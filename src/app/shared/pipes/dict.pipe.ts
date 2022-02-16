import { PipeTransform, Pipe } from '@angular/core';

const dicts = {
    enabled: ['禁用', '启用'],
};

/**
 * 字典
 *
 * @example
 * ```html
 * {{enabled | dict}}
 * ```
 */
@Pipe({ name: 'dict' })
export class DictPipe implements PipeTransform {

    transform(value, name): string {
        return dicts[name][!value ? 0 : 1];
    }

}
