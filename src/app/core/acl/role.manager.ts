import { Injectable } from '@angular/core';
import { ROLES } from './interface';

const SYS_ADMIN_NAME = 'admin';

@Injectable()
export class RoleManager {

    public isSystemAdminName(name: string) {
        return name === SYS_ADMIN_NAME;
    }

    public isSystemAdmin(role: string | string[]) {
        return Array.isArray(role) ?  role.includes(ROLES.SUPER) : role === ROLES.SUPER;
    }

    public isDeptAdmin(role) {
        return Array.isArray(role) ?  role.includes(ROLES.ADMIN) : role === ROLES.ADMIN;
    }

}
