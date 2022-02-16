import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

import { G2RadarComponent } from './radar.component';

const COMPONENTS = [G2RadarComponent];

@NgModule({
  imports: [CommonModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdG2RadarModule {
  static forRoot(): ModuleWithProviders<AdG2RadarModule> {
    return { ngModule: AdG2RadarModule, providers: [] };
  }
}
