import {Apollo, gql} from 'apollo-angular';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { GroupService, UserService } from '@biz';
import { ModalHelper, _HttpClient, SettingsService } from '@delon/theme';



import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, Observer, Subscription } from 'rxjs';
import * as dateFormat from 'format-datetime';

const gqlUser = gql`
  query getData($category: String){
    groupTree
    aDictionarys(category: $category) {
        code
        name
    }
  }
`;

@Component({
    selector: 'avalon-user-edit',
    templateUrl: './user.edit.component.html'
})
export class UserEditComponent implements OnInit {
    validateForm = new FormGroup({
        uid: new FormControl(),
        enabled: new FormControl(),
        fullname: new FormControl(),
        username: new FormControl(),
        gender: new FormControl(),
        birthdate: new FormControl(),
        email: new FormControl(),
        mobile: new FormControl(),
        gid: new FormControl(),
        user_section: new FormControl(),
        remark: new FormControl()
    });

    flag: any;
    _user;
    u: any = {};
    gid: string;
    groups = [];
    orgs = [];
    sections = [];
    user_section = [];
    idCardNoPattern = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    subscribe: Subscription;
    /*
     * 性别-国标
     * 0 - 未知的性别
     * 1 - 男性
     * 2 - 女性
     * 5 - 女性改（变）为男性
     * 6 - 男性改（变）为女性
     * 9 - 未说明的性别
     */
    genders = [];

    constructor(
        private modalHelper: ModalHelper,
        private subject: NzModalRef,
        public msgSrv: NzMessageService,
        private apollo: Apollo,
        private setting: SettingsService,
        private notifier: NzNotificationService,
        public http: _HttpClient,
        private groupService: GroupService,
        private userService: UserService,
        private fb: FormBuilder) { }

    pattern = /^\w+$/;
    userNameAsyncValidator = (control: FormControl) => new Observable((observer: Observer<ValidationErrors>) => {
        if (control.value && !this.u.uid) {
            if (!this.pattern.test(control.value)) {
                observer.next({ error: true, pattern: true });
                observer.complete();
                return;
            }
            this.userService.validateUserName(control.value).subscribe(res => {
                if (res.msg) {
                    this.flag = true;
                } else {
                    this.flag = false;
                }
            });
        }
        setTimeout(() => {
            if (this.flag) {
                observer.next({ error: true, confirm: true });
            } else {
                observer.next(null);
            }
            observer.complete();
        }, 1000);
    }
    )

    orgsValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value || control.value === '[]' || !control.value[0]) {
            return { required: true };
        }
    }

    hasAuth = false;
    ngOnInit() {
        const user = this.setting.user;
        const roles = user.roles;
        const role_codes = roles.map(e => e.code);
        if (role_codes.indexOf('SUPER') !== -1 || role_codes.indexOf('OPER') !== -1) {
            this.hasAuth = true;
        } else {
            if (!this.u.gid) {
                this.u.gid = this.setting.user.org_id;
                this.u.org_code = !!this.setting.user.choose_code ? this.setting.user.choose_code : this.setting.user.org_code;
                this.u.org_name = this.setting.user.org_name;
            }
        }
        const item: any = {
            fullname: [null, [Validators.required]],
                gender: [null, [Validators.required]],
                gid: [null, [this.orgsValidator]],
                uid: [false],
                enabled: [false],
                birthdate: [false],
                email: [false],
                mobile: [false],
                user_section: [false],
                remark: [false]
        };
        if (this.hasAuth) {
            item.gid = [null, [this.orgsValidator]];
            if (this.u.uid) {
                item.username = [false];
                this.validateForm = this.fb.group(item);
            } else {
                item.username = [null, [Validators.required], [this.userNameAsyncValidator]];
                this.validateForm = this.fb.group(item);
            }
        } else {
            item.gid = [false];
            if (this.u.uid) {
                item.username = [false];
                this.validateForm = this.fb.group(item);
            } else {
                item.username = [null, [Validators.required], [this.userNameAsyncValidator]];
                this.validateForm = this.fb.group(item);
            }
        }
        this.treeGroup();
    }

    @Input()
    set user(user: any) {
        this._user = user;
        this.userService.parse(this._user);
        this.u = this._user;
    }

    onSelectGroup(e: any) {
        if ('click' === e.eventName) {
            // this.u['gid'] = e.node.origin['id'];
            this.u['org_id'] = e.node.origin['id'];
            this.u['org_code'] = e.node.origin['code'];
            this.u['org_name'] = e.node.origin['name'];

            const gid = e.node.origin['id'];
        }
    }

    save() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            if (i !== 'username' || (i === 'username' && !this.validateForm.controls[i].value)) {
                this.validateForm.controls[i].updateValueAndValidity();
            }
        }
        if (!this.validateForm.valid) {
            return;
        }
        if (!this.u.org_id) {
            for (const x in this._group) {
                if (this._group[x].id === this.u.gid) {
                    this.u['org_id'] = this._group[x].id;
                    this.u['org_code'] = this._group[x].code;
                    this.u['org_name'] = this._group[x].name;
                }
            }
        }
        if (this.u.birthdate && this.u.birthdate instanceof Date) this.u.birthdate = dateFormat(this.u.birthdate, 'yyyy-MM-dd');
        delete this.u.role_name;
        delete this.u.roles;
        delete this.u.__typename;
        delete this.u.orgs;
        this.userService.save(this.u).subscribe((res) => {
            if (res.code === 0) {
                const user = res.data;
                Object.assign(this.u, user);
                this.userService.parse(this.u);
                console.log('用户信息保存成功： %s', user.fullname);
                this.close();
            } else {
                this.msgSrv.error(res.msg);
            }
        });
    }

    close() {
        this.subject.destroy(true);
    }

    _group: any[];
    /**
     * 构建组织机构树
     */
    treeGroup(callback?) {
        this.subscribe = this.apollo.watchQuery({
            query: gqlUser,
            variables: { category: 'GENDERS' },
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.genders = result.data['aDictionarys'];
            const nodes = result.data['groupTree'];
            this._group = result.data['groupTree'];
            this.groups = nodes.map(node => new NzTreeNode(node));
            if (!!callback) callback(this.groups);
        }, e => console.log(`Error: ${e}`));
    }

}
