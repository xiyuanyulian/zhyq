---
order: 2
title: 迷你区域图
---

基础区域图。

```ts
import { Component, OnInit } from '@angular/core';
import * as format from 'date-fns/format';

@Component({
  selector: 'app-demo',
  template: `
  <g2-mini-area line color="#cceafe" height="45" [data]="visitData"></g2-mini-area>
  `
})
export class DemoComponent implements OnInit {
    visitData: any[] = [];
    ngOnInit(): void {
        const beginDay = new Date().getTime();
        for (let i = 0; i < 20; i += 1) {
            this.visitData.push({
                x: format(new Date(beginDay + (1000 * 60 * 60 * 24 * i)), 'yyyy-MM-dd'),
                y: Math.floor(Math.random() * 100) + 10,
            });
        }
    }
}
```
