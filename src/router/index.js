import Vue from 'vue'
import Router from 'vue-router'
import home from '../pages/home.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/designer-to-render-example',
    name: 'designer-to-render-example',
    component: () => import('../components/designer-to-render-example.vue')
  }
]

export default new Router({
  routes
})