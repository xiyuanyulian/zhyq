import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';

import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { UserService } from '@biz';
import { Observable, Observer } from 'rxjs';
import { Base64 } from 'js-base64';
import { AuthenticationService } from '@core';

@Component({
    selector: 'app-user-setting',
    templateUrl: './user.setting.component.html'
})
export class UserSettingComponent implements OnInit, OnDestroy {

    user: any;

    active = 1;

    captcha: string; // 验证码
    flag;
    loading = false;
    // avatarUrl = "./assets/img/avatar.jpg";
    avatarUrl;
    previewImage;
    uploading = false;
    fileList: NzUploadFile[] = [];
    states = ['正常', '休假', '出差'];
    isZF = false;
    inspector: any;

    second = 0;
    intervalId;

    mobileForm: FormGroup;
    emailForm: FormGroup;

    // 绑定微信
    redirectUri: string = encodeURIComponent('https://volunteer.toone.com/#/home'); // 重定向地址
    href: string = 'data:text/css;base64,' + Base64.encode(`.impowerBox .title {display: none;}
    .impowerBox .info {display: none;}`); // 二维码样式
    appid = '';
    state = '';
    url = '';

    constructor(
        private modalHelper: ModalHelper,
        private subject: NzModalRef,
        public http: _HttpClient,
        public msgSrv: NzMessageService,
        public settings: SettingsService,
        private userService: UserService,
        private fb: FormBuilder,
        private authService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        this.user = Object.assign({}, this.settings.user);
        this.mobileForm = this.fb.group({
            mobile: ['', [Validators.pattern(/^1[0-9]\d{9}$/)]],
            captcha: ['', [Validators.required], [this.captcha1AsyncValidator]]
        });

        this.emailForm = this.fb.group({
            email: ['', [Validators.email]],
            captcha: ['', [Validators.required], [this.captchaAsyncValidator]]
        });

    }

    captcha1AsyncValidator = (control: FormControl) => new Observable((observer: Observer<ValidationErrors>) => {
        if (control.value) {
            this.userService.validateCaptcha(this.mobileForm.get('mobile').value, control.value).subscribe(res => {
                const code = res['data'];
                this.flag = code;
            });
        }
        setTimeout(() => {
            if (!this.flag) {
                observer.next({ error: true, confirm: true });
            } else {
                observer.next(null);
            }
            observer.complete();
        }, 1000);
    }
    )

    captchaAsyncValidator = (control: FormControl) => new Observable((observer: Observer<ValidationErrors>) => {
        if (control.value) {
            this.userService.validateCaptcha(this.emailForm.get('email').value, control.value).subscribe(res => {
                const code = res['data'];
                this.flag = code;
            });
        }
        setTimeout(() => {
            if (!this.flag) {
                observer.next({ error: true, confirm: true });
            } else {
                observer.next(null);
            }
            observer.complete();
        }, 1000);
    }
    )

    close(): void {
        this.subject.destroy();
    }

    // 修改手机号码
    updateMobile(): void {
        this.userService.setting(this.user).subscribe(res => {
            if (res['code'] === 0) {
                this.msgSrv.success('修改成功！');
                this.userService.cleanCaptcha(this.mobileForm.get('mobile').value).subscribe();
                this.settings.user.mobile = this.mobileForm.get('mobile').value;
                this.close();
            } else {
                this.msgSrv.error(res['msg']);
            }
        });
    }

    // 修改用户邮箱
    updateEmail(): void {
        this.userService.settingWithCaptcha(this.user).subscribe(res => {
            if (res['code'] === 0) {
                this.msgSrv.success('修改成功！');
                this.userService.cleanCaptcha(this.emailForm.get('email').value).subscribe(() => { });
                this.settings.user.email = this.mobileForm.get('email').value;
                this.close();
            } else {
                this.msgSrv.success('修改失败！');
            }
        });
    }

    // 获取 email 验证码
    getEmailCaptcha(): void {
        const email = this.emailForm.get('email').value;
        const valid = this.emailForm.get('email').valid;

        if (valid) {
            this.userService.captcha({ uid: this.user.uid, name: this.user.fullname, type: 'email', target: email }).subscribe(res => {
                this.msgSrv.success('发送成功！', { nzDuration: 3000 });
                this.countDown(59);
            });
        } else {
            this.msgSrv.error('邮箱格式错误！！！', { nzDuration: 3000 });
        }
    }

    //
    getMobileCaptcha(): void {
        const mobile = this.mobileForm.get('mobile').value;
        const valid = this.mobileForm.get('mobile').valid;

        if (valid) {
            this.userService.captcha({ uid: this.user.uid, name: this.user.fullname, type: 'mobile', target: mobile }).subscribe(res => {
                this.msgSrv.success('发送成功！', { nzDuration: 3000 });
                this.countDown(59);
            });
        } else {
            this.msgSrv.error('手机格式错误！！！', { nzDuration: 3000 });
        }
    }

    countDown(count = 59): void {
        this.second = count;
        this.intervalId = setInterval(() => {
            this.second -= 1;
            if (this.second <= 0) clearInterval(this.intervalId);
        }, 1000);
    }

    ngOnDestroy(): void {
        if (this.intervalId) clearInterval(this.intervalId);
    }

    changeState(state): void {
        console.log(state);
    }

    updateEmailValidator(): void {
        Promise.resolve().then(() => this.emailForm.controls.captcha.updateValueAndValidity());
    }

    updateMobileValidator(): void {
        Promise.resolve().then(() => this.mobileForm.controls.captcha.updateValueAndValidity());
    }

    bindWeChat(): void {
        this.authService.getQrCode().subscribe(res => {
            this.active = 4;
            if (res['code'] === 0) {
                this.appid = res['data']['appid'];
                this.state = res['data']['state'];
                this.redirectUri = encodeURIComponent(res['data']['redirectUri']);
                this.url = `https://open.weixin.qq.com/connect/qrconnect?appid=${this.appid}&redirect_uri=${this.redirectUri}&response_type=code&scope=snsapi_login&state=${this.state}&href=${this.href}#wechat_redirect`;
            } else {
                this.msgSrv.error('获取appid失败，请重试', { nzDuration: 3000 });
            }
        });
    }

    release(): void { // 解绑微信，即清除unionid、openid
        this.authService.weChatUntie({ uid: this.user.uid }).subscribe(res => {
            if (res['code'] === 0) {
                this.msgSrv.success('解绑成功！');
                this.settings.setUser(Object.assign(this.user, {openId: '', unionId: ''}));
            } else {
                this.msgSrv.error('提交失败');
            }
        });
    }
}
