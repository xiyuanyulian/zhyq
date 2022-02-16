import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { GroupComponent } from '../management/group/group.component';
import { ManagementModule } from '../management/management.module';
import { UserComponent } from '../management/user/user.component';
import { OrgComponent } from './org.detail.component';
import { GroupDetailComponent } from './archives/group.detail.component';
import { OrgTreeComponent } from './org-tree.component';
import { OrgSummaryComponent } from './org.summary.component';

const routes: Routes = [
    { path: 'group', component: GroupComponent },
    { path: 'user', component: UserComponent },
    { path: 'detail', component: OrgComponent },
];

const COMPONENTS_NOROUNT = [
    OrgComponent,
    GroupDetailComponent,
    OrgTreeComponent,
    OrgSummaryComponent
];

@NgModule({
    imports: [
        SharedModule,
        ManagementModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ...COMPONENTS_NOROUNT
    ],
    entryComponents: COMPONENTS_NOROUNT
})
export class OrgModule { }
