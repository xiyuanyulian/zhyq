import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { UserService } from '@biz';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SettingsService } from '@delon/theme';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
    ValidationErrors
} from '@angular/forms';

@Component({
    selector: 'nz-demo-form-register',
    templateUrl: './user.password.component.html',
})

export class UserPasswrodComponent implements OnInit {
    validateForm: FormGroup;
    flag: any;
    user: any;

    submitForm(): void {
        const regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}');
        const flag = regex.test(this.validateForm.controls['checkPassword'].value);
        if (!flag) {
            this.msgSrv.warning('密码必须包含英文字母、数字和特殊字符');
            return;
        }

        if ( !this.validateForm.valid) return;

        this.userService.setPassword(this.user, this.validateForm.controls.password.value).subscribe((res) => {
            this.msgSrv.success('修改成功');
            this.close();
        });
    }

    close() {
        this.subject.destroy();
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validateForm.controls.password.value) {
            return { confirm: true, error: true };
        }
    }


    updateConfirmValidator(): void {
        /** wait for refresh value */
        Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
    }

    passwordAsyncValidator = (control: FormControl) => new Observable((observer: Observer<ValidationErrors>) => {
        if (control.value) {
            this.userService.validatePassword(control.value, this.user).subscribe(res => {
                if (res.msg) {
                    this.flag = true;
                } else {
                    this.flag = false;
                }
            });
        }
        setTimeout(() => {
            if (this.flag) {
                observer.next(null);
            } else {
                observer.next({ error: true, confirm: true });
            }
            observer.complete();
        }, 1000);
    }
    )

    constructor(
        private fb: FormBuilder,
        public msgSrv: NzMessageService,
        private userService: UserService,
        public settings: SettingsService,
        private subject: NzModalRef) {
    }

    showStrength1 = false;
    showStrength2 = false;
    showStrength3 = false;
    pattern = /^[^ ]+$/;
    passwordValidator = (control: FormControl) => new Observable((observer: Observer<ValidationErrors>) => {
        if (control.value) {
            if (!this.pattern.test(control.value)) {
                observer.next({ error: true, pattern: true });
                observer.complete();
                return;
            }
            if (control.value.length < 8) {
                observer.next({ error: true, type: true });
                observer.complete();
                this.showStrength1 = false;
                this.showStrength2 = false;
                this.showStrength3 = false;
            } else {
                this.validStrength(control.value);
                observer.next(null);
                observer.complete();
            }
        } else {
            this.showStrength1 = false;
            this.showStrength2 = false;
            this.showStrength3 = false;
        }
    }
    )

    validStrength(pwd) {
        let result;
        for (let i = 0, len = pwd.length; i < len; ++i) {
            result |= this.charType(pwd.charCodeAt(i));
        }
        let level = 0;
        // 对result进行四次循环，计算其level
        for (let i = 0; i <= 4; i++) {
            if (result & 1) {
                level++;
            }
            // 右移一位
            result = result >>> 1;
        }

        switch (level) {
            case 1:
                this.showStrength1 = true;
                this.showStrength2 = false;
                this.showStrength3 = false;
                break;
            case 2:
                this.showStrength1 = false;
                this.showStrength2 = true;
                this.showStrength3 = false;
                break;
            case 3:
            case 4:
                this.showStrength1 = false;
                this.showStrength2 = false;
                this.showStrength3 = true;
                break;
            default:
                break;
        }

    }

    charType(num) {
        if (num >= 48 && num <= 57) {
            return 1;
        }
        if (num >= 97 && num <= 122) {
            return 2;
        }
        if (num >= 65 && num <= 90) {
            return 4;
        }
        return 8;
    }

    ngOnInit(): void {
        this.user = this.settings.user;
        this.validateForm = this.fb.group({
            oldPassword: [null, [Validators.required], [this.passwordAsyncValidator]],
            password: [null, [Validators.required], [this.passwordValidator]],
            checkPassword: [null, [this.confirmationValidator]],
        });
    }
}
