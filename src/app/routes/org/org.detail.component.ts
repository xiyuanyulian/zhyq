import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'avalon-org-detail',
    templateUrl: './org.detail.component.html'
})
export class OrgComponent implements OnInit {

    g = new BehaviorSubject(null);
    group: any;
    show = false;

    ngOnInit() {
    }

    onChangeOrg(group) {
        this.group = group;
        if (group && group.code.length > 6) {
            this.show = true;
        } else {
            this.show = false;
        }
        this.g.next(Object.assign({}, group));
    }

}
