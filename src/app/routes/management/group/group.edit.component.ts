import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { DivisionService, GroupService } from '@biz';
import { SettingsService, _HttpClient } from '@delon/theme';


import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import * as uuid from 'uuid';
import { FileUploadService } from '@biz/file-upload.service';

const gqlFile = gql`
  query getData($masterId: String){
    file_uploads(masterId: $masterId) {
        id, uid, masterId, moduleName, name, ext, path, url,
        size, status, upload_by, upload_by_who, upload_time, remark, deleted,
        created_by, created_by_who, created_time, updated_by, updated_by_who, updated_time
    }
  }
`;

const gqlStatus = gql`
query getData($category: String){
    aDictionarys(category: $category) {
        code
        name
    }
  }
`;

const gqlGroup = gql`
  query getData($id: String!){
    group(id: $id){
        id
        code
        name
        org_code
        is_supervise_org
        remark
        sn
        division_code
        division_name
        parent_node_name
        superior_org_code
        superior_org_id
        superior_org_name
    }
  }
`;

@Component({
    selector: 'avalon-group-edit',
    templateUrl: './group.edit.component.html'
})
export class GroupEditComponent implements OnInit {

    orgTypes = [];

    audit_type = [{ 'code': '否', 'value': '否' }, { 'code': '是', 'value': '是' }];
    i: any;
    parentGroup: any;
    type;

    divisions = [];
    selectedDivision;

    user: any;
    groups = [];
    org_id: any;
    code: String;
    parent_code: String;

    constructor(
        private subject: NzModalRef,
        public msgSrv: NzMessageService,
        public http: _HttpClient,
        private fileUploadService: FileUploadService,
        private apollo: Apollo,
        public setting: SettingsService,
        private groupService: GroupService,
        private divisionService: DivisionService) { }

    fileList = [];
    saveFileList = [];
    showUploadList = {
        showPreviewIcon: true,
        showRemoveIcon: true,
        hidePreviewIconInNonImage: true
    };
    previewImage: string | undefined = '';
    previewVisible = false;
    uploadPath: String;

    isNew = false;
    canEdit = false;
    ngOnInit() {
        this.user = this.setting.user;
        const roles = this.user.roles;
        const role_codes = roles.map(e => e.code);
        if (role_codes.indexOf('SUPER') !== -1 || role_codes.indexOf('OPER') !== -1) {
            this.canEdit = true;
        }
        if (this.type === 'EDIT') {
            if (!this.i.id) {
                this.i.id = this.user.org_id;
                this.load();
            }
            this.loadFile();
            if (JSON.stringify(this.i) === '{}') {
                this.load();
            }
            this.code = this.i.code.slice(-3);
            this.parent_code = this.i.code.substring(0, this.i.code.length - 3);
        } else {
            this.i.id = uuid.v4();
            if (!this.i.parent_code) {
                this.parent_code = '001';
            } else {
                this.parent_code = this.i.parent_code;
            }
            this.i.superior_org_code = this.i.parent_code;
            this.i.superior_org_id = this.i.parent;
            this.i.superior_org_name = this.i.parent_node_name;
            this.i.sn = 1;
            this.isNew = true;
            this.groupService.getCode({ code: this.parent_code }).subscribe(res => {
                if (res.code === 0 && res['data']['code']) {
                    const code = `${Number(res['data']['code']) + 1}`;
                    const s_code = code.length >= 3 ? '' : '000'.substring(code.length);
                    this.code = `${s_code}${code}`;
                }
            });
        }
        this.uploadPath = '/api/oss_file_upload/upload?masterId=' + this.i.id + '&moduleName=org_logo';

        this.subscribe = this.apollo.watchQuery({
            query: gqlStatus,
            variables: { category: 'ORGTYPE' },
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.orgTypes = result.data['aDictionarys'];
        }, e => console.log(`Error: ${e}`));

        this.loadDivisions();

        this.treeGroup(f => this.org_id = this.i.superior_org_id);
    }

