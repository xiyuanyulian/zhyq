import {gql, Apollo} from 'apollo-angular';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuService } from '@biz/menu.service';
import { UserService } from '@biz/user.service';
import { _HttpClient } from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import '@shared/rxjs-extensions';
import { NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';



const gqlData = gql`
  query getData{
    menuTree
  }
`;

@Component({
    selector: 'avalon-user-permission',
    templateUrl: './user-permission.component.html'
})
export class UserPermissionComponent implements OnInit, OnDestroy {

    private _user: any;
    $user: BehaviorSubject<any>;

    roles = [];
    menus = [];
    _menus = [];
    subscribe: Subscription;

    @ViewChild(NzTreeComponent, {static: false})
    tree: NzTreeComponent;

    constructor(
        public http: _HttpClient,
        private apollo: Apollo,
        public msgSrv: NzMessageService,
        private translate: TranslateService,
        private userService: UserService,
        private menuService: MenuService
    ) { }

    ngOnInit() {
        this.load();
    }

    ngOnDestroy() {
        // this.u.complete();
    }

    @Input()
    set user(user: any) {
        this.$user = user;
        this.$user.subscribe(u => !!u && this.setUser(u.data), e => console.log(`Error: ${e}`));
    }

    load(reload: boolean = false) {
        this.subscribe = this.apollo.watchQuery({
            query: gqlData,
            variables: {},
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            const nodes = result.data['menuTree'];
            this.visit(nodes, (item, parentItem) => {
                item.disabled = true;
            });
            this._menus = nodes;
            this.menus = this.resetRoles(this.roles);
            this.menus = this.menus.map(node => new NzTreeNode(node));
        }, e => console.log(`Error: ${e}`));
    }

    onTreeInitialized(e: any) {
        // 不允许对权限做变更
    }

    setUser(user) {
        if (!user) {
            return;
        }

        this._user = user;

        const roles = user.roles;
        this.roles = roles;
        this.menus = this.resetRoles(roles);
        this.menus = this.menus.map(node => new NzTreeNode(node));

    }

    resetRoles(roles) {
        const codes = roles.sort((a, b) => a.code <= b.code).map(e => e.code);
        const menus = this._menus;
        this.visit(menus, (item, parentItem) => {
            item.checked = this.checkRole(codes, item.acl);
        });
        return menus;
    }

    private visit(menu: any[], callback: (item: any, parentMenum: any) => void) {
        const inFn = (list: any[], parentMenum: any) => {
            for (const item of list) {
                if (callback) {
                    callback(item, parentMenum);
                }
                if (item.children && item.children.length > 0) {
                    inFn(item.children, item);
                }
            }
        };

        inFn(menu, null);
    }

    private checkRole(roles: string[], acl: string | string[]): boolean {
        if (!acl || !roles) {
            return false;
        }
        const r = this.parseACL(acl);
        return roles.some(e => r.includes(e));
    }

    private parseACL(val: string | string[]) {
        return Array.isArray(val) ? <string[]>val : [val];
    }

    expandTree(node = null) {
        if (node) {
            node.expand();
        } else {
        }
    }

    collapseTree(node = null) {
        if (node) {
            node.collapse();
        } else {
        }
    }

    reloadTree() {
        this.load(true);
        this.refreshTree();
    }

    refreshTree() {
        this.setUser(this._user);
    }

}
