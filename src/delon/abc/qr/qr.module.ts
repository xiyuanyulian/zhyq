import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdQRConfig } from './qr.config';
import { QRComponent } from './qr.component';
import { QRService } from './qr.service';

const COMPONENTS = [QRComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AdQRModule {
  static forRoot(): ModuleWithProviders<AdQRModule> {
    return { ngModule: AdQRModule, providers: [AdQRConfig, QRService] };
  }
}
