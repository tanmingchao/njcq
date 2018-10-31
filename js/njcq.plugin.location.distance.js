function Distance() {

}

/**
 * 	计算坐标距离
 * @param {Object} latitude1 当前用户坐标
 * @param {Object} longitude1 当前用户坐标
 * @param {Object} latitude2 表中数据坐标
 * @param {Object} longitude2 表中数据坐标
 */
Distance.prototype.fGetDistance = function(latitude1, longitude1, latitude2, longitude2) {
	// R is the radius of the earth in kilometers  
	if(!latitude1 && latitude1.length == 0 || !latitude2) {
		return '无地理信息';
	}
	var R = 6371;
	var deltaLatitude = toRadians(latitude2 - latitude1);
	var deltaLongitude = toRadians(longitude2 - longitude1);
	latitude1 = toRadians(latitude1);
	latitude2 = toRadians(latitude2);
	var a = Math.sin(deltaLatitude / 2) *
		Math.sin(deltaLatitude / 2) +
		Math.cos(latitude1) *
		Math.cos(latitude2) *
		Math.sin(deltaLongitude / 2) *
		Math.sin(deltaLongitude / 2);
	var c = 2 * Math.atan2(Math.sqrt(a),
		Math.sqrt(1 - a));
	var d = R * c;
	return '<' + parseFloat(d / 1000).toFixed(2) + 'km';
};

var toRadians = function(degree) {
	return degree * Math.PI / 180;
};