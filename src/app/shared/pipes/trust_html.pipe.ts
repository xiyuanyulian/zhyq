import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
    name: 'trustHtml'
})
export class TrustHtmlPipe implements PipeTransform {

    constructor (private sanitizer: DomSanitizer) {
    }
    transform(style) {
        return this.sanitizer.bypassSecurityTrustHtml(style);
    }
}
