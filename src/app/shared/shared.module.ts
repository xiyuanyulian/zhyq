import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// region: third libs
import { CountdownModule } from 'ngx-countdown';
import { UEditorModule } from 'ngx-ueditor';
// import { NzSchemaFormModule } from 'nz-schema-form';
import { AngularWebStorageModule } from 'angular-web-storage';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChartsModule } from 'ng2-charts';
import { SparklineDirective } from './directives/sparkline/sparkline.directive';
import { DictPipe } from './pipes/dict.pipe';
import { TrustHtmlPipe } from './pipes/trust_html.pipe';
import { ModalHelper } from './helper/modal.helper';
import { SafePipe } from '@shared/pipes/safe.pipe';
import { FormatIdCardTypePipe } from './pipes/format_idCardType.pipe';
import { FormatOrgTypePipe } from './pipes/orgType.pipe';
import { FormatWeekTypePipe } from './pipes/weekType.pipe';
import { FormatMonthTypePipe } from './pipes/monthType.pipe';

import { SHARED_ZORRO_MODULES } from '@delon/shared-zorro.module';

const THIRDMODULES = [
    CountdownModule,
    UEditorModule,
    // NzSchemaFormModule
    AngularWebStorageModule,
    PerfectScrollbarModule,
    ChartsModule
];
// endregion

// region: your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [SparklineDirective];
const PIPES = [DictPipe, TrustHtmlPipe, SafePipe, FormatOrgTypePipe,
    FormatIdCardTypePipe, FormatWeekTypePipe, FormatMonthTypePipe];
const HELPERS = [ModalHelper];
// endregion

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AlainThemeModule.forChild(),
        DelonABCModule,
        DelonACLModule,
        ...SHARED_ZORRO_MODULES,
        // third libs
        ...THIRDMODULES
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AlainThemeModule,
        DelonABCModule,
        DelonACLModule,
        // i18n
        TranslateModule,
        // third libs
        ...THIRDMODULES,
        ...SHARED_ZORRO_MODULES,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES
    ]
})
export class SharedModule { }
