import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { filter, first } from 'rxjs/operators';

import { SettingsService, MenuService, _HttpClient, ModalHelper } from '@delon/theme';
import { AuthenticationService } from '@core';

import { UserLoginMiniComponent } from '../../passport/login/login.mini.component';
import { UserSettingComponent } from '../../../routes/management/user/user.setting.component';
import { UserPasswrodComponent } from '../../../routes/management/user/user.password.component';
import { UserService } from '@biz';



@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    public authed = false;
    private menus = [];
    private user = {};
    private groups = {};
    private roles;
    private avatar = {};

    constructor(
        private modalHelper: ModalHelper,
        private router: Router,
        private _message: NzMessageService,
        private confirmSrv: NzModalService,
        private authService: AuthenticationService,
        private userService: UserService,
        public settings: SettingsService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.settings.getUser().subscribe((user) => {
            this.user = user || {};
            if (!this.user['uid']) return;

            this.userService.getAvatar(user).subscribe(data => {
                this.avatar['uid'] = this.user['uid'];
                this.avatar['avatar'] = data && data['avatar'];
            });
        });

        this.settings.getAuth().subscribe(v => {
            this.authed = v;
        });
        // this.loadData();
    }

    show(msg: string) {
        this._message.success(msg);
    }

    changePassword() {
        this.modalHelper.static(UserPasswrodComponent, { avatar: this.avatar }, 480)
            .subscribe(() => {
            });
    }

    showSetting() {
        this.modalHelper.static(UserSettingComponent, {}, 'lg').subscribe(() => {
        });
    }

    closeMenu() {
        this.settings.setLayout('collapsed', false);
    }

    login() {
        // 弹出登录框让用户进行登录
        this.confirmSrv
            .create(Object.assign({
                nzContent: UserLoginMiniComponent,
                nzWrapClassName: 'modal-sm',
                nzFooter: null,
                nzMaskClosable: false
            })).afterClose
            .pipe(
                filter((res: any) => {
                    let findIdx = -1;
                    if (typeof res === 'string') {
                        const resStr = res as string;
                        findIdx = ['onOk', 'onCancel'].findIndex(w => resStr.startsWith(w));
                    }
                    return findIdx !== -1;
                }),
                first()
            ).subscribe();
    }

    logout() {
        this.confirmSrv.confirm({
            nzContent: '您确认要退出系统吗？',
            nzOkText: '退出',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.authService.logout();
                this.router.navigate(['passport/login']);
            }
        });
    }

    logoff() {
        this.confirmSrv.confirm({
            nzContent: '您确认要注销吗？',
            nzOkText: '注销',
            nzCancelText: '取消',
            nzOnOk: () => {
                this.authService.logout();
                this.router.navigate(['/']);
            }
        });
    }
}
