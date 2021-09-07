import Vue from 'vue'
import VueRouter from 'vue-router'
const calculator = ()=> import('../views/Calculator.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Calculator',
    component: calculator
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
