import {gql, Apollo} from 'apollo-angular';
import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { UserEditComponent } from '../user/user.edit.component';
import { ROLES } from '../../../core/acl/interface';

import { Observable, Subscription } from 'rxjs';

import { GroupService } from '@biz/group.service';
import { UserService } from '@biz/user.service';
import { RoleService } from '@biz/role.service';



const gqlUsers = gql`
  query gUsers($rows: Int, $page: Int, $keyword: String, $org_id: String, $scop: String, $enabled: String){
    gUsers(rows: $rows, page: $page, keyword: $keyword, org_id: $org_id, scop: $scop, enabled: $enabled) {
        totalCount,
        edges{
            node{
                uid, fullname, username, role_name, mobile, email, enabled, gender, gid ,
                roles{
                    id, code, name
                }
            }
        }
    }
  }
`;

const gqlRoles = gql`
  query roles($rows: Int, $page: Int, $code: String, $name: String){
    roles(rows: $rows, page: $page, code: $code, name: $name) {
        totalCount,
        edges{
            node{
                id, code, name, remark
            }
        }
    }
  }
`;

@Component({
    selector: 'avalon-group-user',
    templateUrl: './group-user.component.html'
})
export class GroupUserComponent implements OnInit {

    $group: Observable<any>;
    _group: any;
    list: any[] = [];
    role_codes: any[];
    currentUser: any;
    user: any;
    s: any = {
        page: 1,
        rows: 10,
        enabled: '',
        scop: '2',
    };
    total = 0;
    visible = false;
    rolelist: any[] = [];
    roletotal = 0;
    roles = [];
    _user: any;
    authlist: any[] = [];
    subscribe: Subscription;
    subscribe1: Subscription;
    downloadFile = { url: '/api/checkObjectBase/exportOrgUser', exprotUrl: '' };

    showPwdDialog = false;
    password = '';

    open(user): void {
        this._user = user;
        this.s2.viewName = user.fullname + '角色绑定';
        this.setUser(user);
        this.visible = true;
    }

    setUser(user) {
        this.roles = user.roles;

        this._refreshStatus((node) => {
            node.node.checked = this.roles.some(e => node.node.id === e.id) ? true : false;
        });
    }

    _refreshStatus(callback) {
        this.rolelist.forEach(e => callback(e));
    }

    close(): void {
        this.visible = false;
    }

    toggleRole(role) {
        if (!this.isHasAuth(role.code)) {
            this.msgSrv.error('您没有权限设置该权限');
            return;
        }
        if (this._user && this._user.uid) {
            this.userService.setRole(this._user, role).subscribe((data) => {
                if (role.checked) {
                    this._user.roles.push(role);
                } else {
                    for (let x = 0; x < this._user.roles.length; x++) {
                        if (this._user.roles[x].id === role.id) {
                            this._user.roles.splice(x, 1);
                        }
                    }
                }
                this.setUser(this._user);
            });
        }
    }

    isHasAuth(role) {
        let flag = true;
        if (this.role_codes.includes(ROLES.SUPER)) {
            flag = true;
        } else if (this.role_codes.includes(ROLES.ADMIN)) {
            if (role === ROLES.SUPER) {
                flag = false;
            }
        } else if (this.role_codes.includes(ROLES.DEPART)) {
            if (role === ROLES.SUPER || role === ROLES.ADMIN) {
                flag = false;
            }
        }
        return flag;
    }

    constructor(
        public http: _HttpClient,
        public msgSrv: NzMessageService,
        private modalHelper: ModalHelper,
        private apollo: Apollo,
        private settingsService: SettingsService,
        private groupService: GroupService,
        private roleService: RoleService,
        private userService: UserService
    ) { }

