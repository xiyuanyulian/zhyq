import { Component } from '@angular/core';

@Component({
    selector: 'header-task',
    template: `
    <div class="item" nz-dropdown nzTrigger="click" nzPlacement="bottomRight" (nzVisibleChange)="change()" [nzDropdownMenu]="menu">
        <nz-badge [nzDot]="true">
            <i nz-icon nzType="question-circle-o"></i>
        </nz-badge>
    </div>
    <nz-dropdown-menu #menu="nzDropdownMenu">
        <ul nz-menu class="wd-lg">
            <nz-card nzTitle="问题反馈" [nzLoading]="loading" class="ant-card__body-nopadding">
                <ng-template #extra><i nz-icon nzType="plus"></i></ng-template>
                <li nz-menu-item nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm bg-grey-lighter-h point">
                    <div nz-col [nzSpan]="4" class="text-center">
                        <nz-avatar [nzSrc]="'./assets/img/1.png'"></nz-avatar>
                    </div>
                    <div nz-col [nzSpan]="20">
                        <strong>cipchk</strong>
                        <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
                    </div>
                </li>
                <li nz-menu-item nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm bg-grey-lighter-h point">
                    <div nz-col [nzSpan]="4" class="text-center">
                        <nz-avatar [nzSrc]="'./assets/img/2.png'"></nz-avatar>
                    </div>
                    <div nz-col [nzSpan]="20">
                        <strong>はなさき</strong>
                        <p class="mb0">ハルカソラトキヘダツヒカリ </p>
                    </div>
                </li>
                <li nz-menu-item nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm bg-grey-lighter-h point">
                    <div nz-col [nzSpan]="4" class="text-center">
                        <nz-avatar [nzSrc]="'./assets/img/3.png'"></nz-avatar>
                    </div>
                    <div nz-col [nzSpan]="20">
                        <strong>苏先生</strong>
                        <p class="mb0">请告诉我，我应该说点什么好？</p>
                    </div>
                </li>
                <li nz-menu-item nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm bg-grey-lighter-h point">
                    <div nz-col [nzSpan]="4" class="text-center">
                        <nz-avatar [nzSrc]="'./assets/img/4.png'"></nz-avatar>
                    </div>
                    <div nz-col [nzSpan]="20">
                        <strong>Kent</strong>
                        <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
                    </div>
                </li>
                <li nz-menu-item nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm bg-grey-lighter-h point">
                    <div nz-col [nzSpan]="4" class="text-center">
                        <nz-avatar [nzSrc]="'./assets/img/5.png'"></nz-avatar>
                    </div>
                    <div nz-col [nzSpan]="20">
                        <strong>Jefferson</strong>
                        <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
                    </div>
                </li>
                <li nz-menu-item nz-row class="pt-lg pb-lg">
                    <div nz-col [nzSpan]="24" class="border-top-1 text-center text-grey point">
                        See All
                    </div>
                </li>
            </nz-card>
        </ul>
    </nz-dropdown-menu>
    `
})
export class HeaderTaskComponent {

    loading = true;

    change() {
        setTimeout(() => this.loading = false, 500);
    }

}
