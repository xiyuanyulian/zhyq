import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'avalon-user',
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

    $user = new BehaviorSubject(null);

    user = {};
    tabIdx = 0;

    mainPanelSize = 24;
    settingPanelSize = 0;
    showSettingPanel = false;

    constructor(
        public http: _HttpClient,
        public msgSrv: NzMessageService,
        private modalHelper: ModalHelper,
    ) { }

    ngOnInit() {
    }

    changeUser(user) {
        this.user = user;
        this.$user.next({ type: 'changeUser', data: user });
    }

    openSettingPanel(entity: { user, panel?: number }) {
        const _entity = entity || { user: null, panel: -1 };

        this.user = _entity.user || this.user || {};
        this.tabIdx = (typeof _entity.panel === 'number') ? _entity.panel : this.tabIdx;
        this.showSettingPanel = (this.tabIdx >= 0);

        this.settingPanelSize = this.showSettingPanel ? 8 : 0;
        this.mainPanelSize = 24 - this.settingPanelSize;
    }
}
