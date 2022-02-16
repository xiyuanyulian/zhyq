import {Apollo, QueryRef, gql} from 'apollo-angular';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { UserEditComponent } from './user.edit.component';
import { ROLES } from '../../../core/acl/interface';



import { UserService } from '@biz/user.service';
import { Subscription } from 'rxjs';


const gqlUsers = gql`
  query gUsers($rows: Int, $page: Int, $keyword: String, $enabled: String, $org_ids: [String], $role_id: String){
    gUsers(rows: $rows, page: $page, keyword: $keyword, enabled: $enabled, org_ids: $org_ids, role_id: $role_id) {
        totalCount,
        edges{
            node{
                uid, fullname, username, org_name, role_name,
                mobile, email, created_at, enabled, gender, birthdate,
                gid, remark
                roles{
                    id
                    code
                }
            }
        }
    }
  }
`;

const gqlOrgs = gql`
  query orgs{
    uGroupTree
  }
`;

@Component({
    selector: 'avalon-user-list',
    templateUrl: './user.list.component.html'
})
export class UserListComponent implements OnInit {

    private user = {};
    list: any[] = [];
    s: any = {
        page: 1,
        rows: 10,
        enabled: '',
        role_id: ''
    };
    total = 0;
    loading = false;
    subscribe: Subscription;
    showPwdDialog = false;
    password = '';
    loginUser: any = {};
    hasAuth = false;
    downloadFile = { url: '/api/checkObjectBase/exportUser', exprotUrl: '' };

    @Output()
    onUserChanged = new EventEmitter<any>();

    @Output()
    onOpenPanel = new EventEmitter<any>();

    constructor(
        public http: _HttpClient,
        public msgSrv: NzMessageService,
        private setting: SettingsService,
        private modalHelper: ModalHelper,
        private apollo: Apollo,
        private userService: UserService
    ) { }

    showRole = false;
    org_type = 'SUPER';
    nodes: any[] = [];
    ngOnInit() {
        this.loginUser = this.setting.user;
        const user_roles = this.loginUser.roles;
        const org = this.loginUser.orgs[0];
        const role_codes = user_roles.map(e => e.code);
        const type = this.loginUser.type || org.type;
        this.org_type = type;
        if (role_codes.includes(ROLES.SUPER)) {
            this.org_type = 'SUPER';
            this.hasAuth = true;
        } else if (role_codes.includes(ROLES.OPER)) {
            this.org_type = 'SUPER';
            this.hasAuth = true;
            if (type === 'DEVOPS') {
                this.s.org_ids = [];
            } else {
                this.s.org_ids = [this.loginUser.org_id];
            }
        } else {
            this.s.org_ids = [this.loginUser.org_id];
        }
        if (role_codes.includes(ROLES.SUPER) || role_codes.includes(ROLES.OPER)) {
            this.showRole = true;
        } else {
            this.showRole = false;
        }
        this.downloadFile.exprotUrl = this.downloadFile.url;
        this.load();

        if (this.org_type === 'TOWN') {
            this.subscribe = this.apollo.watchQuery({
                query: gqlOrgs,
                variables: {},
                fetchPolicy: 'no-cache'
            }).valueChanges.subscribe(result => {
                const nodes = result.data['uGroupTree'];
                this.nodes = nodes.map(node => new NzTreeNode(node));
            }, e => console.log(`Error: ${e}`));
        }
    }

    search() {
        this.load(true);
    }

    onChange(e) {
        this.s.org_ids = e;
        if (this.s.org_ids.length < 1) {
            return;
        }
        this.load(true);
    }

    change(): void {
        this.load(true);
    }

    load(reload: boolean = false) {

        if (reload) {
            this.s.page = 1;
        }

        if (this.s.org_ids && this.s.org_ids.length < 1 && this.org_type === 'TOWN') {
            return;
        }

        this.downloadFile.exprotUrl = this.downloadFile.url + '?keyword=' + this.s.keyword
            + '&enabled=' + this.s.enabled;

        this.subscribe = this.apollo.watchQuery({
            query: gqlUsers,
            variables: this.s,
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.list = result.data['gUsers']['edges'];
            this.total = result.data['gUsers']['totalCount'];
            this.loading = result.loading;
        }, e => console.log(`Error: ${e}`));

    }

    changeType(e) {
        this.s.division_code = e;
        this.downloadFile.exprotUrl = this.downloadFile.url + '?keyword=' + this.s.keyword
            + '&enabled=' + this.s.enabled;
        this.load(true);
    }

    edit(user) {
        this.modalHelper.static(UserEditComponent, { user }).subscribe(() => {
            this.load();
        });
    }

    toggleEnabled(item) {
        const i = Object.assign({}, item);
        i.enabled = !i.enabled;
        delete i.role_name;
        delete i.roles;
        delete i.__typename;
        this.userService.save(i).subscribe((data) => {
            this.load();
        });
    }

    showAccountPanel(i) {
    }

    showOrgPanel(i) {
        this.selectUser(i);
        this.openSettingPanel(0);
    }

    showRolePanel(i) {
        this.selectUser(i);
        this.openSettingPanel(0);
    }

    showPermissionPanel(i) {
        this.selectUser(i);
        this.openSettingPanel(1);
    }

    showPasswordDialog(i) {
        this.selectUser(i);
        this.password = '';
        this.showPwdDialog = true;
    }

    showQualification(i) {
        this.selectUser(i);
    }

    selectUser(user) {
        this.user = user;
        this.onUserChanged.emit(user);
    }

    openSettingPanel(panel) {
        this.onOpenPanel.emit({ user: this.user, panel });
    }

    handleOk = (e) => {
        this.userService.setPassword(this.user, this.password).subscribe((data) => {
            this.msgSrv.success('修改密码成功！');
            this.password = '';
            this.showPwdDialog = false;
        });
    }

    handleCancel = (e) => {
        this.password = '';
        this.showPwdDialog = false;
    }

    pickRow(i) {
        this.selectUser(i);
        const obj = document.getElementsByName('selected');
        for (let x = 0, l = obj.length; x < l; x++) {
            const objTemp = obj[x];
            objTemp.style.backgroundColor = 'rgb(255,255,255)';
        }
        document.getElementById('selected' + i.uid).style.backgroundColor = 'rgb(186,231,255)';
    }

    delete(i) {
        if (JSON.stringify(i.roles).includes('SUPER')) {
            this.msgSrv.error('系统管理员不允许删除！');
            return;
        }
        this.userService.delete(i).subscribe((data) => {
            if (data.code === 0) {
                this.msgSrv.success('删除成功！');
            } else {
                this.msgSrv.error('删除失败！');
            }
            this.load();
        }, e => console.error(`Error : ${e}`));
    }

    clear() {
        this.s.keyword = null;
        this.load();
    }
}
