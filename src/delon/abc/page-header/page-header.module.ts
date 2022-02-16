import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DelonUtilModule } from '@delon/util';

import { PageHeaderComponent } from './page-header.component';
import { AdPageHeaderConfig } from './page-header.config';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

const COMPONENTS = [PageHeaderComponent];

// region: zorro modules
// endregion

@NgModule({
  imports: [CommonModule, RouterModule, DelonUtilModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdPageHeaderModule {
  static forRoot(): ModuleWithProviders<AdPageHeaderModule> {
    return { ngModule: AdPageHeaderModule, providers: [AdPageHeaderConfig] };
  }
}
