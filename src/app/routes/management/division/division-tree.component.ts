import {Apollo, gql} from 'apollo-angular';
import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';


import { Subscription, Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { _HttpClient } from '@delon/theme';
import { DivisionService } from '@biz/division.service';

const gqlSections = gql`
  query getData{
    divisionTree
  }
`;

@Component({
    selector: 'rioe-division-tree',
    styles: [':host ::ng-deep div.ant-card-body { max-height: 70vh; overflow-y: auto; }'],
    templateUrl: './division-tree.component.html'
})
export class DivisionTreeComponent implements OnInit {

    @Output() onChangeDivision = new EventEmitter<any>();

    expandDefault = true;
    searchValue = '';
    subscribe: Subscription;

    selectedNode;
    selectedEntity = {};
    parentEntity = {};
    entity: any = {};

    nodes = [];

    $saveResult: Observable<any>;

    @Input()
    set r(saveResult: any) {
        this.$saveResult = saveResult;
    }

    @ViewChild(NzTreeComponent, {static: false}) tree: NzTreeComponent;

    constructor(
        public http: _HttpClient,
        public msgSrv: NzMessageService,
        private apollo: Apollo,
        private divisionService: DivisionService
    ) { }

    ngOnInit() {
        this.expandDefault = false;
        this.treeDivision();

        if (this.$saveResult) {
            this.$saveResult.subscribe((saveResult) => {
                if (!!saveResult && !!saveResult.success) {
                    this.treeDivision();
                }
            });
        }
    }

    onSelect(e: any) {
        const node = e.node;
        const pNode = node.getParentNode() || {};
        if (node.isSelected) {
            this.selectedNode = node;
            this.selectedEntity = node.origin;
            this.parentEntity = pNode.origin || {};

            this.entity = Object.assign({}, this.selectedEntity);
            this.entity['parent'] = this.parentEntity['code'];
            this.entity['parent_name'] = this.parentEntity['name'];
        } else {
            this.selectedNode = null;
            this.selectedEntity = {};
            this.parentEntity = {};
            this.entity = {};
        }
        this.onChangeDivision.emit(this.selectedEntity);
    }

    load() {
        this.treeDivision();

        this.selectedEntity = {};
        this.parentEntity = {};
        this.selectedNode = null;
    }

    add() {
        const pNode = this.selectedEntity || {};
        this.entity = !pNode ? {} : { parent: pNode['code'], parent_name: pNode['name'], deleted: false };
        this.entity['code'] = '';
        this.entity['name'] = '';
        this.onChangeDivision.emit(this.entity);
    }

    delete() {
        this.divisionService.delete(this.selectedEntity).subscribe((data) => {
            this.msgSrv.success('删除成功');
            this.load();
        }, e => console.error(`Error:${e}`));
    }

    reload() {
        this.treeDivision();
        this.msgSrv.success('刷新成功');
    }

    /**
     * 构建行政区划树
     */
    treeDivision() {
        this.selectedNode = null;
        this.selectedEntity = {};

        this.subscribe = this.apollo.watchQuery({
            query: gqlSections,
            variables: {},
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            const nodes = result.data['divisionTree'];
            this.nodes = nodes.map(node => new NzTreeNode(node));
            // console.log(this.nodes)
        }, e => console.log(`Error: ${e}`));
    }
}
