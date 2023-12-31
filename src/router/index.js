import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import MinhaConta from '../views/MinhaConta'
import PainelRegrasGratificacoes from '../views/abastecimento/PainelRegrasGratificacoes'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/minhaconta',
    name: 'minhaconta',
    component: MinhaConta
  },
  {
    path: '/painelregrasgratificacoes',
    name: 'painelregrasgratificacoes',
    component: PainelRegrasGratificacoes
  },

  {
    path: "*",
    name: "erro404",
    component: () => import(
      "../views/Erro404"
    )
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
