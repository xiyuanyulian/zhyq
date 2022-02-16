
import { Injectable, Injector, Type, Component } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LOGIN_COMPONENT_TOKEN } from './interface';
import { Observable } from 'rxjs';
import { map, first, filter } from 'rxjs/operators';
import { AuthenticationService } from './auth.service';
import { SettingsService } from '@delon/theme';



@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    private LoginComponent: Type<Component>;

    constructor(private injector: Injector,
        private router: Router,
        private confirmServ: NzModalService,
        private settings: SettingsService,
        private auth: AuthenticationService) {

        this.LoginComponent = injector.get(LOGIN_COMPONENT_TOKEN);
    }

    chekcAuth(): boolean {
        return this.auth.isAuthenticated();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const url: string = state.url;

        if (this.chekcAuth()) {
            return true;
        }

        if (!this.settings.isInited()) {
            const LOGIN_URL = '/login';
            setTimeout(() => this.injector.get(Router).navigateByUrl(LOGIN_URL));
            return false;
        }

        // 如果未登录，则弹出登录框让用户进行登录
        return this.confirmServ.create({
            nzContent: this.LoginComponent,
            nzWrapClassName: 'modal-sm',
            nzFooter: null,
            nzMaskClosable: false
        }).afterClose.pipe(filter((res: any) => {
            let findIdx = -1;
            if (typeof res === 'string') {
                const resStr = res as string;
                findIdx = ['onOk'].findIndex(w => resStr.startsWith(w));
            }
            return findIdx !== -1;
        }), first(), map((res) => this.chekcAuth()));
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.canActivate(route, state);
    }
}
