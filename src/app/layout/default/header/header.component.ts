import {gql, Apollo} from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LocalStorageService } from 'angular-web-storage';

import { SettingsService } from '@delon/theme';
// import { I18NService } from '@core/i18n/i18n.service';

import { Subscription } from 'rxjs';
import { ROLES } from '@core/acl/interface';


const gqlOrgs = gql`
  query childGroups($org_id: String!){
    childGroups(org_id: $org_id) {
        id
    }
  }
`;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    subscribe: Subscription;

    ngOnInit(): void {
        const roles = this.settings.user.roles;
        const role_codes = roles.map(e => e.code);
        const org = this.settings.user.orgs[0];
        if (!role_codes.includes('SUPER')) {
            this.showOrg = true;
            if ((role_codes.includes('DEPART') || role_codes.includes('PERSONNEL')) && org.type === 'TOWN') {
                this.subscribe = this.apollo.watchQuery({
                    query: gqlOrgs,
                    variables: { org_id: this.settings.user.org_id },
                    fetchPolicy: 'no-cache'
                }).valueChanges.subscribe(result => {
                    const orgs = result.data['childGroups'];
                    const childOrg = orgs.map(e => e.id);
                    childOrg.push(org.id);
                    this.settings.user.childOrg = childOrg;
                }, e => console.log(`Error: ${e}`));
            }
        }

        if (role_codes.length === 1 && role_codes.includes(ROLES.BUSINESS)) {
            this.showOrg = false;
        }

        this.changeLang('zh');
    }
    searchToggleStatus: boolean;
    searchToggled = false;
    appLoading = true;
    showOrg = false;

    constructor(
        public settings: SettingsService,
        private apollo: Apollo,
        // public i18nService: I18NService,
        private confirmServ: NzModalService,
        private storageServ: LocalStorageService,
        private messageServ: NzMessageService
    ) {
    }

    toggleCollapsedSidebar() {
        this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
    }

    searchToggleChange() {
        this.searchToggleStatus = !this.searchToggleStatus;
        this.searchToggled = true;
    }

    appChange() {
        setTimeout(() => this.appLoading = false, 500);
    }

    changeLang(lang: string) {
        // this.i18nService.use(lang);
        this.settings.setLayout('lang', lang);
    }

    clearStorage() {
        this.confirmServ.confirm({
            nzTitle: 'Make sure clear all local storage?',
            nzOnOk: () => {
                this.storageServ.clear();
                this.messageServ.success('Clear Finished!');
            }
        });
    }
}
