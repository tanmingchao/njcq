/**
 * 使用时候，，需要引入common.js
 */

var camera = function() {};

/**
 * 	拍照
 */
camera.prototype.fGetImage = function(callback) {
	var c = plus.camera.getCamera();
	console.info('开始调用摄像头插件');
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var s = entry.toLocalURL(); //+ "?version=" + new Date().getTime();
			return callback(s);
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
			return callback(null);
		});
	}, function(s) {
		console.log("error" + s);
	}, {
		filename: '_doc/camera/',
		index: 1
	});
};
/**
 * 	相册读取图片
 */
camera.prototype.fGalleryImg = function(callback) {
	// 从相册中选择图片
	plus.gallery.pick(function(e) {
		if(e && e.files) {
			return callback(e.files);
		}
	}, function(e) {
		return callback(null);
	}, {
		filter: 'image',
		multiple: true,
		maximum: 6,
		system: false,
		onmaxed: function() {
			plus.nativeUI.alert('最多只能选择6张图片');
		}
	}); // 最多选择6张图片
};
/**
 * 	录像
 */
camera.prototype.fGetVideo = function(callback) {
	var cmr = plus.camera.getCamera();
	var res = cmr.supportedVideoResolutions[0];
	var fmt = cmr.supportedVideoFormats[0];

	cmr.startVideoCapture(function(p) {
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			//					createItem(entry);

			return callback(p);
		}, function(e) {
			console.info('读取录像文件错误：' + e.message);
			return callback(null);
		});
	}, function(e) {
		console.info(e.message);
	}, {
		filename: '_doc/camera/',
		resolution: res,
		format: fmt
	});
	// 拍摄20s后自动完成 
	setTimeout(function() {
		cmr.stopVideoCapture();
	}, 20000);

};
/**
 * 	压缩图像,
 * @param localPathUrl 拍照或者选中的图片的 entry.localUrl 
 */
camera.prototype.fZipImage = function(options) {

	plus.zip.compressImage({
		src: options.localPathUrl,
		dst: "_doc/chat/camera/" + options.localPathUrl,
		quality: 20,
		overwrite: true
	}, function(e) {
		return options.callback(e.target); //用作文件上传的， task.addFile(e.target, {});  
	}, function(err) {
		console.log("压缩失败：  " + err.message);
	}, {
		index: 1
	});

};