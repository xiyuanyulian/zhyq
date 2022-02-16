import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

import { G2ProgressComponent } from './mini-progress.component';

const COMPONENTS = [G2ProgressComponent];

@NgModule({
  imports: [CommonModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdG2MiniProgressModule {
  static forRoot(): ModuleWithProviders<AdG2MiniProgressModule> {
    return { ngModule: AdG2MiniProgressModule, providers: [] };
  }
}
