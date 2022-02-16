import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from '../core/module-import-guard';

// 系统管理
import { MenuService } from './menu.service';
import { AccountService } from './account.service';
import { UserService } from './user.service';
import { RoleService } from './role.service';
import { GroupService } from './group.service';
import { DictionaryService } from './dictionary.service';
import { DictionaryCategoryService } from './dictionary-category.service';
import { FileUploadService } from '@biz/file-upload.service';
import { LoginLogService } from './login-log.service';
import { DivisionService } from './division.service';
import { WechatUserService } from './wechat_user.service';
@NgModule({
    imports: [
        // SharedModule,
        // CoreModule,
        // HttpClientModule,
        // HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {passThruUnknownUrl: true}),
    ],
    providers: [
        MenuService,
        AccountService,
        UserService,
        RoleService,
        GroupService,
        DictionaryService,
        DictionaryCategoryService,
        FileUploadService,
        LoginLogService,
        DivisionService,
        WechatUserService
    ],
    declarations: [
    ],
    exports: [
    ]
})
export class BizModule {
    constructor(@Optional() @SkipSelf() parentModule: BizModule) {
        throwIfAlreadyLoaded(parentModule, 'BuzModule');
    }
}
