/**
 * 好友分组列表
 */
(function($, doc) {
	var c = config();
	//	$.init();
	$.plusReady(function() {
		//分组好友列表绑定		
//		group_friends_bind();
		//分组（组名称）点击事件
		group_title_click_event();
		//好友点击事件，跳转到聊天界面
		group_row_friend_click_event();

	});

	//好友点击事件，跳转到聊天页面
	var group_row_friend_click_event = function() {
		mui('#contact-list').on('tap', 'li', function() {
			var self = this;
			var toAccount = self.getAttribute('data-uaccount');
			var toName = self.querySelector('.username').innerText;
			currentChatingUser = toAccount;
			mui.openWindow({
				url: "chat_single.html",
				id: 'chat_single.html',
				preload: true,
				createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false, //自动显示等待框，默认为true
				},
				extras: {
					toAccount: toAccount,
					toName: toName,
					fromType: 'friend'
				}
			});
		});
	}

	//分组名称点击事件（展开或收起好友列表）
	var group_title_click_event = function() {
		mui('#contact').on('tap', '.item-group-info', function() {
			var self = this;
			var parentTarget = self.parentNode;
			if(parentTarget.classList.contains('item-group-unactive'))
				parentTarget.classList.remove('item-group-unactive')
			else
				parentTarget.classList.add('item-group-unactive');
		});
	}
	
	

}(mui, document));