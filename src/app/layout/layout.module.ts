import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { UserLockComponent } from '../layout/passport/lock/lock.component';
// passport pages
import { UserLoginComponent } from '../layout/passport/login/login.component';
import { UserLoginMiniComponent } from '../layout/passport/login/login.mini.component';
import { UserRegisterResultComponent } from '../layout/passport/register-result/register-result.component';
import { UserRegisterComponent } from '../layout/passport/register/register.component';
import { UserSettingComponent } from '../routes/management/user/user.setting.component';
import { LayoutDefaultComponent } from './default/default.component';
import { HeaderFullScreenComponent } from './default/header/components/fullscreen.component';
import { HeaderI18nComponent } from './default/header/components/i18n.component';
import { HeaderIconComponent } from './default/header/components/icon.component';
import { HeaderStorageComponent } from './default/header/components/storage.component';
import { HeaderTaskComponent } from './default/header/components/task.component';
import { HeaderUserComponent } from './default/header/components/user.component';
import { HeaderComponent } from './default/header/header.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';
// passport
import { LayoutPassportComponent } from './passport/passport.component';
import { WechatLoginComponent } from './passport/wechat-login/wechat-login.component';
import { BroswerVersionComponent } from './passport/version/broswer.version.component';
import { LoginChooseComponent } from './passport/login/login.choose.component';



const COMPONENTS = [
    LayoutDefaultComponent,
    LayoutFullScreenComponent,
    HeaderComponent,
    SidebarComponent,
    UserSettingComponent
];

const HEADERCOMPONENTS = [
    HeaderTaskComponent,
    HeaderIconComponent,
    HeaderFullScreenComponent,
    HeaderI18nComponent,
    HeaderStorageComponent,
    HeaderUserComponent
];


const PASSPORT = [
    LayoutPassportComponent
];


const PAGES = [
    UserLoginComponent,
    UserRegisterComponent,
    UserRegisterResultComponent,
    UserLockComponent,
];

const routes: Routes = [
    {
        path: 'passport',
        component: LayoutPassportComponent,
        children: [
            { path: 'login', component: UserLoginComponent, data: { title: '登录', titleI18n: 'pro-login' } },
            { path: 'login2', component: UserLoginMiniComponent },
            { path: 'register', component: UserRegisterComponent, data: { title: '注册', titleI18n: 'pro-register' } },
            { path: 'register-result', component: UserRegisterResultComponent, data: { title: '注册结果', titleI18n: 'pro-register-result' } }
        ]
    }
];

const COMPONENTS_NOROUNT = [
    UserLoginMiniComponent,
    UserSettingComponent,
    WechatLoginComponent,
    BroswerVersionComponent,
    LoginChooseComponent
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
    declarations: [
        ...COMPONENTS,
        ...HEADERCOMPONENTS,
        ...PASSPORT,
        ...PAGES,
        COMPONENTS_NOROUNT,
    ],
    exports: [
        ...COMPONENTS,
        ...PASSPORT,
        ...PAGES
    ],
    entryComponents: COMPONENTS_NOROUNT
})
export class LayoutModule { }
