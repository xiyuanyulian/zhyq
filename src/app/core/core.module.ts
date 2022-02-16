import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { I18NService } from './i18n/i18n.service';

import { AuthenticationService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { TokenService } from './net/token/token.service';
import { RoleManager } from './acl';


@NgModule({
  imports: [],
  providers: [
    I18NService,
    AuthenticationService,
    TokenService,
    AuthGuard,
    RoleManager
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
