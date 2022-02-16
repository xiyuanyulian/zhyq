import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { _HttpClient } from '@delon/theme';


@Injectable()
export class DictionaryService {
    private apiEndpoint = environment.apiEndpoint;
    private baseUrl = this.apiEndpoint + 'api/dictionary';

    constructor(public http: _HttpClient) {
    }

    getAll(type: any): Observable<any[]> {
        const url = `${this.baseUrl}`;
        return this.http.get(url, type);
    }

    // search(params: any) {
    //     const url = this.baseUrl + '/search';
    //     return this.http.get(url, params);
    // }

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

    // 数据字典分类
    getDictionaryCategory(url, params) {
        return this.http.get(this.baseUrl + url, params);
    }

    // 新增数字字典分类
    addDictionaryCategory(url, body) {
        return this.http.post(this.baseUrl + url, body);
    }

    // 修改数据字典分类
    updateDictionCategory(url, body) {
        return this.http.put(this.baseUrl + url, body);
    }

    // 删除数据字典分类
    deleteDictionaryCategory(url) {
        return this.http.delete(this.baseUrl + url);
    }
}
