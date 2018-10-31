/**
 * 谷歌定位
 */

var geomap = function(options) {
	this.watchId = options.watchId;
	this.callback = options.callback;

	/**
	 * 	谷歌定位
	 * @param {Object} callback object 为position
	 * {"coordsType":"gcj02","address":{"street":"百润路","cityCode":"025","province":"江苏省","district":"浦口区","poiName":"汇川教育","streetNum":"8号23","city":"南京市","country":"中国"},"addresses":"江苏省南京市浦口区百润路靠近汇川教育","coords":{"latitude":32.156304,"longitude":118.736409,"accuracy":29,"altitude":0,"heading":null,"speed":0,"altitudeAccuracy":0},"timestamp":1496126642809}
	 */
	geomap.prototype.getPos = function() {
		var self = this;
		plus.geolocation.getCurrentPosition(function(position) {
			return self.callback(position);
		}, function(e) {
			console.info('获取位置信息失败：' + e.message);
		}, {
			geocode: true, //是否解析地址信息address
			enableHighAccuracy: true //是否高精度获取位置信息，需要耗费更多资源和响应时间
		});
	};
	/**
	 * 	监听位置变化 返回结果 同 getPos
	 * 		注：使用监听时候，返回的只是 geo的wgs84(gps)定位类型，以及定位坐标
	 * 	如：{"coordsType":"wgs84","coords":{"latitude":32.15813301912046,"longitude":118.7314226301498,"accuracy":65,"altitude":22.27260780334473,"heading":null,"speed":null,"altitudeAccuracy":10},"timestamp":1495530403438.879}
	 * 	无法获得address地址信息，需要通过坐标 逆地理解析
	 * @param {Object} callback
	 */
	geomap.prototype.watchPos = function() {
		var self = this;
		if(self.watchId) {
			return;
		}
		self.watchId = plus.geolocation.watchPosition(function(p) {
			outSet("监听位置变化信息:");
			self.callback(p);
		}, function(e) {
			console.info('监听位置变化信息失败：' + e.message);
		}, {
			geocode: false
		});
	};
	geomap.prototype.clearWatch = function() {
		var self = this;
		if(self.watchId) {
			outSet("停止监听位置变化信息");
			plus.geolocation.clearWatch(self.watchId);
			self.watchId = null;
		}
	};

};

//
//var geoMap = function() {
//	//用于监听位置变化 标识
//	var watchId;
//	/**
//	 * 	谷歌定位
//	 * @param {Object} callback object 为position
//	 */
//	getPos: function(callback) {
//			plus.geolocation.getCurrentPosition(function(position) {
//				return callback(position);
//			}, function(e) {
//				outSet("获取位置信息失败：" + e.message);
//			}, {
//				geocode: false
//			});
//		},
//		/**
//		 * 	监听位置变化 返回结果 同 getPos
//		 * 		注：使用监听时候，返回的只是 geo的wgs84(gps)定位类型，以及定位坐标
//		 * 	如：{"coordsType":"wgs84","coords":{"latitude":32.15813301912046,"longitude":118.7314226301498,"accuracy":65,"altitude":22.27260780334473,"heading":null,"speed":null,"altitudeAccuracy":10},"timestamp":1495530403438.879}
//		 * 	无法获得address地址信息，需要通过坐标 逆地理解析
//		 * @param {Object} callback
//		 */
//		watchPos: function(callback) {
//			if(watchId) {
//				return;
//			}
//			watchId = plus.geolocation.watchPosition(function(p) {
//				outSet("监听位置变化信息:");
//				callback(p);
//			}, function(e) {
//				outSet("监听位置变化信息失败：" + e.message);
//			}, {
//				geocode: false
//			});
//		},
//		/**
//		 * 	清除位置变化监听
//		 */
//		clearWatch: function(callback) {
//			if(watchId) {
//				outSet("停止监听位置变化信息");
//				plus.geolocation.clearWatch(watchId);
//				watchId = null;
//			}
//		}
//
//}