import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import isRender from 'isrender';
import isRender from 'isrender';
import isrenderForm from 'isrender-form';

import EchartsDirective from './utils/echarts-directive';

Vue.use(ElementUI);
Vue.use(isrenderForm);
Vue.use(isRender);
Vue.use(EchartsDirective);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
