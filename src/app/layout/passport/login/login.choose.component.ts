import { OnInit, Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'avalon-login-choose',
    templateUrl: './login.choose.component.html'
})
export class LoginChooseComponent implements OnInit {

    constructor(
        private subject: NzModalRef,
        private msgSev: NzMessageService
    ) {}

    ngOnInit(): void {
    }
    loading = false;
    body: any;
    users: any;

    choose(item) {
        if (item.enabled === 0) {
            this.msgSev.error('登录失败，账号已被禁用！');
            return;
        }
        this.body.username = item.username;
        this.subject.destroy(this.body);
    }
}