    showRole = true;
    ngOnInit() {
        this.user = this.settingsService.user;
        const user_roles = this.user.roles;
        this.role_codes = user_roles.map(e => e.code);
        if (this.role_codes.includes(ROLES.SUPER) || this.role_codes.includes(ROLES.OPER)) {
            this.showRole = true;
        } else {
            this.showRole = false;
        }

        this.$group.subscribe(group => {
            this._group = group;
            if (this.role_codes.includes(ROLES.SUPER)) {
                this.s['org_id'] = group ? group.id : '';
            } else if (this.role_codes.includes(ROLES.ADMIN)) {
                if (this.user.orgs[0].division_code === '440700') {
                    this.s['org_id'] = group ? group.id : '';
                } else {
                    if (group && group.code && group.code.length >= 6) {
                        this.s['org_id'] = group ? group.id : '';
                    } else {
                        this.s['org_id'] = '0';
                    }
                }
            } else if (this.role_codes.includes(ROLES.DEPART)) {
                if (group && group.code && group.code.length >= this.user.org_code.length) {
                    this.s['org_id'] = group ? group.id : '';
                } else {
                    this.s['org_id'] = '0';
                }
            }
            this.load(true);
        }, e => console.log(`Error: ${e}`));
        this.loadRole();
        this.downloadFile.exprotUrl = this.downloadFile.url + '?group_id=' + this.s.org_id
            + '&scop=' + this.s.scop + '&enabled=' + this.s.enabled + '&keyword=' + this.s.keyword;
    }

    s2: any = {
        page: 1,
        rows: 10,
        enabled: '',
        scop: '2',
    };
    loadRole(reload: boolean = false) {
        if (reload) {
            this.s2.page = 1;
        }

        this.subscribe1 = this.apollo.watchQuery({
            query: gqlRoles,
            variables: this.s2,
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.rolelist = result.data['roles']['edges'];
            this.roletotal = result.data['roles']['totalCount'];
        }, e => console.log(`Error: ${e}`));
    }

    setAuth() {
        if (this.role_codes.includes(ROLES.SUPER)) {
        } else if (this.role_codes.includes(ROLES.ADMIN)) {
            this.authlist = [ROLES.SUPER];
        } else if (this.role_codes.includes(ROLES.DEPART)) {
            this.authlist = [ROLES.SUPER, ROLES.ADMIN];
        }
        this._refreshAuth((node) => {
            node.disabled = this.authlist.some(e => node.id === e) ? true : false;
        });
    }

    _refreshAuth(callback) {
        this.rolelist.forEach(e => callback(e));
    }

    @Input()
    set group(group: any) {
        this.$group = group;
    }

    showQualification(i) {
    }

    load(reload: boolean = false) {
        if (reload) {
            this.s.page = 1;
        }

        this.downloadFile.exprotUrl = this.downloadFile.url + '?group_id=' + this.s.org_id
            + '&scop=' + this.s.scop + '&enabled=' + this.s.enabled + '&keyword=' + this.s.keyword;

        this.subscribe = this.apollo.watchQuery({
            query: gqlUsers,
            variables: {
                page: this.s.page,
                rows: this.s.rows,
                keyword: this.s.keyword,
                org_id: this.s.org_id,
                scop: this.s.scop,
                enabled: this.s.enabled
            },
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.list = result.data['gUsers']['edges'];
            this.total = result.data['gUsers']['totalCount'];
        }, e => console.log(`Error: ${e}`));
    }

    edit(user) {
        this.modalHelper.static(UserEditComponent, { user }).subscribe(() => {
            this.load();
        });
    }

    toggleEnabled(i) {
        i.enabled = !i.enabled;
        this.userService.save(i).subscribe((data) => this.load());
    }

    toggleUser(user) {
        if (this._group && this._group.id) {
            this.groupService.setUser(this._group, user).subscribe((data) => { });
        }
    }

    showPasswordDialog(i) {
        this.pickRow(i);
        this.password = '';
        this.showPwdDialog = true;
    }

    pickRow(i) {
        this.currentUser = i;
    }

    handleOk = (e) => {
        if (!this.currentUser) return;
        this.userService.setPassword(this.currentUser, this.password).subscribe((data) => {
            this.msgSrv.success('修改密码成功！');
            this.password = '';
            this.showPwdDialog = false;
        });
    }

    handleCancel = (e) => {
        this.password = '';
        this.showPwdDialog = false;
    }

}
