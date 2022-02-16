import { SettingsService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SocialService, SocialOpenType, TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { AuthenticationService } from '@core';
import { User, UserService } from '@biz';
import { Base64 } from 'js-base64';
import Cookie from 'js.cookie';

@Component({
    selector: 'avalon-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: [SocialService]
})
export class UserLoginComponent implements OnInit, OnDestroy {

    form: FormGroup;
    error = '';
    info = '';
    type = '0'; // 0：账号密码登录， 1：手机验证码登录
    loading = false;
    time = 0;
    passCount = 0;

    constructor(
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private settings: SettingsService,
        private socialService: SocialService,
        @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
        private authService: AuthenticationService,
        private userService: UserService
    ) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(2)]],
            password: [null, Validators.required],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required, Validators.minLength(4)]],
            remembe: [true]
        });
        modalSrv.closeAll();
    }

    ngOnInit() {
        const content = Cookie.get('time');
        if (content) {
            this.time = parseInt(content, 0);
        } else {
            this.time = 0;
        }
        this.countDown();
    }

    countDown() {
        if (this.time > 2) {
            this.passCount = (this.time - 2) * (this.time - 2) * 59;
            this.interval$ = setInterval(() => {
                this.passCount -= 1;
                if (this.passCount <= 0)
                    clearInterval(this.interval$);
            }, 1000);
        }
    }

    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    switch(ret: any) {
        this.error = '';
        this.info = '';
    }

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        if (this.type === '0') {
            return false;
        }

        this.mobile.markAsDirty();
        this.mobile.updateValueAndValidity();

        const valid = this.form.get('mobile').valid;

        if (valid) {
            const mobile = this.form.get('mobile').value;
            this.userService.loginCaptcha({ uid: '', name: '', type: 'mobile', target: mobile }).subscribe(res => {
                this.info = '验证码发送成功！';
            }, error => {
                this.error = '系统错误！';
                return false;
            });
        } else {
            return false;
        }
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
    }

    // endregion

    validFileds() {
        if (this.type === '0') {
            this.userName.markAsDirty();
            this.userName.updateValueAndValidity();
            this.password.markAsDirty();
            this.password.updateValueAndValidity();
            if (this.userName.invalid || this.password.invalid) return false;
        } else {
            this.mobile.markAsDirty();
            this.mobile.updateValueAndValidity();
            this.captcha.markAsDirty();
            this.captcha.updateValueAndValidity();
            if (this.mobile.invalid) return false;
        }

        return true;
    }

    submit() {
        if (!this.validFileds()) return false;

        this.info = '';
        this.error = '';
        const val = this.form.value;
        let body;

        if (this.type === '0') {
            const password = Base64.encode(val.password);
            body = { username: val.userName, password: password, type: this.type };
        } else {
            body = { mobile: val.mobile, captcha: val.captcha, type: this.type };
        }

        this.form.markAsPristine();

        this.authService.login(body).subscribe((res) => {
            if (0 === res.code) {
                this.time = 0;
                // 登录成功后设置用户
                const u = this.authService.getAuthUser();
                u.type = u.orgs[0].type;
                this.settings.setUser(u);

                // 清空路由复用信息
                this.reuseTabService.clear();

                // TODO: 和拦截器里面的内容整合
                const path = this.settings.redirectTo || '/';
                if (this.settings.redirectTo) {
                    this.settings.redirectTo = null;
                }
                this.router.navigate([path]);
            } else {
                this.time += 1;
                this.countDown();
                this.error = res.msg;
            }
            Cookie.set('time', this.time);
        }, (error) => {
            this.error = '服务器错误：' + error.statusText;
        });
        // this.router.navigate(['dashboard']);

    }

    // region: social

    open(type: string, openType: SocialOpenType = 'href') {
        let url = ``;
        let callback = ``;
        if (environment.production)
            callback = 'https://cipchk.github.io/ng-alain/callback/' + type;
        else
            callback = 'http://localhost:4200/callback/' + type;
        switch (type) {
            case 'auth0':
                url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
                break;
            case 'github':
                url = `//github.com/login/oauth/authorize?client_id=
                9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
                break;
            case 'weibo':
                url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=
                code&redirect_uri=${decodeURIComponent(callback)}`;
                break;
        }
        if (openType === 'window') {
            this.socialService.login(url, '/', {
                type: 'window'
            }).subscribe(res => {
                if (res) {
                    this.settings.setUser(res);
                    this.router.navigateByUrl('/');
                }
            });
        } else {
            this.socialService.login(url, '/', {
                type: 'href'
            });
        }
    }

    // endregion

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
}
