import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { DivisionService } from '@biz/division.service';

@Component({
    selector: 'rieo-division-edit',
    templateUrl: './division-edit.component.html'
})
export class DivisionEditComponent implements OnInit {

    @Output() onSaveDivision: EventEmitter<any> = new EventEmitter<any>();

    entity: any = {};

    constructor(
        public msgSrv: NzMessageService,
        private divisionService: DivisionService
    ) {}

    ngOnInit(): void {
        if (this.$division) {
            this.$division.subscribe((division) => {
                if (!!division) {
                    this.entity = division;
                }
            });
        }
    }

    save() {
        const entity = this.entity;

        this.divisionService.save(entity).subscribe(
            res => {
                if (res.code === 0) {
                    const _entity = res.data;
                    // this.selectedEntity = _entity;
                    this.msgSrv.success('保存成功');
                    // this.load();
                    this.entity = _entity;
                    this.onSaveDivision.emit({'success': true});
                } else {
                    this.msgSrv.error(res.msg);
                    this.onSaveDivision.emit({'success': false});
                }
            },
            e => console.error(`Error : ${e}`)
        );
    }

    $division: Observable<any>;

    @Input()
    set d(division: any) {
        this.$division = division;
    }
}
