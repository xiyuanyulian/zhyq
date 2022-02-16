import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReuseTabComponent } from './reuse-tab.component';
import { ReuseTabContextComponent } from './reuse-tab-context.component';
import { ReuseTabContextDirective } from './reuse-tab-context.directive';
import { ReuseTabContextMenuComponent } from './reuse-tab-context-menu.component';

const COMPONENTS = [ReuseTabComponent];
const NOEXPORTS = [
  ReuseTabContextMenuComponent,
  ReuseTabContextComponent,
  ReuseTabContextDirective,
];

import { OverlayModule } from '@angular/cdk/overlay';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

@NgModule({
  imports: [CommonModule, RouterModule, ...SHARED_ZORRO_MODULES, OverlayModule],
  declarations: [...COMPONENTS, ...NOEXPORTS],
  entryComponents: [ReuseTabContextMenuComponent],
  exports: [...COMPONENTS],
})
export class AdReuseTabModule {
  static forRoot(): ModuleWithProviders<AdReuseTabModule> {
    return {
      ngModule: AdReuseTabModule,
    };
  }
}
