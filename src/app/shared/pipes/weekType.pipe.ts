import { Pipe, PipeTransform } from '@angular/core';

const weekType = {
    '2': '星期一',
    '3': '星期二',
    '4': '星期三',
    '5': '星期四',
    '6': '星期五',
    '7': '星期六',
    '1': '星期日'
};

@Pipe({ name: 'format_weekType' })
export class FormatWeekTypePipe implements PipeTransform {

    transform(value: any): any {
        if (!value) return '无';
        const items = value.split(',');
        let s = '';
        for (const item of items) {
            s += weekType[item] + ';';
        }

        return s;
    }

}
