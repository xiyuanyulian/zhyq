import {gql, Apollo} from 'apollo-angular';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { BehaviorSubject, Subscription } from 'rxjs';

import { UserService } from '@biz/user.service';
import { RoleService } from '@biz/role.service';
import { ROLES } from '../../../core/acl/interface';



const gqlRoles = gql`
  query roles($rows: Int, $page: Int, $code: String, $name: String, $type: Int){
    roles(rows: $rows, page: $page, code: $code, name: $name, type: $type) {
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
    selector: 'avalon-user-role',
    templateUrl: './user-role.component.html'
})
export class UserRoleComponent implements OnInit, OnDestroy {

    private _user: any;
    $user: BehaviorSubject<any>;
    list: any[] = [];
    s: any = {
        page: 1,
        rows: 10,
    };
    total = 0;
    sub: Subscription;
    subscribe: Subscription;

    _indeterminate = false;
    _displayData = [];
    roles = [];

    role_codes = [];

    constructor(
        public http: _HttpClient,
        private apollo: Apollo,
        public msgSrv: NzMessageService,
        private settingsService: SettingsService,
        private modalHelper: ModalHelper,
        private userService: UserService,
        private roleService: RoleService
    ) { }

    currentUser: any;
    ngOnInit() {
        this.currentUser = this.settingsService.user;
        const user_roles = this.currentUser.roles;
        this.role_codes = user_roles.map(e => e.code);
        this.load();
        // this.u.subscribe(u => this.setUser(u), e => console.log(`Error: ${e}`));
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @Input()
    set user(user: any) {
        this.$user = user;
        this.sub = this.$user.subscribe(u => {
            if (!u || u.type === 'changeRole') return;
            this.setUser(u.data);
        },
            e => console.log(`Error: ${e}`)
        );
    }

    load(reload: boolean = false) {
        this.s.type = 0;
        this.subscribe = this.apollo.watchQuery({
            query: gqlRoles,
            variables: this.s,
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.list = result.data['roles']['edges'];
            this.total = result.data['roles']['totalCount'];
            this._refreshStatus((node) => {
                node.checked = this.roles.some(e => node.id === e.id) ? true : false;
            });
            this.setAuth();
        }, e => console.log(`Error: ${e}`));
    }

    authlist: any[] = [];
    setAuth() {
        if (this.role_codes.includes(ROLES.SUPER)) {
        } else if (this.role_codes.includes(ROLES.OPER)) {
            this.authlist = [ROLES.SUPER];
        } else if (this.role_codes.includes(ROLES.DEPART)) {
            this.authlist = [ROLES.SUPER, ROLES.ADMIN];
        }
        this._refreshAuth((node) => {
            node.disabled = this.authlist.some(e => node.id === e) ? true : false;
        });
    }

    _refreshAuth(callback) {
        this.list.forEach(e => callback(e.node));
    }

    setUser(user) {
        this._user = user;
        if (!user || !user.uid) {
            this._refreshStatus((node, parent) => node.checked = false);
            return;
        }
        this.roles = user.roles;
        this._refreshStatus((node) => {
            node.checked = this.roles.some(e => node.id === e.id) ? true : false;
        });
    }

    _refreshStatus(callback) {
        this.list.forEach(e => callback(e.node));
    }

    toggleRole(role) {
        if (this._user && this._user.uid) {
            this.userService.setRole(this._user, role).subscribe((data) => {
            this._setUserRole(role);
                this.setUser(this._user);
                this.$user.next({ type: 'changeRole', data: this._user });
            });
        }
    }

    _setUserRole(role) {
        if (role.checked) {
            this.roles.push(role);
        } else {
            for (let x = 0; x < this.roles.length; x++) {
                if (this.roles[x].id === role.id) {
                    this.roles.splice(x, 1);
                }
            }
        }
    }

}
