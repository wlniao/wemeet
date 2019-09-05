var xRouter = new VueRouter({ mode: 'abstract', routes: [] });
xRouter.beforeEach((to, from, next) => {
    location.href = to.path;
});
//浏览器兼容
var ts = 0;
var _ua = navigator.userAgent.toLowerCase();
if (_ua.indexOf('msie') >= 0 || _ua.indexOf('opera') >= 0 || _ua.indexOf('chrome') < 0) {
	document.write('<div style="font-size:12px;color:#333;width:100%;height:40px;line-height:40px;background:#FFC107;text-align:center;position:absolute;z-index:999;top:0;">您正在使用浏览器未完全支持本系统特性，我们推荐使用以下浏览器： <a href="http://browser.qq.com">QQ浏览器</a> / <a href="http://se.360.cn">360安全浏览器</a> / <a href="http://www.google.com/chrome/?hl=zh-CN">Chrome最新版</a></div>');
}
var pager = emptyPager = { size: 10, page: 1, total: 0, rows: [], list: [], key: '', message: '数据加载中', loading: false, index: 1 };
Vue.prototype.getParam = (key) => {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return "";
}
//设置cookie
Vue.prototype.setCookie = (c_name, value, expiredays) => {
    if (expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ";path=/;expires=" + exdate.toGMTString();
    } else {
        document.cookie = c_name + "=" + escape(value) + ";path=/;";
    }
}
//获取cookie
Vue.prototype.getCookie = (name) => {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return (arr[2]);
    }
    else {
        return null;
    }
}
//删除cookie
Vue.prototype.delCookie = (name) => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = Vue.prototype.getCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
    }
}
Vue.prototype.checkLogin = () => {
    if (location.pathname == '/login' && Vue.prototype.getCookie('sid')) {
        history.replaceState(null, '', '/');
        location.reload();
    } else if (location.pathname != '/login' && !Vue.prototype.getCookie('sid')) {
        history.replaceState(null, '', '/login');
        location.reload();
    }
}
Vue.prototype.htmlEncode = (str) => {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    return s;  
}
Vue.prototype.htmlDecode = (str) => {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
}
//日期格式化
Date.prototype.pattern = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份           
		"d+": this.getDate(), //日           
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
		"H+": this.getHours(), //小时           
		"m+": this.getMinutes(), //分           
		"s+": this.getSeconds(), //秒           
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度           
		"S": this.getMilliseconds() //毫秒           
	};
	var week = {
		"0": "/u65e5",
		"1": "/u4e00",
		"2": "/u4e8c",
		"3": "/u4e09",
		"4": "/u56db",
		"5": "/u4e94",
		"6": "/u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}
//字符串格式化
String.prototype.format = function () {
	var args = arguments;
	return this.replace(/\{(\d+)\}/g, function (m, i, o, n) {
		return args[i];
	});
}
//字符串尾部
String.prototype.endWith = function (str) {
	if (str == null || str == "" || this.length == 0 || str.length > this.length)
		return false;
	if (this.substring(this.length - str.length) == str)
		return true;
	else
		return false;
	return true;
}
//字符串头部
String.prototype.startWith = function (str) {
	if (str == null || str == "" || this.length == 0 || str.length > this.length)
		return false;
	if (this.substr(0, str.length) == str)
		return true;
	else
		return false;
	return true;
}