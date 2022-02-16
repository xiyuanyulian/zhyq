import {Apollo, gql} from 'apollo-angular';
import { Component, Input, OnInit } from '@angular/core';
import { DivisionService } from '@biz/division.service';
import { FileUploadService } from '@biz/file-upload.service';
import { GroupService } from '@biz/group.service';
import { ModalHelper, SettingsService, _HttpClient } from '@delon/theme';

import { TenctentMapComponent } from 'app/routes/map/tenctent.map.component';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Subscription } from 'rxjs';

const gqlRecord = gql`
query getData($orgId: String!){
    group(id: $orgId) {
        id
        code
        name
        type
        org_code
        is_supervise_org
        is_display
        remark
        division_code
        division_name
        superior_org_code
        superior_org_id
        org_intr
        committee_name
        committee_addr
        committee_tel
        committee_intr
        superior_org_name
        parent_node_name
        simple_name
        province, municipal, area, detail_area, province_name, municipal_name, area_name
        logos {
            id, uid, masterId, moduleName, name, ext, path, url,
            size, status, upload_by, upload_by_who, upload_time, remark, deleted,
            created_by, created_by_who, created_time, updated_by, updated_by_who, updated_time
        }
    }
}
`;

@Component({
    selector: 'vol-group-info',
    templateUrl: 'org.info.component.html',
    styleUrls: ['org.info.component.less']
})
export class OrgInfoComponent implements OnInit {

    s: any = {
        page: 1,
        rows: 10,
        orgId: ''
    };
    subscribe: Subscription;
    canEdit = true;
    isEdit = false;
    group: any = {};
    selectedDivision;
    user;

    s1 = {
        page: 1,
        rows: 10,
        orgId: ''
    };
    isLottery;
    couponNumber;
    canEditCoupon = false;
    showAll = true;

    selectGroup = {};
    ngOnInit(): void {
        this.user = this.setting.user;
        const roles = this.user.roles;
        this.s1.orgId = this.user.org_id;
        const roleCodes = roles.map(e => e.code);
        if (roleCodes.indexOf('SUPER') !== -1 || roleCodes.indexOf('OPER') !== -1) {
            this.canEditCoupon = true;
        }
        if (this.$group) {
            this.$group.subscribe((group) => {
                if (group.id) {
                    this.isEdit = false;
                    this.canEdit = true;
                    this.selectGroup = group;
                    this.s.orgId = group.id;
                    this.s1.orgId = group.id;
                    this.load();
                }
            });
        }
    }

    constructor(
        public http: _HttpClient,
        private modalHelper: ModalHelper,
        private msgsvr: NzMessageService,
        public setting: SettingsService,
        private groupService: GroupService,
        private divisionService: DivisionService,
        private fileUploadService: FileUploadService,
        private apollo: Apollo
    ) { }

    fileList = [];
    saveFileList = [];
    showUploadList = {
        showPreviewIcon: true,
        showRemoveIcon: true,
        hidePreviewIconInNonImage: true
    };
    previewImage: string | undefined = '';
    previewVisible = false;
    uploadPath: string;

    handlePreview = (file: NzUploadFile): void => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    picChanged = false;
    handleChange(info): void {
        if (!this.isEdit) {
            return;
        }
        this.picChanged = true;
        if (info.type === 'success' && info.file.response.file.status === 'done') {
            // 上传成功，处理附件列表
            // 不要自动添加的

            // 手动添加
            info.file.response.file.masterId = this.group['id'];
            info.file.response.file.moduleName = 'org_logo';
            info.file.response.file['upload_by'] = this.user.uid;
            info.file.response.file['upload_by_who'] = this.user.fullname;
            info.file.response.file['upload_time'] = new Date();
            info.file.response.file.deleted = false;

            this.fileList.push(info.file.response.file);
            this.saveFileList.push(info.file.response.file);
        }
        if (info.type === 'removed') {
            let index = '0';
            for (const x in this.fileList) {
                if (this.fileList[x] === info.file) {
                    index = x;
                    break;
                }
            }
            this.fileList.splice(parseInt(index, 0), 1);
            this.saveFileList.splice(parseInt(index, 0), 1);
        }
    }

    remove = (file: NzUploadFile): boolean => {
        if (!this.isEdit) {
            return false;
        } else {
            file.status = 'removed';
            return true;
        }
    }

    $group: Observable<any>;

    @Input()
    set g(group) {
        this.$group = group;
    }

    load() {
        this.subscribe = this.apollo.watchQuery({
            query: gqlRecord,
            variables: this.s,
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.group = result.data['group'];
            this.fileList = this.fileUploadService.handleImageList(JSON.parse(JSON.stringify(this.group['logos'])));
            this.saveFileList = this.group['logos'];
            if (this.group['type'] === 'SERVICE') {
                this.showAll = false;
            } else {
                this.showAll = true;
            }
        }, e => console.log(`Error: ${e}`));
        this.uploadPath = '/api/oss_file_upload/upload?masterId=' + this.group['id'] + '&moduleName=org_logo';
    }

    edit(): void {
        if (!this.isEdit) {
            this.isEdit = true;
            this.canEdit = false;
        }
    }

    save(): void {
        this.isEdit = false;
        this.canEdit = true;
        delete this.group['logos'];

        this.groupService.save(this.group, false).subscribe((res) => {
            if (res.code === 0) {
                this.fileUploadService.insertFileList(this.saveFileList, this.group['id'], 'org_logo').subscribe(result => {
                    if (result.code === 0) {
                        this.msgsvr.success('提交成功！');
                    } else {
                        this.msgsvr.error(result.msg);
                    }
                });
            } else {
                this.msgsvr.error(res.msg);
            }
        });
    }

    cancle() {
        this.isEdit = false;
        this.canEdit = true;
    }

    openMap() {
        this.modalHelper.static(TenctentMapComponent, { address: this.group['committee_addr'] }, 'lg', null, false).subscribe((res) => {
            this.group['committee_addr'] = res;
        });
    }
}
