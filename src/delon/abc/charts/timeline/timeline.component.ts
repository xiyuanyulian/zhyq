import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
  OnChanges,
  NgZone,
  OnInit,
  TemplateRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { toNumber } from '@delon/util';

@Component({
  selector: 'g2-timeline',
  template: `
  <ng-container *ngIf="_title; else _titleTpl"><h4>{{_title}}</h4></ng-container>
  <div #container></div>
  <div #slider></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class G2TimelineComponent
  implements OnDestroy, OnChanges, OnInit, AfterViewInit {
  // region: fields

  _title = '';
  _titleTpl: TemplateRef<any>;
  @Input()
  set title(value: string | TemplateRef<any>) {
    if (value instanceof TemplateRef) {
      this._title = null;
      this._titleTpl = value;
    } else {
      this._title = value;
    }
    this.cd.detectChanges();
  }

  @Input() data: Array<{ x: Date; y1: number; y2: number; [key: string]: any }>;
  @Input() titleMap: { y1: string; y2: string };
  @Input()
  colorMap: { y1: string; y2: string } = { y1: '#1890FF', y2: '#2FC25B' };

  @Input() mask = 'HH:mm';
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top';

  @Input()
  get height() {
    return this._height;
  }
  set height(value: any) {
    this._height = toNumber(value);
  }
  private _height = 400;

  @Input() padding: number[] = [60, 20, 40, 40];

  @Input()
  get borderWidth() {
    return this._borderWidth;
  }
  set borderWidth(value: any) {
    this._borderWidth = toNumber(value);
  }
  private _borderWidth = 2;

  // endregion

  @ViewChild('container', {static: false}) node: ElementRef;
  @ViewChild('slider', {static: false}) sliderNode: ElementRef;

  chart: any;
  initFlag = false;
  slider: any;

  constructor(private cd: ChangeDetectorRef, private zone: NgZone) {}

  ngOnInit(): void {
    this.initFlag = true;
  }

  ngAfterViewInit(): void {
    this.runInstall();
  }

  private runInstall() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => this.install(), 100);
    });
  }

  install() {
    if (!this.data || (this.data && this.data.length < 1)) return;

    // clean
    this.sliderNode.nativeElement.innerHTML = '';
    this.node.nativeElement.innerHTML = '';

    const MAX = 8;
    const begin = this.data.length > MAX ? (this.data.length - MAX) / 2 : 0;

    const ds = new DataSet({
      state: {
        start: this.data[begin - 1].x,
        end: this.data[begin - 1 + MAX].x,
      },
    });
    const dv = ds.createView().source(this.data);
    dv.source(this.data).transform({
      type: 'filter',
      callback(obj) {
        const time = new Date(obj.x).getTime(); // !????????????????????????????????????????????????????????????
        return time >= ds.state.start && time <= ds.state.end;
      },
    });

    const chart = new G2.Chart({
      container: this.node.nativeElement,
      forceFit: true,
      height: +this.height,
      padding: this.padding,
    });
    chart.axis('x', { title: false });
    chart.axis('y1', {
      title: false,
    });
    chart.axis('y2', false);

    let max;
    if (this.data[0] && this.data[0].y1 && this.data[0].y2) {
      max = Math.max(
        this.data.sort((a, b) => b.y1 - a.y1)[0].y1,
        this.data.sort((a, b) => b.y2 - a.y2)[0].y2,
      );
    }
    chart.source(dv, {
      x: {
        type: 'timeCat',
        tickCount: MAX,
        mask: this.mask,
        range: [0, 1],
      },
      y1: {
        alias: this.titleMap.y1,
        max,
        min: 0,
      },
      y2: {
        alias: this.titleMap.y2,
        max,
        min: 0,
      },
    });

    chart.legend({
      position: this.position,
      custom: true,
      clickable: false,
      items: [
        { value: this.titleMap.y1, fill: this.colorMap.y1 },
        { value: this.titleMap.y2, fill: this.colorMap.y2 },
      ],
    });

    chart
      .line()
      .position('x*y1')
      .color(this.colorMap.y1)
      .size(this.borderWidth);
    chart
      .line()
      .position('x*y2')
      .color(this.colorMap.y2)
      .size(this.borderWidth);
    chart.render();

    const sliderPadding = Object.assign([], this.padding);
    sliderPadding[0] = 0;
    const slider = new Slider({
      container: this.sliderNode.nativeElement,
      height: 26,
      padding: sliderPadding,
      scales: {
        x: {
          type: 'time',
          tickCount: 16,
          mask: this.mask,
        },
      },
      backgroundChart: {
        type: 'line',
      },
      start: ds.state.start,
      end: ds.state.end,
      xAxis: 'x',
      yAxis: 'y1',
      data: this.data,
      onChange({ startValue, endValue }) {
        ds.setState('start', startValue);
        ds.setState('end', endValue);
      },
    });
    slider.render();

    this.chart = chart;
    this.slider = slider;
  }

  uninstall() {
    if (this.chart) this.chart.destroy();
    if (this.slider) this.slider.destroy();
  }

  ngOnChanges(): void {
    if (this.initFlag) this.runInstall();
  }

  ngOnDestroy(): void {
    this.uninstall();
  }
}
