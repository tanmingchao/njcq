var njcqUtil = function() {

	var hasClass = function(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}
	var addClass = function(obj, cls) {
		if(!hasClass(obj, cls)) obj.className += " " + cls;
	}
	var removeClass = function(obj, cls) {
		if(hasClass(obj, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			obj.className = obj.className.replace(reg, ' ');
		}
	}
	var toggleClass = function(obj, cls) {
		if(hasClass(obj, cls)) {
			removeClass(obj, cls);
		} else {
			addClass(obj, cls);
		}
	}
	return {
		/**
		 * 	某元素是否有指定的 class属性
		 * @param {Object} obj
		 * @param {Object} cls
		 */
		hasClass: function(obj, cls) {
			return hasClass(obj, cls);
		},
		/**
		 * 	为当前dom对象添加指定的class属性
		 * @param {Object} obj
		 * @param {Object} cls
		 */
		addClass: function(obj, cls) {
			return addClass(obj, cls);
		},
		/**
		 * 	移除指定的class属性
		 * @param {Object} obj
		 * @param {Object} cls
		 */
		removeClass: function(obj, cls) {
			return removeClass(obj, cls);
		},
		/**
		 * 	移除或添加指定的 class样式
		 * @param {Object} obj
		 * @param {Object} cls
		 */
		toggleClass: function(obj, cls) {
			return toggleClass(obj, cls);
		}
	}

};