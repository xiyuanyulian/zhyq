import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router';
import { UserService } from '@biz/user.service';
import { ReuseTabService } from '@delon/abc';
import { ModalHelper, ScrollService, SettingsService } from '@delon/theme';
import Cookie from 'js.cookie';
import * as _ from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'layout-default',
    templateUrl: './default.component.html'
})
export class LayoutDefaultComponent implements OnInit {

    isFetching = false;
    MSG_OPTION = { nzPlacement: 'bottomRight' };

    constructor(
        private router: Router,
        scroll: ScrollService,
        private modalHelper: ModalHelper,
        private _message: NzNotificationService,
        private userService: UserService,
        private reuseTabService: ReuseTabService,
        public settings: SettingsService) {
        // scroll to top in change page
        router.events.subscribe(evt => {
            if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
                this.isFetching = true;
            }
            if (evt instanceof NavigationError) {
                this.isFetching = false;
                _message.error('系统错误', `无法加载页面：${evt.url}`, { nzDuration: 1000 * 3 });
                return;
            }
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            setTimeout(() => {
                scroll.scrollToTop();
                this.isFetching = false;
            }, 100);
        });
    }

    user: any;

    ngOnInit() {
        this.popMessageBox();
        this.onLogoff();

        // 系统初始化完毕
        this.settings.setInited(true);

        this.user = this.settings.user;

        const lock = Cookie.get('lock');

        if (lock) {
            this.router.navigate(['lock']);
            return;
        }

    }

    /**
     * 弹出系统消息框，消息是来于 settings 中的全局消息队列。
     */
    popMessageBox() {
         // this.msg_option = Object.assign(this.msg_option, this.settings.app.);
        _.assign(this.MSG_OPTION, this.settings.app.options.notification);

        this.settings.getMessage().pipe(
            debounceTime(1000),
            distinctUntilChanged()
        ).subscribe(msg => {
            if (!msg) { return; }

            const _option = _.assign({}, this.MSG_OPTION, msg.option);
            this._message.create(msg.type || 'info', msg.title || '系统消息', msg.content, _option);
        });
    }

    /**
     * 注销系统时，做相关的清理工作：
     *   1. 关掉所有的标签页面；
     */
    onLogoff() {
        this.settings.getAuth().subscribe(value => {
            if (!value) {
                this.reuseTabService.clear();
            }
        });
    }
}
