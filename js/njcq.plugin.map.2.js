/**
 * 地图插件
 */
;
(function($, window, document, undefined) {

	var CQMap = function(options) {
		//判断是用函数创建还是用new创建，这样
		if(!(this instanceof CQMap)) return new CQMap(options);

		//合并参数
		if(!options.targetId) {
			var mapTag = document.createElement("div");
			mapTag.setAttribute("id", "choose-location");
			options.targetId = mapTag;
		}
		this.mapObj = null;
		this.options = this.extend({
			targetId: mapTag,
			UserLocationData: {}
		}, options);

		//初始化
		this.fInitMap();
	};

	CQMap.prototype = {
		/*
		 * 	创建地图 
		 * 	options：{
		 * 		targetId：'#map',
		 * 		UserLocationData:当前用户的位置信息，默认null
		 * 	}
		 */
		fInitMap: function() {
			alert('执行initMap方法');
			var self = this;
//			self.options = $.extend(true, {}, options);
			console.info('这是self.options');
			console.info(JSON.stringify(self.options));
			if(self.options.targetId) {
				//创建地图
				self.mapObj = new plus.maps.Map(self.options.targetId);
				if(!self.options.UserLocationData) { //一些地图设置参数 如图标、中心点经纬度
					self.fGetUserLocation(); //定位当前用户位置
				} else {
					//标记城市中心点
					var pcenter = new plus.maps.Point(self.options.UserLocationData.pcenter_long, self.options.UserLocationData.pcenter_lin);
					var marker = new plus.maps.Marker(pcenter);
					marker.setIcon(self.options.UserLocationData.Icon);
					marker.setLabel(self.options.UserLocationData.Lable);
					var bubble = new plus.maps.Bubble(self.options.UserLocationData.Bubble);
					marker.setBubble(bubble);
					self.mapObj.addOverlay(marker);
					self.mapObj.centerAndZoom(pcenter, data.zoom || self.zoom);
					return self;
				}
			} else {
				plus.nativeUI.toast('创建地图缺少需要的dom元素对象');
				return;
			}
		},
		/*
		 * 	显示位置点
		 */
		fShowPoints: function(points) {
			var self = this;
			if(!self.mapObj) {
				plus.nativeUI.toast('地图对象尚未创建，请先调用fInitMap初始化地图！');
				return
			}
			for(var i = 0; i < points.length; i++) {
				var point = new plus.maps.Point(points[i].lon, points[i].lin);
				var marker = new plus.maps.Marker(point);
				marker.setIcon(points[i].Icon);
				marker.setLabel(points[i].Lable);
				var bubble = new plus.maps.Bubble(points[i].Bubble);
				marker.setBubble(bubble);
				self.mapObj.addOverlay(marker);
			}
			return self;
		},

		/*
		 * 创建一条折线
		 */
		fShowLine: function(pointsJson) {
			var self = this;
			if(!self.mapObj) {
				plus.nativeUI.toast('地图对象尚未创建，请先调用fInitMap初始化地图！');
				return
			}
			var polylineObj = null,
				points = new Array();
			for(var i = 0; i < pointsJson.length; i++) {
				points[i] = new plus.maps.Point(pointsJson[i].lon, pointsJson[i].lin);
			}
			polylineObj = new plus.maps.Polyline(points);
			polylineObj.setStrokeOpacity(0.6); // 设置折线为半透明
			polylineObj.setLineWidth(5); // 设置折线宽度
			console.log(JSON.stringify(polylineObj));
			self.mapObj.addOverlay(polylineObj);
			return self;
		},

		/*
		 * 创建一个多边形对象
		 */
		fShowGon: function(pointsJson) {
			var self = this;
			if(!self.mapObj) {
				plus.nativeUI.toast('地图对象尚未创建，请先调用fInitMap初始化地图！');
				return
			}
			var polygonObj = null,
				points = new Array();
			for(var i = 0; i < pointsJson.length; i++) {
				points[i] = new plus.maps.Point(pointsJson[i].lon, pointsJson[i].lat);
			}
			polygonObj = new plus.maps.Polygon(points);
			self.mapObj.addOverlay(polygonObj);
			return self;
		},

		/*
		 * 	导航  调用第三方
		 * 	var point = {
				"des": "导航描述",
				"dstlon": 116.39131928,
				"dstlin": 39.90793074,
				"srclon": 116.335,
				"srclin": 39.966
			};
		 */
		fNavigation: function(point) {
			var dst = new plus.maps.Point(point.dstlon, point.dstlin);
			var src = new plus.maps.Point(point.srclon, point.srclin);
			plus.maps.openSysMap(dst, point.des, src); // 调用系统地图显示 
			return self;
		},

		/**
		 * 	驾车路线检索
		 */
		fDrivingLineSearch: function(points) {
			var self = this;
			if(!self.mapObj) {
				plus.nativeUI.toast('地图对象尚未创建，请先调用fInitMap初始化地图！');
				return;
			}
			var mapObj = self.mapObj;
			var searchObj = new plus.maps.Search(mapObj);
			var startP = new plus.maps.Point(points.startLon, points.startLat);
			var endP = new plus.maps.Point(points.endLon, points.endLat);
			var startC = points.startCity,
				endC = points.endCity;
			searchObj.onRouteSearchComplete = function(state, result) {
				console.log("onRouteSearchComplete: " + state + " , " + result.routeNumber);
				if(state == 0) {
					if(result.routeNumber <= 0) {
						alert("没有检索到结果");
					}
					for(var i = 0; i < result.routeNumber; i++) {
						if(i == 1) {
							mapObj.addOverlay(result.getRoute(i));
							console.log(result.getRoute(i).distance);
							return;
						}
					}
				} else {
					alert("检索失败");
				}
			}
			searchObj.setDrivingPolicy(plus.maps.SearchPolicy.DRIVING_DIS_FIRST); //驾车策略  距离最短
			searchObj.drivingSearch(startP, startC, endP, endC);
			return self;
		},

		/*
		 * 定位当前用户位置
		 */
		fGetUserLocation: function() {
			var self = this;
			if(null == self.mapObj) {
				plus.nativeUI.toast('地图对象尚未创建，请先调用fInitMap初始化地图！');
				return;
			};
			self.mapObj.showUserLocation(true);
			self.mapObj.getUserLocation(function(state, pos) {
				if(0 == state) {
					self.mapObj.setZoom(self.zoom);
					self.mapObj.setCenter(pos);
					self.UserLocationData = pos;
					return self;
				}
			});
		},
		/*
		 * 	重置地图
		 */
		fResetMap: function(mapObj) {
			mapObj.reset();
		},

		/*
		 * 	@description 城市中关键词搜索 并显示在地图上
		 */
		fSearchAndShowOnMap: function(city, key) {
			var self = this;
			var address = null;
			if(!self.mapObj) {
				plus.nativeUI.toast('地图对象尚未创建，请先调用fInitMap初始化地图！');
				return;
			}
			var searchObj = new plus.maps.Search(self.mapObj);
			console.log("search.." + searchObj);
			searchObj.poiSearchInCity(city, key);
			searchObj.onPoiSearchComplete = function(state, result) {
				console.log("onPoiSearchComplete: " + state + " , " + result.currentNumber);
				if(state == 0) {
					if(result.currentNumber <= 0) {
						mui.alert("没有检索到结果");
					}
					for(var i = 0; i < result.currentNumber; i++) { // 将检索到的第一条信息作为标点添加到地图中
						var pos = result.getPosition(0);
						console.log(JSON.stringify(pos.address));
						address = pos.address;
						var marker = new plus.maps.Marker(pos.point);
						self.mapObj.setCenter(pos.point);
						marker.setLabel(pos.name);
						self.mapObj.addOverlay(marker);
						break;
					}
					return self;
				} else {
					mui.alert("检索失败");
				}
			}
		}
	};

	//注册到 mui中
	$.CQMap = $.Class.extend(new CQMap);
})(mui, window, document);