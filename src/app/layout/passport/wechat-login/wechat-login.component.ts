import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@core';

@Component({
    selector: 'wechat-login',
    templateUrl: './wechat-login.component.html'
})
export class WechatLoginComponent implements OnInit, OnDestroy {

    url = '';
    state = '';
    appid = '';
    redirectUri = '';
    subscript: Subscription;
    constructor(
        private modal: NzModalRef,
        private authService: AuthenticationService
    ) { }

    ngOnInit() {
        this.subscript = this.authService.closeCode.subscribe(e => {
            if (e) {
                this.modal.destroy();
            }
        });
        this.url = `https://open.weixin.qq.com/connect/qrconnect?appid=${this.appid}&redirect_uri=${this.redirectUri}&response_type=code&scope=snsapi_login&state=${this.state}#wechat_redirect`;
    }

    ngOnDestroy(): void {
        this.modal.destroy();
    }

}
