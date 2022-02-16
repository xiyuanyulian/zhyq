import { Component } from '@angular/core';

@Component({
    selector: 'header-icon',
    template: `
    <div class="item" nz-dropdown [nzDropdownMenu]="menu" nzTrigger="click" nzPlacement="bottomRight" (nzVisibleChange)="change()">
        <i nz-icon nzType="appstore-o"></i>
    </div>
    <nz-dropdown-menu #menu="nzDropdownMenu">
        <ul nz-menu class="wd-xl animated jello">
            <nz-spin [nzSpinning]="loading" [nzTip]="'正在读取数据...'">
                <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="app-icons">
                    <li nz-menu-item nz-col [nzSpan]="6">
                        <i nz-icon nzType="calendar" class="bg-error text-white"></i>
                        <small>Calendar</small>
                    </li>
                    <li nz-menu-item nz-col [nzSpan]="6">
                        <i nz-icon nzType="file" class="bg-teal text-white"></i>
                        <small>Files</small>
                    </li>
                    <li nz-menu-item nz-col [nzSpan]="6">
                        <i nz-icon nzType="cloud" class="bg-success text-white"></i>
                        <small>Cloud</small>
                    </li>
                    <li nz-menu-item nz-col [nzSpan]="6">
                        <i nz-icon nzType="star-o" class="bg-magenta text-white"></i>
                        <small>Star</small>
                    </li>
                    <li nz-menu-item nz-col [nzSpan]="6">
                        <i nz-icon nzType="team" class="bg-purple text-white"></i>
                        <small>Team</small>
                    </li>
                    <li nz-menu-item nz-col [nzSpan]="6">
                        <i nz-icon nzType="scan" class="bg-warning text-white"></i>
                        <small>QR</small>
                    </li>
                    <li nz-menu-item nz-col [nzSpan]="6">
                        <i nz-icon nzType="pay-circle-o" class="bg-cyan text-white"></i>
                        <small>Pay</small>
                    </li>
                    <li nz-menu-item nz-col [nzSpan]="6">
                        <i nz-icon nzType="printer" class="bg-grey text-white"></i>
                        <small>Print</small>
                    </li>
                </div>
            </nz-spin>
        </ul>
    </nz-dropdown-menu>
    `
})
export class HeaderIconComponent {

    loading = true;

    change() {
        setTimeout(() => this.loading = false, 500);
    }

}
