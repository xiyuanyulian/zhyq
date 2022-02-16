import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient, ModalHelper } from '@delon/theme';

import { AccountService } from '@biz/account.service';
import { UserService } from '@biz/user.service';

@Component({
    selector: 'avalon-user-account',
    templateUrl: './user-account.component.html'
})
export class UserAccountComponent implements OnInit {

    private _user: any;
    list: any[] = [];
    s = {};
    total = 0;

    _indeterminate = false;
    _displayData = [];
    roles = [];

    constructor(
        public http: _HttpClient,
        public msgSrv: NzMessageService,
        private modalHelper: ModalHelper,
        private userService: UserService,
        private accountService: AccountService
    ) { }

    ngOnInit() {
    }

    @Input()
    set user(user: any) {
        this._user = user;
        this.load(user);
    }

    load(user) {
        if (!user) {
            return;
        }

        this.userService.getAccounts(user).subscribe((res: any) => {
            this.list = res;
            this.total = !!res ? res.length : 0;
        });
    }

    edit(account) {
    }

    save(account) {
    }

    remove(account) {
    }

    changePwd(account) {

    }

    toggleEnabled(account) {
        account.enabled = !account.enabled;
        this.accountService.save(account).subscribe((data) => {
            console.log('账号[%s]已经被%', account.identity, account.enabled ? '启用' : '禁用');
        });
    }

}
