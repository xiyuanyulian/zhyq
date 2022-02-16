import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

import { G2TimelineComponent } from './timeline.component';

const COMPONENTS = [G2TimelineComponent];

@NgModule({
  imports: [CommonModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdG2TimelineModule {
  static forRoot(): ModuleWithProviders<AdG2TimelineModule> {
    return { ngModule: AdG2TimelineModule, providers: [] };
  }
}
