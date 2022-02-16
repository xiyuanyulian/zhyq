import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarListComponent } from './avatar-list.component';
import { AvatarListItemComponent } from './avatar-list-item.component';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

const COMPONENTS = [AvatarListComponent, AvatarListItemComponent];

// region: zorro modules

// const ZORROMODULES = [NgZorroAntdModule];

// endregion

@NgModule({
  imports: [CommonModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdAvatarListModule {
  static forRoot(): ModuleWithProviders<AdAvatarListModule> {
    return { ngModule: AdAvatarListModule, providers: [] };
  }
}
