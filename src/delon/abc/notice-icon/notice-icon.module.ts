import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticeIconComponent } from './notice-icon.component';
import { NoticeIconTabComponent } from './notice-icon-tab.component';

const COMPONENTS = [NoticeIconComponent];

// region: zorro modules

import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

const ZORROMODULES = [...SHARED_ZORRO_MODULES];

// endregion

@NgModule({
  imports: [CommonModule, ...ZORROMODULES],
  declarations: [...COMPONENTS, NoticeIconTabComponent],
  exports: [...COMPONENTS],
})
export class AdNoticeIconModule {
  static forRoot(): ModuleWithProviders<AdNoticeIconModule> {
    return { ngModule: AdNoticeIconModule, providers: [] };
  }
}
