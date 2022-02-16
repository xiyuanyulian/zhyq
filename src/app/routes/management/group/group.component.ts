import { Component, OnInit } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';

import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'avalon-group',
    templateUrl: './group.component.html',
    styles: [':host ::ng-deep .ant-tabs-bar {border: none}']
})
export class GroupComponent implements OnInit {

    g = new BehaviorSubject(null);
    group: any;
    isShow = true;
    user: any;

    constructor(
        private setting: SettingsService
    ) {}

    ngOnInit() {
        this.user = this.setting.user;
    }

    onChangeGroup(group) {
        this.group = group;
        if (!!group.code && (group.code.length <= 6 || group.code.length < this.user.org_code.length)) {
            this.isShow = false;
        } else {
            this.isShow = true;
        }
        this.g.next(Object.assign({}, group));
    }

}
