import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

import { SidebarNavComponent } from './sidebar-nav.component';

@NgModule({
  imports: [CommonModule, RouterModule, ...SHARED_ZORRO_MODULES],
  declarations: [SidebarNavComponent],
  exports: [SidebarNavComponent],
})
export class AdSidebarNavModule {
  static forRoot(): ModuleWithProviders<AdSidebarNavModule> {
    return { ngModule: AdSidebarNavModule, providers: [] };
  }
}
