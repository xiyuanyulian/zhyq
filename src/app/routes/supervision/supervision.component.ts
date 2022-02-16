import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'rioe-grid-supervision',
    templateUrl: './supervision.component.html'
})
export class SupervisionComponent implements OnInit {

    url: any = '';

    constructor(
        private routeInfo: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        const link = this.routeInfo.snapshot.params['link'];
        // this.url = this.sanitizer.bypassSecurityTrustHtml(`http://localhost:4200/js_aic/${link}.html`);
        this.url = `/js_aic/${link}.html`;
    }

}
