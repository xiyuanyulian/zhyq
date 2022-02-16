import { Injectable } from '@angular/core';
import { App, Layout, User, MessageInfo } from './interface';
import { LocalStorageService } from 'angular-web-storage';
import { BehaviorSubject, Observable } from 'rxjs';

const LAYOUT_KEY = 'layout';
const USER_KEY = 'user';
const APP_KEY = 'app';
const CONFIG_KEY = 'uploadprovider';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private _app: App = null;
    private _user: User = null;
    private _config: object = null;
    private _layout: Layout = null;
    public inited: boolean;
    public redirectTo: string;

    private s = new BehaviorSubject(null);
    private _appSubject = new BehaviorSubject(null);
    private _initedSubject = new BehaviorSubject(null);
    private _userSubject = new BehaviorSubject(null);
    private _layoutSubject = new BehaviorSubject(null);
    private _menuSubject = new BehaviorSubject(null);
    private _aclSubject = new BehaviorSubject(null);
    private _messageSubject = new BehaviorSubject(null);
    private _authSubject = new BehaviorSubject(false);
    private _orgChange = new BehaviorSubject(null);

    constructor(private storage: LocalStorageService) { }

    private get(key: string) {
        return JSON.parse(this.storage.get(key) || 'null') || null;
    }

    private set(key: string, value: any) {
        this.storage.set(key, JSON.stringify(value));
    }

    get layout(): Layout {
        if (!this._layout) {
            this._layout = Object.assign(<Layout>{
                fixed: true,
                collapsed: false,
                boxed: false,
                lang: null
            }, this.get(LAYOUT_KEY));
            this.set(LAYOUT_KEY, this._layout);
        }
        return this._layout;
    }
    set app(val: App) {
        this._app = Object.assign(this._app, val);
    }

    get app(): App {
        if (!this._app) {
            this._app = Object.assign(
                <App>{
                    year: new Date().getFullYear(),
                },
                this.get(APP_KEY),
            );
            this.set(APP_KEY, this._app);
        }
        return this._app;
    }

    set user(val: User) {
        this._user = val;
    }

    get user(): User {
        if (!this._user) {
            this._user = Object.assign(<User>{}, this.get(USER_KEY));
            this.set(USER_KEY, this._user);
        }
        return this._user;
    }

    setCosConfig(val: object): void {
        this._config = val;
        this.set(CONFIG_KEY, this._config);
    }

    getCosConfig(): object {
        if (!this._config) {
            this._config = Object.assign({}, this.get(CONFIG_KEY));
            this.set(CONFIG_KEY, this._config);
        }
        return this._config;
    }

    isInited() {
        return this.inited;
    }

    setApp(value) {
        this._app = value;
        this.set(APP_KEY, value);
        this._appSubject.next(value);
        this.s.next(Object.assign({}, this));
    }

    getApp(): Observable<any> {
        return this._appSubject;
    }
    setLayout(name: string, value: any): boolean {
        if (typeof this.layout[name] !== 'undefined') {
            this.layout[name] = value;
            this.set(LAYOUT_KEY, this.layout);
            this._layoutSubject.next(this.layout);
            this.s.next(Object.assign({}, this));
            return true;
        }
        return false;
    }

    getLayout(): Observable<any> {
        return this._layoutSubject;
    }

    setUser(value) {
        this._user = value;
        this.set(USER_KEY, value);
        this._userSubject.next(value);
        this.s.next(Object.assign({}, this));
    }

    setOrgChange(value) {
        this._orgChange.next(value);
    }

    getOrgChange(): Observable<any> {
        return this._orgChange;
    }

    getUser(): Observable<any> {
        return this._userSubject;
    }

    setInited(value: boolean) {
        this.inited = value;
        this._initedSubject.next(value);
        this.s.next(Object.assign({}, this));
    }

    getInited(): Observable<any> {
        return this._initedSubject;
    }

    putMessage(value: MessageInfo) {
        this._messageSubject.next(value);
    }

    getMessage(): Observable<MessageInfo> {
        return this._messageSubject;
    }

    putAuth(value: boolean) {
        this._authSubject.next(value);
    }

    getAuth(): Observable<any> {
        return this._authSubject;
    }

    getSettings() {
        return this.s;
    }

    subscribe(next?, error?, complete?) {
        return this.s.subscribe(next, error, complete);
    }
}
