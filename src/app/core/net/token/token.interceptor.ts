
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse,
    HttpProgressEvent, HttpResponse, HttpUserEvent, HttpHeaders
} from '@angular/common/http';
import { throwError,  Observable } from 'rxjs';
import { TokenService } from './token.service';



import { environment } from '@env/environment';

const ESCAPE_URLS = ['auth/', 'assets/', 'api/auth'];

/**
 * TOKEN拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        let request = req;

        // 可以进一步处理，比如：重新刷新或重新登录
        const token: TokenService = this.injector.get(TokenService);
        if (token && token.data) {
            if (token.isTokenExpired()) {
                return throwError({ status: 401, statusText: 'token is expired!' });
            }

            // TODO: refresh token

            request = this.attachToken(req, token.getAuthToken());
        }

        return next.handle(request);

    }

    private attachToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        let header: HttpHeaders = null;

        // 正常token值放在请求header当中，具体格式以后端为准
        if (token) {
            header = req.headers.set('Authorization', `Bearer ${token}`);
        }

        // 统一加上服务端前缀
        let url = req.url;
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
            url = environment.SERVER_URL + url;
        }

        const newReq = req.clone({
            headers: header,
            url: url
        });

        return newReq;
    }
}
