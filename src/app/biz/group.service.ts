import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { _HttpClient } from '@delon/theme';


@Injectable()
export class GroupService {
    private apiEndpoint = environment.apiEndpoint;
    private baseUrl = this.apiEndpoint + 'api/group';

    constructor(public http: _HttpClient) {

    }

    getAll(params?: any): Observable<any[]> {
        // get groups from api
        const url = `${this.baseUrl}`;
        return this.http.get(url, params);
    }

    get(id: string): Observable<any[]> {
        // get a user from api
        const url = `${this.baseUrl}/${id}`;
        return this.http.get(url);
    }

    getRoles(group: any): Observable<any> {
        const id = group ? group.id : '0';

        const url = `${this.baseUrl}/${id}/role`;
        return this.http.get(url);
    }

    getUsers(group: any, params?: any): Observable<any[]> {
        const id = params.org_id ? params.org_id : '0';

        const url = `${this.baseUrl}/${id}/user`;
        return this.http.get(url, params);
    }

    getSections(group: any, params?: any): Observable<any[]> {
        const id = params.org_id ? params.org_id : '1';

        const url = `${this.baseUrl}/${id}/section`;
        return this.http.get(url, params);
    }

    save(group: any, isNew: boolean): Observable<any> {
        const _group = Object.assign({}, group);
        delete _group.children;

        if (!isNew) {
            return this.update(_group);
        } else {
            return this.insert(_group);
        }
    }

    insert(group: any): Observable<any> {
        const url = `${this.baseUrl}`;
        // return this.http.put(url, JSON.stringify(person));
        return this.http.post(url, group);
    }

    update(group: any): Observable<any> {
        const url = `${this.baseUrl}/${group.id}`;
        // return this.http.put(url, JSON.stringify(person));
        return this.http.put(url, group);
    }

    delete(group: any): Observable<any> {
        const url = `${this.baseUrl}/${group.id}`;
        // return this.http.put(url, JSON.stringify(person));
        return this.http.delete(url, {});
    }

    setUser(group, user): Observable<any> {
        const url = `${this.baseUrl}/${group.id}/user`;
        return this.http.post(url, user);
    }

    setRole(group, role): Observable<any> {
        const url = `${this.baseUrl}/${group.id}/role`;
        return this.http.post(url, role);
    }

    setSection(group, section): Observable<any> {
        const url = `${this.baseUrl}/${group.id}/section`;
        return this.http.post(url, section);
    }

    getTree(): Observable<any> {
        const url = `${this.baseUrl}/tree`;
        return this.http.get(url);
    }

    getReport(params?: any): Observable<any> {
        const url = `/api/recommond/orgReportList`;
        return this.http.get(url, params);
    }

    getCode(params?: any): Observable<any> {
        const url = `${this.baseUrl}/${params.code}/code`;
        return this.http.get(url, params);
    }

    addBlackList(params?: any): Observable<any> {
        const url = `${this.baseUrl}/addBlackList`;
        return this.http.post(url, params);
    }

    removeBlackList(id?: string): Observable<any> {
        const url = `${this.baseUrl}/removeBlackList/${id}`;
        return this.http.delete(url);
    }
}
