import { Component, DoCheck, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, UserService } from '@biz';
import { AuthenticationService } from '@core';
import { ReuseTabService } from '@delon/abc';
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth';
import { ModalHelper, SettingsService } from '@delon/theme';
import { Base64 } from 'js-base64';
import Cookie from 'js.cookie';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LoginChooseComponent } from './login/login.choose.component';
import { BroswerVersionComponent } from './version/broswer.version.component';
import { WechatLoginComponent } from './wechat-login/wechat-login.component';
import { v4 as uuidv4 } from 'uuid';
import { Observable, Observer } from 'rxjs';
declare var $: any;
// declare var SlidingVerificationCode: any;
@Component({
    selector: 'layout-passport',
    templateUrl: './passport.component.html',
    styleUrls: ['./passport.component.less']
})
export class LayoutPassportComponent implements OnInit, DoCheck {
    ngDoCheck() {
        const code = this.route.snapshot.queryParams;
        if (!!code.code && !this.hasDone) {
            this.authService.closeCode.emit(true);
            this.hasDone = true;
            this.wechatLogin(code.code);
        }
    }

    form: FormGroup;
    error = '';
    loginError = '';
    info = '';
    type = '0'; // 0：账号密码登录， 1：手机验证码登录
    loading = false;
    time = 0;
    passCount = 0;
    refresh_token = '';
    hasDone = false; // 是否已执行微信code的获取使用

