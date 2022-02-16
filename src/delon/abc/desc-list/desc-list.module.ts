import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';
import { ObserversModule } from '@angular/cdk/observers';

import { DescListComponent } from './desc-list.component';
import { DescListItemComponent } from './desc-list-item.component';
import { AdDescListConfig } from './desc-list.config';

const COMPONENTS = [DescListComponent, DescListItemComponent];

@NgModule({
  imports: [CommonModule, ...SHARED_ZORRO_MODULES, ObserversModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdDescListModule {
  static forRoot(): ModuleWithProviders<AdDescListModule> {
    return { ngModule: AdDescListModule, providers: [AdDescListConfig] };
  }
}
