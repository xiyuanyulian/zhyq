import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
    selector: 'header-user',
    template: `
    <div class="item d-flex align-items-center px-sm" [nzDropdownMenu]="menu" nz-dropdown nzPlacement="bottomRight">
        <nz-avatar [nzSrc]="settings.user.avatar || './assets/img/avatar.jpg'" nzSize="small" class="mr-sm"></nz-avatar>
        {{settings.user.name}}
    </div>
    <nz-dropdown-menu #menu="nzDropdownMenu">
        <ul nz-menu class="width-sm">
            <li nz-menu-item [nzDisabled]="true"><i nz-icon nzType="user" class="mr-sm"></i>个人中心</li>
            <li nz-menu-item [nzDisabled]="true"><i nz-icon nzType="setting" class="mr-sm"></i>设置</li>
            <li nz-menu-divider></li>
            <li nz-menu-item (click)="logout()"><i nz-icon nzType="setting" class="mr-sm"></i>退出登录</li>
        </ul>
    </nz-dropdown-menu>
    `
})
export class HeaderUserComponent implements OnInit {
    constructor(
        public settings: SettingsService,
        private router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {}

    ngOnInit(): void {
        this.tokenService.change().subscribe((res: any) => {
            this.settings.setUser(res);
        });
        // mock
        const token = this.tokenService.get() || {
            token: 'nothing',
            name: 'Admin',
            avatar: './assets/img/zorro.svg',
            email: 'cipchk@qq.com'
        };
        this.tokenService.set(token);
    }

    logout() {
        this.tokenService.clear();
        this.router.navigateByUrl(this.tokenService.login_url);
    }
}
