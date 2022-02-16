
import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FileUploadService } from '@biz/file-upload.service';
import { SettingsService, _HttpClient } from '@delon/theme';
import { TokenService as TokenSvc, DA_SERVICE_TOKEN } from '@delon/auth';
import { TokenService } from '@core/net/token/token.service';
import { AuthenticationInfo } from './interface';

const AUTH_URL = '/api/auth';

@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient,
        private token: TokenService,
        private fileUpload: FileUploadService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenSvc,
        private settings: SettingsService) {
    }

    closeCode: EventEmitter<boolean> = new EventEmitter();

    private loadAuthedUser() {
        return this.token.getAuthUser();
    }

    isAuthenticated(): boolean {
        return !!this.token.data;
    }

    getAuthToken(): string {
        return this.token.data;
    }

    getAuthUser(): any {
        return this.loadAuthedUser();
    }

    login(credential: any): Observable<AuthenticationInfo> {
        const url = AUTH_URL;
        return this.http.post<AuthenticationInfo>(url, credential
            //      {
            //     // 'headers': new HttpHeaders({ 'Content-Type': 'application/json' }),
            //     'params': this.parseParams(credential)
            // }
        ).pipe(tap((res) => {
            const authInfo = <AuthenticationInfo>res;

            // login successful if there's a jwt token in the response
            if (!!authInfo && authInfo.token) {
                // store username and jwt token in local storage to keep user logged in between page refreshes
                this.token.data = authInfo.token;
                this.settings.putAuth(true);
                // 设置Token信息
                this.tokenService.set(authInfo);
                this.fileUpload.getCofig();
            }
        }));
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token.remove();
        this.settings.setUser({});
        this.settings.putAuth(false);
    }

    private parseParams(params: any): HttpParams {
        let ret = new HttpParams();
        if (params) {
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    const _data = params[key];
                    ret = ret.set(key, _data);
                }
            }
        }
        return ret;
    }

    // 微信扫码登录
    weChatLogin(code) {
        const url = `${AUTH_URL}/wechatLogin`;
        return this.http.post<AuthenticationInfo>(url, code).pipe(tap((res) => {
            const authInfo = <AuthenticationInfo>res;

            // login successful if there's a jwt token in the response
            if (!!authInfo && authInfo.token) {
                // store username and jwt token in local storage to keep user logged in between page refreshes
                this.token.data = authInfo.token;
                this.settings.putAuth(true);

                // 设置Token信息
                this.tokenService.set(authInfo);
            }
        }));
    }

    // 绑定微信
    bindWeChat(params) {
        const url = `${AUTH_URL}/bindWeChat`;
        return this.http.post(url, params);
    }

    // 获取二维码链接
    getQrCode() {
        const url = `${AUTH_URL}/getQrCode`;
        return this.http.get(url);
    }

    weChatUntie(params) {
        const url = `${AUTH_URL}/weChatUntie`;
        return this.http.put(url, params);
    }
}
