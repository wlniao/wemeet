function openDocs(file) {
	if (dd.ios || dd.android) {
		dd.ready(() => {
			dd.biz.cspace.saveFile({
				url: file.url,
				name: file.name,
				corpId: wjs.corpId,
				onSuccess: function (e) {
					e.data[0].corpId = wjs.corpId;
					dd.biz.cspace.preview(e.data[0]);
				},
				onFail: function (err) {
					dd.device.notification.alert({ message: err.errorMessage });
				}
			});
		});
	} else {
		window.open(file.link);
	}
}
function openFile(file, fn) {
	if (dd.ios || dd.android) {
		dd.ready(() => {
			dd.biz.cspace.saveFile({
				url: file.url,
				name: file.name,
				corpId: wjs.corpId,
				onSuccess: function (e) {
					e.data[0].corpId = wjs.corpId;
					dd.biz.cspace.preview(e.data[0]);
				},
				onFail: function (err) {
					dd.device.notification.alert({ message: err.errorMessage });
				}
			});
		});
	} else {
		window.open(file.link);
	}
}
function sendMsg(msg, fn) {
	try {
		dd.ready(function () {
			dd.biz.chat.pickConversation({
				userId: '02190440654337',
				isConfirm: false, //是否弹出确认窗口，默认为true
				corpId: wjs.corpId,
				onFail: function (err) { },
				onSuccess: function (info) {
					if (fn) {
						fn(info);
					} else {
						Vue.prototype.api.post(location.pathname + '?do=sendto&cid=' + info.cid, msg).then(res => {
							alert(JSON.stringify(res));
						}, res => { });
					}
				}
			});
		});
		dd.error(function (err) {
			alert(JSON.stringify(err));
		});
	} catch (e) {
		alert(e);
	}
}