import {gql, Apollo} from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { DictionaryService, DictionaryCategoryService } from '@biz';

import { Subscription } from 'rxjs';


const gqlCategorys = gql`
  query categorys($rows: Int, $page: Int, $keyword: String){
    dictionary_categorys(rows: $rows, page: $page, keyword: $keyword) {
        totalCount,
        edges{
            node{
                id, category, cat_name, remark
            }
        }
    }
  }
`;

@Component({
    selector: 'app-dictionary-category',
    templateUrl: './dictionary.category.component.html',

})
export class DictionaryCategoryComponent implements OnInit {

    i: any = {};
    editIndex = -1;
    editCache; // 编辑标识符
    editLine;  // 编辑标识行

    list: any[] = [];
    s: any = {
        page: 1,
        rows: 10,
    };
    total = 0;
    subscribe: Subscription;

    constructor(
        private modalService: NzModalService,
        public http: _HttpClient,
        private apollo: Apollo,
        private subject: NzModalRef,
        private dictionaryService: DictionaryService,
        private dictionaryCategoryService: DictionaryCategoryService,
        private messageService: NzMessageService
    ) { }

    ngOnInit() {
        this.editCache = false;
        this.loadCategory();
        //    this.updateEditCache();
    }

    // 加载数据字典分类
    loadCategory(reload: boolean = false) {
        if (reload) {
            this.s.page = 1;
        }

        this.subscribe = this.apollo.watchQuery({
            query: gqlCategorys,
            variables: this.s,
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.list = result.data['dictionary_categorys']['edges'];
            this.total = result.data['dictionary_categorys']['totalCount'];
        }, e => console.log(`Error: ${e}`));

    }

    // 搜索数据字典分类
    searchCategory(reload: boolean = false) {

        if (reload) {
            this.s.page = 1;
        }

        this.loadCategory();
    }

    clear() {
        this.s.keyword = null;
        this.loadCategory(true);
    }

    pageChange() {
        this.searchCategory();
    }

    sort(sort: { key: string, value: string }) {
        this.s.sort = sort.key;
        this.s.order = sort.value === 'ascend' ? 'asc' : 'desc';
        this.loadCategory(true);
    }

    // 编辑分类
    editCategory(i, modalContent) {
        this.i = i;

        this.subject = this.modalService.create({
            nzContent: modalContent,
            nzWrapClassName: 'modal-lg',
            nzMaskClosable: false,
            nzFooter: null
        });
    }

    // 删除数据字典分类
    deleteCategory(i, index) {
        this.dictionaryCategoryService.delete(i['id'])
            .subscribe(resp => {
                this.list.splice(index, 1);
                this.total = --this.total;
            });
    }

    save() {

        delete this.i['_id'];

        if (!this.i['id']) {
            // 添加操作
            this.dictionaryCategoryService.save(this.i)
                .subscribe((resp) => {
                    if (resp['code'] === 0) {
                        this.messageService.success('添加成功');
                        this.loadCategory();

                        this.i = {};
                        this.subject.destroy();
                    } else {
                        this.messageService.error(resp['data']);
                        return;
                    }
                });
        }
    }

    close() {
        this.i = {};
        this.subject.destroy();
    }

    // 修改编辑标识符的状态，设置编辑行
    Edit(key: any, inx, state: any): void {
        this.editCache = key;
        this.editLine = inx;
        if (state !== '' || state != null) {
            this.loadCategory();

        }
    }

    // 保存编辑
    savaEdit(i) {

        // 修改数据字典分类
        this.dictionaryCategoryService.update(i)
            .subscribe(resp => {
                if (resp['data']) {
                    // this.list.splice(this.editIndex, 1, resp['data']);

                    this.messageService.success('编辑成功!');
                    this.editCache = false;

                }
            });

    }
}
