import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { _HttpClient } from '@delon/theme';


@Injectable()
export class DictionaryCategoryService {
    private apiEndpoint = environment.apiEndpoint;
    private baseUrl = this.apiEndpoint + 'api/dictionary-category';

    constructor(public http: _HttpClient) {
    }

    getAll(type: any): Observable<any[]> {
        const url = `${this.baseUrl}`;
        return this.http.get(url, type);
    }

    search(params: any) {
        const url = this.baseUrl + '/search';
        return this.http.get(url, params);
    }

    save(i) {
        const url = `${this.baseUrl}`;
        return this.http.post(url, i);
    }

    update(i) {
        const url = `${this.baseUrl}/${i['id']}`;
        return this.http.put(url, i);
    }

    delete(id) {
        const url = `${this.baseUrl}/${id}`;
        return this.http.delete(url);
    }
}
