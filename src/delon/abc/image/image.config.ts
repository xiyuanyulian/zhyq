import { Injectable } from '@angular/core';

@Injectable()
export class AdImageConfig {
  /**
   * 默认大小，默认值：`64`，单位：px
   */
  size = 64;

  /**
   * 错误图片
   */
  error = './assets/img/logo.svg';
}
