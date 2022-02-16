import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Base64 } from 'js-base64';
import { environment } from '../../environments/environment';
import { _HttpClient } from '@delon/theme';

import { UserService } from './user.service';


@Injectable()
export class AccountService {
    private apiEndpoint = environment.apiEndpoint;
    private baseUrl = this.apiEndpoint + 'api/account';

    constructor(public http: _HttpClient, private userService: UserService) {

    }

    get(id: string): Observable<any[]> {
        const url = `${this.baseUrl}/${id}`;
        return this.http.get(url);
    }

    save(account: any): Observable<any> {
        const url = `${this.baseUrl}/${account.id}`;
        return this.http.put(url, account);
    }

    changePassword(account: any, credential: any): Observable<any[]> {
        const url = `${this.baseUrl}/${account.id}/password`;
        return this.http.post(url);
    }

    getJointAccounts(account: any): Observable<any[]> {
        const user = { uid: account.uid };

        return this.userService.getAccounts(user);
    }

    bind(user: any, account: any): Observable<any> {
        return this.userService.bindAccount(user, account);
    }

    unbind(user: any, account: any): Observable<any> {
        return this.userService.unbindAccount(user, account);
    }

    remove(account) {
        const url = `${this.baseUrl}/${account.id}`;
        return this.http.delete(url);
    }

    validPassword(user: any, pass: string): Observable<any> {
        const url = `${this.baseUrl}/${user.uid}/password`;
        const password = Base64.encode(pass);
        return this.http.get(url, {username: user.username, password: password});
    }

    login(body): Observable<any> {
        const url = `${this.apiEndpoint}api/auth/mobile/login`;
        return this.http.post(url, body);
    }

    getCaptcha(uuid: any): Observable<any> {
        const url = `${this.apiEndpoint}api/auth/login/captcode`;
        return this.http.get(url, { uuid });
    }

    validCaptcha(uuid: any, captCode: any): Observable<any> {
        const url = `${this.apiEndpoint}api/auth/login/valid`;
        return this.http.get(url, { uuid, captCode });
    }

}
