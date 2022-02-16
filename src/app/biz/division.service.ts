import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { _HttpClient } from '@delon/theme';
import { DTO, AbstractService } from './interface';


@Injectable()
export class DivisionService extends AbstractService {

    constructor(protected http: _HttpClient) {
        super(http);
        this.baseUrl = AbstractService.API_ENDPOINT + 'api/division';
    }

    assignEntity(entity: any): any {
        const _entity = Object.assign({}, entity);
        delete _entity.children;

        return _entity;
    }

    save(entity: any): Observable<any> {
        const _entity = this.assignEntity(entity);

        return this.update(_entity);
    }

    update(entity: any): Observable<any> {
        const url = `${this.baseUrl}/${entity.code}`;
        return this.http.put(url, entity);
    }

    delete(entity: any): Observable<any> {
        const url = `${this.baseUrl}/${entity.code}`;
        return this.http.delete(url);
    }

    getAgencys(division: any, params?: any): Observable<any[]> {
        const code = division ? division.code : '0';

        const url = `${this.baseUrl}/${code}/agency`;
        return this.http.get(url, params);
    }

    setAgency(division, agency): Observable<any> {
        const url = `${this.baseUrl}/${division.code}/agency`;
        return this.http.post(url, agency);
    }

    getTree(): Observable<any> {
        const url = `${this.baseUrl}/tree`;
        return this.http.get(url);
    }

}
