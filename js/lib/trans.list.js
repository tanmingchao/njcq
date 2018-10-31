var Trans = function() {

}

Trans.prototype.fnInitHtml = function() {

	var html = '';
	html + _fHtmlTop(data, currentlat, currentlng);


	html += _fHtmlFooter(data, currentlat, currentlng);
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
	html += '	<div class="item-row item-row-ex">';
	html += '		<div class="show-info">';
	html += '			' + distance.fGetDistance(currentlat, currentlng, data.Latitude, data.Longitude) + ' - ' + data.ClickLike + '赞 - ' + data.ViewTimes + '阅读';
	html += '		</div>';
	html += '		<div class="more-options">';
	html += '			<span class="mui-icon-extra mui-icon-extra-like"></span>';
	html += '			<span class="mui-icon-extra mui-icon-extra-comment"></span>';
	html += '			<span class="mui-icon-extra mui-icon-extra-share"></span>';
	html += '		</div>';
	html += '	</div>';
	//	html += '</li>';
	return html;
};