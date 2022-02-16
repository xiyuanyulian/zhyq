import { NgModule, LOCALE_ID, APP_INITIALIZER, Injector, ErrorHandler } from '@angular/core';
import { HttpClient, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService } from 'angular-web-storage';
// import { ObserversModule } from '@angular/cdk/observers';

import { DelonModule } from './delon.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { RoutesModule } from './routes/routes.module';
import { LayoutModule } from './layout/layout.module';
import { StartupService } from '@core/startup/startup.service';

import { SettingsService } from '@delon/theme';

// angular i18n
import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh';
registerLocaleData(localeZh);
// i18n
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ALAIN_I18N_TOKEN, WINDOW } from '@delon/theme';
import { I18NService } from '@core/i18n/i18n.service';

import { JWTInterceptor } from '@delon/auth';
import { DefaultInterceptor, TokenInterceptor, ErrorInterceptor, ErrorDefaultHandler } from '@core';

import { LOGIN_COMPONENT_TOKEN } from '@core';
import { UserLoginMiniComponent } from './layout/passport/login/login.mini.component';

import { BizModule } from './biz/biz.module';
import { GraphQLModule } from './graphql.module';

import './shared/rxjs-extensions';

// third
import { UEditorModule } from 'ngx-ueditor';
// JSON-Schema form
// import { JsonSchemaModule } from '@shared/json-schema/json-schema.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, `assets/i18n/`, '.json');
}

export function StartupServiceFactory(startupService: StartupService): Function {
    return () => startupService.load();
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        DelonModule.forRoot(),
        GraphQLModule,
        CoreModule,
        SharedModule,
        LayoutModule,
        RoutesModule,
        // ObserversModule,
        // i18n
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        BizModule,
        // thirds
        UEditorModule.forRoot({
            js: [
                `./assets/ueditor/ueditor.all.js`,
                `./assets/ueditor/ueditor.config.js`,
            ],
            // 默认前端配置项
            options: {
                UEDITOR_HOME_URL: './assets/ueditor/'
            }
        }),
        // // JSON-Schema form
        // JsonSchemaModule
    ],
    providers: [
        { provide: WINDOW, useValue: window },
        // code see: https://github.com/unicode-cldr/cldr-core/blob/master/availableLocales.json
        { provide: LOCALE_ID, useValue: 'zh-Hans' },
        { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        { provide: ErrorHandler, useClass: ErrorDefaultHandler },
        { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
        { provide: LOGIN_COMPONENT_TOKEN, useValue: UserLoginMiniComponent, multi: false },
        SettingsService,
        StartupService,
        {
            provide: APP_INITIALIZER,
            useFactory: StartupServiceFactory,
            deps: [StartupService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
