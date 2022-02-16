import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { DictionaryCategoryComponent } from './dictionary/dictionary.category.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { DivisionComponent } from './division/division.component';
import { DivisionTreeComponent } from './division/division-tree.component';
import { DivisionEditComponent } from './division/division-edit.component';
import { GroupRoleComponent } from './group/group-role.component';
import { GroupTreeComponent } from './group/group-tree.component';
import { GroupUserComponent } from './group/group-user.component';
import { GroupComponent } from './group/group.component';
import { GroupEditComponent } from './group/group.edit.component';
import { OrgInfoComponent } from './group/info/org.info.component';
import { LoginLogListComponent } from './login-log/login-log.list.component';
import { RolePermComponent } from './role/role-permission.component';
import { RoleUserComponent } from './role/role-user.component';
import { RoleComponent } from './role/role.component';
import { RoleEditComponent } from './role/role.edit.component';
import { RoleListComponent } from './role/role.list.component';
import { UserAccountComponent } from './user/user-account.component';
import { UserPermissionComponent } from './user/user-permission.component';
import { UserRoleComponent } from './user/user-role.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/user.edit.component';
import { UserListComponent } from './user/user.list.component';
import { UserPasswrodComponent } from './user/user.password.component';
import { UserProfileComponent } from './user/user.profile.component';
import { UserSelectionComponent } from './user/user.selection.component';

const routes: Routes = [
    { path: 'user', component: UserComponent },
    { path: 'role', component: RoleComponent },
    { path: 'division', component: DivisionComponent },
    { path: 'group', component: GroupComponent },
    { path: 'dictionary', component: DictionaryComponent },
    { path: 'login-log', component: LoginLogListComponent }
];

const COMPONENTS_NOROUNT = [
    UserListComponent,
    UserEditComponent,
    UserAccountComponent,
    UserRoleComponent,
    UserPermissionComponent,
    UserSelectionComponent,
    UserPasswrodComponent,
    RoleListComponent,
    RoleEditComponent,
    RolePermComponent,
    RoleUserComponent,
    GroupEditComponent,
    GroupTreeComponent,
    GroupUserComponent,
    GroupRoleComponent,
    DictionaryCategoryComponent,
    LoginLogListComponent,
    DivisionComponent,
    UserProfileComponent,
    OrgInfoComponent
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports: [],
    declarations: [
        UserComponent,
        RoleComponent,
        GroupComponent,
        DictionaryComponent,
        GroupTreeComponent,
        DivisionTreeComponent,
        DivisionEditComponent,
        ...COMPONENTS_NOROUNT
    ],
    entryComponents: COMPONENTS_NOROUNT
})
export class ManagementModule { }
