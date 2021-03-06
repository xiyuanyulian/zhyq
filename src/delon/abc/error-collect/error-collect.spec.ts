import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  Component,
  DebugElement,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { AdErrorCollectModule } from './error-collect.module';
import { ErrorCollectComponent } from './error-collect.component';

describe('abc: error-collect', () => {
  let fixture: ComponentFixture<TestComponent>;
  let dl: DebugElement;
  let context: TestComponent;
  let injector: Injector;

  beforeEach(() => {
    injector = TestBed.configureTestingModule({
      imports: [
        AdErrorCollectModule.forRoot(),
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
      ],
      declarations: [TestComponent],
    });
  });

  function getPropertiesAndCreate() {
    fixture = TestBed.createComponent(TestComponent);
    dl = fixture.debugElement;
    context = fixture.componentInstance;
    fixture.detectChanges();
    const iptEl = dl.query(By.css('#email'));
    if (iptEl) {
      const ipt = iptEl.nativeElement as HTMLInputElement;
      ipt.value = '1';
      ipt.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }
  }

  afterEach(() => {
    if (context) context.comp.ngOnDestroy();
  });

  describe('[default]', () => {
    beforeEach(() => getPropertiesAndCreate());
    it('should be collect error', (done: () => void) => {
      setTimeout(() => {
        expect(context.comp.count).toBe(1);
        done();
      }, 21);
    });

    it('should be click go to first error element', (done: () => void) => {
      setTimeout(() => {
        expect(context.comp.count).toBe(1);
        const el = dl.query(By.css('.has-error')).nativeElement as HTMLElement;
        spyOn(el, 'scrollIntoView');
        expect(el.scrollIntoView).not.toHaveBeenCalled();
        (dl.query(By.css('error-collect'))
          .nativeElement as HTMLElement).click();
        expect(el.scrollIntoView).toHaveBeenCalled();
        done();
      }, 21);
    });
  });

  it('should be not to error element when not errores', () => {
    TestBed.overrideTemplate(
      TestComponent,
      `<form nz-form [formGroup]="validateForm"><error-collect #ec [freq]="freq"></error-collect></form>`,
    );
    getPropertiesAndCreate();
    let count = 0;
    spyOnProperty(context.comp, 'offsetTop').and.callFake(() => {
      ++count;
      return 0;
    });
    expect(count).toBe(0);
    (dl.query(By.css('error-collect')).nativeElement as HTMLElement).click();
    expect(count).toBe(0);
  });

  it('should be throw [??????????????? form ??????] if no form element', () => {
    expect(() => {
      TestBed.overrideTemplate(
        TestComponent,
        `<error-collect #ec [freq]="freq"></error-collect>`,
      )
        .createComponent(TestComponent)
        .detectChanges();
    }).toThrowError('??????????????? form ??????');
  });
});

@Component({
  template: `
    <form nz-form [formGroup]="validateForm">
        <nz-form-item>
            <nz-form-control>
                <input nz-input formControlName="email" id="email">
            </nz-form-control>
        </nz-form-item>
        <error-collect #ec [freq]="freq" [offsetTop]="offsetTop"></error-collect>
    </form>
    `,
})
class TestComponent implements OnInit {
  freq = 20;
  offsetTop = 65 + 8 * 2;
  @ViewChild('ec', {static: false}) comp: ErrorCollectComponent;
  validateForm: FormGroup;
  constructor(fb: FormBuilder) {
    this.validateForm = fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.validateForm.controls.email;
  }

  ngOnInit(): void {
    this.email.markAsDirty();
  }
}
