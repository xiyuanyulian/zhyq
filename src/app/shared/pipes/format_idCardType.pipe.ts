import { Pipe, PipeTransform } from '@angular/core';

const idcardType = {
    'IDCRAD': '身份证',
    'PASSPORT': '护照',
    'STUDENT': '学生证',
};

@Pipe({ name: 'format_idcard' })
export class FormatIdCardTypePipe implements PipeTransform {

    transform(value: any): any {
        if (!value) return '无';
        if (typeof value === 'string') return idcardType[value];
        return value.map(c => idcardType[c]);
    }

}
