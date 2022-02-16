import { Pipe, PipeTransform } from '@angular/core';

const monthType = {
    '1': '第1天',
    '2': '第2天',
    '3': '第3天',
    '4': '第4天',
    '5': '第5天',
    '6': '第6天',
    '7': '第7天',
    '8': '第8天',
    '9': '第9天',
    '10': '第10天',
    '11': '第11天',
    '12': '第12天',
    '13': '第13天',
    '14': '第14天',
    '15': '第15天',
    '16': '第16天',
    '17': '第17天',
    '18': '第18天',
    '19': '第19天',
    '20': '第20天',
    '21': '第21天',
    '22': '第22天',
    '23': '第23天',
    '24': '第24天',
    '25': '第25天',
    '26': '第26天',
    '27': '第27天',
    '28': '第28天',
    '29': '第29天',
    '30': '第30天',
    '31': '第31天',
    '0': '最后一天'
};

@Pipe({ name: 'format_monthType' })
export class FormatMonthTypePipe implements PipeTransform {

    transform(value: any): any {
        if (!value) return '无';
        const items = value.split(',');
        let s = '';
        for (const item of items) {
            s += monthType[item] + ';';
        }

        return s;
    }

}
