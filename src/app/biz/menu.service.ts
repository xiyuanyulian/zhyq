import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { _HttpClient } from '@delon/theme';


@Injectable()
export class MenuService {
    private apiEndpoint = environment.apiEndpoint;
    private baseUrl = this.apiEndpoint + 'api/menu';

    constructor(public http: _HttpClient) {

    }

    get(code: any): Observable<any> {
        const url = `${this.baseUrl}/${code}`;
        return this.http.get(url);
    }

    getAll(params?: any): Observable<any[]> {
        const url = `${this.baseUrl}`;
        return this.http.get(url, params);
    }

    getTree(params?: any): Observable<any> {
        const url = `${this.baseUrl}/tree`;
        return this.http.get(url);
    }

    save(menu: any): Observable<any> {
        if (!!menu && !!menu.id) {
            return this.update(menu);
        } else {
            return this.insert(menu);
        }
    }

    insert(menu: any): Observable<any> {
        const url = `${this.baseUrl}`;
        return this.http.post(url, menu);
    }

    update(menu: any): Observable<any> {
        const url = `${this.baseUrl}/${menu.id}`;
        return this.http.put(url, menu);
    }

    delete(menu: any): Observable<any> {
        const url = `${this.baseUrl}/${menu.id}`;
        return this.http.delete(url, menu);
    }

    allow(key, role): Observable<any> {
        const url = `${this.baseUrl}/${key}/role`;
        return this.http.post(url, role);
    }

    disallow(key, role): Observable<any> {
        const url = `${this.baseUrl}/${key}/role/${role.id}`;
        return this.http.delete(url);
    }
}
