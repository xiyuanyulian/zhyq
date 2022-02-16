
import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SettingsService, TitleService, ALAIN_I18N_TOKEN, MenuService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { RoleManager } from '../acl';
import { ReuseTabService } from '@delon/abc';
import { zip } from 'rxjs';
import { tap, filter, catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';
import { TokenService } from '../net/token/token.service';
import { User, UserService, MenuService as MainMenu } from '@biz';


/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    constructor(
        private injector: Injector,
        @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
        private translate: TranslateService,
        private setting: SettingsService,
        private httpClient: HttpClient,
        private token: TokenService,
        private aclService: ACLService,
        private roleManager: RoleManager,
        private titleService: TitleService,
        private mainMenu: MainMenu,
        private menuService: MenuService,
        private reuseTabService: ReuseTabService,
        private userService: UserService
    ) { }

    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            console.log(`[%s] system is starting...`, new Date().toUTCString());
            zip(
                this.httpClient.get(`assets/i18n/${this.i18n.defaultLang}.json`),
                this.httpClient.get('assets/app-data.json')
            ).pipe(
                // 接收其他拦截器后产生的异常消息
                catchError(([langData, appData]) => {
                    resolve(null);
                    return [langData, appData];
                })
            ).subscribe(([langData, appData]) => {
                // setting language data
                this.translate.setTranslation(this.i18n.defaultLang, langData);
                this.translate.setDefaultLang(this.i18n.defaultLang);

                // application data
                const res: any = appData;
                // 应用信息：包括站点名、描述、年份
                this.setting.setApp(res.app);
                // ACL：设置权限为全量
                // this.aclService.setFull(true);
                // 初始化菜单
                // this.menuService.add(res.menu);

                // 设置页面的默认标题以及标题的后缀
                this.titleService.default = res.app.name;
                this.titleService.suffix = res.app.name;
                this.titleService.appname = res.app.name;

                // debug 模式下，加载测试用户数据
                if (appData.debug && appData.user) {
                    this.setting.getInited().pipe(
                        filter(v => !!v)
                    ).subscribe(() => {
                        this.setting.user = appData.user;
                    });
                }
                resolve(res);
            },
                (err: HttpErrorResponse) => {
                    resolve(null);
                },
                () => {
                    resolve(null);
                });

            // 如果用户已经登录，则装载用户信息
            if (this.token.isValid()) {
                this.setting.putAuth(true);
                const u = this.token.getAuthUser();
                this.setting.setUser(u);
                // this.loadUser(u);
            } else {
                this.setting.setUser({});
            }

            // 初始化权限信息
            this.setting.getUser().pipe(tap(u => {
                // 设置管理员的权限为全量
                if (u && this.roleManager.isSystemAdminName(u.username)) {
                    this.aclService.setFull(true);
                } else {
                    this.aclService.setFull(false);
                }
            })).subscribe(u => this.loadACL(u));

            // 初始化菜单
            this.aclService.change.subscribe(acl => this.loadMenus(acl));

            // 初始化完成
            this.menuService.change.subscribe((menus) => {

                // 刷新标签
                this.reuseTabService.refresh();

                // this.setting.setInited(true);
            });
        });
    }

    /**
     * 装载用户信息
     * @param user 用户
     */
    loadUser(user) {
        if (!user || !user.uid) { return; }

        this.userService.getUser(user.uid).subscribe(u => {
            const _user = Object.assign(new User(), u);
            this.setting.setUser(_user);
        });
    }

    /**
     * 装载权限信息
     * @param user
     */
    loadACL(user) {
        if (!user || !user.uid) {
            this.aclService.set({});
            return;
        }

        const roles = user.roles;

        // 设置管理员的权限为全量
        if (roles.some(r => this.roleManager.isSystemAdmin(r.code))) {
            this.aclService.setFull(true);
        } else {
            this.aclService.setFull(false);
        }

        const aclRoles = roles.map(e => e.id);
        this.aclService.set({ 'role': aclRoles });
    }

    /**
     * 装载菜单
     * @param acl
     */
    loadMenus(acl) {
        if (!acl || !this.setting.user || !this.setting.user.uid) {
            this.menuService.add([]);
            return;
        }

        this.mainMenu.getTree().subscribe(res => {
            const menus = res.data;
            this.menuService.add(menus);

            if (menus && menus.length > 0) {
                // 根据当前url展开菜单
                const router = this.injector.get(Router);
                this.menuService.openedByUrl(router.url);
                this.menuService.refresh();
            }
        });
    }
}
