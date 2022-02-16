import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { UserLockComponent } from '../layout/passport/lock/lock.component';
// passport pages
import { UserLoginMiniComponent } from '../layout/passport/login/login.mini.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { RoieHomeComponent } from './home/home.component';
import { ForgetComponent } from './pages/forget/forget.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutDefaultComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: RoieHomeComponent, canActivate: [AuthGuard] },
            { path: 'management', loadChildren: () => import('./management/management.module').then(m => m.ManagementModule),
                canActivate: [AuthGuard] }
        ]
    },
    // 全屏布局
    {
        path: 'data-v',
        component: LayoutFullScreenComponent,
        children: [
            { path: '', loadChildren: () => import('./data-v/data-v.module').then(m => m.DataVModule) }
        ]
    },
    // 单页不包裹Layout
    { path: 'register', redirectTo: 'passport/register' },
    { path: 'login', redirectTo: 'passport/login' },
    { path: 'login2', component: UserLoginMiniComponent },
    { path: 'forget', component: ForgetComponent },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: 'callback/:type', component: CallbackComponent },
    { path: 'lock', component: UserLockComponent, data: { title: '锁屏', titleI18n: 'lock' } },
    { path: '403', component: Exception403Component },
    { path: '404', component: Exception404Component },
    { path: '500', component: Exception500Component },
    { path: '**', redirectTo: 'hote' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
    exports: [RouterModule]
})
export class RouteRoutingModule { }
