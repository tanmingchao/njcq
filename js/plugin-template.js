/* 
 * 插件模板，mui 扩展插件，可以参考下面的 模板，（复制即好）
 */
;(function($,win,dom,undefined){
    //默认参数
    var defaultConfig = {

    };

    //插件核心方法
    var CustomForm = {
        /** 实例化调用函数
         * -------------------------
         * @param {Object} arg 插件配置参数
         */
        init:function(arg){
            var self = this;

            if(arg) {

            } else {
                self._logError("初始化参数不存在");
            }
            return slef;
        },

        /** 内部方法，输出错误信息
         *  -----------------------------
         * @param {String} errorMsg 错误信息字符串
         * @param {Boolean} isTypeEr 是否类型错误
         */
        _logError: function(errorMsg, isTypeEr) {
            var self = this;
            if(self.config.Debug) {
                if(isTypeEr) {
                    throw new TypeError(errorMsg);
                } else {
                    throw new Error(errorMsg);
                }
            } else {
                return;
            }

            return self;
        }
    };

    //注册插件
    $.customForm = $.Class.extend(CustomForm);
})(mui,window,document);