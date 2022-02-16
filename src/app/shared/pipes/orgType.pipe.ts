import { Pipe, PipeTransform } from '@angular/core';

const orgType = {
    'AREA': '区县',
    'CITY': '城市',
    'DISTRICT': '村居',
    'TOWN': '镇街',
    'DEVOPS': '系统运维',
    'SERVICE': '社会组织'
};

@Pipe({ name: 'format_orgType' })
export class FormatOrgTypePipe implements PipeTransform {

    transform(value: any): any {
        if (!value) return '无';
        if (typeof value === 'string') return orgType[value];
        return value.map(c => orgType[c]);
    }

}
