import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class LoginLogService {
    private apiEndpoint = environment.apiEndpoint;
    private baseUrl = this.apiEndpoint + 'api/logInLog';

    constructor(public http: _HttpClient) {
    }

    getAll(params?: any): Observable<any[]> {
        const url = `${this.baseUrl}`;
        return this.http.get(url, params);
    }

}
