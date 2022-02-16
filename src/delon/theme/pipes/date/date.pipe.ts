import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, format } from 'date-fns';

/**
 * @see http://ng-alain.com/docs/service-pipe#%E6%97%A5%E6%9C%9F-_date
 */
@Pipe({ name: '_date' })
export class DatePipe implements PipeTransform {
  transform(
    value: Date | string | number,
    formatString: string = 'yyyy-MM-dd HH:mm',
  ): string {
    if (value) {
      if (formatString === 'fn') {
        return formatDistanceToNow(new Date(value), {
          locale: (window as any).__locale__,
        });
      }
      return format(new Date(value), formatString);
    } else {
      return '';
    }
  }
}
