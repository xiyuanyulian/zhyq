import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'rioe-division',
    templateUrl: './division.component.html'
})
export class DivisionComponent implements OnInit {

    divisionSubject = new BehaviorSubject(null);

    saveDivisionSubject = new BehaviorSubject(null);

    constructor() {}

    ngOnInit() { }

    onChangeDivision(division) {
        this.divisionSubject.next(Object.assign({}, division));
    }

    onSaveDivision(result) {
        this.saveDivisionSubject.next(result);
    }

}
