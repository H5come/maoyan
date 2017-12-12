<template>
	<div class="mtPayNext">
		<div class="mtPayNext-img">
			<img src="../assets/tishi.jpg" alt="" />
		</div>
		<div class="mtPayNext-endTime">
			支付剩余时间
			<div class="mt-font14">{{countDown_minute}} : {{countDown_second}}</div>
		</div>
		<div class="mtPayNext-info vux-1px-tb">
			<div class="mtPayNext-info-img">
				<img src="../assets/11.png"/>
			</div>	
			<div>
				<div class="mt-font16">¥ {{order.diff_price}}</div>
				<div class="mt-order_sn">订单编号：755434242332</div>
			</div>
		</div>
		 <group>
	      	<radio :options="radio" value="wx">
	      		<div slot="each-item">
		      		<svg class="icon" aria-hidden="true">
					    <use xlink:href="#icon-weixinzhifu"></use>
					</svg>
					<span class="mt-font16 wxPay-text">微信支付</span>
				</div>	
	      	</radio>
	    </group>
	    <x-button class="mtPayNext-btn" @click.native="wePay">确认支付 {{order.diff_price}}</x-button>
	</div>
</template>

<script>
	import {Group,Cell,Radio,XButton} from 'vux'
	var	timer;//定时器对象
	export default{
		data(){
			return{
				order:{},
				countDown_minute:"",
				countDown_second:"",
				radio:["wx"],
				wxParams:"",//微信支付需要的参数
				order_id:this.$route.params.order_id,
			}
		},
		components:{
			Group,
			Cell,
			Radio,
			XButton
		},
		methods:{
			wePay:function(){
				console.log("1")
				this.callpay();
			},
			jsApiCall(){//调用微信支付的方法
				var _self=this;
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest',
					JSON.parse(this.wxParams),
					function(res){
						WeixinJSBridge.log(res.err_msg);
						if(res.err_msg=='get_brand_wcpay_request:ok'){
							_self.$http.post("/wemovie/card_order.php?act=actPay",{order_id:_self.order_id}).then((data)=>{
								if(data.data.code == 200){
									_self.$router.replace({
										name:"orderList"
									})
//									alert("成功")
								}else{
									alert(data.data.message);
								}
							})
						}else{
							alert("支付失败！");
//							alert(JSON.stringify(res))
						}
					}
				);
			},
			callpay(){//微信支付浏览器的兼容
				if(typeof WeixinJSBridge == "undefined"){
				    if( document.addEventListener ){
				        document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
				    }else if (document.attachEvent){
				        document.attachEvent('WeixinJSBridgeReady', this.jsApiCall()); 
				        document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall());
				    }
				}else{
				   this.jsApiCall();
				}
			}
		},
		created:function(){
			this.$http.post("/wemovie/card_order.php?act=payParams",{order_id:this.order_id}).then((res)=>{
				if(res.data.code==200){
					var _self=this;
					console.log(res)
					this.order=res.data.data.order;
					this.wxParams=res.data.data.params;
					var time=res.data.data.order.end_paytime;
					timer=setInterval(function(){
						if(time>=0){
							var minute=Math.floor((time / 60) % 60);
							var second=Math.floor(time % 60);
							minute  = minute < 10 ? "0" + minute : minute;
							second  = second < 10 ? "0" + second : second;
							_self.countDown_minute=minute;
							_self.countDown_second=second;
							time--;
							console.log("2")
						}else{
							clearInterval(timer);
							alert("订单已超时！")
						};
					},1000);
				}else{
					alert(res.data.message)
				}
			})
		},
		destroyed () {
		  	clearInterval(timer);
		}
	}
</script>

<style>
	.mtPayNext-img img{
		width: 100%;
		vertical-align: bottom;
	}
	.mtPayNext-info{
		background-color: #FFFFFF;
		display: flex;
		padding: 10px 15px;
	}
	.mtPayNext-endTime{
		padding: 5px 0;
		text-align: center;
		font-size: 12px;
	}
	.mt-order_sn{
		font-size: 14px;
		color: #808080;
	}
	.icon {
		width: 1em; height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}
	.mtPayNext-endTime{
		background-color: #FFFFFF;
	}
	.mtPayNext-btn{
		background-color: #00AAEE!important;
		margin-top: 2rem;
		width: 90%!important;
		color: #FFFFFF!important;
	}
	.mtPayNext-info-img{
		width: 50px;
		margin-right:20px ;
	}
	.mtPayNext-info-img img{
		width: 100%;
	}
	.wxPay-text{
		color: #333;
		margin-left: 10px;
	}
</style>