import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

import { G2PieComponent } from './pie.component';

const COMPONENTS = [G2PieComponent];

@NgModule({
  imports: [CommonModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdG2PieModule {
  static forRoot(): ModuleWithProviders<AdG2PieModule> {
    return { ngModule: AdG2PieModule, providers: [] };
  }
}
