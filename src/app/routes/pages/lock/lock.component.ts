import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-pages-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.scss']
})
export class LockComponent {
  valForm: FormGroup;

  constructor(public settings: SettingsService, fb: FormBuilder, private router: Router) {
    this.valForm = fb.group({
      password: [null, Validators.required]
    });
  }

  submit() {
    for (const i in this.valForm.controls) {
      this.valForm.controls[i].markAsDirty();
    }
    if (this.valForm.valid) {
      this.router.navigate(['dashboard']);
    }
  }
}
