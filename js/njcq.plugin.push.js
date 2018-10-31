var push = function(options) {
	this.title = "车趣" || options.title;
	this.context = "车趣推送信息" || options.context;
	this.toLink = options.link; //跳转页面链接,如果是下载链接，直接链接到app的完整路径，eg:'http://www.dcloud.io/helloh5/HelloH5.apk'
	this.remark = options.remark; //更多附加信息,直接字符串，第4种推送参考格式：'{"title":"Hello H5+ Test","content":"test content","payload":"1234567890"}'

	/**
	 * 	推送普通消息
	 */
	push.prototype.fPushNormal = function() {
		var self = this;
		if(navigator.userAgent.indexOf('StreamApp') > 0) {
			plus.nativeUI.toast('当前环境暂不支持发送推送消息');
			return;
		}
		var inf = plus.push.getClientInfo();
		var url = pushServer + 'type=noti&appid=' + encodeURIComponent(plus.runtime.appid);
		inf.id && (url += '&id=' + inf.id);
		url += ('&cid=' + encodeURIComponent(inf.clientid));
		if(plus.os.name == 'iOS') {
			url += ('&token=' + encodeURIComponent(inf.token));
		}
		url += ('&title=' + encodeURIComponent(self.title));
		url += ('&content=' + encodeURIComponent(self.context));
		url += ('&version=' + encodeURIComponent(plus.runtime.version));
		plus.runtime.openURL(url);
	};
	/**
	 * 	推送带有链接的消息
	 */
	push.prototype.fPushLink = function() {
		var self = this;
		if(navigator.userAgent.indexOf('StreamApp') > 0) {
			plus.nativeUI.toast('当前环境暂不支持发送推送消息');
			return;
		}
		var inf = plus.push.getClientInfo();
		var url = pushServer + "type=link&appid=" + encodeURIComponent(plus.runtime.appid);
		inf.id && (url += '&id=' + inf.id);
		url += ('&cid=' + encodeURIComponent(inf.clientid));
		if(plus.os.name == 'iOS') {
			url += ('&token=' + encodeURIComponent(inf.token));
		}
		url += ('&title=' + encodeURIComponent(self.title));
		url += ('&content=' + encodeURIComponent(self.context));
		url += ('&url=' + encodeURIComponent(self.toLink));
		url += ('&version=' + encodeURIComponent(plus.runtime.version));
		plus.runtime.openURL(url);
	};
	/**
	 * 	推送下载链接信息
	 */
	push.prototype.fPushDownLoad = function() {
		var self = this;
		if(navigator.userAgent.indexOf('StreamApp') > 0) {
			plus.nativeUI.toast('当前环境暂不支持发送推送消息');
			return;
		}
		if(plus.os.name != "Android") {
			plus.nativeUI.alert("此平台不支持！");
			return;
		}
		var inf = plus.push.getClientInfo();
		var url = pushServer + 'type=down&appid=' + encodeURIComponent(plus.runtime.appid);
		inf.id && (url += '&id=' + inf.id);
		url += ('&cid=' + encodeURIComponent(inf.clientid));
		url += ('&title=' + encodeURIComponent(self.title));
		url += ('&content=' + encodeURIComponent(self.context));
		url += ('&ptitle=' + encodeURIComponent(self.title));
		url += ('&pcontent=' + encodeURIComponent(self.remark));
		url += ('&dtitle=' + encodeURIComponent('下载' + self.title));
		url += ('&durl=' + encodeURIComponent(self.toLink));
		url += ('&version=' + encodeURIComponent(plus.runtime.version));
		plus.runtime.openURL(url);
	};
	/**
	 * 	‘透传数据’推送消息
	 */
	push.prototype.fPushTran = function() {
		var self = this;
		if(navigator.userAgent.indexOf('StreamApp') > 0) {
			plus.nativeUI.toast('当前环境暂不支持发送推送消息');
			return;
		}
		var inf = plus.push.getClientInfo();
		var url = pushServer + 'type=tran&appid=' + encodeURIComponent(plus.runtime.appid);
		inf.id && (url += '&id=' + inf.id);
		url += ('&cid=' + encodeURIComponent(inf.clientid));
		if(plus.os.name == 'iOS') {
			url += ('&token=' + encodeURIComponent(inf.token));
		}
		url += ('&title=' + encodeURIComponent(self.title));
		url += ('&content=' + encodeURIComponent(self.context));
		url += ('&payload=' + encodeURIComponent(self.remark));
		url += ('&version=' + encodeURIComponent(plus.runtime.version));
		plus.runtime.openURL(url);
	};

};