import {gql, Apollo} from 'apollo-angular';
import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';

import { GroupEditComponent } from './group.edit.component';
import { GroupService } from '@biz/group.service';

import { Subscription } from 'rxjs';

const gqlSections = gql`
  query getData{
    groupTree
  }
`;

@Component({
    selector: 'avalon-group-tree',
    styles: [':host ::ng-deep div.ant-card-body { max-height: 70vh; overflow-y: auto; }'],
    templateUrl: './group-tree.component.html'
})
export class GroupTreeComponent implements OnInit {

    @Output() onChangeGroup = new EventEmitter<any>();

    selectedNode;
    expandDefault = true;
    searchValue = '';
    subscribe: Subscription;

    parentGroup = {};
    selectedGroup = {};

    list: any[] = [];
    nodes = [];

    @ViewChild(NzTreeComponent, {static: false}) tree: NzTreeComponent;

    constructor(
        public http: _HttpClient,
        private apollo: Apollo,
        public msgSrv: NzMessageService,
        private modalHelper: ModalHelper,
        public setting: SettingsService,
        private groupService: GroupService
    ) { }

    hasAuth = true;
    canDelete = false;
    defaultSelectedKeys = [];
    defaultExpandedKeys = [];
    user: any;
    ngOnInit() {
        this.user = this.setting.user;
        const roles = this.user.roles;
        const role_codes = roles.map(e => e.code);
        if (role_codes.indexOf('SUPER') !== -1 || role_codes.indexOf('OPER') !== -1) {
            this.canDelete = true;
        }
        this.defaultSelectedKeys.push(this.user.org_id);
        this.expandDefault = false;
        this.treeGroup();
        this.onChangeGroup.emit(this.user.orgs[0]);
    }

    onSelect(e: any) {
        this.defaultSelectedKeys = [];
        if (e.selectedKeys && e.selectedKeys.length > 0) {
            const node = e.selectedKeys[0];
            this.selectedGroup = node.origin;
            this.parentGroup = node.parentNode && node.parentNode.origin || {};
            this.selectedNode = node;
        } else {
            this.selectedGroup = {};
            this.parentGroup = {};
            this.selectedNode = null;
        }
        if (this.selectedNode && this.user.org_code.length <= this.selectedNode.origin.code.length) {
            this.hasAuth = true;
        } else {
            this.hasAuth = false;
        }
        this.onChangeGroup.emit(this.selectedGroup);
    }

    load() {
        this.treeGroup();

        this.selectedGroup = {};
        this.parentGroup = {};
        this.selectedNode = null;
    }

    add() {
        let i = {};
        if (this.selectedGroup === '{}') {
            i = {
                parent: this.user.org_id,
                parent_node_name: this.user.org_name
            };
        } else {
            if (this.canDelete) {
                i = {
                    parent: this.selectedGroup['id'],
                    parent_node_name: this.selectedGroup['name'],
                    parent_code: this.selectedGroup['code']
                };
            } else {
                i = {
                    parent: this.user.org_id,
                    parent_node_name: this.user.org_name,
                    parent_code: this.user.org_code
                };
            }
        }
        this.modalHelper.static(GroupEditComponent, { i: i, type: 'ADD' }, 'lg')
            .subscribe((result) => {
                if (result) {
                    this.msgSrv.success('创建成功');
                    this.load();
                }
            });
    }

    edit() {
        if (!this.selectedNode && this.defaultSelectedKeys.length < 1) {
            this.msgSrv.error('请先选择要修改的用户组！');
            return;
        }

        this.modalHelper.static(GroupEditComponent, { i: this.selectedGroup, type: 'EDIT' }, 'lg')
            .subscribe((result) => {
                if (result) {
                    this.msgSrv.success('修改成功');
                    // this.selectedNode.origin = result;
                    // this.selectedNode.key = result.id;
                    // this.selectedNode.title = result.name;
                    // this.selectedGroup = result;
                    this.load();
                    // this.onChangeGroup.emit(this.selectedGroup);
                }
            });
    }

    delete() {
        this.groupService.delete(this.selectedGroup).subscribe((data) => {
            if (data.msg === 'success') {
                this.msgSrv.success('删除成功');
                this.load();
            } else {
                this.msgSrv.error('机构下有用户无法删除');
            }
        });
    }

    reload() {
        this.treeGroup();
        this.msgSrv.success('刷新成功');
    }

    /**
     * 构建组织机构树
     */
    _nodes;
    treeGroup() {
        this.subscribe = this.apollo.watchQuery({
            query: gqlSections,
            variables: {},
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            const nodes = result.data['groupTree'];
            this.nodes = nodes.map(node => new NzTreeNode(node));
        }, e => console.log(`Error: ${e}`));
    }

}
