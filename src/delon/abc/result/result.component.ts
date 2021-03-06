import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'result',
  template: `
  <div class="icon"><i nz-icon class="anticon anticon-{{_icon}} {{_type}}"></i></div>
  <div class="title"><ng-container *ngIf="_title; else _titleTpl">{{_title}}</ng-container></div>
  <div *ngIf="_description || _descriptionTpl" class="description"><ng-container *ngIf="_description; else _descriptionTpl">{{_description}}</ng-container></div>
  <div *ngIf="_extra || _extraTpl" class="extra">
    <ng-container *ngIf="_extra; else _extraTpl">{{_extra}}</ng-container>
  </div>
  <div class="actions"><ng-content></ng-content></div>
  `,
  host: { '[class.ad-result]': 'true' },
  preserveWhitespaces: false,
})
export class ResultComponent {
  // region: fields

  _type = '';
  _icon = '';
  @Input()
  set type(value: string) {
    this._type = value;
    switch (value) {
      case 'success':
        this._icon = 'check-circle';
        break;
      case 'error':
        this._icon = 'close-circle';
        break;
      default:
        this._icon = value;
        break;
    }
  }

  _title = '';
  _titleTpl: TemplateRef<any>;
  @Input()
  set title(value: string | TemplateRef<any>) {
    if (value instanceof TemplateRef) {
      this._title = null;
      this._titleTpl = value;
    } else this._title = value;
  }

  _description = '';
  _descriptionTpl: TemplateRef<any>;
  @Input()
  set description(value: string | TemplateRef<any>) {
    if (value instanceof TemplateRef) {
      this._description = null;
      this._descriptionTpl = value;
    } else this._description = value;
  }

  _extra = '';
  _extraTpl: TemplateRef<any>;
  @Input()
  set extra(value: string | TemplateRef<any>) {
    if (value instanceof TemplateRef) {
      this._extra = null;
      this._extraTpl = value;
    } else this._extra = value;
  }

  // endregion
}
