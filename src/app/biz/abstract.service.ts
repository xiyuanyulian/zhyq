import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { _HttpClient } from '@delon/theme';
import { DTO } from './interface';

export abstract class AbstractService {
    public static API_ENDPOINT = environment.apiEndpoint;
    protected baseUrl: string;

    constructor(protected http: _HttpClient) {

    }

    public get apiEndpoint() {
        return AbstractService.API_ENDPOINT;
    }

    get(id: any, params?: any): Observable<any> {
        const url = `${this.baseUrl}/${id}`;
        return this.http.get(url, params);
    }

    getAll(params?: any): Observable<DTO | any> {
        const url = `${this.baseUrl}`;
        return this.http.get(url, params);
    }

    save(entity: any): Observable<any> {
        const _entity = this.assignEntity(entity);

        if (!!_entity && !!_entity.id) {
            return this.update(_entity);
        } else {
            return this.insert(_entity);
        }
    }

    assignEntity(entity: any): any {
        return Object.assign({}, entity);
    }

    insert(entity: any): Observable<any> {
        const url = `${this.baseUrl}`;
        return this.http.post(url, entity);
    }

    update(entity: any): Observable<any> {
        const url = `${this.baseUrl}/${entity.id}`;
        return this.http.put(url, entity);
    }

    delete(entity: any): Observable<any> {
        const url = `${this.baseUrl}/${entity.id}`;
        return this.http.delete(url);
    }

}
