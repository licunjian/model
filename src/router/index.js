import Vue from 'vue'
import Router from 'vue-router'
import List from '@/pages/List'
import Add from '@/pages/Add'
import Detail from '@/pages/Detail'
import Edit from '@/pages/Edit'

Vue.use(Router)

export default new Router({
  routes: [
    {path:'/',redirect:'/list'},
    {path: '/list',name: 'list',component: List},
    {path:'/add',name:'add',component:Add},
    {path:'/detail/:meetingId',name:'detail',component:Detail},
    {path:'/edit/:meetingId/:appId/:appOrgId',name:'edit',component:Edit}
  ]
})
