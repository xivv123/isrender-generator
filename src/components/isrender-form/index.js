// 导入组件
import isrenderForm from './core.vue';

// 安装函数
const install = function(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component(isrenderForm.name, isrenderForm);
};

// 自动安装（当检测到 Vue 全局变量存在时）
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

// 导出组件
export default {
  // 安装方法
  install,
  // 组件本身
  isrenderForm
};

// 导出单独组件
export { isrenderForm }; 