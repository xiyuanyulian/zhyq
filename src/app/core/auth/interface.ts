import { InjectionToken, Type, Component } from '@angular/core';

export interface AuthenticationInfo {
    code: number;
    success: boolean;
    msg: string;
    uid: string;
    username: string;
    token: string;
}

export const LOGIN_COMPONENT_TOKEN = new InjectionToken<Type<Component>>('LOGIN_COMPONENT_TOKEN');
