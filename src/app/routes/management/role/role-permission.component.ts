import {gql, Apollo} from 'apollo-angular';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuService } from '@biz/menu.service';
import { ACLType } from '@delon/acl';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import { NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
import { Observable, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';



const gqlData = gql`
  query getData{
    menuTree
  }
`;

@Component({
    selector: 'avalon-role-permission',
    templateUrl: './role-permission.component.html'
})
export class RolePermComponent implements OnInit {

    r: Observable<any>;
    _role: any;
    menus = [];
    _menus = [];
    s: any = {};
    options = {
        allowDrag: false
    };
    subscribe: Subscription;

    @ViewChild(NzTreeComponent, {static: false})
    tree: NzTreeComponent;

    constructor(
        public http: _HttpClient,
        public msgSrv: NzMessageService,
        private apollo: Apollo,
        private translate: TranslateService,
        private modalHelper: ModalHelper,
        private menuService: MenuService
    ) { }

    ngOnInit() {
        this.load();

        this.r.subscribe(role => {
            this._role = role;
            this.changeRole(role);
        }, e => console.log(`Error: ${e}`));
    }

    @Input()
    set role(role: any) {
        this.r = role;
    }

    onTreeInitialized(e: any) {
        // 取消树形选择框的级联选择
    }

    load(reload: boolean = false) {
        this.subscribe = this.apollo.watchQuery({
            query: gqlData,
            variables: {},
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            const nodes = result.data['menuTree'];
            const menus = nodes;
            this._menus = menus;
            setTimeout(() => {
                const role = this._role;
                this.changeRole(role);
            }, 200);
        }, e => console.log(`Error: ${e}`));
    }

    defaultCheckedKeys = [];
    changeRole(role) {
        this.defaultCheckedKeys = [];
        const menus = this._menus;
        this.menus = menus.map(node => new NzTreeNode(node));
        this.visit(menus, (item, parentItem) => {
            const checked = role ? this.checkRole(role.id, item.acl) : false;
            if (checked) {
                this.defaultCheckedKeys.push(item.key);
            }
        });
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


    private checkRole(role: string, acl: string | string[]): boolean {
        if (!acl || !role) {
            return false;
        }
        const t = this.parseACLType(acl);
        return t.role.includes(role);
    }

    private parseACLType(val: string | string[]): ACLType {
        if (Array.isArray(val)) {
            return <ACLType>{ role: <string[]>val };
        }

        return <ACLType>{
            role: [val]
        };
    }

    onCheck(e) {
        if (e.node.isChecked) {
            this.menuService.allow(e.node.key, this._role).subscribe(data => {
                this.visit(this._menus, (item, parentItem) => {
                    if (item.key === e.node.key) {
                        item.acl.push(this._role.id);
                    }
                });
            });
        } else {
            this.menuService.disallow(e.node.key, this._role).subscribe(data => {
                this.visit(this._menus, (item, parentItem) => {
                    if (item.key === e.node.key) {
                        const acl = item.acl;
                        const index = acl.indexOf(this._role.id);
                        if (index > -1) {
                            acl.splice(index, 1);
                        }
                    }
                });
            });
        }
    }

}
