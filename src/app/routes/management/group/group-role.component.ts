import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';

import { Observable } from 'rxjs';

import { GroupService } from '@biz/group.service';
import { RoleService } from '@biz/role.service';

@Component({
    selector: 'avalon-group-role',
    templateUrl: './group-role.component.html'
})
export class GroupRoleComponent implements OnInit {

    g: Observable<any>;
    private _group: any;
    list: any[] = [];
    s = {};
    total = 0;

    _allChecked = false;
    _indeterminate = false;
    _displayData = [];
    groupRoles = [];

    constructor(
        public http: _HttpClient,
        public msgSrv: NzMessageService,
        private groupService: GroupService,
        private roleService: RoleService
    ) { }

    ngOnInit() {
        this.load();

        this.g.subscribe(group => {
            this._group = group;
            this.setGroup(group);
            this._refreshStatus();
        });
    }

    @Input()
    set group(group: any) {
        this.g = group;
    }

    load(reload: boolean = false) {
        this.roleService.getAll().subscribe((res: any) => {
            this.list = res;
            this.total = !!res ? res.length : 0;
        }, e => console.log(`Error: ${e}`));
    }

    setGroup(group) {
        if (group && group.id) {
            this.groupService.getRoles(group).subscribe((res) => {
                const roles = res.data;
                this.groupRoles = roles;

                this.list.forEach(r => {
                    r.checked = roles.some(e => r.id === e.id) ? true : false;
                });
                this._refreshStatus();
            }, e => console.log(`Error: ${e}`));
        } else {
            this.list.forEach(r => r.checked = false);
        }
    }

    _displayDataChange(event) {
        this._displayData = event;
        this._refreshStatus();
    }

    _refreshStatus() {
        const allChecked = this._displayData.every(value => value.checked === true);
        const allUnChecked = this._displayData.every(value => !value.checked);
        this._allChecked = allChecked;
        this._indeterminate = (!allChecked) && (!allUnChecked);
    }

    _checkAll(value) {
        this._displayData.forEach(data => data.checked = !!value);
        this._refreshStatus();
    }

    toggleRole(role) {
        if (this._group && this._group.id) {
            this.groupService.setRole(this._group, role).subscribe((data) => this._refreshStatus());
        } else {
            this._refreshStatus();
        }
    }

}
