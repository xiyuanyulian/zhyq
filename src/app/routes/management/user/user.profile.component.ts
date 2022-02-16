import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Component, OnInit } from '@angular/core';

import { _HttpClient, SettingsService } from '@delon/theme';
import { UserService } from '@biz';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user.profile.component.html'
})
export class UserProfileComponent implements OnInit {

    user: any;  // 用户基本信息

    orgs: any;  // 用户所属部门

    roles = []; // 用户角色

    originAvatar;
    avatar: any = {};
    more = false;

    constructor(
        private subject: NzModalRef,
        public http: _HttpClient,
        public msgSrv: NzMessageService,
        private userService: UserService,
        public settings: SettingsService,
    ) { }

    ngOnInit() {
        this.originAvatar = this.avatar['avatar'];

        this.user = this.settings.user;

        this.userService.getSectionName(this.user).subscribe(res => {
            this.user.section = res['data'];
        });

        this.userService.getRoles(this.user).subscribe(res => {
            this.roles = res || [];
        });

        this.userService.getGroups(this.user).subscribe(res => {
            this.orgs = res || [];
        });

    }

    save() {
        delete this.avatar['_id'];

        if (this.originAvatar !== this.avatar['avatar']) {
            this.userService.saveAvatar(this.avatar).subscribe(res => {

            }, error => {
                this.avatar['src'] = this.originAvatar;
            });
        }

    }

    close() {
        this.subject.destroy({ avtar: this.avatar });
    }

    showMore() {
        this.more = !this.more;
    }

    beforeUpload = (file: File) => {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJPG) {
            this.msgSrv.error('图片格式错误! 图片格式只能为 JPG 或 PNG');
            return false;
        }
        // 图片小于800kb
        const limitSize = file.size / 1024 < 800;
        if (!limitSize) {
            this.msgSrv.error('图片不能大于 800K');
            return false;
        }

        this.getBase64(file, (img: string) => {
            this.avatar['avatar'] = img;
            this.save();
        });

        // return isJPG && limitSize;
        return false;
    }

    private getBase64(img: File, callback: (img: {}) => void): void {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    // handleChange(info: { file: UploadFile }): void {
    //     if (info.file.status === 'uploading') {
    //         return;
    //     }

    //     if (info.file.status === 'done') {
    //         this.getBase64(info.file.originFileObj, (img: string) => {
    //             this.avatar['src'] = img;
    //             this.save();
    //         });

    //     }
    // }

}
