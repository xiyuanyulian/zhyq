import {gql, Apollo} from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';

import { UserService } from '@biz/user.service';

import { Subscription } from 'rxjs';


const gqlUsers = gql`
  query users($rows: Int, $page: Int, $keyword: String){
    users(rows: $rows, page: $page, keyword: $keyword) {
        totalCount,
        edges{
            node{
                uid, org_name, fullname, username, mobile, email, enabled
            }
        }
    }
  }
`;

@Component({
    selector: 'avalon-user-selection',
    templateUrl: './user.selection.component.html'
})
export class UserSelectionComponent implements OnInit {
    title: any;
    i: any;
    list: any[] = [];
    s: any = {
        page: 1,
        rows: 10,
        enabled: ''
    };
    total = 0;
    selection = [];
    subscribe: Subscription;

    constructor(
        private subject: NzModalRef,
        public msgSrv: NzMessageService,
        public http: _HttpClient,
        private apollo: Apollo,
        private userService: UserService) { }

    ngOnInit() {
        this.load();
    }

    load(reload: boolean = false) {
        if (reload) {
            this.s.page = 1;
        }

        this.subscribe = this.apollo.watchQuery({
            query: gqlUsers,
            variables: this.s,
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.list = result.data['users']['edges'];
            this.total = result.data['users']['totalCount'];
        }, e => console.log(`Error: ${e}`));
    }

    save(event?) {
        this.subject.destroy(this.selection);
    }

    close() {
        this.subject.destroy();
    }

    toggleCheck(user) {
        if (!!user) {
            this.selection.push(user);
        } else {
            this.selection = this.selection.filter(u => u.uid !== user.uid);
        }
    }

    clear() {
        this.s.keyword = null;
        this.load();
    }
}
