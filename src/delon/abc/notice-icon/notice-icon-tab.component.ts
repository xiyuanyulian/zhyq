import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NoticeItem } from './interface';

@Component({
  selector: 'notice-icon-tab',
  template: `
  <div *ngIf="data.list?.length === 0; else listTpl" class="not-found">
    <img *ngIf="data.emptyImage" src="{{data.emptyImage}}" alt="not found" />
    <p>{{data.emptyText || '无通知'}}</p>
  </div>
  <ng-template #listTpl>
    <nz-list [nzDataSource]="data.list" [nzRenderItem]="item">
      <ng-template #item let-item>
        <nz-list-item (click)="onClick(item)" [ngClass]="{'read': item.read}">
          <nz-list-item-meta
            [nzTitle]="nzTitle"
            [nzDescription]="nzDescription"
            [nzAvatar]="nzAvatar">
            <ng-template #nzAvatar>
                <img style="height: 24px;width: 24px; margin-top: 12px;" src="{{item.avatar}}">
            </ng-template>
            <ng-template #nzTitle>
              {{item.title}}
              <div class="extra" *ngIf="item.extra"><nz-tag [nzColor]="item.color">{{item.extra}}</nz-tag></div>
            </ng-template>
            <ng-template #nzDescription>
              <div *ngIf="item.description" class="description">{{item.description}}</div>
              <div *ngIf="item.datetime" class="datetime">{{item.datetime}}</div>
            </ng-template>
          </nz-list-item-meta>
        </nz-list-item>
      </ng-template>
    </nz-list>
    <div class="clear" (click)="onClear()">{{ data.clearText || '清空' }}</div>
  </ng-template>
  `,
  preserveWhitespaces: false,
})
export class NoticeIconTabComponent {
  @Input() data: NoticeItem;
  @Output() select = new EventEmitter<any>();
  @Output() clear = new EventEmitter<string>();

  onClick(item: NoticeItem) {
    this.select.emit({
      title: this.data.title,
      item,
    });
  }

  onClear() {
    this.clear.emit(this.data.title);
  }
}
