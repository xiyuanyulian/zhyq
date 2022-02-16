import {gql, Apollo} from 'apollo-angular';
import { OnInit, Component } from '@angular/core';
import { LoginLogService } from '@biz/login-log.service';

import { Subscription } from 'rxjs';


const gqlIssues = gql`
  query getData($rows: Int, $page: Int, $login_user_name: String){
    login_logs(rows: $rows, page: $page, login_user_name: $login_user_name) {
        totalCount,
        edges{
            node{
                id
                login_user_id
                login_user_name
                login_user_org_id
                login_user_org_name
                login_at
                login_ip
            }
        }
    }
  }
`;

@Component({
    selector: 'rioe-login-log-list',
    templateUrl: './login-log.list.component.html'
})
export class LoginLogListComponent implements OnInit {

    list: any;
    s = {
        total: 0,
        rows: 10,
        page: 1,
        login_user_name: ''
    };
    subscribe: Subscription;

    ngOnInit(): void {
        this.load();
    }

    constructor(
        private apollo: Apollo,
        private loginLogService: LoginLogService
    ) { }

    load(reload?: boolean) {
        if (reload) {
            this.s.page = 1;
        }

        this.subscribe = this.apollo.watchQuery({
            query: gqlIssues,
            variables: this.s,
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.list = result.data['login_logs']['edges'];
            this.s.total = result.data['login_logs']['totalCount'];
        }, e => console.log(`Error: ${e}`));
    }

    clear() {
        this.s.login_user_name = null;
        this.load();
    }
}
