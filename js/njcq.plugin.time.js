/**
 * 	时间格式转换
 */
function Formatter() {

}

/**
 * 	将当前时间转换成 X月前 X天前  X小时前，X分钟前
 * @param {Object} timestamp 时间戳，如果不是时间戳，需要先调用 下面的 fGetTimestampFormDateTime方法
 */
Formatter.prototype.fGetFromatterChatTime = function(yyyyMMddHHmmssTime) {
	var timestamp = Date.parse(yyyyMMddHHmmssTime.replace(/-/gi, "/"));

	var time = new Date(timestamp);
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();

	//当前时间（时间戳）
	var now = new Date().getTime();
	var now_time = new Date(now);
	if(now_time.getDate() == d) {
		return add0(h) + ':' + add0(mm);
	} else if(now_time.getDate() - d == 1) {
		return '昨天';
	} else if(now_time.getDate() - d == 2) {
		return '前天';
	} else {
		var diffValue = timestamp - now;
		if(diffValue < 0) {
			return;
		}
		var result = '';
		var monthC = diffValue / month;
		var weekC = diffValue / (7 * day);
		var dayC = diffValue / day;
		var hourC = diffValue / hour;
		var minC = diffValue / minute;
		var secondC = diffValue / second;

		if(monthC >= 1) {
			result = "" + parseInt(monthC) + "月前";
		} else if(weekC >= 1) {
			result = "" + parseInt(weekC) + "周前";
		} else if(dayC >= 1) {
			result = "" + parseInt(dayC) + "天前";
		}
		return result;
	}

};

function add0(m) {
	return m < 10 ? '0' + m : m
}
/**
 * 	将当前时间转换成 X月前 X天前  X小时前，X分钟前
 * @param {Object} timestamp 时间戳，如果不是时间戳，需要先调用 下面的 fGetTimestampFormDateTime方法
 */
Formatter.prototype.fGetFormatterTimeStr = function(timestamp) {
	var second = 1000; //1000毫秒等于1秒
	var minute = second * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - timestamp;
	if(diffValue < 0) {
		return;
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	var secondC = diffValue / second;

	if(monthC >= 1) {
		result = "" + parseInt(monthC) + "月前";
	} else if(weekC >= 1) {
		result = "" + parseInt(weekC) + "周前";
	} else if(dayC >= 1) {
		result = "" + parseInt(dayC) + "天前";
	} else if(hourC >= 1) {
		result = "" + parseInt(hourC) + "小时前";
	} else if(minC >= 1) {
		result = "" + parseInt(minC) + "分钟前";
	} else if(secondC >= 1)
		result = "" + parseInt(secondC) + "秒前";
	return result;
};

/**
 * 	将时间转换成时间戳
 * @param {Object} yyyyMMddHHmmss格式时间
 */
Formatter.prototype.fGetTimestampFormDateTime = function(yyyyMMddHHmmss) {
	return Date.parse(yyyyMMddHHmmss.replace(/-/gi, "/"));
};

/**
 * 时间大小对比,开始时间>=结束时间 返回false,否则返回true
 * @param {Object} beginTime
 * @param {Object} endTime
 */
Formatter.prototype.compareTo = function(beginTime, endTime) {
	var d1 = new Date(beginTime.replace(/\-/g, "\/"));
	var d2 = new Date(endTime.replace(/\-/g, "\/"));

	if(beginDate != "" && endDate != "" && d1 >= d2) {
		return false;
	}
	return true;
};
/**
 * 	输入时间与当前时间大小比较 是否大于当前时间 
 * 如果>返回false,如果不大于返回 true
 * @param {Object} time
 */
Formatter.prototype.compareToCurrent = function(time) {
	var d1 = new Date(time.replace(/\-/g, "\/"));
	var d2 = new Date(getNowFormatDate().replace(/\-/g, "\/"));

	if(d1 >= d2) {
		return false;
	}
	return true;
};

/**
 * 	获取当前时间 格式：yyyy-MM-dd HH:MM:SS
 */
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;
}

Formatter.prototype.fnGetNow = function() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;
};