    loadFile() {
        this.subscribe = this.apollo.watchQuery({
            query: gqlFile,
            variables: { masterId: this.i.id },
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.fileList = this.fileUploadService.handleImageList(JSON.parse(JSON.stringify(result.data['file_uploads'])));
            this.saveFileList = result.data['file_uploads'];
        }, e => console.log(`Error: ${e}`));
    }

    handlePreview = (file: NzUploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    pic_changed = false;
    handleChange(info: any): void {
        this.pic_changed = true;
        if (info.type === 'success' && info.file.response.file.status === 'done') {
            // 上传成功，处理附件列表
            // 不要自动添加的

            // 手动添加
            info.file.response.file.masterId = this.i.id;
            info.file.response.file.moduleName = 'org_logo';
            info.file.response.file.upload_by = this.setting.user.uid;
            info.file.response.file.upload_by_who = this.setting.user.fullname;
            info.file.response.file.upload_time = new Date();
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

    subscribe: Subscription;
    load() {
        this.subscribe = this.apollo.watchQuery({
            query: gqlGroup,
            variables: { id: this.user.org_id },
            fetchPolicy: 'no-cache'
        }).valueChanges.subscribe(result => {
            this.i = result.data['group'];
        }, e => console.log(`Error: ${e}`));
    }

    setValue() {
        this.divisions.forEach((d) => {
            if (d.division_code === this.i['division_code']) {
                this.selectedDivision = d;
                return;
            }
        });
    }

    loadDivisions(callback?) {
        this.divisionService.getTree().subscribe((res) => {
            this.divisions = res.data.map(node => new NzTreeNode(node));
            if (!!callback) callback(this.divisions);
        });
    }

    onSelectGroup(e: any) {
        this.i['superior_org_id'] = e.node.origin['id'];
        this.i['superior_org_code'] = e.node.origin['code'];
        this.i['superior_org_name'] = e.node.origin['name'];
        this.parent_code = e.node.origin['code'];
    }

    onSelectDivision(e: any) {
        this.i['division_code'] = e.node.origin['code'];
        this.i['division_name'] = e.node.origin['name'];
    }

    /**
     * 构建组织机构树
     */
    treeGroup(callback?) {
        this.groupService.getAll().subscribe((res) => {
            const groups = this.doTree(res);
            this.groups = groups.map(node => new NzTreeNode(node));
            if (!!callback) callback(this.groups);
        });
    }

    /**
     * 将用户组构建成树型结构
     * @param groups group array
     * @param p parent group
     */
    private doTree(groups: any[], p?: any) {
        const _nodes = [];

        if (!p) {
            // 找出顶级用户组
            groups.filter(g => !g.parent).forEach(node => _nodes.push(node));
        } else {
            // 找出 p 的所有子用户组
            groups.filter(g => g.parent === p.id).forEach(node => _nodes.push(node));
        }

        // 按 sn 字段排序，无sn的排最后
        _nodes.sort((a, b) => (!!a.sn ? a.sn : 1000) - (!!b.sn ? b.sn : 1000));

        // 找出每个用户组的子级用户组
        _nodes.forEach(group => group['children'] = this.doTree(groups, group));

        return _nodes;
    }

    save() {
        const group = Object.assign({}, this.i);
        delete group.children;
        delete group.key;
        delete group.title;
        group.code = `${this.parent_code}${this.code}`;
        this.groupService.save(group, this.isNew).subscribe((res) => {
            if (res.msg === 'success') {
                this.fileUploadService.insertFileList(this.saveFileList, this.i.id, 'org_logo').subscribe((result) => {
                });
                this.subject.destroy(res.data);
            } else {
                this.msgSrv.error(res.data || '机构编码重复');
            }
        });
    }

    close() {
        this.subject.destroy();
    }
}
