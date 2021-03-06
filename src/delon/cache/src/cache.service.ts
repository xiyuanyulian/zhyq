import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { addSeconds } from 'date-fns';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import {
  DC_STORE_STORAGE_TOKEN,
  ICacheStore,
  ICache,
  CacheNotifyResult,
  CacheNotifyType,
} from './interface';
import { DelonCacheConfig } from '../cache.config';

@Injectable()
export class CacheService implements OnDestroy {
  private readonly memory: Map<string, ICache> = new Map<string, ICache>();
  private readonly notifyBuffer: Map<
    string,
    BehaviorSubject<CacheNotifyResult>
  > = new Map<string, BehaviorSubject<CacheNotifyResult>>();
  private meta: Set<string> = new Set<string>();
  private freq_tick = 3000;
  private freq_time: any;

  constructor(
    private options: DelonCacheConfig,
    @Inject(DC_STORE_STORAGE_TOKEN) private store: ICacheStore,
    private http: HttpClient,
  ) {
    this.loadMeta();
    this.startExpireNotify();
  }

  _deepGet(obj: any, path: string[], defaultValue?: any) {
    if (!obj) return defaultValue;
    if (path.length <= 1) {
      const checkObj = path.length ? obj[path[0]] : obj;
      return typeof checkObj === 'undefined' ? defaultValue : checkObj;
    }
    return path.reduce((o, k) => o[k], obj) || defaultValue;
  }

  // region: meta

  private pushMeta(key: string) {
    if (this.meta.has(key)) return;
    this.meta.add(key);
    this.saveMeta();
  }

  private removeMeta(key: string) {
    if (!this.meta.has(key)) return;
    this.meta.delete(key);
    this.saveMeta();
  }

  private loadMeta() {
    const ret = this.store.get(this.options.meta_key);
    if (ret && ret.v) {
      (ret.v as string[]).forEach(key => this.meta.add(key));
    }
  }

  private saveMeta() {
    const metaData: string[] = [];
    this.meta.forEach(key => metaData.push(key));
    this.store.set(this.options.meta_key, { v: metaData, e: 0 });
  }

  getMeta() {
    return this.meta;
  }

  // endregion

  // region: set

  /**
   * ??????????????? `Observable` ??????????????????
   * - `set('data/1', this.http.get('data/1')).subscribe()`
   * - `set('data/1', this.http.get('data/1'), { expire: 10 }).subscribe()`
   */
  set<T>(
    key: string,
    data: Observable<T>,
    options?: { type?: 's'; expire?: number },
  ): Observable<T>;
  /**
   * ??????????????? `Observable` ??????????????????
   * - `set('data/1', this.http.get('data/1')).subscribe()`
   * - `set('data/1', this.http.get('data/1'), { expire: 10 }).subscribe()`
   */
  set(
    key: string,
    data: Observable<any>,
    options?: { type?: 's'; expire?: number },
  ): Observable<any>;
  /**
   * ???????????????????????????????????????
   * - `set('data/1', 1)`
   * - `set('data/1', 1, { expire: 10 })`
   */
  set(
    key: string,
    data: Object,
    options?: { type?: 's'; expire?: number },
  ): void;
  /**
   * ????????????????????????????????????????????????????????????
   * - `set('data/1', 1, { type: 'm' })`
   * - `set('data/1', 1, { type: 'm', expire: 10 })`
   */
  set(
    key: string,
    data: Object,
    options: { type: 'm' | 's'; expire?: number },
  ): void;
  /**
   * ????????????
   */
  set(
    key: string,
    data: any | Observable<any>,
    options: {
      /** ???????????????'m' ???????????????'s' ???????????? */
      type?: 'm' | 's';
      /**
       * ????????????????????? `???`
       */
      expire?: number;
    } = {},
  ): any {
    // expire
    let e = 0;
    if (options.expire) {
      e = addSeconds(new Date(), options.expire).valueOf();
    }
    if (!(data instanceof Observable)) {
      this.save(options.type, key, { v: data, e });
      return;
    }
    return data.pipe(
      tap((v: any) => {
        this.save(options.type, key, { v, e });
      }),
    );
  }

  private save(type: 'm' | 's', key: string, value: ICache) {
    if (type === 'm') {
      this.memory.set(key, value);
    } else {
      this.store.set(this.options.prefix + key, value);
      this.pushMeta(key);
    }
    this.runNotify(key, 'set');
  }

  // endregion

  // region: get

  /** ???????????????????????? `key` ???????????? `key` ??????HTTP????????????????????? */
  get<T>(
    key: string,
    options?: {
      mode: 'promise';
      type?: 'm' | 's';
      expire?: number;
    },
  ): Observable<T>;
  /** ???????????????????????? `key` ???????????? `key` ??????HTTP????????????????????? */
  get(
    key: string,
    options?: {
      mode: 'promise';
      type?: 'm' | 's';
      expire?: number;
    },
  ): Observable<any>;
  /** ???????????????????????? `key` ?????????????????????????????? null */
  get(
    key: string,
    options: {
      mode: 'none';
      type?: 'm' | 's';
      expire?: number;
    },
  ): any;
  get(
    key: string,
    options: {
      mode?: 'promise' | 'none';
      type?: 'm' | 's';
      expire?: number;
    } = {},
  ): Observable<any> | any {
    const isPromise =
      options.mode !== 'none' && this.options.mode === 'promise';
    const value: ICache = this.memory.has(key)
      ? this.memory.get(key)
      : this.store.get(this.options.prefix + key);
    if (!value || (value.e && value.e > 0 && value.e < new Date().valueOf())) {
      if (isPromise) {
        return this.http
          .get(key)
          .pipe(
            map((ret: any) =>
              this._deepGet(ret, this.options.reName as string[], null),
            ),
            tap(v => this.set(key, v)),
          );
      }
      return null;
    }

    return isPromise ? of(value.v) : value.v;
  }

