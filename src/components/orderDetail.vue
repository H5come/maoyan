<template>
	<div class="m-orderDetail m-bodyColor">
			<ul class="m-titleBox m-padding m-margin9 m-white">
				<li class="m-font14">{{info.movie_name}} {{info.count}}张</li>
				<li class="m-Colore82">{{info.featuretime}}</li>
				<li class="m-colora04">{{info.cinema_name}}</li>
				<li class="m-colora04">{{info.seat_info}}</li>
			</ul>
			<ul class="m-titleBox m-padding m-margin9 m-white">
				<li class="m-font14">取票电影</li>
				<li class="m-colora04">在电影院取票机输入取票码取电影票</li>
				<li class="m-font14">{{info.msg}}</li>
			</ul>
			<ul class="m-titleBox m-padding m-margin9 m-white">
				<li class="m-font14 m-moreMargin">支付信息</li>
				<li class="m-flexLi"><span class="m-colora04">订单总额:</span><span class="m-Colore82">￥{{info.money}}</span></li>
				<li class="m-flexLi"><span class="m-colora04">优惠券抵 :</span><span class="m-Colore82 m-after m-lowerMargin"> -￥{{info.cika_price}} <i class="iconfont icon-icontishiwenhao" @click="selectAdd=!selectAdd"></i></span></li>
				<li class="m-flexLi"><span class="m-colora04">实付金额：</span><span class="m-Colore82 m-lowerMargin1"> -￥{{info.diff_price}}</span></li>
			</ul>
			<ul class="m-titleBox m-padding m-margin9 m-white">
				<li class="m-font14 m-moreMargin"><span>订单状态</span><span>{{info.order_status_cn}}</span></li>
				<li class="m-flexLi m-colora04"><span>订单号码:</span><span>{{info.order_sn}}</span></li>
				<li class="m-flexLi m-colora04"><span>下单时间:</span><span>{{info.add_time}}</span></li>
				<li class="m-flexLi m-colora04"><span>手机号码:</span><span>{{info.mobile}}</span></li>
			</ul>
			<ul class="m-titleBox m-padding m-margin9 m-white">
				<li class="mt-font14">取票需知</li>
				<li class="m-colora04">1、请提前到达影院现场，找到自动取款机，打印纸质电影票，完成取票。</li>
				<li class="mt-font14 m-colora04">2、如现场自助取票机无法打印电影票，请联系影院工作人员处理。</li>
				<li class="mt-font14 m-colora04">3、凭打印好的纸质电影票，检票入场观影。</li>
			</ul>
			<x-dialog v-model="selectAdd" hide-on-blur>
				<div class="m-alertOrderDeatil m-white">
					<div class="m-top">抵扣详情</div>
					<ul class="m-alertUl m-padding12">
						<li v-for="item in info.cards" class=" m-alertLi"><span class="mt-font14">{{item.card_no}}:</span><span class="m-Colore82">抵扣{{item.pay_count}}次，共<span v-text="item.pay_count*item.coupons_price"></span>元</span></li>
					</ul>
				</div>
			</x-dialog>	
	</div>
</template>

<script>
	import { XDialog } from 'vux'
	export default{
		data(){
			return {
				selectAdd:false,
				info:{},
			}
		},
		methods:{
			
		},
		components:{
			XDialog
		},
		created:function(){
			this.$http.get("/wemovie/order.php?act=detail",{params:{order_id:this.$route.params.order_id}}).then((res)=>{
				if(res.data.code==200){
					console.log(res)
					this.info=res.data.data;
				}else{
					alert(res.data.message)
				}
			})
		}
		
	}
</script>

<style>
li{
	list-style: none;
}
.m-bodyColor{
	background-color:#ebebf0;
}
.m-margin9{
	margin:9px 0;
}
.m-padding{
	padding:17px 15px;
}
.m-white{
	background-color: #fff;
}
.m-Colore82{
	color:#e82413;
	font-size:12px;
}
.m-orderDetail{
	width:100%;
	height:100%;
	position: relative;
	padding-top:1px;
}
.m-font14{
	font-size:14px;
	color:#1d1d1d;
	width:100%;
	overflow:hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.m-colora04{
	color:#a0a0a4;
	font-size:12px;
}
.m-titleBox{
	min-height: 70px;
}
.m-moreMargin{
	margin-bottom:10px;
	display:flex;
	justify-content: space-between;
}
.m-lowerMargin{
	margin-left:-12px;
}
.m-lowerMargin1{
	margin-left:-17px;
}
.m-titleBox>li{
	line-height:20px;
}
.m-flexLi>span:first-child{
	margin-right:22px;
}
.m-after{
	position:relative;
}
.m-after .iocn-tu{
	content:"";
	position:absolute;
	font-size:12px;
	color:#a0a0a4;
	right:-30px;
}
.m-alertOrderDeatil{
	min-height:184px;
	border-radius:8px;
}
.m-padding12{
	padding:0 12px;
}
.m-alertOrderDeatil .m-top{
	text-align:center;
	position:relative;
	height:44px;
	line-height:44px;
}
.m-top .icon-cha{
	position: absolute;
	right:12px;
	top:-3px;
	color:#A0A0A4;
}
.m-alertUl,.m-alertUl .m-alertLi{
	position:relative;
}
.m-alertUl:after,.m-alertUl .m-alertLi:after{
	content:"";
	position:absolute;
	left:0;
	top:-1px;
	width: 100%;
	border-top:1px solid #94daf6;
	transform: scaleY(0.5);
}
.m-alertUl .m-alertLi:after{
	border-top:none;
	border-bottom:1px solid #a0a0a4;
}
.m-alertUl .m-alertLi{
	display: flex;
	justify-content:space-around;
	align-items: center;
	height:44px;
}
.m-alertUl .m-alertLiBorderNone{
	border-bottom:none;
}
.m-flexLi .iconfont.icon-icontishiwenhao{
	font-size: 20px;
    position: absolute;
    top: -4px;
    right: -25px;
    color: #ccc;
}
</style>