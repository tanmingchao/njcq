var waiting = function() {

	waiting.prototype.defaultWaiting = function() {
		var w = plus.nativeUI.showWaiting("处理中，请等待...\n5");
		w.onclose = function() {
			clearInterval(t);
		}
		var n = 5;
		var t = setInterval(function() {
			n--;
			w.setTitle("处理中，请等待...\n" + n);
			if(n <= 0) {
				w.close();
				clearInterval(t);
			}
		}, 1000);
	};
	waiting.prototype.nomodalWaiting = function() {
		var w = plus.nativeUI.showWaiting("处理中，请等待...\n5", {
			modal: false
		});
		w.onclose = function() {
			clearInterval(t);
		}
		var n = 5;
		var t = setInterval(function() {
			n--;
			w.setTitle("处理中，请等待...\n" + n);
			if(n <= 0) {
				w.close();
				clearInterval(t);
			}
		}, 1000);
	};
	waiting.prototype.customWaiting = function(iconUrl) {
		var w = plus.nativeUI.showWaiting("处理中，请等待...\n5", {
			loading: {
				icon: iconUrl
			}
		});
		w.onclose = function() {
			clearInterval(t);
		}
		var n = 5;
		var t = setInterval(function() {
			n--;
			w.setTitle("处理中，请等待...\n" + n);
			if(n <= 0) {
				w.close();
				clearInterval(t);
			}
		}, 1000);
	};

};