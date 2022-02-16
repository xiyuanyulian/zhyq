import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalHelper } from '@delon/theme';

import { BehaviorSubject } from 'rxjs';
import '@shared/rxjs-extensions';

@Component({
    selector: 'avalon-role',
    templateUrl: './role.component.html'
})
export class RoleComponent implements OnInit {

    r = new BehaviorSubject(null);
    role = {};

    tabIdx = 0;
    mainPanelSize = 24;
    settingPanelSize = 0;
    showSettingPanel = false;

    constructor(
        public msgSrv: NzMessageService,
        private modalHelper: ModalHelper
    ) { }

    ngOnInit() {
    }

    changeRole(role) {
        this.role = role;
        this.r.next(Object.assign({}, role));
    }

    openSettingPanel(entity: { role, panel?: number }) {
        const _entity = entity || { role: null, panel: -1 };

        this.role = _entity.role || this.role || {};
        this.tabIdx = (typeof _entity.panel === 'number') ? _entity.panel : this.tabIdx;
        this.showSettingPanel = (this.tabIdx >= 0);

        this.settingPanelSize = this.showSettingPanel ? 8 : 0;
        this.mainPanelSize = 24 - this.settingPanelSize;
    }
}
