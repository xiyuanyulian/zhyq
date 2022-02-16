import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';

import { PagesModule } from './pages/pages.module';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { HomeModule } from './home/home.module';
import { ManagementModule } from './management/management.module';
import { SupervisionComponent } from './supervision/supervision.component';
import { TenctentMapComponent } from './map/tenctent.map.component';

@NgModule({
    imports: [SharedModule, RouteRoutingModule, HomeModule, PagesModule, ManagementModule],
    declarations: [
        SupervisionComponent,
        TenctentMapComponent,
        // single pages
        CallbackComponent,
        Exception403Component,
        Exception404Component,
        Exception500Component
    ],
    entryComponents: [TenctentMapComponent]
})

export class RoutesModule { }
