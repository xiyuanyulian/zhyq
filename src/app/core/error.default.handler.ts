
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent } from '@angular/common/http';

import { SettingsService } from '@delon/theme';
import { _HttpClient } from '@delon/theme';

import { Observable, of, from } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class ErrorDefaultHandler extends ErrorHandler {

    constructor(private injector: Injector, private settings: SettingsService) {
        super();
    }

    handleError(error) {
        if (error instanceof HttpErrorResponse) {
            this.handleHttpErrorResponse(error);
            return;
        } else {
            super.handleError(error);
        }
    }

    private handleHttpErrorResponse(error: HttpErrorResponse) {
        switch (error.status) {
            case 404:
                console.log('404', error);
                this.showError('系统错误', error.statusText || '您请求的资源不存在！');
                break;
            default:
                if (error instanceof HttpErrorResponse) {
                    console.warn('未可知错误', error);
                    this.showError('系统错误', '未知错误，请联系管理员！' + error.message);
                }
                break;
        }
    }

    showError(title: string, content: string) {
        this.settings.putMessage({ type: 'error', title, content });
    }
}
