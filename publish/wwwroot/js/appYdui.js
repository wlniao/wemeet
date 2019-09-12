var ts = 0;
var vpath = '';
var router = new VueRouter({ mode: 'history' });
Vue.use(Vuex, VueRouter, ydui);
const store = new Vuex.Store({
	state: {
		tip: '',
		navShow: false,
		navList: [ ]
	},
	mutations: {
		tip(state, msg) {
			state.tip = msg;
		},
		setNav(state, obj) {
			// 使用：setTimeout(() => { t.$store.commit('setNav', {hide: false, active: '/ucenter', addDot: '/ucenter', delDot: '/'}) }, 100)
			let path = obj.active === '/mobile' ? '/' : obj.active;
			for (var i = 0; i < state.navList.length; i++) {
				if (obj.show) {
					state.navShow = true;
				}
				if (obj.hide) {
					state.navShow = false;
				}
				if (obj.addDot && state.navList[i].link === obj.addDot) {
					state.navList[i].dot = true;
				}
				if (obj.delDot && state.navList[i].link === obj.delDot) {
					state.navList[i].dot = false;
				}
				if (obj.active) {
					if (state.navList[i].link === path) {
						state.navShow = obj.hide ? false : true;
						state.navList[i].active = true;
					} else {
						state.navList[i].active = false;
					}
				}
			}
		}
	}
});
Vue.prototype.$store = store;
Vue.config.productionTip = false;

axios.defaults.withCredentials = true;
Vue.prototype.showLoading = (mes) => { Vue.prototype.$dialog.loading.open(mes); };
Vue.prototype.hideLoading = () => { Vue.prototype.$dialog.loading.close(); };
Vue.prototype.notify = (mes) => { Vue.prototype.$dialog.notify({ mes: mes, timeout: 1500 }); };
Vue.prototype.success = (mes) => { Vue.prototype.$dialog.toast({ mes: mes, timeout: 1500, icon: 'success' }); };
Vue.prototype.toast = (mes, icon) => { Vue.prototype.$dialog.toast({ mes: mes, timeout: 1500, icon: icon }); };
Vue.prototype.confirm = (mes, yes, no) => {
	if (yes && no && typeof yes === 'function' && typeof no === 'function') {
		Vue.prototype.$dialog.confirm({ mes: mes, opts: [{ txt: '取消', color: false, callback: no }, { txt: '确定', color: true, callback: yes }] });
	} else if (yes && typeof yes === 'function') {
		Vue.prototype.$dialog.confirm({ mes: mes, opts: [{ txt: '取消', color: false }, { txt: '确定', color: true, callback: yes }] });
	} else {
		Vue.prototype.$dialog.alert({ mes: mes });
	}
};
Vue.prototype.alert = (mes, fn) => {
	if (fn && typeof fn === 'function') {
		Vue.prototype.$dialog.confirm({ mes: mes, opts: [{ txt: '确定', color: true, callback: fn }] });
	} else {
		Vue.prototype.$dialog.alert({ mes: mes });
	}
};
Vue.prototype.to = (page) => {
	if (page) {
		router.push(url + '/' + page);
	} else if (url) {
		router.push(url);
	} else {
		router.push('/');
	}
};
Vue.prototype.api = (function () {
	let o = axios.create({ baseURL: '', withCredentials: true, timeout: 20000 });
	o.interceptors.request.use(function (res) {
		// 处理请求拦截
		if (localStorage.sessionkey) {
			if (res.params) {
				res.params['sessionkey'] = localStorage.sessionkey;
			} else {
				res.params = { 'sessionkey': localStorage.sessionkey };
			}
		}
		return res;
	}, function (error) { });
	o.interceptors.response.use(function (res) {
		// 处理响应拦截
		if (res.status === 200) {
			return res.data;
		} else {
			Vue.prototype.$dialog.loading.close();
			console.log('响应异常:', res.config.url, res);
			return res;
		}
	}, function (error) {
		// 处理响应失败拦截
		Vue.prototype.hideLoading();
		Vue.prototype.notify('网络异常，请尝试重新提交');
		return Promise.reject(error);
	});
	return o;
})();