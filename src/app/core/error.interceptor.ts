import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {
    HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders,
    HttpInterceptor, HttpHandler, HttpEvent
} from '@angular/common/http';
import { SettingsService } from '@delon/theme';
import { _HttpClient } from '@delon/theme';

import { Observable, of, from, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private injector: Injector, private settings: SettingsService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            mergeMap(event => {
                // 暂时不对业务错误进行统一处理
                // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200/201的情况下需要
                // if (event instanceof HttpResponse && event.status === 300) {
                //     return this.handleData(event);
                // }
                // 若一切都正常，则后续操作
                return of(event);
              }),
              catchError(err => this.handleData(err))
            );
    }

    private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
        // 可能会因为 `throw` 导致无法执行 `_HttpClient` 的 `end()` 操作
        this.injector.get<_HttpClient>(_HttpClient).end();
        // 业务处理：一些通用操作
        switch (event.status) {
            // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200/201的情况下需要
            case 200:
            case 201:
                // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
                // 例如响应内容：
                //  正确内容：{ status: 0, response: {  } }
                //  错误内容：{ status: 1, msg: '非法参数' }
                // 则以下代码片断可直接适用
                // if (event instanceof HttpResponse) {
                //     const body: any = event.body;
                //     if (body && body.status !== 0) {
                //         this.msg.error(body.msg);
                //         // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
                //         // this.http.get('/').subscribe() 并不会触发
                //         return ErrorObservable.throw(event);
                //     } else {
                //         // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
                //         return of(new HttpResponse(Object.assign(event, { body: body.response })));
                //         // 或者依然保持完整的格式
                //         return of(event);
                //     }
                // }
                break;
            case 401: // 未登录状态码
                if (!this.settings.isInited()) {
                    return from(this.goLogin());
                } else {
                    this.settings.putAuth(false);
                    this.showError('没有权限', '用户未登录，或者登录已经过期，请重新登录！');
                }
                break;
            case 403:
            case 404: // 因为有的业务模块允许 404 错误，所以统一的 404 错误处理放到error.default.handler 里面。
                // console.log('404', event);
                // this.showError('系统错误', event.statusText || '您请求的资源不存在！');
                break;
            case 500:
                this.showError('系统错误', '服务器内部错误，请联系管理员！');
                break;
            default:
                if (event instanceof HttpErrorResponse) {
                    console.warn('未可知错误，大部分是由于后端不支持CORS或无效配置引起', event);
                    this.showError('系统错误', '未知错误，请联系管理员！' + event.message);
                }
                break;
        }
        return throwError(event);
    }

    showError(title: string, content: string) {
        this.settings.putMessage({ type: 'error', title, content });
    }

    private goLogin() {
        // 保存原来的地址
        const location: Location = this.injector.get(Location);
        this.settings.redirectTo = location.path();

        // 跳转到登录页面
        const router = this.injector.get(Router);
        return router.navigate(['/login'], { skipLocationChange: true });
    }

    private goTo(url: string) {
        setTimeout(() => this.injector.get(Router).navigateByUrl(url));
    }

}
