import { SettingsService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SocialService, SocialOpenType, TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { AuthenticationService } from '@core';
import { User } from '@biz/user.model';
import { UserService } from '@biz/user.service';
import { Base64 } from 'js-base64';

@Component({
    selector: 'passport-login-mini',
    templateUrl: './login.mini.component.html',
    styleUrls: ['./login.mini.component.less'],
    providers: [SocialService]
})
export class UserLoginMiniComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    type = '0';
    loading = false;

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
        private userService: UserService,
        private subject: NzModalRef
    ) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(2)]],
            password: [null, Validators.required],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, Validators.required],
            remember: [true]
        });
        modalSrv.closeAll();
    }

    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    switch(ret: any) {
        this.type = ret.index + '';
    }

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        if (this.type === '0') {
            return;
        }
        const mobile = this.form.get('mobile').value;
        if (!mobile) {
            this.msg.error('请输入手机号码！');
            return;
        }
        const valid = this.form.get('mobile').valid;

        if (valid) {
            this.userService.loginCaptcha({ uid: '', name: '', type: 'mobile', target: mobile }).subscribe(res => {
                this.msg.success('发送成功！');
            }, error => {
                this.error = '系统错误！';
                return false;
            });
        } else {
            this.msg.error('手机格式错误！！！');
            return;
        }
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
    }

    // endregion

    submit() {
        this.error = '';
        const val = this.form.value;
        let body;
        if (this.type === '0') {
            this.userName.markAsDirty();
            this.userName.updateValueAndValidity();
            this.password.markAsDirty();
            this.password.updateValueAndValidity();
            if (this.userName.invalid || this.password.invalid) return;
            // body = { username: val.userName, password: val.password, type: this.type };
        } else {
            this.mobile.markAsDirty();
            this.mobile.updateValueAndValidity();
            this.captcha.markAsDirty();
            this.captcha.updateValueAndValidity();
            if (this.mobile.invalid || this.captcha.invalid) return;
            // body = { mobile: val.mobile, type: this.type };
        }

        if (this.type === '0') {
            const password = Base64.encode(val.password);
            body = { username: val.userName, password: password, type: this.type };
        } else {
            body = { mobile: val.mobile, captcha: val.captcha, type: this.type };
        }

        this.authService.login(body).subscribe((res) => {
            if (0 === res.code) {
                // 登录成功后设置用户
                const u = this.authService.getAuthUser();
                u.type = u.orgs[0].type;
                this.settings.setUser(u);
                this.subject.destroy('onOk');
                this.router.navigate(['/']);
                setTimeout(() => {
                    this.router.navigate(['/']);
                });
            } else {
                this.error = res.msg;
            }
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
                url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-
                wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
                break;
            case 'github':
                url = `//github.com/login/oauth/authorize?client_id=
                9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
                break;
            case 'weibo':
                url = `https://api.weibo.com/oauth2/authorize?client_id=
                1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
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
