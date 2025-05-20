import isRender from './form-core.vue';

// 安装函数
const install = function(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component(isRender.name, isRender);
};

// 自动安装（当检测到 Vue 全局变量存在时）
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

// 创建插件对象
const plugin = {
  install,
  // 同时导出组件实例，便于按需引入
  isRender: isRender
};

// 支持全局使用 Vue.use() 安装
export default plugin;

// 支持按需导入的命名导出
export { isRender }; 