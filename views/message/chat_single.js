/**
 * 单人聊天js
 */
;
(function($, doc) {
	var ws, wo, focus = false,
		ui = {},
		footerPadding;
	var c = config();
	//消息记录分页
	var pageIndex = 0,
		pageSize = 10,
		totalRows = 0;
	var fAccount = null,
		fName = null;

	$.plusReady(function() {

		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize"
		});

		var userInfo = c.fGetLoginUserInfo();
		ws = plus.webview.currentWebview();
		wo = ws.opener();

		ws = plus.webview.currentWebview();
		ws.setPullToRefresh({
			support: true,
			height: '50px',
			range: '100px',
			style: 'circle',
			offset: '1px'
		}, afterDownCallback);

		function afterDownCallback() {
			setTimeout(function() {
				//加载下一页 聊天记录
				var size = pageSize * pageIndex;
				if(size < totalRows) {
					pageIndex = pageIndex + 1;
					console.info('size:' + size + '   totalRows:' + totalRows + '  pageSize:' + pageSize + '  pageIndex:' + pageIndex);
					var userInfo = c.fGetLoginUserInfo();
					func.fnLoadNextPageChatRecord(userInfo.UserLoginAccount, fAccount);
				} else {
					plus.nativeUI.toast('没有更多聊天记录');
				}
				ws.endPullToRefresh();
			}, 1000);
		}

		//获取父页面传递过来的参数（用户账号，昵称，从哪个页面传过来的fromType类型）
		fAccount = ws.toAccount;
		fName = ws.toName;
		var fromPage = ws.fromType;

		document.querySelector('.mui-title').innerText = fAccount;

		//如果当前页面打开，收到主页面推送过来 接收到的好友的消息，绑定显示
		window.addEventListener('message', function(e) {
			var param = e.detail;
			//调用绑定显示方法
			var parentNode = doc.querySelector('#msg-list');
			var mesInfo = {
				Message: param.message
			}
			_fnBindUnReadMsgToPage(parentNode, mesInfo, userInfo.UserLoginAccount);
			//通知主页面方法，更新 未读信息状态为已读
			mui.fire(wo || plus.webview.currentWebview().opener(), 'changeUnReadMsgToRead', {
				fAccount: fAccount
			});

		});

		ui = {
			body: doc.querySelector('body'),
			footer: doc.querySelector('footer'),
			footerRight: doc.querySelector('.footer-right'),
			footerLeft: doc.querySelector('.footer-left'),
			btnMsgType: doc.querySelector('#msg-type'),
			boxMsgText: doc.querySelector('#msg-text'),
			boxMsgSound: doc.querySelector('#msg-sound'),
			btnMsgImage: doc.querySelector('#msg-image'),
			areaMsgList: doc.querySelector('#msg-list'),
			boxSoundAlert: doc.querySelector('#sound-alert'),
			h: doc.querySelector('#h'),
			content: doc.querySelector('.mui-content')
		};
		ui.h.style.width = ui.boxMsgText.offsetWidth + 'px';
		//alert(ui.boxMsgText.offsetWidth );
		footerPadding = ui.footer.offsetHeight - ui.boxMsgText.offsetHeight;

		//返回
		func.fnBack();
		func.fnResizeWindow();
		func.fnMsgInputBox();
		func.fnFooterLeftTapEvent();
		func.fnMsgListTapEvent();
		func.fnMsgInputTap();
		func.fnSendBtnTapEvent(); //发送消息（点击发送文本消息）
		//初始化当前登录用户的 对应的好友的未读的信息
		func.fnInitUnReadMsg(userInfo.UserLoginAccount, fAccount);

	});

	var func = {
		/**
		 * 加载下一页 聊条记录
		 */
		fnLoadNextPageChatRecord: function(loginAccount, fAccount) {

			func.fnInitUnReadMsg(loginAccount, fAccount, true);
		},
		/**
		 * 调用该方法绑定未读消息列表
		 * @param {Object} loginAccount 登录的账号
		 * @param {Object} fAccount 好友的账号
		 */
		fnInitUnReadMsg: function(loginAccount, fAccount, history) {
			var param = {
				CacheKey: 'chat_single_' + loginAccount + '_' + fAccount,
				CurrentLoginAccount: loginAccount,
				PageSize: pageSize,
				PageIndex: pageIndex
			};
			c.fPost({
				//				link: '/Logger/GetCacheChatUnReadRecordByAccount',
				link: '/Logger/GetCacheChatRecordFromFootByAccount',
				params: param,
				callback: function(res) {
					var obj = JSON.parse(res);
					if(obj && obj.Data.data && obj.Data.data.length > 0) {
						//绑定到页面显示
						var parentNode = doc.querySelector('#msg-list');
						totalRows = obj.Data.totalRows;

						//						if(pageIndex == 1) {
						//							var rows = parentNode.querySelectorAll('div.cq-row');
						//							if(rows && rows.length > 0) {
						//								for(var i = 0; i < rows.length; i++) {
						//									rows[i].remove();
						//								}
						//							}
						//						}

						if(history) {
							_fnBindUnReadMsgBeforeToPage(parentNode, obj.Data.data, loginAccount);
						} else {
							for(var i = 0; i < obj.Data.data.length; i++) {
								var d = obj.Data.data[i];
								_fnBindUnReadMsgToPage(parentNode, d, loginAccount);
							}
						}
						//通知主页面方法，更新 未读信息状态为已读
						mui.fire(wo || plus.webview.currentWebview().opener(), 'changeUnReadMsgToRead', {
							fAccount: fAccount
						});
					}
				}
			});
		},
		/**
		 * 聊天列表点击事件
		 */
		fnMsgListTapEvent: function() {
			//点击消息列表，关闭键盘
			ui.areaMsgList.addEventListener('click', function(event) {
				if(!focus) {
					ui.boxMsgText.blur();
				}
			})
		},
		//返回
		fnBack: function() {
			document.querySelector('#mui-action-back')
				.addEventListener('tap', function() {
					mui.back();
				}, false);
		},
		fnResizeWindow: function() {
			window.addEventListener('resize', function() {
				ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
			}, false);
		},
		fnMsgInputBox: function() {
			document.querySelector('#msg-text').addEventListener('input', function(event) {
				ui.btnMsgType.classList[ui.boxMsgText.value == '' ? 'remove' : 'add']('mui-icon-paperplane');
				ui.btnMsgType.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
				ui.h.innerText = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
				ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
				ui.content.style.paddingBottom = ui.footer.style.height;
			});
		},
		fnMsgInputTap: function() {
			ui.boxMsgText.addEventListener('tap', function(event) {
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();
				}, 0);
				focus = true;
				setTimeout(function() {
					focus = false;
				}, 1000);
				event.detail.gesture.preventDefault();
			}, false);
		},
		fnFooterLeftTapEvent: function() {
			ui.footerLeft.addEventListener('tap', function(event) {
				var btnArray = [{
					title: "拍照"
				}, {
					title: "从相册选择"
				}];
				plus.nativeUI.actionSheet({
					title: "选择照片",
					cancel: "取消",
					buttons: btnArray
				}, function(e) {
					var index = e.index;
					switch(index) {
						case 0:
							break;
						case 1:
							var cmr = plus.camera.getCamera();
							cmr.captureImage(function(path) {
								send('image', "file://" + plus.io.convertLocalFileSystemURL(path));
							}, function(err) {});
							break;
						case 2:
							plus.gallery.pick(function(path) {
								send('image', path);
							}, function(err) {}, null);
							break;
					}
				});
			}, false);
		},
		/**
		 * 	发送按钮点击事件
		 */
		fnSendBtnTapEvent: function() {

			//解决长按“发送”按钮，导致键盘关闭的问题；
			ui.footerRight.addEventListener('touchstart', function(event) {
				if(ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
					msgTextFocus();
					ui.boxMsgText.blur();
					send('text', ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '<br/>'));
					ui.boxMsgText.value = '';
					//					document.body.focus();

					$.trigger(ui.boxMsgText, 'input', null);
					event.preventDefault();
				}
			});
			//解决长按“发送”按钮，导致键盘关闭的问题；
			ui.footerRight.addEventListener('touchmove', function(event) {
				if(ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
					msgTextFocus();
					event.preventDefault();
				}
			});
			ui.footerRight.addEventListener('release', function(event) {
				console.info(ui.btnMsgType.classList);
				if(ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
					//showKeyboard();
					ui.boxMsgText.focus();
					setTimeout(function() {
						ui.boxMsgText.focus();
					}, 150);
					//							event.detail.gesture.preventDefault();
					send('text', ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '<br/>'));
					ui.boxMsgText.value = '';

					$.trigger(ui.boxMsgText, 'input', null);
				} else if(ui.btnMsgType.classList.contains('mui-icon-mic')) {
					ui.btnMsgType.classList.add('mui-icon-compose');
					ui.btnMsgType.classList.remove('mui-icon-mic');
					ui.boxMsgText.style.display = 'none';
					ui.boxMsgSound.style.display = 'block';
					ui.boxMsgText.blur();
					document.body.focus();
				} else if(ui.btnMsgType.classList.contains('mui-icon-compose')) {
					ui.btnMsgType.classList.add('mui-icon-mic');
					ui.btnMsgType.classList.remove('mui-icon-compose');
					ui.boxMsgSound.style.display = 'none';
					ui.boxMsgText.style.display = 'block';
					//--
					//showKeyboard();
					ui.boxMsgText.focus();
					setTimeout(function() {
						ui.boxMsgText.focus();
					}, 150);
				}
			}, false);

		}
	}

	//返回
	mui.back = function() {
		plus.storage.setItem('currentFriend', '');
		ws = ws || plus.webview.currentWebview();
		ws.close();
	}

	var send = function(type, data) {
		wo = wo || plus.webview.currentWebview().opener();
		var loginAccount = c.fGetLoginUserInfo().UserLoginAccount;
		var mess = {
			CacheKey: 'chat_single_' + loginAccount + '_' + fAccount,
			Message: {
				id: guid(),
				type: type || 'txt',
				from: loginAccount,
				to: fAccount,
				data: data,
				groupId: '',
				msgType: type || 'txt',
				sendTime: new Date().format("yyyy-MM-dd hh:mm:ss")
			},
			CurrentLoginUserAccount: loginAccount
		};

		mui.fire(wo, 'sendSingleMsg', {
			messge: mess.Message
		});
		//每次发送消息时候，重新初始化 历史聊天记录索引
		if(pageIndex != 0) pageIndex = 0;
		if(totalRows != 0) totalRows = 0;
		//同时绑定到列表显示
		var parentNode = doc.querySelector('#msg-list');
		_fnBindUnReadMsgToPage(parentNode, mess, loginAccount);
	};
	var guid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	function msgTextFocus() {
		ui.boxMsgText.focus();
		setTimeout(function() {
			ui.boxMsgText.focus();
		}, 150);
	}

	/**
	 * 将信息绑定到页面显示(获取未读消息或者发送和接收到新消息，都可以走该方法)
	 * @param {Object} parentNode
	 * @param {Object} data
	 * RowData:{
	 * 		CacheKey:'',
	 * 		Message:message,
	 * 		CurrentLoginUserAccount:'',
	 * 		IsRead:''}
	 */
	function _fnBindUnReadMsgToPage(parentNode, RowData, loginAccount) {
		var to = RowData.Message.to;
		var from = RowData.Message.from;

		if(to == loginAccount) {
			//初始化左边 html
			var div = doc.createElement('div');
			div.setAttribute('class', 'cq-row flex-direction-row');
			var html = '';
			_fnGetFriendInfoByAccount(from, function(res) {
				var isFriend = res.isFriend; //是否已经是好友，支持非好友亦可以聊天
				var friend = res.friend; //姐沟同 loginUserInfo
				//初始化html
				html += '<div class="head-box">';
				html += '	<img src="' + friend.HeadImageUrl + '" class="head" />';
				html += '</div>';
				html += '<div class="cq-row-nopadding">';
				html += '	<div class="left_triangle"></div>';
				html += '	<div class="from-msg-box">';
				html += RowData.Message.data;
				html += '	</div>';
				html += '</div>';
				html += '<div class="head-box"></div>';
				div.innerHTML = html;
				parentNode.appendChild(div);
			});
		}
		if(to != loginAccount && from == loginAccount) {
			var userInfo = c.fGetLoginUserInfo();
			//初始化右边 html
			var div = doc.createElement('div');
			div.setAttribute('class', 'cq-row flex-direction-row');
			var html = '';
			html += '<div class="head-box"></div>';
			html += '<div class="cq-row-nopadding to">';
			html += '	<div class="to-msg-box">';
			html += RowData.Message.data;
			html += '	</div>';
			html += '	<div class="right_triangle"></div>';
			html += '</div>';
			html += '<div class="head-box"><img src="' + userInfo.HeadImageUrl + '" class="head" /></div>';
			div.innerHTML = html;
			parentNode.appendChild(div);
		}

		var content = mui('body');
		content[0].scrollTop = content[0].scrollHeight
	}

	function _fnBindUnReadMsgBeforeToPage(parentNode, datas, loginAccount) {
		for(var i = datas.length - 1; i >= 0; i--) {
			var RowData = datas[i];
			var to = RowData.Message.to;
			var from = RowData.Message.from;

			if(to == loginAccount) {
				//初始化左边 html
				var div = doc.createElement('div');
				div.setAttribute('class', 'cq-row flex-direction-row');
				var html = '';
				_fnGetFriendInfoByAccount(from, function(res) {
					var isFriend = res.isFriend; //是否已经是好友，支持非好友亦可以聊天
					var friend = res.friend; //姐沟同 loginUserInfo
					//初始化html
					html += '<div class="head-box">';
					html += '	<img src="' + friend.HeadImageUrl + '" class="head" />';
					html += '</div>';
					html += '<div class="cq-row-nopadding">';
					html += '	<div class="left_triangle"></div>';
					html += '	<div class="from-msg-box">';
					html += RowData.Message.data;
					html += '	</div>';
					html += '</div>';
					html += '<div class="head-box"></div>';
					div.innerHTML = html;
					parentNode.insertBefore(div, parentNode.firstChild);

				});
			}
			if(to != loginAccount && from == loginAccount) {
				var userInfo = c.fGetLoginUserInfo();
				//初始化右边 html
				var div = doc.createElement('div');
				div.setAttribute('class', 'cq-row flex-direction-row');
				var html = '';
				html += '<div class="head-box"></div>';
				html += '<div class="cq-row-nopadding to">';
				html += '	<div class="to-msg-box">';
				html += RowData.Message.data;
				html += '	</div>';
				html += '	<div class="right_triangle"></div>';
				html += '</div>';
				html += '<div class="head-box"><img src="' + userInfo.HeadImageUrl + '" class="head" /></div>';
				div.innerHTML = html;
				var firstMsgDiv = parentNode.childNodes[0];
				parentNode.insertBefore(div, parentNode.firstChild);
			}
			//		ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
			//		console.info(ui.areaMsgList.scrollTop);
		}
	}

	/**
	 * 获取指定账号的好友信息
	 * 	如果好友列表的缓存中，存在该用户，便从缓存中取出，否则从服务器重新获取
	 * @param {Object} fAccount
	 */
	var _fnGetFriendInfoByAccount = function(fAccount, callback) {
		if(plus.storage.getItem('currentFriend') && plus.storage.getItem('currentFriend') != '') {
			var currentFriend = JSON.parse(plus.storage.getItem('currentFriend')); //currentFriend = {isFriend: true,friend: friend};
			return callback(currentFriend);
		}
		var cacheFriendGroups = plus.storage.getItem('friendGroups');
		if(cacheFriendGroups && cacheFriendGroups != '') {
			var friendGroups = JSON.parse(cacheFriendGroups);
			if(friendGroups && friendGroups.length > 0) {
				var canOut = false;
				friendGroups.forEach(function(item, index, input) {
					var friends = item.CustomerFriendCollection;
					if(friends && friends.length > 0) {
						friends.forEach(function(citem, cindex, cinput) {
							var friend = citem.Friend; //好友信息
							if(friend) {
								if(friend.UserLoginAccount == fAccount) {
									var currentFriend = {
										isFriend: true,
										friend: friend
									};
									//临时存储当前好友，关闭聊天页面时候清除
									plus.storage.setItem('currentFriend', JSON.stringify(currentFriend));
									return callback(currentFriend);
								}
							}
						});
					}
				});
			}
		} else { //从服务器获取
			c.fGet({
				link: '/Customer/' + fAccount + '/GetUserInfoByAccount',
				callback: function(res) {
					var user = JSON.parse(res);
					if(user && user.ResultType == 3) {
						var currentFriend = {
							isFriend: false,
							friend: user.Data
						};
						//临时存储当前好友，关闭聊天页面时候清除
						plus.storage.setItem('currentFriend', JSON.stringify(currentFriend));
						return callback(currentFriend);
					}
				}
			});
		}
	}

}(mui, document));