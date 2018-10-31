function ActShare() {

}

/**
 * 	获取车友圈列表数据
 * @param {Object} options={
 * 		setting:{firstLoad:firstLoad,totalRows:totalRows},
 * 		params:{
 * 					TypeKey : "",
					ActShareKey : "",
					ActShareTitle : "",
					CurrentLoginUserKey : "",
					PageIndex : 0,
					PageSize : 0
 * 				}
 * }
 * 		GetMyFollowActShareList
 */
ActShare.prototype.fGetList = function(options, callback) {
	var url = options.link == null ? '/ActivityShare/GetActShareList' : options.link;
	config.fPost({
		link: url,
		params: options.params,
		callback: function(res) {
			var data = JSON.parse(res).Data;
			if(options.setting.firstLoad) {
				options.setting.firstLoad = false;
				options.setting.totalRows = data.totalRows;
			}
			if(data && data.data.length > 0)
				return callback(data.data);

			return callback(null);
		}
	});
};

/**
 * 	用于判断初始化什么类型的 html  :纯文字|图文混合|文字视频混合|文章
 * @param {Object} data
 * @param {Object} currentlat
 * @param {Object} currentlng
 */
ActShare.prototype.fInitHtml = function(data, currentlat, currentlng) {
	var self = this;
	var title = data.ActTitle;
	var showImage = data.ShowImage;
	var showVideo = data.ShowVideo;
	var desc = data.ActDesc;

	if(title && title != '' && title.length > 0) { //初始化文章类型 html
		return self.fGetArticleHtml(data, currentlat, currentlng);
	} else if(showVideo && showVideo.length > 0) { //初始化视频类型
		return self.fGetVideoHtml(data, currentlat, currentlng);
	} else if(showImage && showImage.length > 0 && (!showVideo || showVideo.length == 0)) { //初始化 图片类型
		return self.fGetImageHtml(data, currentlat, currentlng);
	} else { //纯文字类型
		return self.fGetOnlyTextHtml(data, currentlat, currentlng);
	}

}

/**
 * 		 纯文本格式的 html
 * @param {Object} data:某一行数据
 */
ActShare.prototype.fGetOnlyTextHtml = function(data, currentlat, currentlng) {
	var html = '';

	html += _fHtmlTop(data);
	html += '	<div class="item-row" style="border-top: 1px solid #EFEFF4;">';
	html += '		<div rel="' + data.PrimaryKey + '"  class="item-row-context">';
	html += '			<p rel="' + data.PrimaryKey + '"  class="item-row-context-info">';
	html += data.ActDesc;
	html += '			</p>';
	html += '			<div class="context-location">';
	if(data.ActLocationDesc && data.ActLocationDesc.length > 0)
		html += '				<i class="mui-icon mui-icon-location"></i> ' + data.ActLocationDesc + ' ';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += _fHtmlFooter(data, currentlat, currentlng);

	return html;
};

/**
 * 	图片格式或图文混合的html
 * @param {Object} data
 */
ActShare.prototype.fGetImageHtml = function(data, currentlat, currentlng) {
	var imgs = data.ShowImage.split(',');
	var imgLng = imgs.length;
	var showStyle = imgLng == 1 ? ' one-image' : (imgLng == 2 ? ' two-image' : (imgLng == 3 ? ' three-image' : ' greater-three-image'));
	var html = '';
	html += _fHtmlTop(data);
	html += '<div class="item-row" style="border-top: 1px solid #EFEFF4;">';
	html += '	<div  rel="' + data.PrimaryKey + '" class="item-row-context">';
	html += '		<p  rel="' + data.PrimaryKey + '" class="item-row-context-info">';
	html += data.ActDesc;
	html += '		</p>';
	html += '		<div rel="' + data.PrimaryKey + '"  class="item-images ' + showStyle + '">';
	for(var i = 0; i < imgLng; i++) {
		html += '			<img  rel="' + data.PrimaryKey + '"  src="' + imgs[i] + '" />';
	}
	html += '		</div>';
	html += '		<div class="context-location">';
	if(data.ActLocationDesc && data.ActLocationDesc.length > 0)
		html += '			<i class="mui-icon mui-icon-location"></i>' + data.ActLocationDesc + ' ';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	html += _fHtmlFooter(data, currentlat, currentlng);
	return html;
};

ActShare.prototype.fGetVideoHtml = function(data, currentlat, currentlng) {
	var html = '';
	html += _fHtmlTop(data);
	html += '<div class="item-row" style="border-top: 1px solid #EFEFF4;">';
	html += '	<div rel="' + data.PrimaryKey + '"  class="item-row-context">';
	html += '		<p rel="' + data.PrimaryKey + '"  class="item-row-context-info">';
	html += data.ActDesc;
	html += '		</p>';
	html += '		<div rel="' + data.PrimaryKey + '"  class="item-images video">';
	html += '			<video webkit-playsinline playsinline poster="' + data.ShowImage + '" preload';
	html += '				style ="background:transparent url(' + data.ShowImage + ') 50% 50% no-repeat;"  ';
	html += '			>';
	html += '					<source src="' + data.ShowVideo + '" type="video/mp4">';
	html += '					<source src="' + data.ShowVideo + '" type="video/webm">';
	html += '					<source src="' + data.ShowVideo + '" type="video/ogg">';
	html += '					<source src="' + data.ShowVideo + '">';
	html += '			</video>';
	html += '			<img class="play-icon" src="../img/video-play.png" />';
	html += '			<div class="progressTime">';
	html += '				<span class=" current">0</span>';
	html += '				<div class="progressBar">';
	html += '					<div class="timeBar"></div>';
	html += '				</div>';
	html += '				<div class="all-progress-box">';
	html += '					<span class="all-progress">0</span>';
	html += '					<img class="video-all-screen" src="../img/video-all-screen.png" />';
	html += '				</div>';
	html += '			</div>';
	html += '		</div>';
	html += '		<div class="context-location">';
	if(data.ActLocationDesc && data.ActLocationDesc.length > 0)
		html += '			<i class="mui-icon mui-icon-location"></i>' + data.ActLocationDesc;
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	html += _fHtmlFooter(data, currentlat, currentlng);
	return html;
}

