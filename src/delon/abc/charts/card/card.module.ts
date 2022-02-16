import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

import { G2CardComponent } from './card.component';

const COMPONENTS = [G2CardComponent];

@NgModule({
  imports: [CommonModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdG2CardModule {
  static forRoot(): ModuleWithProviders<AdG2CardModule> {
    return { ngModule: AdG2CardModule, providers: [] };
  }
}
