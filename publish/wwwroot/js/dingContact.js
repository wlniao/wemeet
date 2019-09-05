let tplContact = '';
tplContact += '<div class="wln-mask-layout" v-if="mask" @click="close">';
tplContact += '  <div class="wln-mask-body" loading="true" @click.stop="empty" style="width:1000px;min-height:500px;margin-top:60px;border-radius:6px;overflow:hidden;">';
tplContact += '    <div style="line-height:40px;text-align:center;font-size:18px;border-bottom:1px solid #e2e2e2">';
tplContact += '      <el-button size="none" @click="close" style="position:absolute;top:6px;left:6px;color:#333333;font-size:20px;padding:3px !important;"><i class="el-icon-close"></i></el-button>';
tplContact += '      <font>{{title}}</font>';
tplContact += '      <el-button size="none" @click="submit" style="position:absolute;top:6px;right:6px;color:#ffffff;background:#4497F9;font-size:14px;padding:6px 10px !important;"><i class="el-icon-check"></i> 已选 ({{values.length}})</el-button>';
tplContact += '    </div>';
tplContact += '    <el-cascader-panel ref="cascader" v-model="select" v-on:change="change" :options="options" :props="props" style="border:none;height:300px;"></el-cascader-panel>';
tplContact += '    <div style="border:none;height:168px;background:#f1f1f1;border-top:1px solid #d0d0d0;margin-top:20px;padding:10px 20px;">';
tplContact += '      已选：{{names}}';
tplContact += '    </div>';
tplContact += '  </div>';
tplContact += '</div>';
Vue.component('ding-contact', {
	template: tplContact,
	props: {
		title: { type: String, default: '选择人员' }
	},
	data: function () {
		return {
			mask: false,
			names: '',
			values: [],
			select: [],
			options: [],
			props: {
				lazy: true,
				multiple: true,
				checkStrictly: true,
				lazyLoad(node, resolve) {
					if (node.children && node.children.length > 0) {
						resolve([]);
					} else {
						asyncGet('/dingtalk/contact?dept=' + node.value).then(res => {
							resolve(res.tree);
						});
					}
				}
			}
		};
	},
	methods: {
		empty() { },
		close() {
			this.mask = false;
		},
		change() {
			let nodes = this.$refs.cascader.getCheckedNodes();
			nodes = nodes.sort((a, b) => a.path.join() - b.path.join()).sort((a, b) => a.path.length - b.path.length);
			this.names = nodes.map(i => i.pathLabels.join('-')).join();
			this.values = nodes.map(i => i.path.join('/'));
		},
		show(values, names) {
			let t = this;
			let ids = values.filter(i => i.indexOf('userid_') > 0).map(i => i.split('/')).map(i => i[i.length - 2]);
			let loading = t.$loading({ lock: true, text: 'Loading', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' });
			ids = ids.filter((x, i) => { return ids.indexOf(x) === i; });
			t.names = '';
			t.select = [];
			t.values = [];
			asyncGet('/dingtalk/contact?depts=' + ids.join()).then(res => {
				loading.close();
				if (res.success) {
					t.mask = true;
					t.options = res.tree;
					t.names = names ? names : '';
					if (values.length > 0) {
						t.select = values.map(i => i.split('/'));
					}
				} else {
					Vue.prototype.$message({ type: 'info', message: res.message });
				}
			}).catch(res => {
				loading.close();
			});
		},
		submit() {
			this.$emit('change', this.values, this.names);
			this.mask = false;
		}
	}
});