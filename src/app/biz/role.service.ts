import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { environment } from '../../environments/environment';
import { _HttpClient } from '@delon/theme';


@Injectable()
export class RoleService {
    private apiEndpoint = environment.apiEndpoint;
    private baseUrl = this.apiEndpoint + 'api/role';

    constructor(public http: _HttpClient) {

    }

    getAll(params?: any): Observable<any[]> {
        // get users from api
        const url = `${this.baseUrl}`;
        return this.http.get(url, params);
    }

    getRoles(): Observable<any[]> {
        // get users from api
        const url = `${this.baseUrl}`;
        return this.http.get(url);
    }

    getRole(id: string): Observable<any[]> {
        // get a user from api
        const url = `${this.baseUrl}/${id}`;
        return this.http.get(url);
    }

    save(role: any): Observable<any> {
        if (!!role && !!role.id) {
            return this.update(role);
        } else {
            return this.insert(role);
        }
    }

    insert(role: any): Observable<any> {
        const url = `${this.baseUrl}`;
        // return this.http.put(url, JSON.stringify(person));
        return this.http.post(url, role);
    }

    update(role: any): Observable<any> {
        const url = `${this.baseUrl}/${role.id}`;
        // return this.http.put(url, JSON.stringify(person));
        return this.http.put(url, role);
    }

    delete(role: any): Observable<any> {
        const url = `${this.baseUrl}/${role.id}`;
        // return this.http.put(url, JSON.stringify(person));
        return this.http.delete(url, role);
    }

    getGroups(role): Observable<any[]> {
        const url = `${this.baseUrl}/${role.id}/group`;
        return this.http.get(url);
    }

    setGroup(role, group): Observable<any[]> {
        const url = `${this.baseUrl}/${role.id}/group`;
        return this.http.post(url, group);
    }

    getUser(role, params?): Observable<any[]> {
        const url = `${this.baseUrl}/${role.id}/user`;
        return this.http.get(url, params);
    }

    setUser(role, users: any | any[]): Observable<any[]> {
        console.assert(!!role, 'role is required');

        if (!users || users.length === 0) {
            return from([]);
        }

        let list = users;
        if (!!users && !Array.isArray(users)) {
            list = [users];
        }
        const url = `${this.baseUrl}/${role.id}/user`;
        return this.http.post(url, list);
    }

}
