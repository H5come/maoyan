import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'//首页
import hotShowing from '@/components/hotShowing'//正在热映/即将上映
import mtDetail from '@/components/mtDetail'//影片选影院
import cinemaDetail from '@/components/cinemaDetail'//影院详情
import mtPay from '@/components/mtPay'//确认支付
import addCard from '@/components/addCard'//添加卡号
import addCard1 from '@/components/addCard1'//手动添加卡号
import mtSeat from '@/components/mtSeat'//选座
import mtPayNext from '@/components/mtPayNext'//支付订单
import payOk from '@/components/payOk'//支付成功
import orderDetail from '@/components/orderDetail'//订单详情
import orderList from '@/components/orderList'//订单列表

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'index'
      }
    },
    {
      path: '/index',
      name: 'index',
      component: index,
    },
    {
	    	path:'/hotShowing',
	    	name:'hotShowing',
	    	component:hotShowing
    },
    {
	    	path:'/mtDetail/:movie_id',
	    	name:'mtDetail',
	    	component:mtDetail
    },
    {
	    	path:'/cinemaDetail',
	    	name:'cinemaDetail',
	    	component:cinemaDetail
    },
    {
	    	path:'/mtPay/:order_id',
	    	name:'mtPay',
	    	component:mtPay
    },
    {
	    	path:'/addCard/:card_no/:card_number',
	    	name:'addCard',
	    	component:addCard
    },
    {
	    	path:'/addCard1',
	    	name:'addCard1',
	    	component:addCard1
    },
    {
	    	path:'/mtSeat/:id',
	    	name:'mtSeat',
	    	component:mtSeat
    },
    {
	    	path:'/mtPayNext/:order_id',
	    	name:'mtPayNext',
	    	component:mtPayNext
    },
    {
	    	path:'/payOk',
	    	name:'payOk',
	    	component:payOk
    },
    {
	    	path:'/orderDetail/:order_id',
	    	name:'orderDetail',
	    	component:orderDetail
    },
    {
	    	path:'/orderList',
	    	name:'orderList',
	    	component:orderList
    },
  ]
})