    constructor(
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private accountService: AccountService,
        private settings: SettingsService,
        // private socialService: SocialService,
        @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
        private authService: AuthenticationService,
        private userService: UserService,
        private modal: ModalHelper,
        private route: ActivatedRoute,
    ) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(2)]],
            password: [null, Validators.required],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required, Validators.minLength(4)]],
            inputCode: [null, Validators.required, [this.passwordAsyncValidator]],
            remembe: [true]
        });
        modalSrv.closeAll();
    }


    uuid: any;
    ngOnInit() {
        this.uuid = uuidv4();
        this.createCode();
        this.validBroswerVersion();
        $('.tabs div').click(function () {
            $(this).parent('li').siblings().removeClass('head-center-active');
            $(this).parent('li').addClass('head-center-active');
            const $targetname = $(this).attr('href').substring(1);
            $(this).parents('.tabs').siblings('.tabs-main').hide();
            $('.tabs-' + $targetname).show();
            if ($('.head-center-active').children('div').text() === '密码登录') {
                this.type = '0';
                $('#errorMsg1').hide();
                $('#errorMsg0').show();
            } else {
                this.type = '1';
                $('#errorMsg0').hide();
                $('#errorMsg1').show();
            }
        });
        const content = Cookie.get('time');
        if (content) {
            this.time = parseInt(content, 0);
        } else {
            this.time = 0;
        }
        this.countDown();
        // this.inits();
        const _this = this;
        document.onkeydown = function (ev) {
            if (ev.key === 'Enter') {
                _this.submit();
            }
        };
    }

    validBroswerVersion() {
        if (this.getChromeVersion()) {
            const version = this.getChromeVersion();
            if (version < 60) {
                this.modal.static(BroswerVersionComponent, { type: 'c' }, 400).subscribe();
            }
        } else {
            this.modal.static(BroswerVersionComponent, { type: 'n' }, 400).subscribe();
        }
    }

    getChromeVersion() {
        const arr = navigator.userAgent.split(' ');
        let chromeVersion = '';
        for (let i = 0; i < arr.length; i++) {
            if (/chrome/i.test(arr[i]))
                chromeVersion = arr[i];
        }
        if (chromeVersion) {
            return Number(chromeVersion.split('/')[1].split('.')[0]);
        } else {
            return false;
        }
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

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }
    get inputCode() { return this.form.controls.inputCode; }

    // endregion

    switch(ret: any) {
        this.error = '';
        this.info = '';
        this.loginError = '';
    }

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        // if (this.type === '0') {
        //     return false;
        // }
        if ($('.head-center-active').children('div').text() === '密码登录') {
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
        if ($('.head-center-active').children('div').text() === '密码登录') {
            this.userName.markAsDirty();
            this.userName.updateValueAndValidity();
            this.password.markAsDirty();
            this.password.updateValueAndValidity();
            if (this.userName.invalid || this.password.invalid || this.inputCode.invalid) return false;
        } else if ($('.head-center-active').children('div').text() === '快捷登录') {
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
        this.loginError = '';
        const val = this.form.value;
        let body;

        if ($('.head-center-active').children('div').text() === '密码登录') {
            const password = Base64.encode(val.password);
            this.type = '0';
            body = { username: val.userName, password: password, type: this.type, uuid: this.uuid };
        } else {
            this.type = '1';
            body = { mobile: val.mobile, captcha: val.captcha, type: this.type };
        }

        this.form.markAsPristine();

        if (!!this.refresh_token) {
            body.refresh_token = this.refresh_token;
        }

        if (this.type === '0') {
            this.login(body);
        } else {
            this.accountService.login(body).subscribe((res) => {
                if (res.code === 0) {
                    const users = res.data;
                    if (users.length > 1) {
                        this.modal.static(LoginChooseComponent, { body, users: users }, 'md').subscribe((result) => {
                            if (!!result) {
                                this.login(result);
                            }
                        });
                    } else {
                        body.username = users[0].username;
                        if (users[0].enabled === 0) {
                            this.msg.error('登录失败，账号已被禁用！');
                            return;
                        }
                        this.login(body);
                    }
                } else {
                    this.error = res.msg;
                }
            });
        }
        // this.router.navigate(['dashboard']);
    }

    login(body: any) {
        this.loading = true;
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
                this.loginError = res.msg;
                console.log(this.loginError, this.type);
            }
            this.loading = false;
            Cookie.set('time', this.time);
        }, (error) => {
            this.loading = false;
            this.loginError = '服务器错误：' + error.statusText;
        });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }

    // show WeChat QR Code
    qrCode() {
        this.authService.getQrCode().subscribe(res => {
            if (res['code'] === 0) {
                this.modal.static(WechatLoginComponent, {
                    appid: res['data']['appid'],
                    state: res['data']['state'],
                    redirectUri: encodeURIComponent(res['data']['redirectUri'])
                }, 480).subscribe();
            } else {
                this.msg.error('获取appid失败,请重试');
            }
        });
    }

    passwordAsyncValidator = (control: FormControl) => new Observable((observer: Observer<ValidationErrors>) => {
        if (!control.value) {
            observer.next({ required: true });
            observer.complete();
        } else {
            this.accountService.validCaptcha(this.uuid, control.value).subscribe((res) => {
                if (res.code) {
                    observer.next(null);
                    observer.complete();
                } else {
                    observer.next({ error: true });
                    observer.complete();
                }
            });
        }

    })

    wechatLogin(code) {
        this.authService.weChatLogin({ code: code }).subscribe(res => {
            if (0 === res['code']) {
                this.time = 0;
                // 登录成功后设置用户
                const u = this.authService.getAuthUser();
                this.settings.setUser(u);

                // 清空路由复用信息
                this.reuseTabService.clear();

                // TODO: 和拦截器里面的内容整合
                const path = this.settings.redirectTo || '/';
                if (this.settings.redirectTo) {
                    this.settings.redirectTo = null;
                }
                this.router.navigate([path]);
            } else if (res['msg'] === '用户未绑定微信' && res['code'] === 2) {
                this.refresh_token = res['data']['refresh_token'] || '';
                this.msg.warning(`您未绑定微信，请输入账号密码登录并绑定！`, { nzDuration: 3000 });
            } else if (res['msg'] === '请选择账号登录' && res['code'] === 2) {
                const data = res['data'] || {};
                this.modal.static(LoginChooseComponent,
                    {
                        body: { openid: data.openid, unionid: data.unionid, refresh_token: data.refresh_token, type: '2' },
                        users: data['users']
                    }, 'md').subscribe((result) => {
                        if (!!result) {
                            this.login(result);
                        }
                    });
            } else {
                this.msg.warning(res['msg'] || '登录失败！');
            }
        });
    }

    code = '';
    createCode() {
        const checkCode = document.getElementById('checkCode');
        checkCode.className = 'code';

        this.accountService.getCaptcha(this.uuid).subscribe((res) => {
            checkCode.innerHTML = res.code;
        });
    }

    turn(value) {
        this.type = value;
        if (value === '0') {
            this.accountService.validCaptcha(this.uuid, this.inputCode).subscribe((res) => {
                if (!res.code) {
                    this.loginError = '请输入正确验证码！';
                }
            });
        }
    }
}
