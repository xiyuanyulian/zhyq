---
order: 6
title: 自定义列
---

利用在 `ng-template` 定义 `st-row="custom"` 指定的名称，与列描述中的 `render: 'custom'` 关联；允许接收 `item`、`index`、`column` 三个值。

其中若指定 `type="title"` 表示是对标题自定义列。附加可实现：表头分组。

```ts
import { Component } from '@angular/core';
import { SimpleTableColumn, SimpleTableChange, SimpleTableFilter } from '@delon/abc';

@Component({
    selector: 'app-demo',
    template: `
    <simple-table #st [data]="users" [ps]="3" [columns]="columns">
        <ng-template st-row="custom" type="title" let-c>
            {{ c.title }}
            <i nz-icon nzType="smile-o" class="ant-table-filter-icon" nz-dropdown [nzDropdownMenu]="menu" nzTrigger="click" [nzClickHide]="false"></i>
            <nz-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                    <li nz-menu-item class="ant-table-filter-dropdown p-sm">
                    <input type="text" nz-input placeholder="Search name" [(ngModel)]="searchValue" class="width-sm mr-sm">
                    <button nz-button [nzType]="'primary'" (click)="st.load(2)">Search</button>
                    </li>
                </ul>
            </nz-dropdown-menu>
        </ng-template>
        <ng-template st-row="custom" let-item let-index="index">
            <span nz-tooltip [nzTooltipTitle]="'年龄：' + item.age">tooltip: {{item.age}}-{{index}}</span>
        </ng-template>
    </simple-table>
    `
})
export class DemoComponent {

    searchValue: string;

    users: any[] = Array(10).fill({}).map((item: any, idx: number) => {
        return {
            id: idx + 1,
            name: `name ${idx + 1}`,
            age: Math.ceil(Math.random() * 10) + 20
        };
    });
    columns: SimpleTableColumn[] = [
        { title: '编号', index: 'id' },
        { title: '姓名', index: 'name' },
        { title: '年龄', index: 'age' },
        {
            title: '自定义',
            render: 'custom'
        }
    ];
}
```
