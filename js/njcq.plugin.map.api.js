function MapUtil() {
	var map = null;
	var geolocation = null;
	var geocoder = null;
	var inputId = null;
}

/**
 * 创建或者获取
 */
MapUtil.prototype.m = function(containerId, lng, lat, markTitle) {
	if(this.map == null) {
		this.map = new AMap.Map(containerId, {
			resizeEnable: true,
			zoom: 16, //地图显示的缩放级别
			keyboardEnable: false
		});
		if(lng && lat) {
			this.map.setCenter([lng, lat]);
			new AMap.Marker({
				map: this.map,
				position: [lng, lat],
				//				icon: 'http://vdata.amap.com/icons/b18/1/2.png',
				title: markTitle
			});
		}
	}
	return this.map;
}

/**
 * 绑定输入提示的input标签
 */
MapUtil.prototype.bindSearchInput = function(keywords, city, callback) {
	if(this.map == null) {
		return false;
	}
	//	AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function() {
	//		var autoOptions = {
	//			input: inputId //使用联想输入的input的id
	//		};
	//		autocomplete = new AMap.Autocomplete(autoOptions);
	//		var placeSearch = new AMap.PlaceSearch({
	//			city: '',
	//			map: this.map
	//		})
	//		AMap.event.addListener(autocomplete, "select", function(e) {
	//			//TODO 针对选中的poi实现自己的功能
	//			var lat = e.poi.location.lat;
	//			var lng = e.poi.location.lng;
	//			this.markPoint(lng, lat);
	//		});
	//	});

	AMap.plugin(['AMap.Autocomplete'], function() {
		var autoOptions = {
			pageIndex: 1,
			pageSize: 30,
			city: city || '', //默认全国
		};
		autocomplete = new AMap.Autocomplete(autoOptions);
		AMap.event.addListener(autocomplete, "complete", function(e) {
			//TODO 针对选中的poi实现自己的功能
			return callback(e);
		});
		autocomplete.search(keywords);

	});
}

/**
 * 设置地图标记,并重新指定地图中心
 */
MapUtil.prototype.markPoint = function(lng, lat, name, isCenter) {
	if(this.map == null) {
		return false;
	}
	//清除之前的Marker
	this.map.clearMap();
	// 设置缩放级别和中心点
	if(isCenter || isCenter === undefined) {
		this.map.setCenter([lng, lat]);
	}
	var marker = new AMap.Marker({
		map: this.map,
		position: [lng, lat],
		title: name || ''
	});

}

/**
 * 绑定鼠标点击事件，获取点击的经纬度并且Mark
 */
MapUtil.prototype.bindClickEvent = function() {
	if(this.map == null) {
		return false;
	}
	return this.map.on('click', function(e) {
		var lat = e.lnglat.getLat();
		var lng = e.lnglat.getLng();
		this.markPoint(lng, lat, false);
		return this.address(e.lnglat);
	})
}

/** 
 * 定位到当前所在位置,浏览器定位会出现定位不准确问题
 */
MapUtil.prototype.locate = function() {
	if(this.map == null) {
		return false;
	}
	return this.map.plugin('AMap.Geolocation', function() {
		if(this.geolocation == null) {
			this.geolocation = new AMap.Geolocation({
				enableHighAccuracy: true, //是否使用高精度定位，默认:true
				timeout: 10000, //超过10秒后停止定位，默认：无穷大
				buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				buttonPosition: 'RB'
			});
		}

		this.map.addControl(this.geolocation);
		this.geolocation.getCurrentPosition();
		//返回定位信息
		AMap.event.addListener(this.geolocation, 'complete', function(data) {
			this.markPoint(data.position.getLng(), data.position.getLat())
			return this.address(data.position);
		});
		//返回定位出错信息
		AMap.event.addListener(this.geolocation, 'error', function(data) {
			console.log("定位失败");
			return false;
		});
	});
}

/**
 * 根据经纬度获取地址
 */
MapUtil.prototype.address = function(lnglat,callback) {
	var self = this;
	if(!lnglat) {
		return false;
	}
	if(self.geocoder == null) {
		AMap.service('AMap.Geocoder', function() {
			self.geocoder = new AMap.Geocoder({});
		});
	}

	return self.geocoder.getAddress(lnglat, function(status, result) {
		if(status == 'complete') {
			//如果有绑定input标签，那么设置input标签的内容
//			var address = result.regeocode.formattedAddress;
			return callback(result);
		} else {
			return callback(null);
		}
	})

}

MapUtil.prototype.fSearchNearByKeyAndType = function(key, type, cityCode, long, lat, callback) {
	if(this.map == null) {
		return false;
	}
	AMap.plugin(['AMap.PlaceSearch'], function() {
		var placeSearch = new AMap.PlaceSearch({
			pageSize: 25
		});
		if(type)
			placeSearch.setType(type);
		if(cityCode)
			placeSearch.setCity(cityCode);

		placeSearch.searchNearBy(key || "", [long, lat], 5000, function(status, result) {
			if(status === 'complete' && result.info === 'OK') {
				return callback(result);
			}
		});

	});
}