/*!
 * Wlniao Control for Vue v0.0.1
 * (c) 2019 Wlniao Studio
 * Released under the MIT License.
 */
(function () {
	let msg = '请求正在处理中，请稍候';
	let o = axios.create({
		baseURL: '',
		withCredentials: false
	});
	window.ts = 0;
	window.ds = {
		key: '',
		page: 1,
		size: 10,
		total: 0,
		rows: [],
		list: [],
		message: '数据加载中'
	};
	window.asyncGet = (url, data) => {
		return new Promise(function (resolve, reject) {
			o.get(url, {
				params: data
			}).then(res => {
				resolve(res.data);
			}).catch(res => {
				Vue.prototype.$message({ type: 'info', message: res.message });
				reject();
			});
		});
	};
	window.asyncPost = (url, data) => {
		return new Promise(function (resolve, reject) {
			o.post(url, data).then(res => {
				resolve(res.data);
			}).catch(res => {
				Vue.prototype.$message({ type: 'info', message: res.message });
				reject();
			});
		});
	};
	window.get = (url, data, timeout) => {
		return new Promise(function (resolve, reject) {
			if (new Date().getTime() - ts < (timeout ? timeout : 10000)) {
				Vue.prototype.$message({ type: 'info', message: msg });
			} else {
				ts = new Date().getTime();
				o.get(url, {
					params: data
				}).then(res => {
					ts = 0;
					resolve(res.data);
				}).catch(res => {
					ts = 0;
					Vue.prototype.$message({ type: 'info', message: res.message });
					reject();
				});
			}
		});
	};
	window.post = (url, data, timeout) => {
		return new Promise(function (resolve, reject) {
			if (new Date().getTime() - ts < (timeout ? timeout : 10000)) {
				Vue.prototype.$message({ type: 'info', message: msg });
			} else {
				ts = new Date().getTime();
				o.post(url, data).then(res => {
					ts = 0;
					resolve(res.data);
				}).catch(res => {
					ts = 0;
					Vue.prototype.$message({ type: 'info', message: res.message });
					reject();
				});
			}
		});
	};
	window.openTab = (url, name) => {
		if (window.parent !== window && window.parent.openTab) {
			window.parent.openTab(url, name || '新窗口');
		} else {
			location.href = url;
		}
	};
	window.backTab = ( name) => {
		if (window.parent !== window && window.parent.activeTab) {
			window.parent.activeTab(name || document.title);
		} else {
			history.back();
		}
	};
	window.setTab = () => { window.parent !== window && window.parent.setTab && (window.parent.setTab(location.href, document.title)); };
})();