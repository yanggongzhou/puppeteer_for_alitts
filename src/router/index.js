import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/alitts'
    },
    {
      path: '/alitts',
      name: 'alitts',
      component: ()=>import ('@/components/alitts'),
    }
  ]
})
