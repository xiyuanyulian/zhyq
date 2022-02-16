import { Component, Input, QueryList, ContentChildren } from '@angular/core';
import { AvatarListItemComponent } from './avatar-list-item.component';

@Component({
  selector: 'avatar-list',
  template: `
  <ul>
    <li *ngFor="let i of _items" class="item" [ngClass]="_size">
        <nz-avatar *ngIf="i.tips" nz-tooltip [nzTooltipTitle]="i.tips" [nzSrc]="i.src" [nzText]="i.text" [nzIcon]="i.icon" [nzSize]="_avatarSize"></nz-avatar>
        <nz-avatar *ngIf="!i.tips" [nzSrc]="i.src" [nzText]="i.text" [nzIcon]="i.icon" [nzSize]="_avatarSize"></nz-avatar>
    </li>
  </ul>
  `,
  host: { '[class.ad-avatar-list]': 'true' },
  preserveWhitespaces: false,
})
export class AvatarListComponent {
  _size = '';

  _avatarSize = '';

  @Input()
  set size(value: 'large' | 'small' | 'mini' | 'default') {
    this._size = value === 'default' ? '' : value;
    switch (value) {
      case 'large':
      case 'small':
      case 'default':
        this._avatarSize = value;
        break;
      default:
        this._avatarSize = 'small';
        break;
    }
  }

  @ContentChildren(AvatarListItemComponent)
  _items: QueryList<AvatarListItemComponent>;
}
