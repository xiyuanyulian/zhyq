import { Component, OnInit } from '@angular/core';
import { UserService } from '@biz';

@Component({
    selector: 'nz-demo-broswer-version',
    templateUrl: './broswer.version.component.html',
})

export class BroswerVersionComponent implements OnInit {

    constructor(
        private userService: UserService
    ) {}

    url: any;
    type: any;
    warnText: any;

    ngOnInit() {
        if (this.type === 'c') {
            this.warnText = '您的浏览器版本过低，请升级！';
        } else {
            this.warnText = '请使用最新chrome浏览器！';
        }
        this.url = '/assets/exe/69.0.3497.92_chrome_installer.exe';
    }

    download() {
        window.open(this.url);
    }

}
