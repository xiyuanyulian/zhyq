import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
declare const qq: any;

@Component({
    selector: 'vol-tenctent-map',
    styleUrls: ['./tenctent.map.component.less'],
    templateUrl: './tenctent.map.component.html'
})
export class TenctentMapComponent implements OnInit {

    constructor(
        private subject: NzModalRef
    ) { }

    address;
    map: any;
    geocoder: any;
    citylocation: any;
    info: any;
    marker: any;
    newAddress;
    ngOnInit() {
        this.newAddress = this.address;
        setTimeout(() => {
            const _this = this;
            this.map = new qq.maps.Map(document.getElementById('container'), {
                center: new qq.maps.LatLng(39.916527, 116.397128),
                zoom: 13
            });
            // 获取城市列表接口设置中心点
            this.citylocation = new qq.maps.CityService({
                complete: function (result) {
                    _this.map.setCenter(result.detail.latLng);
                }
            });
            this.info = new qq.maps.InfoWindow({map: this.map});
            // 调用searchLocalCity();方法    根据用户IP查询城市信息。
            this.citylocation.searchLocalCity();
            // 绑定单击事件添加参数
            qq.maps.event.addListener(this.map, 'click', function (event) {
                if (!!_this.marker) _this.marker.setMap(null);
                const latLng = new qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng());
                // 调用获取位置方法
                _this.geocoder.getAddress(latLng);
            });
            this.geocoder = new qq.maps.Geocoder({
                complete: function (result) {
                    // _this.close(result.detail.address);
                    _this.newAddress = result.detail.address;
                    _this.map.setCenter(result.detail.location);
                    _this.marker = new qq.maps.Marker({
                        map: _this.map,
                        position: result.detail.location
                    });
                    _this.info.open();
                    _this.info.setContent('<div style="width:280px;height:70px;">' +
                        '<p>' + result.detail.address + '</p>' +
                        '<p></p>' +
                        '</div>');
                    _this.info.setPosition(result.detail.location);
                }
            });
            if (!!this.address && !!this.geocoder) {
                this.geocoder.getLocation(this.address);
            }
        }, 1000);
    }

    confirm() {
        this.close(this.newAddress);
    }

    cancle() {
        this.close(this.address);
    }

    codeAddress() {
        this.geocoder.getLocation(this.newAddress);
    }

    close(result?) {
        this.subject.destroy(result);
    }

}
