var mapObj = {};
mapObj.targetId = null;
mapObj.mapObj = null;
mapObj.zoom = 17;
mapObj.UserLocationData = null;

var CQMap = function() {

	/*
	 * 	创建地图 
	 * 	options：{
	 * 		targetId：'#map',
	 * 		UserLocationData:当前用户的位置信息，默认null
	 * 	}
	 */
	var fCreateMap = function(options) {
		mapObj.targetId = options.targetId || null;
		//		mapObj.zoom = 13; //缩放值
		mapObj.UserLocationData = options.UserLocationData; //一些地图设置参数 如图标、中心点经纬度

		if(mapObj.targetId) {
			if(mapObj.mapObj == null) {
				mapObj.mapObj = new plus.maps.Map(options.targetId);
			}
			//			mapObj.mapObj = new plus.maps.Map(mapObj.targetId);
			if(!options.UserLocationData.latitude) { //一些地图设置参数 如图标、中心点经纬度
				console.info('开始获取用户所在地点');
				fGetUserLocation(); //定位当前用户位置
			} else {
				//标记城市中心点
				var points = [];
				points.push({
					lon: options.UserLocationData.longitude,
					lin: options.UserLocationData.latitude,
					Lable: '我在这',
					Bubble: '我在这'
				});
				fShowPoints(points);
				pcenter = new plus.maps.Point(options.UserLocationData.longitude, options.UserLocationData.latitude);
				mapObj.mapObj.centerAndZoom(pcenter, mapObj.zoom);
			}
		} else {
			plus.nativeUI.toast('创建地图缺少需要的dom元素对象');
			return;
		}
	};
	/*
	 * 	显示位置点
	 * 	lon
	 * 	lin
	 * 	Icon,
	 * 	Label
	 * 	Bubble
	 */
	var fShowPoints = function(points) {

		if(!mapObj.mapObj) {
			plus.nativeUI.toast('地图对象尚未创建，请先调用fCreateMap初始化地图！');
			return
		}
		for(var i = 0; i < points.length; i++) {
			var point = new plus.maps.Point(points[i].lon, points[i].lin);
			var marker = new plus.maps.Marker(point);
			marker.setIcon(points[i].Icon || '../img/marker-icon.png');
			if(points[i].Lable)
				marker.setLabel(points[i].Lable);
			if(points[i].Bubble) {
				var bubble = new plus.maps.Bubble(points[i].Bubble);
				marker.setBubble(bubble);
			}
			mapObj.mapObj.addOverlay(marker);
		}
	};

	/*
	 * 创建一条折线
	 */
	var fShowLine = function(pointsJson) {

		if(!mapObj.mapObj) {
			plus.nativeUI.toast('地图对象尚未创建，请先调用fCreateMap初始化地图！');
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
		mapObj.mapObj.addOverlay(polylineObj);
	};

	/*
	 * 创建一个多边形对象
	 */
	var fShowGon = function(pointsJson) {

		if(!mapObj.mapObj) {
			plus.nativeUI.toast('地图对象尚未创建，请先调用fCreateMap初始化地图！');
			return
		}
		var polygonObj = null,
			points = new Array();
		for(var i = 0; i < pointsJson.length; i++) {
			points[i] = new plus.maps.Point(pointsJson[i].lon, pointsJson[i].lat);
		}
		polygonObj = new plus.maps.Polygon(points);
		mapObj.mapObj.addOverlay(polygonObj);
	};

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
	var fNavigation = function(point) {
		var dst = new plus.maps.Point(point.dstlon, point.dstlin);
		var src = new plus.maps.Point(point.srclon, point.srclin);
		plus.maps.openSysMap(dst, point.des, src); // 调用系统地图显示 
	};

	/**
	 * 	驾车路线检索
	 */
	var fDrivingLineSearch = function(points) {

		if(!mapObj.mapObj) {
			plus.nativeUI.toast('地图对象尚未创建，请先调用fCreateMap初始化地图！');
			return;
		}
		var mapObj = mapObj.mapObj;
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
	};

	/*
	 * 定位当前用户位置
	 */
	var fGetUserLocation = function() {
		if(null == mapObj.mapObj) {
			plus.nativeUI.toast('地图对象尚未创建，请先调用fCreateMap初始化地图！');
			return;
		};
		mapObj.mapObj.showUserLocation(true);
		mapObj.mapObj.getUserLocation(function(state, pos) {
			if(0 == state) {
				var points = [];
				points.push({
					lon: pos.longitude,
					lin: pos.latitude,
					Icon: null,
					Label: '我在这',
					Bubble: '我在这'
				});
				fShowPoints(points);
				pcenter = new plus.maps.Point(pos.longitude, pos.latitude);
				mapObj.mapObj.centerAndZoom(pcenter, mapObj.zoom);

				mapObj.UserLocationData.longitude = pos.longitude;
				mapObj.UserLocationData.latitude = pos.latitude;
			}
		});
	};

	/*
	 * 	重置地图
	 */
	var fResetMap = function(mapObj) {
		mapObj.reset();
	};

	/*
	 * 	@description 城市中关键词搜索 并显示在地图上
	 */
	var fSearchAndShowOnMap = function(city, key, callback) {

		var address = null;
		if(!mapObj.mapObj) {
			plus.nativeUI.toast('地图对象尚未创建，请先调用fCreateMap初始化地图！');
			return;
		}
		var searchObj = new plus.maps.Search(mapObj.mapObj);
		searchObj.poiSearchInCity(city, key);
		searchObj.onPoiSearchComplete = function(state, result) {
			console.log("onPoiSearchComplete: " + state + " , " + result.currentNumber);
			if(state == 0) {
				if(result.currentNumber <= 0) {
					mui.alert("没有检索到结果");
				}

				//				for(var i = 0; i < result.currentNumber; i++) { // 将检索到的第一条信息作为标点添加到地图中
				//					var pos = result.getPosition(0);
				//					address = pos.address;
				//					var marker = new plus.maps.Marker(pos.point);
				//					mapObj.mapObj.setCenter(pos.point);
				//					marker.setLabel(pos.name);
				//					mapObj.mapObj.addOverlay(marker);
				//					break;
				//				}
				return callback(result);

			} else {
				mui.alert("检索失败");
			}
		}
	};
	/*
	 * 	@description 搜索指定 point的周边
	 */
	var fSearchSearchNearBy = function(key, pt, radius, callback) {

		var address = null;
		if(!mapObj.mapObj) {
			plus.nativeUI.toast('地图对象尚未创建，请先调用fCreateMap初始化地图！');
			return;
		}
		var searchObj = new plus.maps.Search(mapObj.mapObj);
		searchObj.setPageCapacity(15);
		searchObj.poiSearchNearBy(key, pt, radius || 5000);
		searchObj.onPoiSearchComplete = function(state, result) {
//			console.log("onPoiSearchComplete: " + state + " , " + result.currentNumber);
			if(state == 0) {
				if(result.currentNumber <= 0) {
					mui.alert("没有检索到结果");
				}

				//				for(var i = 0; i < result.currentNumber; i++) { // 将检索到的第一条信息作为标点添加到地图中
				//					var pos = result.getPosition(0);
				//					address = pos.address;
				//					var marker = new plus.maps.Marker(pos.point);
				//					mapObj.mapObj.setCenter(pos.point);
				//					marker.setLabel(pos.name);
				//					mapObj.mapObj.addOverlay(marker);
				//					break;
				//				}
				return callback(result);

			} else {
				mui.alert("检索失败");
			}
		}
	};

	return {
		fCreateMap: function(options) {
			return fCreateMap(options);
		},
		fShowPoints: function(points) {
			return fShowPoints(points);
		},
		fShowLine: function(pointsJson) {
			return fShowLine(pointsJson);
		},
		fShowGon: function(pointsJson) {
			return fShowGon(pointsJson);
		},
		fNavigation: function(point) {
			return fNavigation(point);
		},
		fDrivingLineSearch: function(points) {
			return fDrivingLineSearch(points);
		},
		fGetUserLocation: function() {
			return fGetUserLocation();
		},
		fSearchAndShowOnMap: function(city, key, callback) {
			return fSearchAndShowOnMap(city, key, callback);
		},
		fResetMap: function(mapObj) {
			return fResetMap(mapObj);
		},
		fSearchSearchNearBy: function(key, pt, radius, callback) {
			return fSearchSearchNearBy(key, pt, radius, callback);
		}
	};
};