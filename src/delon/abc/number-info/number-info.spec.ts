import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AdNumberInfoModule } from './number-info.module';
import { NumberInfoComponent } from './number-info.component';

describe('abc: number-info', () => {
  let fixture: ComponentFixture<TestComponent>;
  let dl: DebugElement;
  let context: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdNumberInfoModule.forRoot()],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    dl = fixture.debugElement;
    context = fixture.componentInstance;
    fixture.detectChanges();
  });

  function isText(cls: string, value: any) {
    const el = dl.query(By.css(cls)).nativeElement as HTMLElement;
    if (el) return el.innerText.trim();
    return '';
  }

  function isExists(cls: string, stauts: boolean = true) {
    if (stauts) expect(dl.query(By.css(cls))).not.toBeNull();
    else expect(dl.query(By.css(cls))).toBeNull();
  }

  describe('#title', () => {
    it('with string', () => {
      isText('.title', context.title);
    });
    it('with template', () => {
      context.title = context.titleTpl;
      fixture.detectChanges();
      isExists('#titleTpl');
    });
  });

  describe('#subTitle', () => {
    it('with string', () => {
      isText('.sub-title', context.subTitle);
    });
    it('with template', () => {
      context.subTitle = context.subTitleTpl;
      fixture.detectChanges();
      isExists('#subTitleTpl');
    });
  });

  describe('#total', () => {
    it('with string', () => {
      expect(context.total).toBe(context.comp._total);
    });
    it('with template', () => {
      context.total = context.totalTpl;
      fixture.detectChanges();
      isExists('#totalTpl');
    });
  });

  describe('#subTotal', () => {
    it('with string', () => {
      isExists('.sub-total');
    });
    it('with template', () => {
      context.subTotal = context.subTotalTpl;
      fixture.detectChanges();
      isExists('#subTotalTpl');
    });
  });

  it('should be change theme', () => {
    isExists('.light');
    context.theme = '';
    fixture.detectChanges();
    isExists('.light', false);
  });

  it('should be change gap', () => {
    context.gap = 10;
    fixture.detectChanges();
    const el = dl.query(By.css('.value')).nativeElement as HTMLElement;
    expect(+el.style.marginTop.replace('px', '')).toBe(10);
  });
});

@Component({
  template: `
    <number-info #ni
        [title]="title"
        [subTitle]="subTitle"
        [total]="total"
        [subTotal]="subTotal"
        suffix="suffix"
        [status]="status"
        [theme]="theme"
        [gap]="gap"></number-info>
    <ng-template #titleTpl><p id="titleTpl">titleTpl</p></ng-template>
    <ng-template #subTitleTpl><p id="subTitleTpl">subTitleTpl</p></ng-template>
    <ng-template #totalTpl><p id="totalTpl">totalTpl</p></ng-template>
    <ng-template #subTotalTpl><p id="subTotalTpl">subTotalTpl</p></ng-template>
    `,
})
class TestComponent {
  @ViewChild('ni', {static: false}) comp: NumberInfoComponent;
  @ViewChild('titleTpl', {static: false}) titleTpl: TemplateRef<void>;
  @ViewChild('subTitleTpl', {static: false}) subTitleTpl: TemplateRef<void>;
  @ViewChild('totalTpl', {static: false}) totalTpl: TemplateRef<void>;
  @ViewChild('subTotalTpl', {static: false}) subTotalTpl: TemplateRef<void>;
  title: string | TemplateRef<void> = 'title';
  subTitle: string | TemplateRef<void> = 'subTitle';
  total: string | TemplateRef<void> = 'total';
  subTotal: string | TemplateRef<void> = 'subTotal';
  status = 'up';
  theme = 'light';
  gap = 8;
}
