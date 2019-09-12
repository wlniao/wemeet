let dingCss = '', tplContact = '', tplUserSelect = '';
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

tplUserSelect += '<div class="ding-select">';
tplUserSelect += '  <div style="line-height:30px"><el-tag v-for="item in data" closable v-on:close="changeValue(item)">{{item.label}}</el-tag></div>';
tplUserSelect += '  <div class="wln-mask-layout" v-if="mask" @click="close">';
tplUserSelect += '    <div class="wln-mask-body" loading="true" @click.stop="empty" style="width:700px;min-height:500px;margin-top:60px;border-radius:6px;overflow:hidden;">';
tplUserSelect += '      <div style="line-height:40px;text-align:center;font-size:18px;border-bottom:1px solid #e2e2e2">';
tplUserSelect += '        <el-button size="none" @click="close" style="position:absolute;top:6px;left:6px;color:#333333;font-size:20px;padding:3px !important;"><i class="el-icon-close"></i></el-button>';
tplUserSelect += '        <font>{{title}}</font>';
tplUserSelect += '        <el-button size="none" @click="submit" style="position:absolute;top:6px;right:6px;color:#ffffff;background:#4497F9;font-size:14px;padding:6px 10px !important;"><i class="el-icon-check"></i> 确定选择</el-button>';
tplUserSelect += '      </div>';
tplUserSelect += '      <div style="margin:20px 30px">';
tplUserSelect += '        <div style="width:250px;float:left">';
tplUserSelect += '          <div class="ding-select-tip">部门</div>';
tplUserSelect += '          <div class="ding-select-box" style="height:352px">';
tplUserSelect += '            <el-tree ref="tree" node-key="value" v-on:node-click="loadUser" highlight-current :data="depts" current-node-key="1" default-expanded-keys="[\'1\']"></el-tree>';
tplUserSelect += '          </div>';
tplUserSelect += '        </div>';
tplUserSelect += '        <div style="width:360px;float:right">';
tplUserSelect += '          <div class="ding-select-tip">人员</div>';
tplUserSelect += '          <div class="ding-select-box" style="height:200px">';
tplUserSelect += '            <el-checkbox-group v-model="select" v-if="users.length > 0"><el-checkbox v-on:change="changeUser(item)" :label="item.value" v-for="item in users">{{item.label}}</el-checkbox></el-checkbox-group>';
tplUserSelect += '            <div style="text-align:center;color:#9c9c9c" v-else>此部门暂无人员</div>';
tplUserSelect += '          </div>';
tplUserSelect += '          <div class="ding-select-tip"><span>{{values.length}}人</span>已选</div>';
tplUserSelect += '          <div class="ding-select-box" style="height:100px;line-height:30px">';
tplUserSelect += '            <el-tag v-for="item in values" closable v-on:close="changeUser(item)">{{item.label}}</el-tag>';
tplUserSelect += '          </div>';
tplUserSelect += '        </div>';
tplUserSelect += '      </div>';
tplUserSelect += '    </div>';
tplUserSelect += '  </div>';
tplUserSelect += '</div>';
Vue.component('ding-select', {
	template: tplUserSelect,
	props: {
		title: { type: String, default: '选择人员' },
		data: { type: Array, default: [] }
	},
	data: function () {
		return {
			mask: false,
			select: [],
			values: [],
			depts: [],
			users: []
		};
	},
	methods: {
		empty() { },
		close() {
			this.mask = false;
		},
		loadUser(e) {
			asyncGet('/dingtalk/departmentusers?dept=' + e.value).then(res => {
				this.users = res.length > 0 ? res : [];
			}).catch(res => { });
		},
		changeUser(item) {
			let i = this.values.map(item => item.value).indexOf(item.value);
			if (i < 0) {
				this.values.push({ value: item.value, label: item.label });
			} else {
				this.values.splice(i, 1);
				this.select.splice(this.select.indexOf(item.value), 1);
			}
		},
		changeValue(item) {			
			this.$emit('change', this.data.filter(i => i.value !== item.value));
		},
		submit() {
			this.$emit('change', this.values);
			this.mask = false;
		},
		show() {
			let t = this;
			t.users = [];
			t.values = t.data.filter(i => true);
			t.select = t.data.map(i => i.value);
			if (t.depts.length > 0) {
				t.mask = true;
				t.loadUser({ value: '1' });
			} else {
				let loading = t.$loading({ lock: true, text: 'Loading', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' });
				asyncGet('/dingtalk/contact?do=tree').then(res => {
					loading.close();
					if (res.success) {
						t.mask = true;
						t.depts = res.tree;
						t.loadUser({ value: '1' });
					} else {
						Vue.prototype.$message({ type: 'info', message: res.message });
					}
				}).catch(res => { loading.close(); });
			}
		}
	}
});

dingCss += '.el-scrollbar__wrap{overflow-y:auto;overflow-x:hidden !important}';
dingCss += '.ding-select .el-tag{user-select:none;margin:0px 6px 3px 0px !important;line-height:26px; !important;height:28px; !important}';
dingCss += '.ding-select-tip{line-height:30px}.ding-select-tip>span{float:right;color:#9E9E9E}';
dingCss += '.ding-select-box{background:#f9f9f9;padding:10px;border-radius:5px;border:1px solid #dadada;overflow-x:hidden;overflow-y:auto;}';
dingCss += '.ding-select-box .el-tree{background:transparent !important}';
dingCss += '.ding-select-box .el-tree-node.is-current>.el-tree-node__content{background-color:#cbeef3 !important}';
dingCss += '.ding-select-box .el-checkbox{width:105px !important;margin-right:0 !important;padding-left:5px !important;}.ding-select-box .el-checkbox-group{line-height:20px;}';

frag = document.createDocumentFragment();
frag.appendChild(document.createTextNode(dingCss));
ele = document.createElement('style');
ele.type = 'text/css';
ele.appendChild(frag);
document.getElementsByTagName('head')[0].appendChild(ele);