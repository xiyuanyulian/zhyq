import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';

import { RoleService } from '@biz/role.service';

@Component({
    selector: 'avalon-role-edit',
    templateUrl: './role.edit.component.html'
})
export class RoleEditComponent implements OnInit {
    i: any;

    constructor(
        private modalHelper: ModalHelper,
        private subject: NzModalRef,
        public msgSrv: NzMessageService,
        public http: _HttpClient,
        private roleService: RoleService) { }

    ngOnInit() {
    }

    save() {
        this.roleService.save(this.i).subscribe((data) => {
            this.close();
        });
    }

    close() {
        this.subject.destroy(true);
    }
}
