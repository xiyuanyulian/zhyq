import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

import { SHFWrapDirective } from './wrap.directive';
import { SHFItemComponent } from './item.component';
import { AdSHFConfig } from './config';

const COMPONENTS = [SHFWrapDirective, SHFItemComponent];

@NgModule({
  imports: [CommonModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdSHFModule {
  static forRoot(): ModuleWithProviders<AdSHFModule> {
    return { ngModule: AdSHFModule, providers: [ AdSHFConfig ] };
  }
}
