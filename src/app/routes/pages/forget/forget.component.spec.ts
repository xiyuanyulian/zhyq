/* tslint:disable:no-unused-variable */

import { TestBed, async, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { SettingsService } from '@delon/theme';

import { ForgetComponent } from './forget.component';

describe('Pages: forget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, SharedModule.forRoot()],
      declarations: [ForgetComponent],
      providers: [SettingsService]
    });
  });

  it('should create an instance', waitForAsync(() => {
    const fixture = TestBed.createComponent(ForgetComponent);
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeTruthy();
  }));
});
