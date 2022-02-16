import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { _HttpClient } from '@delon/theme';
import { Base64 } from 'js-base64';

import { User } from './user.model';


@Injectable()
export class UserService {
    private apiEndpoint = environment.apiEndpoint;
    private baseUrl = this.apiEndpoint + 'api/user';

    constructor(public http: _HttpClient) {

    }

    parse(u) {
        this.strToDate(u, 'birthdate');
        u.orgs = [u.gid];
    }

    strToDate(obj, property) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] === 'string') {
                obj[property] = new Date(obj[property]);
            }
        }
    }

    get(uid: string): Observable<any> {
        const url = `${this.baseUrl}/${uid}`;
        return this.http.get<any>(url);
    }

    getAll(params?: any): Observable<any> {
        const url = `${this.baseUrl}`;
        return this.http.get(url, params);
    }

    getUser(id: string): Observable<User> {
        const url = `${this.baseUrl}/${id}`;
        return this.http.get<User>(url);
    }

    update(user: any): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}`;
        return this.http.put(url, user);
    }

    create(user: any): Observable<any> {
        const url = `${this.baseUrl}`;
        return this.http.post(url, user);
    }

    save(user: any): Observable<any> {
        return !!user.uid ? this.update(user) : this.create(user);
    }

    getRoles(user: any, cascaded: boolean = false): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/role`;

        if (cascaded) {
            return this.http.get(url, { cascaded: true });
        } else {
            return this.http.get(url);
        }
    }

    setRole(user: any, role: any): Observable<any[]> {
        const url = `${this.baseUrl}/${user.uid}/role`;
        return this.http.post(url, role);
    }

    getGroups(user): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/group`;
        return this.http.get(url);
    }

    setGroup(user, group): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/group`;
        return this.http.post(url, group);
    }

    getSections(user): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/section`;
        return this.http.get(url);
    }

    getSectionName(user): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/sectionName`;
        return this.http.get(url);
    }

    setSections(user, sections): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/section`;
        return this.http.post(url, sections);
    }

    getAccounts(user): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/account`;
        return this.http.get(url);
    }

    bindDefaultAccount(user: any): Observable<any> {
        const account = {
            uid: user.uid,
            identity: user.username
        };
        return this.bindAccount(user, account);
    }

    bindAccount(user: any, account: any): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/account`;
        account['bound'] = true;
        return this.http.post(url, account);
    }

    unbindAccount(user: any, account: any): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/account`;
        account['bound'] = false;
        return this.http.post(url, account);
    }

    setPassword(user: any, pass: string) {
        const url = `${this.baseUrl}/${user.uid}/password`;
        const password = Base64.encode(pass);
        return this.http.put(url, { uid: user.uid, password });
    }

    // 用户头像设置
    saveAvatar(avatar) {
        const url = `${this.baseUrl}/${avatar.uid}/avatar`;
        return this.http.put(url, avatar);
    }

    getAvatar(avatar) {
        const url = `${this.baseUrl}/${avatar.uid}/avatar`;
        return this.http.get(url);
    }

    // 用户设置
    setting(user) {
        const url = `${this.baseUrl}/${user.uid}/mobile`;
        return this.http.put(url, user);
    }

    // 用户设置
    settingWithCaptcha(user) {
        const url = `${this.baseUrl}/${user.uid}/email`;
        return this.http.put(url, user);
    }

    // 验证码
    loginCaptcha(captcha): Observable<any> {
        const url = `${this.apiEndpoint}api/auth/captcha`;
        return this.http.get(url, captcha);
    }

    // 验证码
    captcha(captcha): Observable<any> {
        const url = `${this.apiEndpoint}api/captcha`;
        return this.http.get(url, captcha);
    }

    validateUserName(username: string): Observable<any> {
        const url = `${this.baseUrl}/${username}/valid`;
        return this.http.get(url);
    }

    validatePassword(pass: string, user: any): Observable<any> {
        const url = `${this.baseUrl}/${user.id}/password`;
        const password = Base64.encode(pass);
        return this.http.get(url, { password });
    }

    validateCaptcha(target: string, captcha: string): Observable<any> {
        const url = `${this.apiEndpoint}api/captcha/valid`;
        return this.http.get(url, { target, captcha });
    }

    cleanCaptcha(target: string): Observable<any> {
        const url = `${this.apiEndpoint}api/captcha/clean`;
        return this.http.get(url, { target });
    }

    firstLogin(user: any, pass: any): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/firstLogin`;
        const password = Base64.encode(pass);
        return this.http.put(url, { mobile: user.mobile, password });
    }

    changeStatus(user: any): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/changeStatus`;
        return this.http.put(url);
    }

    delete(user: any): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}`;
        return this.http.delete(url, {});
    }

}
