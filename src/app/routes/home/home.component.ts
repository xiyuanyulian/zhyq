import { Component, OnInit, DoCheck } from '@angular/core';
import { ModalHelper, SettingsService, _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import gql from 'graphql-tag';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@core';
import { ROLES } from '@core/acl/interface';

@Component({
  selector: 'roie-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class RoieHomeComponent implements OnInit, DoCheck {
  ngDoCheck() {
    const code = this.route.snapshot.queryParams.code;
    this.authService.closeCode.emit(true);
    if (!!code && !this.hasDone) {
      this.hasDone = true;
      this.authService.bindWeChat({ uid: this.user['uid'], code: code }).subscribe(res => {
        if (res['code'] === 0) {
          this.msg.success('绑定成功！', { nzDuration: 3000 });
        } else {
          this.msg.error('绑定失败，请重试!', { nzDuration: 3000 });
        }
      });
    }
  }

  user: any = {};
  isInspector = false;
  canCreate = true;
  group: any = {
    team_num: 0,
    activity_num: 0
  };
  value;
  canAdd = true;

  checkUsers: any = [];
  userStat: any = {};
  subscribe: Subscription;
  hasDone = false; // 是否已执行微信code的获取使用

  constructor(
    public http: _HttpClient,
    private apollo: Apollo,
    private title: Title,
    private titleService: TitleService,
    private setting: SettingsService,
    public msg: NzMessageService,
    private modalHelper: ModalHelper,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.title.setTitle('个人首页' + ' - ' + this.titleService.appName);
    this.user = this.setting.user;
  }

  isVisible = false;
  handleCancel() {
    this.isVisible = false;
  }

  showModal() {
    this.isVisible = true;
  }

  fresh_num = 1;
  websocket = null;
  refresh() {
    const _this = this;
    if ('WebSocket' in window) {
      const host = location.host;
      const protocol = location.protocol;
      let wsprotocol = 'ws://';
      if (protocol === 'https:') {
        wsprotocol = 'wss://';
      }
      this.websocket = new WebSocket(wsprotocol + host + '/api/websocket/home/' + this.user.uid);
    }
    // 连接发生错误的回调方法

    this.websocket.onerror = function () {
      console.log('error');
    };

    // 连接成功建立的回调方法

    this.websocket.onopen = function () {
      _this.websocket.send('连接成功！');
    };

    // 接收到消息的回调方法

    this.websocket.onmessage = function (event) {
      // let data = event.data;
      // data = JSON.parse(data);
      // _this.s4.total = data.total;
      // _this.userLog = data.list;
      if (event.data === 'load') {
        _this.fresh_num += 1;
        // _this.loadUserLog(true);
      }
    };

    // 连接关闭的回调方法

    this.websocket.onclose = function () {
      _this.websocket.send('close');
    };

    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。

    window.onbeforeunload = function () {

      _this.websocket.close();

    };
  }

}