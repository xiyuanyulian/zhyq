import { Component } from '@angular/core';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-pages-500',
  templateUrl: './500.component.html',
  styleUrls: ['./500.component.scss']
})
export class Page500Component {

    constructor(public settings: SettingsService) {}

}
