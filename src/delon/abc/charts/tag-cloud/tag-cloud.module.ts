import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

import { G2TagCloudComponent } from './tag-cloud.component';

const COMPONENTS = [G2TagCloudComponent];

@NgModule({
  imports: [CommonModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdG2TagCloudModule {
  static forRoot(): ModuleWithProviders<AdG2TagCloudModule> {
    return { ngModule: AdG2TagCloudModule, providers: [] };
  }
}