  /** ???????????????????????? `key` ?????????????????????????????? null */
  getNone<T>(key: string): T;
  /** ???????????????????????? `key` ?????????????????????????????? null */
  getNone(key: string): any {
    return this.get(key, { mode: 'none' });
  }

  /**
   * ??????????????????????????????????????????????????? `Observable` ??????
   */
  tryGet<T>(
    key: string,
    data: Observable<T>,
    options?: { type?: 's'; expire?: number },
  ): Observable<T>;
  /**
   * ??????????????????????????????????????????????????? `Observable` ??????
   */
  tryGet(
    key: string,
    data: Observable<any>,
    options?: { type?: 's'; expire?: number },
  ): Observable<any>;
  /**
   * ???????????????????????????????????????????????????????????????
   */
  tryGet(
    key: string,
    data: Object,
    options?: { type?: 's'; expire?: number },
  ): any;
  /**
   * ????????????????????????????????????????????????????????????????????????
   */
  tryGet(
    key: string,
    data: Object,
    options: { type: 'm' | 's'; expire?: number },
  ): any;

  /**
   * ????????????????????????????????????????????????
   */
  tryGet(
    key: string,
    data: any | Observable<any>,
    options: {
      /** ???????????????'m' ???????????????'s' ???????????? */
      type?: 'm' | 's';
      /**
       * ????????????????????? `???`
       */
      expire?: number;
    } = {},
  ): any {
    const ret = this.getNone(key);
    if (ret === null) {
      if (!(data instanceof Observable)) {
        this.set(key, data, <any>options);
        return data;
      }

      return this.set(key, data as Observable<any>, <any>options);
    }
    return of(ret);
  }

  // endregion

  // region: has

  /** ???????????? `key` */
  has(key: string): boolean {
    return this.memory.has(key) || this.meta.has(key);
  }

  // endregion

  // region: remove

  private _remove(key: string, needNotify: boolean) {
    if (needNotify) this.runNotify(key, 'remove');
    if (this.memory.has(key)) {
      this.memory.delete(key);
      return;
    }
    this.store.remove(this.options.prefix + key);
    this.removeMeta(key);
  }

  /** ???????????? */
  remove(key: string) {
    this._remove(key, true);
  }

  /** ?????????????????? */
  clear() {
    this.notifyBuffer.forEach((v, k) => this.runNotify(k, 'remove'));
    this.memory.clear();
    this.meta.forEach(key => this.store.remove(this.options.prefix + key));
  }

  // endregion

  // region: notify

  /**
   * ????????????????????????????????????????????? `20ms`????????????`3000ms`
   */
  set freq(value: number) {
    this.freq_tick = Math.max(20, value);
    this.abortExpireNotify();
    this.startExpireNotify();
  }

  private startExpireNotify() {
    this.checkExpireNotify();
    this.runExpireNotify();
  }

  private runExpireNotify() {
    this.freq_time = setTimeout(() => {
      this.checkExpireNotify();
      this.runExpireNotify();
    }, this.freq_tick);
  }

  private checkExpireNotify() {
    const removed: string[] = [];
    this.notifyBuffer.forEach((v, key) => {
      if (this.has(key) && this.getNone(key) === null) removed.push(key);
    });
    removed.forEach(key => {
      this.runNotify(key, 'expire');
      this._remove(key, false);
    });
  }

  private abortExpireNotify() {
    clearTimeout(this.freq_time);
  }

  private runNotify(key: string, type: CacheNotifyType) {
    if (!this.notifyBuffer.has(key)) return;
    this.notifyBuffer.get(key).next({ type, value: this.getNone(key) });
  }

  /**
   * `key` ???????????? `key` ???????????????????????????????????????????????????????????????
   *
   * - ???????????????????????? `cancelNotify` ?????????????????????
   * - ???????????? `freq` (?????????3???) ????????????????????????
   */
  notify(key: string): Observable<CacheNotifyResult> {
    if (!this.notifyBuffer.has(key)) {
      const change$ = new BehaviorSubject<CacheNotifyResult>(this.getNone(key));
      this.notifyBuffer.set(key, change$);
    }
    return this.notifyBuffer.get(key).asObservable();
  }

  /**
   * ?????? `key` ??????
   */
  cancelNotify(key: string): void {
    if (!this.notifyBuffer.has(key)) return;
    this.notifyBuffer.get(key).unsubscribe();
    this.notifyBuffer.delete(key);
  }

  /** `key` ?????????????????? */
  hasNotify(key: string): boolean {
    return this.notifyBuffer.has(key);
  }

  /** ???????????? `key` ????????? */
  clearNotify(): void {
    this.notifyBuffer.forEach(v => v.unsubscribe());
    this.notifyBuffer.clear();
  }

  // endregion

  ngOnDestroy(): void {
    this.memory.clear();
    this.abortExpireNotify();
    this.clearNotify();
  }
}
