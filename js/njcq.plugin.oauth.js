var auths = {};
var njcqOAuth = function() {
	return {
		init: function(callback) {

			document.addEventListener('plusready', plusReady, false);
		}
	}
};

function plusReady(callback) {
	/**
	 * 	获取登录认证通道
	 * 	services 是多个第三方平台信息
	 * 	每个对象：{"id":"weixin","description":"微信"}
	 * 	同时在callback函数中，解析返回结果，拼接显示到页面，绑定 login的方法，传递service中的id
	 * 	获取全局变量 auths中存储的某一个service对象，趋势线登录认证
	 * 	var de = document.createElement('div'); 
							de.setAttribute('class', 'button');
							de.setAttribute('onclick', 'login(this.id)');
							de.id = service.id;
							de.innerText = service.description + "登录";
							
	 */
	plus.oauth.getServices(function(services) {
		for(var i in services) {
			var service = services[i];
			auths[service.id] = service;
		}
		return callback(services);
	}, function(e) {
		outLine("获取登录认证失败：" + e.message);
	});
}

// 登录认证
function login(id, callback) {
	outSet("----- 登录认证 -----");
	var auth = auths[id];
	if(auth) {
		var w = null;
		if(plus.os.name == "Android") {
			w = plus.nativeUI.showWaiting();
		}
		document.addEventListener("pause", function() {
			setTimeout(function() {
				w && w.close();
				w = null;
			}, 2000);
		}, false);
		auth.login(function() {
			w && w.close();
			w = null;
			outLine("登录认证成功：");
			outLine(JSON.stringify(auth.authResult));
			userinfo(auth, callback);
		}, function(e) {
			w && w.close();
			w = null;
			outLine("登录认证失败：");
			outLine("[" + e.code + "]：" + e.message);
			//			plus.nativeUI.alert("详情错误信息请参考授权登录(OAuth)规范文档：http://www.html5plus.org/#specification#/specification/OAuth.html", null, "登录失败[" + e.code + "]：" + e.message);
			plus.nativeUI.alert('登录认证失败');
		});
	} else {
		outLine("无效的登录认证通道！");
		plus.nativeUI.alert("无效的登录认证通道！", null, "登录");
	}
}
// 获取用户信息
function userinfo(a, callback) {
	outLine("----- 获取用户信息 -----");
	a.getUserInfo(function() {
		outLine("获取用户信息成功：");
		outLine(JSON.stringify(a.userInfo));

		var nickname = a.userInfo.nickname || a.userInfo.name || a.userInfo.miliaoNick;
		plus.nativeUI.alert("欢迎“" + nickname + "”登录！");
		return callback(a.userInfo);
	}, function(e) {
		outLine("获取用户信息失败：");
		outLine("[" + e.code + "]：" + e.message);
		plus.nativeUI.alert("获取用户信息失败！", null, "登录");
	});
}
// 注销登录
function logoutAll() {
	outSet("----- 注销登录认证 -----");
	for(var i in auths) {
		logout(auths[i]);
	}
}

function logout(auth) {
	auth.logout(function() {
		outLine("注销\"" + auth.description + "\"成功");
	}, function(e) {
		outLine("注销\"" + auth.description + "\"失败：" + e.message);
	});
}