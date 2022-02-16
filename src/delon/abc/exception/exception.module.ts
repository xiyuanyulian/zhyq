import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

import { ExceptionComponent } from './exception.component';

const COMPONENTS = [ExceptionComponent];

@NgModule({
  imports: [CommonModule, RouterModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdExceptionModule {
  static forRoot(): ModuleWithProviders<AdExceptionModule> {
    return { ngModule: AdExceptionModule, providers: [] };
  }
}
