import {gql, Apollo} from 'apollo-angular';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient, ModalHelper } from '@delon/theme';

import { RoleEditComponent } from './role.edit.component';
import { RoleService } from '@biz/role.service';

import { Subscription } from 'rxjs';


const gqlRoles = gql`
  query roles($rows: Int, $page: Int, $code: String, $name: String){
    roles(rows: $rows, page: $page, code: $code, name: $name) {
        totalCount,
        edges{
            node{
                id, code, name, remark, type
            }
        }
    }
  }
`;

@Component({
    selector: 'avalon-role-list',
    templateUrl: './role.list.component.html'
})
export class RoleListComponent implements OnInit {

    list: any[] = [];
    s: any = {};
    total = 0;
    role;
    subscribe: Subscription;
    loading = false;

    @Output()
    onRoleChanged = new EventEmitter<any>();

    @Output()
    onOpenPanel = new EventEmitter<any>();

    constructor(
        public http: _HttpClient,
        public msgSrv: NzMessageService,
        private apollo: Apollo,
        private modalHelper: ModalHelper,
        private roleService: RoleService
    ) { }

    ngOnInit() {
        this.load();
    }

    load(reload: boolean = false) {

        this.subscribe = this.apollo.watchQuery({
            query: gqlRoles,
            variables: this.s,
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.list = result.data['roles']['edges'];
            this.total = result.data['roles']['totalCount'];
            this.loading = result.loading;
        }, e => console.log(`Error: ${e}`));
    }

    edit(i) {
        this.modalHelper.static(RoleEditComponent, { i }, 'sm').subscribe(() => {
            this.load();
        });
    }

    delete(i) {
        this.roleService.delete(i).subscribe((data) => {
            this.msgSrv.success('删除成功');
            this.load();
        });
    }

    openPermissionPanel(i) {
        this.selectRole(i);
        this.openSettingPanel(0);
    }

    openOrgPanel(i) {
        this.selectRole(i);
        this.openSettingPanel(1);
    }

    openUserPanel(i) {
        this.selectRole(i);
        this.openSettingPanel(1);
    }

    selectRole(role) {
        this.role = role;
        this.onRoleChanged.emit(role);
    }

    openSettingPanel(panel) {
        this.onOpenPanel.emit({ role: this.role, panel });
    }

    pickRow(i) {
        this.selectRole(i);
        const obj = document.getElementsByName('selected');
        for (let x = 0, l = obj.length; x < l; x++) {
            const objTemp = obj[x];
            objTemp.style.backgroundColor = 'rgb(255,255,255)';
        }
        document.getElementById('selected' + i.code).style.backgroundColor = 'rgb(186,231,255)';
    }

    clear(s) {
        if (s === 'name') {
            this.s.name = null;
        } else {
            this.s.code = null;
        }
        this.load();
    }
}
