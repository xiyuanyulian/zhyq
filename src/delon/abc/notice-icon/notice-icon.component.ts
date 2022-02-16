import { Component, Input, Output, EventEmitter } from '@angular/core';
import { toNumber, toBoolean } from '@delon/util';

import { NoticeItem } from './interface';

@Component({
  selector: 'notice-icon',
  template: `

  `,
  host: { '[class.ad-notice-icon]': 'true' },
  preserveWhitespaces: false,
})
export class NoticeIconComponent {
  @Input() data: NoticeItem[] = [];

  /** 图标上的消息总数 */
  @Input()
  get count() {
    return this._count;
  }
  set count(value: any) {
    this._count = toNumber(value);
  }
  private _count: number;

  /** 弹出卡片加载状态 */
  @Input()
  get loading() {
    return this._loading;
  }
  set loading(value: any) {
    this._loading = toBoolean(value);
  }
  private _loading = false;

  @Output() select = new EventEmitter<any>();
  @Output() clear = new EventEmitter<string>();

  /** 手动控制Popover显示 */
  @Input()
  get popoverVisible() {
    return this._popoverVisible;
  }
  set popoverVisible(value: any) {
    this._popoverVisible = toBoolean(value);
  }
  private _popoverVisible = false;

  @Output() popoverVisibleChange = new EventEmitter<boolean>();

  onVisibleChange(result: boolean) {
    this.popoverVisibleChange.emit(result);
  }

  onSelect(i: any) {
    this.select.emit(i);
  }

  onClear(title: string) {
    this.clear.emit(title);
  }
}
