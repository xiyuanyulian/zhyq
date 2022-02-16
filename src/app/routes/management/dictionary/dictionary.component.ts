import {gql, Apollo} from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { DictionaryCategoryComponent } from './dictionary.category.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DictionaryService, DictionaryCategoryService } from '@biz';

import { Subscription } from 'rxjs';


const gqlDcitionarys = gql`
  query dictionarys($rows: Int, $page: Int, $search_param: String, $category: String){
    dictionarys(rows: $rows, page: $page, keyword: $search_param, category: $category) {
        totalCount,
        edges{
            node{
                id, cat_name, category, name, code, remark
            }
        }
    }
  }
`;

const gqlCategorys = gql`
  query categorys{
    categorys {
        id, category, cat_name
    }
  }
`;

@Component({
    selector: 'avalon-dictionary',
    templateUrl: './dictionary.component.html',
})
export class DictionaryComponent implements OnInit {

    list: any[] = [];
    s: any = {
        page: 1,
        rows: 10,
    };
    total = 0;

    item: any = {};
    editIndex = -1;
    subscribe: Subscription;
    subscribe1: Subscription;

    searchOptions = [];

    subject;

    constructor(
        private modalService: NzModalService,
        private messageService: NzMessageService,
        public http: _HttpClient,
        private apollo: Apollo,
        private modalHelper: ModalHelper,
        private dictionaryService: DictionaryService,
        private dictionaryCategoryService: DictionaryCategoryService,
    ) { }

    ngOnInit() {
        this.load();
    }

    sort(sort: { key: string, value: string }): void {
        this.s.sort = sort.key;
        this.s.order = sort.value === 'ascend' ? 'asc' : 'desc';
        this.loadData(true);
    }


    load(reload: boolean = false) {
        if (reload) {
            this.s.page = 1;
        }

        this.subscribe = this.apollo.watchQuery({
            query: gqlDcitionarys,
            variables: this.s,
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.list = result.data['dictionarys']['edges'];
            this.total = result.data['dictionarys']['totalCount'];
        }, e => console.log(`Error: ${e}`));
    }

    loadCategory() {
        this.subscribe1 = this.apollo.watchQuery({
            query: gqlCategorys,
            variables: {},
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.searchOptions = result.data['categorys'];
        }, e => console.log(`Error: ${e}`));
    }

    loadData(reload: boolean = false) {
        if (this.s.search_param) {
            this.search();
        } else {
            this.load(reload);
        }
    }


    // 搜索数据字典
    search(reload: boolean = false) {

        if (reload) {
            this.s.page = 1;
        }
        this.load();
    }


    // 编辑数据字典
    editDictionary(i, modalContent) {
        this.loadCategory();

        this.item = i;
        this.subject = this.modalService.create({
            nzContent: modalContent,
            nzWrapClassName: 'modal-lg',
            nzMaskClosable: false,
            nzFooter: null
        });
    }

    // 删除数据字典
    delete(i, index) {
        this.dictionaryService.delete(i.id)
            .subscribe((res: any) => {
                this.list.splice(index, 1);
                this.total = --this.total;
            });
    }

    // 弹出分类管理模态框
    showDictionaryCategory() {
        // create() Modal,按空格键，继续弹出??
        this.modalHelper.static(DictionaryCategoryComponent, {}, 'lg', { nzTitle: '数据字典分类管理' }).subscribe(() => {
        });
    }

    saveDictionary() {
        this.setCategory();

        delete this.item['_id'];

        if (!this.item['id']) {
            this.dictionaryService.save(this.item)
                .subscribe(data => {
                    // 插入到第一行
                    if (data['code'] === 0) {
                        this.messageService.success('添加成功');
                        this.loadData();

                        // 清空继续添加
                        this.item['name'] = '';
                        this.item['code'] = '';
                    } else {
                        this.messageService.error(data['msg']);
                    }
                });
        } else {
            this.dictionaryService.update(this.item).subscribe();
            this.close();
        }

    }

    // 设置分类名称
    setCategory() {
        for (const item of this.searchOptions) {
            if (item.category === this.item['category']) {
                this.item['cat_name'] = item['cat_name'];
                return;
            }
        }
    }

    close() {
        // this.item = {};
        this.subject.destroy();
    }

    clear() {
        this.s.search_param = null;
        this.load();
    }
}
