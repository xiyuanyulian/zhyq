import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { RoieHomeComponent } from './home.component';

const COMPONENTS_NOROUNT = [];

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        RoieHomeComponent,
        ...COMPONENTS_NOROUNT
    ],
    entryComponents: COMPONENTS_NOROUNT
})
export class HomeModule { }