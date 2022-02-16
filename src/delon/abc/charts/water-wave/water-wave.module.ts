import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

import { G2WaterWaveComponent } from './water-wave.component';

const COMPONENTS = [G2WaterWaveComponent];

@NgModule({
  imports: [CommonModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdG2WaterWaveModule {
  static forRoot(): ModuleWithProviders<AdG2WaterWaveModule> {
    return { ngModule: AdG2WaterWaveModule, providers: [] };
  }
}
