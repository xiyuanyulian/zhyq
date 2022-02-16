import { Injectable } from '@angular/core';

@Injectable()
export class AdPageHeaderConfig {
  /**
   * 首页文本，若指定空表示不显示
   */
  home = '首页';
  /**
   * 首页链接
   */
  home_link = '/';
  /**
   * 首页链接国际化参数
   */
  home_i18n?: string;
  /**
   * 自动生成导航，以当前路由从主菜单中定位
   */
  autoBreadcrumb = true;
  /**
   * 自动生成标题，以当前路由从主菜单中定位
   */
  autoTitle = true;
  /**
   * 是否自动将标准信息同步至 `TitleService`、`ReuseService` 下
   */
  titleSync = false;
}
