/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if(loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if(loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		var authed = false;
		var users = localStorage.getItem('$users');
		if(users && users != null && users != '') {
			//			var authed = users.some(function(user) {
			//				return loginInfo.account == user.account && loginInfo.password == user.password;
			//			});
			authed = (loginInfo.account == users.account && loginInfo.password == users.password);
		}
		var msg = _doLogin(loginInfo);
		if(authed) {
			//调用 登录api（防止用户勾选自动登录的同时，有修改过密码）
			if(msg === '')
				return owner.createState(loginInfo.account, callback);
			else {
				localStorage.setItem('$users', '');
				return callback(msg);
			}
		} else {
			//调用登录api
			if(msg != '')
				return callback(msg);
			return owner.createState(loginInfo.account, callback);
		}
	};
	var _doLogin = function(loginInfo) {
		mui.ajax('http://www.autojoynet.com/api/Customer/Login', {
			data: {
				LoginAccount: loginInfo.account,
				LoginPwd: loginInfo.password
			},
			async: false,
			type: 'post',
			success: function(res) {
				var data = JSON.parse(res);
				var msg = '';
				switch(data.ResultType) {
					case 1:
						msg = '用户名或密码错误！';
						break;
					case 3:
						//1.登录成功

						//2.存储用户信息
						console.info(JSON.stringify(data.Data));
						localStorage.setItem('$users', JSON.stringify(data.Data));
						break;
				}
				return msg;
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
				return type;
			}
		});
	};
	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		regInfo.nickname = regInfo.nickname || '';

		if(regInfo.nickname.length < 0) {
			return callback('请输入昵称');
		}
		if(regInfo.account.length < 11) {
			return callback('用户名最短需要 11 个字符');
		} else {
			var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
			if(!myreg.test(regInfo.account)) {
				return callback('请输入有效的手机号码！');
			}
		}

		if(regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}

		if(!config.isTestInvariment) {
			var code = localStorage.getItem('valideCode');
			if(code.length == 0) {
				return callback('请输入先发送验证码');
			}

			if(regInfo.validCode.length < 0) {
				return callback('请输入验证码');
			} else {
				if(code.toString() != regInfo.validCode.toString()) {
					return callback('验证码有误，请重新输入！');
				} else {
					localStorage.setItem('valideCode', '');
				}
			}
		}

		config.fGet({
			link: '/Customer/' + regInfo.account + '/CheckTelephoneIsExists',
			callback: function(res) {
				var obj = JSON.parse(res);

				if(obj.ResultType == 1) {
					var prams = {
						PrimaryKey: '1234567890',
						UserNickName: regInfo.nickname,
						UserLoginAccount: regInfo.account,
						UserLoginPwd: regInfo.password,
						UserGender: 'M',
						TelPhone: regInfo.account,
						UserEmail: '',
						HeadImageUrl: '',
						UserLocation: '',
						UserScore: 10, //注册送十个积分
						Remark: '',
						UserLevelName: ''
					};
					console.info(JSON.stringify(prams));
					config.fPost({
						link: '/Customer/Regist',
						params: prams,
						callback: function(res) {
							var obj = JSON.parse(res).Data;

							if(obj && obj.UserNickName) {
								localStorage.setItem('$users', JSON.stringify(obj));
								return callback();
							} else {
								return callback('账号注册失败,请稍后再试！');
							}
						}
					})
				} else {
					return callback('该手机号码已经注册过，不可再次进行注册');
				}

			}
		});
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkPhone = function(phone) {
		phone = phone || '';
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if(!myreg.test(phone)) {
			return false;
		}
		return true;

	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(phone, valideCode, callback) {
		callback = callback || $.noop;
		valideCode = valideCode || $.noop;
		if(!checkPhone(phone)) {
			return callback('请输入有效的手机号码！');
		}
		if(valideCode.length == 0) {
			return callback('请输入短信验证码');
		} else {
			var code = localStorage.getItem('valideCode-change');
			if(code === valideCode) {
				return callback();
			} else {
				return callback('请输入正确的验证码！');
			}
		}

	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	};

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	};
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	};

}(mui, window.app = {}));