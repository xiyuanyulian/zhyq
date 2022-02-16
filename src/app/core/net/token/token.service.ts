import { Injectable } from '@angular/core';
import { TokenData } from './token.type';
import { AuthenticationService } from '../../auth/auth.service';
import { JwtHelper } from './jwt';

/** 存储键 */
const AUTHED_USER_KEY = 'auth_user';
const KEY = 'auth_user';

/**
 * 基于Token认证，在前后端分离非常普通，本身只提供一个接口的形式展示如果优雅处理HTTP请求
 */
@Injectable()
export class TokenService {

    private storage = sessionStorage;

    private jwtHelper = new JwtHelper();

    /**
     * 保存
     */
    set data(token: string) {
        // const _token = (typeof token === 'object') ? JSON.stringify(token) : token;
        this.storage.setItem(KEY, token);
    }

    /**
     * 获取
     */
    get data(): string {
        // const _token = this.storage.getItem(KEY);
        // return _token ? JSON.parse(_token) : null;
        return this.storage.getItem(KEY);
    }

    remove() {
        this.storage.removeItem(KEY);
    }

    getAuthToken(): string {
        return this.data;
    }

    isTokenExpired(): boolean {
        const token = this.data;
        return this.jwtHelper.isTokenExpired(token);
    }

    getAuthUser() {
        const token = this.data;
        return token ? this.jwtHelper.decodeToken(token) : null;
    }

    getTokenExpirationDate() {
        const token = this.getAuthToken();
        return this.jwtHelper.getTokenExpirationDate(token);
    }

    refreshToken(): string {
        // TODO: refresh token
        return '';
    }

    isValid() {
        return !!this.data && !this.isTokenExpired();
    }
}
