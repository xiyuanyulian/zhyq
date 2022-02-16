import { Injectable, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { registerLocaleData } from '@angular/common';
import locale_en from '@angular/common/locales/en';
import locale_zh from '@angular/common/locales/zh';

import * as df_en from 'date-fns/locale/en-US';
import * as df_zh_cn from 'date-fns/locale/zh-CN';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, AlainI18NService } from '@delon/theme';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';

@Injectable()
export class I18NService implements AlainI18NService {
    private _default = 'zh';
    private change$ = new BehaviorSubject<string>(null);

    private _langs = [
        { code: 'en', text: 'English' },
        { code: 'zh', text: '中文' }
    ];

    constructor(
        settings: SettingsService,
        private nzI18nService: NzI18nService,
        private translate: TranslateService,
        private injector: Injector
    ) {
        const defaultLan = settings.layout.lang || translate.getBrowserLang();
        const lans = this._langs.map(item => item.code);
        this._default = lans.includes(defaultLan) ? defaultLan : lans[1];
        translate.addLangs(lans);
        this.setZorro(this._default).setDateFns(this._default).setLocalData(this._default);

        settings.getLayout().subscribe(layout => {
            if (layout) {
                this.use(layout.lang);
            }
        });
    }

    setLocalData(lang: string) {
        const localData = lang === 'en' ? locale_en : locale_zh;
        registerLocaleData(localData);

        return this;
    }

    setZorro(lang: string): this {
        this.nzI18nService.setLocale(lang === 'en' ? en_US : zh_CN);
        return this;
    }

    setDateFns(lang: string): this {
        (window as any).__locale__ = lang === 'en' ? df_en : df_zh_cn;
        return this;
    }

    get change(): Observable<string> {
        return this.change$.asObservable().pipe(filter(w => w != null));
    }

    use(lang: string): void {
        lang = lang || this.translate.getDefaultLang();
        if (this.currentLang === lang) return;
        this.setZorro(lang).setDateFns(lang).setLocalData(lang);
        this.translate.use(lang).subscribe(() => this.change$.next(lang));
    }
    /** 获取语言列表 */
    getLangs() {
        return this._langs;
    }
    /** 翻译 */
    fanyi(key: string) {
        return this.translate.instant(key);
    }
    /** 默认语言 */
    get defaultLang() {
        return this._default;
    }
    /** 当前语言 */
    get currentLang() {
        return this.translate.currentLang || this.translate.getDefaultLang() || this._default;
    }
}
