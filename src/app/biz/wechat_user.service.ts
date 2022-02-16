import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

@Injectable()
export class WechatUserService {

    private apiEndpoint = environment.apiEndpoint;
    private baseUrl = this.apiEndpoint + 'api/wechat_user';

    constructor(public http: _HttpClient) {

    }

    save(wechat_user: any): Observable<any> {
        if (!!wechat_user.uid) {
            return this.update(wechat_user);
        } else {
            return this.insert(wechat_user);
        }
    }

    update(wechat_user: any): Observable<any> {
        const url = `${this.baseUrl}/${wechat_user.uid}`;
        return this.http.put(url, wechat_user);
    }

    insert(wechat_user: any): Observable<any> {
        const url = `${this.baseUrl}`;
        return this.http.post(url, wechat_user);
    }

    changeMobile(wechat_user: any): Observable<any> {
        const url = `${this.baseUrl}/${wechat_user.uid}/mobile`;
        return this.http.put(url, wechat_user);
    }

    forzen(uid: any): Observable<any> {
        const url = `${this.apiEndpoint}api/account/${uid}/forzen`;
        return this.http.put(url, {uid});
    }

    unforzen(uid: any): Observable<any> {
        const url = `${this.apiEndpoint}api/account/${uid}/unforzen`;
        return this.http.put(url, {uid});
    }

    saveContacts(uid: any, contacts: any | any[]): Observable<any> {
        const url = `${this.baseUrl}/${uid}/contact`;
        return this.http.post(url, contacts);
    }

    replace(wechat_user: any): Observable<any> {
        const url = `${this.baseUrl}/${wechat_user.uid}/replace`;
        return this.http.put(url, wechat_user);
    }

    validateMobile(mobile: string): Observable<any> {
        const url = `${this.baseUrl}/mobile/valid`;
        return this.http.get(url, { mobile });
    }

    setCredit(item: any, status: string): Observable<any> {
        if (status === 'B') {
            const url = `${this.apiEndpoint}api/org_user_credit`;
            return this.http.post(url, item);
        } else {
            const url = `${this.apiEndpoint}api/org_user_credit/${item.uid}`;
            return this.http.put(url, item);
        }
    }

    validIdCardNo(id_card_no: string): Observable<any> {
        const url = `${this.baseUrl}/idCard/valid`;
        return this.http.post(url, { id_card_no });
    }

    destoryUser(uid: string): Observable<any> {
        const url = `${this.baseUrl}/${uid}/destroy`;
        return this.http.put(url);
    }

    updateOrgRecord(id: string, item: any): Observable<any> {
        const url = `${this.baseUrl}/${id}/update_org_record`;
        return this.http.put(url, item);
    }
}