/**
 * 	文章类型的 html，如果是文章类型，一定是  base64的格式，需要先转码base64，然后再绑定显示
 * @param {Object} data
 * @param {Object} currentlat
 * @param {Object} currentlng
 */
ActShare.prototype.fGetArticleHtml = function(data, currentlat, currentlng) {

	var _html = '';
	//	try {
	//		if(data.ActDesc.split('|').length > 1) {
	//			var temp = data.ActDesc.split('|'); //图文混合
	//			var base64_texts = temp[0];
	//			var base64_imagehtml = temp[1];
	//
	//			var base64_text_array = base64_texts.split(',');
	//			var base64_imagehtml_array = null;
	//			if(base64_imagehtml)
	//				base64_imagehtml_array = base64_imagehtml.split(',');
	//
	//			for(var i = 0; i < base64_text_array.length; i++) {
	//				var t = base64.utf8to16(base64.decode64(base64_text_array[i]));
	//				html += t;
	//				if(base64_imagehtml_array && base64_imagehtml_array.length && base64_imagehtml_array[i])
	//					_html += base64.utf8to16(base64.decode64(base64_imagehtml_array[i]));
	//			}
	//		} else { //只有文字
	//			var base64_texts = d.ActDesc.split(',');
	//			for(var i = 0; i < base64_texts.length; i++) {
	//				_html += base64.utf8to16(base64.decode64(base64_texts[i]));
	//			}
	//		}
	//	} catch(e) {
	//		//TODO handle the exception
	//	}
	var html = '';
	html += _fHtmlTop(data);
	html += '<div class="item-row" style="border-top: 1px solid #EFEFF4;">';
	html += '	<div rel="' + data.PrimaryKey + '" class="item-row-context">';
	html += '		<a  rel="' + data.PrimaryKey + '"  href="#" style="display: block;width: 100%;align-self: flex-start;text-align: left;">';
	html += '			<h5 >【' + data.ActivityShareTypeName + '】' + data.ActTitle + '</h5>';
	html += '		</a>';
	html += '		<p  rel="' + data.PrimaryKey + '"  class="item-row-context-info articel">';

	html += _html;

	html += '		</p>';
	html += '		<div class="context-location">';
	if(data.ActLocationDesc && data.ActLocationDesc.length > 0)
		html += '			<i class="mui-icon mui-icon-location"></i> ' + data.ActLocationDesc;
	html += '		</div>';
	html += '	</div>';
	html += '</div>';

	html += _fHtmlFooter(data, currentlat, currentlng);
	return html;
};

/**
 * 	头部
 * @param {Object} data 每行数据
 */
function _fHtmlTop(data) {
	var userRemark = '';
	var html = '';
	//	html += '<li class="mui-row circle-item">';
	html += '	<div class="item-row">';
	html += '		<img class="user-head" src="' + data.CustomerHeadImage + '" />';
	html += '		<div class="user-info">';
	html += '		<div class="user-name">' + data.CustomerNickName + '</div>';
	if(!data.CustomerRemark || data.CustomerRemark.length == 0) {
		userRemark = '这家伙很懒，没有介绍自己';
	}
	html += '			<span class="user-remark">' + userRemark + '</span>';
	html += '		</div>';
	html += '		<span class="create-time">' + formatter.fGetFormatterTimeStr(formatter.fGetTimestampFormDateTime(data.CreateTime)) + '</span>';
	html += '	</div>';
	return html;
};

/**
 * 	尾部 html
 * @param {Object} data 每行数据
 */
function _fHtmlFooter(data, currentlat, currentlng) {
	var html = '';
	html += '	<div class="item-row item-row-ex" style="margin-top:5px">';
	html += '		<div class="show-info">';
	html += '			' + distance.fGetDistance(currentlat, currentlng, data.Latitude, data.Longitude) + ' - ' + data.ClickLike + '赞 - ' + data.ViewTimes + '阅读';
	html += '		</div>';

	var active = data.HasClickLike ? 'dianzan-active' : '';

	html += '		<div class="more-options">';
	html += '			<span rel="' + data.PrimaryKey + '" class="mui-icon-extra mui-icon-extra-like ' + active + '"></span>';
	html += '			<span rel="' + data.PrimaryKey + '"  class="mui-icon-extra mui-icon-extra-comment"></span>';
	html += '			<span rel="' + data.PrimaryKey + '"  class="mui-icon-extra mui-icon-extra-share"></span>';
	html += '		</div>';
	html += '	</div>';
	//	html += '</li>';
	return html;
};