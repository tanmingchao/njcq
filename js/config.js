/**
 * 环信配置
 */
var hxConfig = {};
hxConfig.conn = null;
hxConfig.userInfo = null;

/**
 * 	API配置文件
 */
var host = {};
host.ip = '接口对应的IP地址';
host.api = "接口地址";
host.resource = "资源地址";

//var apiHost = "http://localhost:61388/api";
var config = function() {

	return {
		fGet: function(options) {

			var link = options.link;
			var success = function(res, d) {
				return options.callback(res);
			}
			var error = function(xhr, type, errorThrown) {
				console.info(errorThrown);
				return options.callback(type);
			}

			mui.ajax(
				host.api + link, {
					dataType: 'json',
					type: 'get',
					timeout: 20000,
					headers: {
						'Content-Type': 'application/json'
					},
					success: success,
					error: error
				});
		},
		fPost: function(options) {
			var link = options.link;
			var success = function(res) {
				return options.callback(res);
			}
			var error = function(xhr, type, errorThrown) {
				console.info(errorThrown);
				//				plus.nativeUI.closeWaiting();
				plus.nativeUI.toast('请求超时，请稍后再试！');
				return options.callback(type);
			}
			//			mui.post(apiHost + link, options.params, success, 'json');
			mui.ajax(host.api + link, {
				data: options.params,
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 20000, //超时时间设置为10秒；
				headers: {
					'Content-Type': options.contextType || 'application/json'
				},
				success: success,
				error: function(xhr, type, errorThrown) {
					//异常处理；
					console.log(type);
					console.log(JSON.stringify(errorThrown));
				}
			});
		},
		fGetPageSize: function() {
			return 5;
		},
		//{"coordsType":"wgs84","coords":{"latitude":32.1557337299057,"longitude":118.7305406419672,"accuracy":1414,"altitude":20.33320999145508,"heading":null,"speed":null,"altitudeAccuracy":10},"timestamp":1495788223623.718}
		fGetLocaltion: function() {
			var localStr = localStorage.getItem("location");
			if(localStr && localStr != "") {
				var local = JSON.parse(localStr);
				return local;
			}
			return null;
		},
		/**
		 * 	获取登录后的用户信息  localStorage.getItem('$users')
		 */
		fGetLoginUserInfo: function() {
			var localStr = localStorage.getItem('$users');
			if(localStr && localStr != "") {
				var local = JSON.parse(localStr);
				return local;
			} else {
				return null;
			}
		},
		isTestInvariment: function() {
			return true;
		},
		/**
		 * 获取客户端标识 clientId
		 */
		fnGetClientInfo: function() {
			var info = plus.push.getClientInfo();
			return {
				id: info.id,
				token: info.token,
				clientid: info.clientid,
				appid: info.appid,
				appkey: info.appkey
			}
		}
	}
};
/**
 * 	date对象格式化 扩展
 * 	使用参考：
 * 	 var dates=new Date().format("yyyy-MM-dd hh:mm:ss");  
 * @param format
 * @returns
 */
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month   
		"d+": this.getDate(), //day   
		"h+": this.getHours(), //hour   
		"m+": this.getMinutes(), //minute   
		"s+": this.getSeconds(), //second   
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter   
		"S": this.getMilliseconds() //millisecond   
	};

	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for(var k in o) {
		if(new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};