import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

import { environment } from '../../environments/environment';
import { _HttpClient, SettingsService } from '@delon/theme';


@Injectable()
export class FileUploadService {
  private apiEndpoint = environment.apiEndpoint;
  private baseUrl = this.apiEndpoint + 'api/file-upload';
  private configUrl = this.apiEndpoint + 'api/url_fetch';
  private render: Renderer2;

  constructor(
    public http: _HttpClient,
    private settings: SettingsService,
    private renderFactory: RendererFactory2
  ) {
    this.render = renderFactory.createRenderer(null, null);
  }

  getFileList(masterId: string): Observable<any[]> {
    const url = `${this.baseUrl}/getFileList/${masterId}`;
    return this.http.get(url);
  }

  insertFileList(fileList: any, masterId: String, moduleName?: string): Observable<any> {
    const url = `${this.baseUrl}/insertFileList/${masterId}`;
    return this.http.post(url, { fileList, moduleName });
  }

  delete(fileUpload: any): Observable<any> {
    const url = `${this.baseUrl}/${fileUpload.id}`;
    return this.http.delete(url, fileUpload);
  }

  deleteAll(fileUpload: any): Observable<any> {
    const url = `${this.baseUrl}/delFile/deleteAll`;
    return this.http.delete(url, fileUpload);
  }

  getCofig(): any {
    this.http.get(`${this.configUrl}`).subscribe((res) => {
      const baseConfig: any = res;
      if (baseConfig && baseConfig.data) {
        this.settings.setCosConfig(baseConfig.data);
      }
    });
  }

  handleImageList(imgList, param = 60, modal = 'quality'): Array<object> {
    const resultList = [];
    imgList.forEach(element => {
      element.url = this.handleImageUrl(element.url, param, modal);
      resultList.push(element);
    });
    return resultList;
  }

  /**
     * @param url //被处理的图片的url
     * @param modal // 图片处理模式，目前只做了三种：1、quality（质量变换） 2、thumbnail（缩放）3、cut(普通裁剪)
     * @param param //相关模式需要带的参数，详情参考https://cloud.tencent.com/document/product/436/44884
     */
  handleImageUrl(url, param = 60, modal = 'quality'): string {
    let cosParam: any = this.settings.getCosConfig();
    cosParam = Object.assign(cosParam, { domain: 'myqcloud' });
    if (url.indexOf('oss_file_upload/getFile') !== -1) {
      let result = '';
      if (cosParam.uploadprovider === 'tencent') {
        url = url.slice(url.indexOf('path=') + 5, url.indexOf('&name='));
        result = `http://${cosParam.bucket}.cos.${cosParam.region}.${cosParam.domain}.com/${url}?imageMogr2/${modal}/${param}`;
      } else {
        result = url;
      }
      return result;
    } else {
      return url;
    }
  }

  // 导出数据--表格列名数据设置
  formatData(excxlData, xlsxName, tableName): void {
    excxlData.unshift(tableName);
    const sheet = XLSX.utils.aoa_to_sheet(excxlData);
    sheet['!merges'] = [];
    excxlData.forEach((e, index) => {
      const content: any = [];
      for (let i = 0; i < tableName.length; i++) {
        content.push({
          s: {
            c: i,
            r: index
          },
          e: {
            c: i,
            r: index
          }
        });
      }
      sheet['!merges'].concat(content);
    });
    this.openDownloadDialog(this.sheet2blob(sheet, 'sheet1'), xlsxName);
  }
  // 导出数据--表格下载
  openDownloadDialog(url, xlsxName): void {
    if (typeof url === 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url); // 创建blob地址
    }
    const aLink = this.render.createElement('a');
    this.render.setAttribute(aLink, 'href', url);
    this.render.setAttribute(aLink, 'download', xlsxName); // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    aLink.click();
    this.render.destroy();
    // 释放URL地址
    URL.revokeObjectURL(url);
  }
  // 导出数据--表格转化数据流
  sheet2blob(sheet, sheetName): Blob {
    sheetName = sheetName || 'sheet1';
    const workbook = {
      SheetNames: [sheetName],
      Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    // 字符串转ArrayBuffer
    function s2ab(s): ArrayBuffer {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    return blob;
  }
}
