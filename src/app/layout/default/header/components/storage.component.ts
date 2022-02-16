import { Component, HostListener } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'header-storage',
    template: `
    <i nz-icon nzType="tool"></i>
    {{ 'clear-local-storage' | translate}}`,
    host: {
        '[class.d-block]': 'true'
    }
})
export class HeaderStorageComponent {

    constructor(
        private confirmServ: NzModalService,
        private messageServ: NzMessageService
    ) {
    }

    @HostListener('click')
    _click() {
        this.confirmServ.confirm({
            nzTitle: 'Make sure clear all local storage?',
            nzOnOk: () => {
                localStorage.clear();
                this.messageServ.success('Clear Finished!');
            }
        });
    }
}
