import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DelonUtilModule } from '@delon/util';

import { SimpleTableComponent } from './simple-table.component';
import { SimpleTableRowDirective } from './simple-table-row.directive';
import { AdSimpleTableConfig } from './simple-table.config';

const COMPONENTS = [SimpleTableComponent, SimpleTableRowDirective];

// region: zorro modules

import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

// const ZORROMODULES = [SharedModule];

// endregion

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, FormsModule, DelonUtilModule, ...SHARED_ZORRO_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdSimpleTableModule {
  static forRoot(): ModuleWithProviders<AdSimpleTableModule> {
    return { ngModule: AdSimpleTableModule, providers: [AdSimpleTableConfig] };
  }
}
