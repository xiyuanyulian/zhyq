import {gql, Apollo} from 'apollo-angular';
import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient, ModalHelper } from '@delon/theme';

import { Observable, Subscription } from 'rxjs';

import { UserSelectionComponent } from '../user/user.selection.component';

import { RoleService } from '@biz/role.service';
import { UserService } from '@biz/user.service';



const gqlUsers = gql`
  query users($rows: Int, $page: Int, $role_id: String){
    users(rows: $rows, page: $page, role_id: $role_id) {
        totalCount,
        edges{
            node{
                fullname, org_name, enabled
            }
        }
    }
  }
`;

@Component({
    selector: 'avalon-role-user',
    templateUrl: './role-user.component.html'
})
export class RoleUserComponent implements OnInit {

    r: Observable<any>;
    _role: any;
    list = [];
    s: any = {
        page: 1,
        rows: 10
    };
    total = 0;
    loading = false;
    subscribe: Subscription;

    constructor(
        public http: _HttpClient,
        public msgSrv: NzMessageService,
        private modalHelper: ModalHelper,
        private apollo: Apollo,
        private roleService: RoleService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.r.subscribe(role => {
            this.s.page = 1;
            this._role = role;
            this.load();
        }, e => console.log(`Error: ${e}`));
    }

    @Input()
    set role(role: any) {
        this.r = role;
    }

    load(reload?) {
        if (reload) {
            this.s.page = 1;
        }
        this.s.role_id = this._role.id;

        this.subscribe = this.apollo.watchQuery({
            query: gqlUsers,
            variables: this.s,
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.list = result.data['users']['edges'];
            this.total = result.data['users']['totalCount'];
            this.loading = result.loading;
        }, e => console.log(`Error: ${e}`));

    }

    reload() {
        this.load(true);
    }

    changRole(role) {
        this.load(true);
    }

    pickUser() {
        this.modalHelper.static(UserSelectionComponent).subscribe((selection) => {
            this.roleService.setUser(this._role, selection).subscribe((res) => {
                console.log('设置用户的角色成功');
                this.load(true); // 刷新用户列表
            });

        });
    }

    remove(user) {
        user.checked = false;
        this.roleService.setUser(this._role, [user]).subscribe((res) => {
            console.log('移除用户的角色成功');
            this.load(true); // 刷新用户列表
        });
    }

}
