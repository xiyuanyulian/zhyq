import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from '@delon/theme';
import { AccountService } from '@biz/account.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Cookie from 'js.cookie';

@Component({
    selector: 'app-user-lock',
    templateUrl: './lock.component.html'
})
export class UserLockComponent implements OnInit {
    f: FormGroup;
    user: any;

    ngOnInit(): void {
        this.user = this.settings.user;
        Cookie.set('lock', true);
        this.closeWindow();
    }

    closeWindow() {
        window.onbeforeunload = function () {
            Cookie.remove('lock');
        };
    }

    constructor(
        public settings: SettingsService,
        fb: FormBuilder,
        private router: Router,
        public msgSrv: NzMessageService,
        private accountService: AccountService) {
        this.f = fb.group({
            password: [null, Validators.required]
        });
    }

    submit() {
        // tslint:disable-next-line:forin
        for (const i in this.f.controls) {
            this.f.controls[i].markAsDirty();
            this.f.controls[i].updateValueAndValidity();
        }
        if (this.f.valid) {
            this.accountService.validPassword(this.user, this.f.controls['password'].value).subscribe((res) => {
                if (res['msg']) {
                    Cookie.remove('lock');
                    this.router.navigate(['home']);
                } else {
                    this.msgSrv.error('密码错误！');
                }
            });
        }
    }
}
