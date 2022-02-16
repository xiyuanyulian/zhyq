import {gql, Apollo} from 'apollo-angular';
import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';

import { GroupService } from '@biz/group.service';

import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';


const gqlSections = gql`
  query getData{
    groupTree
  }
`;

@Component({
    selector: 'avalon-org-tree',
    styles: [':host ::ng-deep div.ant-card-body { max-height: 70vh; overflow-y: auto; }'],
    templateUrl: './org-tree.component.html'
})
export class OrgTreeComponent implements OnInit {

    @Output() onChangeOrg = new EventEmitter<any>();

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
        if (role_codes.indexOf('SUPER') !== -1) {
            this.canDelete = true;
        }
        this.defaultSelectedKeys.push(this.user.org_id);
        this.expandDefault = false;
        this.treeGroup();
        this.onChangeOrg.emit(this.user.orgs[0]);
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
        this.onChangeOrg.emit(this.selectedGroup);
    }

    load() {
        this.treeGroup();

        this.selectedGroup = {};
        this.parentGroup = {};
        this.selectedNode = null;
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
