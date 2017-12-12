<template>
	<div class="mtPay">
		<div class="mtPay-info">
			<div class="mtPay-countdown">
				<span class="iconfont icon-shizhong"></span>
				<span class="mt-font14">{{countDown_minute}}:{{countDown_second}}</span>
			</div>
			<div>{{order.movie_name}}</div>
			<div class="mt-font14">{{order.time}}</div>
			<div class="mt-ellipsis mt-font14">{{order.cinema_name}} {{order.hall_name}}</div>
			<div class="mtPay-movieSeat">
				<div class="mtPay-movieSeat-item" v-for="item in order.seat_info">{{item}}</div>
			</div>
		</div>
		<div class="mtPay-handle vux-1px-b">
			<div class="mtPay-handle-add" @click="selectAdd=!selectAdd"><span class="iconfont icon-icon02"></span>添加观影券/现金券/优惠码</div>
		</div>
		<!--卡列表-->
		<div class="mtPay-card-box">
			<swipeout class="vux-1px-tb">
				<swipeout-item v-for="(item,index) in cards" :key="index">
					<div slot="right-menu">
						<swipeout-button type="warn" @click.native="removeCard(item.id,index)">删除</swipeout-button>
					</div>
					<div slot="content" class="mt-font12">
						<div class="card-no" v-show="item.total_time_points==0||item.status==1"></div>
						<label class="mtPay-label vux-1px-b" @click="checkedboxClick(index)">
							<div>
								<input type="checkbox" :data-num="item.buy_count" :id="'mtPay_'+index" class="weui-check" :value="item.id" v-model="item.checked">
								<i class="weui-icon-checked vux-checklist-icon-checked"></i>
							</div>
							<div class="mtPay-label-content">
								<div>观影券：{{item.card_no}} <span class="mtPay-label-freq">余额：{{item.total_time_points}}次</span></div>
								<div>有效期至：{{item.validity}}</div>
								<div>抵扣金额：<span class="mt-colorRed">-¥ {{item.unit_coupons*item.buy_count}}</span></div>
							</div>
						</label>
					 	<div style="float: right;" class="mtPay-label-item-number">
						 	<a @click="sub(index)" class="vux-number-selector vux-number-selector-sub">
					          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><defs></defs><path d="M863.74455 544.00086 163.424056 544.00086c-17.664722 0-32.00086-14.336138-32.00086-32.00086s14.336138-32.00086 32.00086-32.00086l700.320495 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.440237 544.00086 863.74455 544.00086z"></path></svg>
					        </a>
					        <input type="number" v-model="item.buy_count" readonly="readonly" class="vux-number-input" :name="item.id" :data-id="item.buy_count"/>
					        <a @click="add(index)" class="vux-number-selector vux-number-selector-plus">
					          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs></defs><path d="M863.328262 481.340895l-317.344013 0.099772L545.984249 162.816826c0-17.664722-14.336138-32.00086-32.00086-32.00086s-31.99914 14.336138-31.99914 32.00086l0 318.400215-322.368714-0.17718c-0.032684 0-0.063647 0-0.096331 0-17.632039 0-31.935493 14.239806-32.00086 31.904529-0.096331 17.664722 14.208843 32.031824 31.871845 32.095471l322.59234 0.17718 0 319.167424c0 17.695686 14.336138 32.00086 31.99914 32.00086s32.00086-14.303454 32.00086-32.00086L545.982529 545.440667l317.087703-0.099772c0.063647 0 0.096331 0 0.127295 0 17.632039 0 31.935493-14.239806 32.00086-31.904529S880.960301 481.404542 863.328262 481.340895z"></path></svg>
					        </a>
				        </div>
					</div>
				</swipeout-item>
			</swipeout>
		</div>
		<div class="mtPay-bottom-fix vux-1px-t">
			<div class="mtPay-bottom-fix-price mt-font14">
				<div>票价</div>
				<div><span>¥ {{order.unit_price}} X {{order.count}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>小计 ¥ {{order.total_price}}</span></div>
			</div>
			<div class="mtPay-bottom-fix-price mt-font14">
				<div>聚优卡抵扣</div>
				<div class="mt-colorRed">-¥{{order.order_total_coupons}}</div>
			</div>
			<div class="mtPay-bottom-fix-btn" @click="toPay">确定支付 ¥{{order.diff_price}}</div>
		</div>
		<x-dialog v-model="selectAdd" hide-on-blur>
			<!--<group title="选择添加方式" label-align="left">
				<cell class="mt-font16" title="手动添加" is-link @click.native="toAddCard">
					<svg slot="icon" class="icon selectAddCard-icon" aria-hidden="true">
					    <use xlink:href="#icon-tianxiexinxi"></use>
					</svg>
				</cell>
				<cell class="mt-font16" title="扫码添加" is-link @click.native="getwxQRCode">
					<svg slot="icon" class="icon selectAddCard-icon" aria-hidden="true">
					    <use xlink:href="#icon-saoma"></use>
					</svg>
				</cell>
			</group>-->
			<div class="mtDialog-title vux-1px-b">选择添加方式</div>
			<div class="mtDialog-content">
				<div class="mtDialog-content-img" @click="getwxQRCode"><img src="../assets/saoma.png" alt="" /></div>
				<div class="mtDialog-content-img" @click="toAddCard"><img src="../assets/shoudong.png" alt="" /></div>
			</div>
		</x-dialog>
	</div>
</template>

<script>
	import { Swipeout, SwipeoutItem, SwipeoutButton, XNumber, XDialog, Group, Cell } from 'vux'
	var timer;
	export default {
		data() {
			return {
				appId: "",
				timestamp: "",
				nonceStr: "",
				signature: '',
				order: {},
				cards: [],
				countDown_minute: "",
				countDown_second: "",
				selectAdd: false,
				valArr: [], //选择的id数组
				valObj: {}, //选择的id以及数量对象
				order_id: this.$route.params.order_id,
			}
		},
		components: {
			Swipeout,
			SwipeoutItem,
			SwipeoutButton,
			XNumber,
			XDialog,
			Group,
			Cell
		},
		created: function() {
			this.getCardList();
		},
		methods: {
			getwxQRCode: function() {
				var self = this;
				self.$wechat.scanQRCode({
					needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
					success: function(res) {
						var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
						self.$http.get("/wemovie/wxscancode.php?act=getCodeParams", {
							params: {
								codeUrl: result
							}
						}).then((res) => {
							if(res.data.code == 200) {
								self.$router.push({
									name: "addCard",
									params: {
										card_no: res.data.data.card_no,
										card_number: res.data.data.card_number
									}
								})
							} else {
								alert(res.data.message)
							}
						})
					}
				});
			},
			//页面渲染
			getCardList: function() {
				var _self = this;
				this.$http.post("/wemovie/card_order.php?act=index", {
					order_id: this.order_id
				}).then((res) => {
					console.log(res)
					if(res.data.code == 200) {
						this.order = res.data.data.order;
						this.cards = res.data.data.cards;
						for(var i=0; i<this.cards.length;i++){
							this.cards[i].checked=false;
						}
						var time = res.data.data.order.end_paytime;
						timer = setInterval(function() {
							if(time >= 0) {
								var minute = Math.floor((time / 60) % 60);
								var second = Math.floor(time % 60);
								minute = minute < 10 ? "0" + minute : minute;
								second = second < 10 ? "0" + second : second;
								_self.countDown_minute = minute;
								_self.countDown_second = second;
								time--;
								console.log('定时器',1)
							} else {
								clearInterval(timer);
								alert("订单已超时！")
							};
						}, 1000);
					} else {
						alert(res.data.message)
					}
				})
			},
			sub:function(index){
				if(this.cards[index].buy_count>0){
					this.cards[index].buy_count--;
					this.calc();
				}
				if (this.cards[index].buy_count == 0 && this.cards[index].checked == true) {
					this.cards[index].checked = false
				}
			},
			add:function(index){
				// 获取当前以选择次数
				var currNums = this.ckeckCurrNums()
				if ((currNums + 1) > this.order.count) {
					alert("抵扣次数不能大于购买次数！")
					return 
				}
				if(this.cards[index].total_time_points==this.cards[index].buy_count){
					alert("该卡剩余次数不足！")
					return;
				}
				this.cards[index].buy_count++;
				this.cards[index].checked=true;
				this.calc();
			},
			// 获取当前次数
			ckeckCurrNums () {
				// 当前选中项
				var curritem = this.cards.filter(m => m.checked == true)
				// 当前次数
				var value = 0
				curritem.forEach(item => {
					value += item.buy_count;
				})
				return value
			},
			//删除
			removeCard: function(id,index) {
				this.$http.post("/wemovie/card_order.php?act=delBindCard", {
					bind_id: id
				}).then((res) => {
					console.log(res)
					if(res.data.code == 200) {
						delete this.cards.splice(index,1);
						this.calc();
					}else{
						alert(res.data.message)
					}
				})
			},
			//跳转手动输入页面
			toAddCard: function() {
				this.$router.push({
					name: "addCard1"
				})
			},
			// checkbox 选择事件
			checkedboxClick (index) {
//				this.cards[index].checked=!this.cards[index].checked;
				// 当前项是否是选中状态
				if (this.cards[index].checked == false) {
					this.cards[index].buy_count = 0;
				}
				this.calc()
			},
			// 计算价格
			calc () {
				var curritem = this.cards.filter(m => m.checked == true)
				var valObj = {}
				curritem.forEach(item => {
					var key = item.id
					valObj[key] = item.buy_count
				})
				this.valObj=valObj;
				console.log(valObj)
				this.$http.post("/wemovie/card_order.php?act=index", {
					order_id: this.order_id,
					params: valObj
				}).then((res) => {
					console.log(res)
					if(res.data.code == 200) {
						this.order = res.data.data.order;
//						this.cards = res.data.data.cards;
					} else {
						alert(res.data.message);
					}
				})
			},
			toPay: function() {
				this.$http.post('/wemovie/card_order.php?act=done', {
					order_id: this.order_id,
					params: this.valObj
				}).then((res) => {
					if(res.data.code == 200) {
						console.log(res)
						if(res.data.data.order.is_diff == "false") {
							//聚优卡支付
							this.$http.post('/wemovie/card_order.php?act=actPay', {
								order_id: this.order_id
							}).then((res) => {
								console.log(res)
								if(res.data.code == 200) {
									this.$router.replace({
										name: "payOk"
									})
								}else if(res.data.code==458){
									alert(res.data.message);
								}
							})
						} else {
							this.$router.push({
								name: 'mtPayNext',
								params: {
									order_id: this.order_id
								}
							})
						}
					} else {
							console.log(res);
						alert(res.data.message)
					}
				})
			},
		},
		destroyed () {
		  clearInterval(timer)
		}
	}
</script>

<style>
	.mtPay {
		padding-bottom: 130px;
	}
	
	.mtPay-info {
		position: relative;
		padding: 15px;
		background: -webkit-gradient(linear, 0 0, 0 bottom, from(#4eb4ef), to(#406ec3));
		color: #FFFFFF;
		text-align: center;
		line-height: 1.5rem;
	}
	
	.mtPay-info .mtPay-countdown {
		position: absolute;
		display: flex;
		color: #FFFFFF;
		right: 0;
		background-color: rgba(0, 0, 0, .3);
		padding: .2rem .3rem;
		line-height: 1;
		align-items: center;
		width: 3.2rem;
		justify-content: space-around;
		border-radius: 10px 0 0 10px;
		top: 1.2rem;
	}
	
	.mtPay-movieSeat {
		margin-top: .5rem;
		margin-bottom: .5rem;
	}
	
	.mtPay-movieSeat-item {
		display: inline-block;
		width: 3.5rem;
		line-height: 1.5rem;
		background-color: #f5f5f5;
		color: #333;
		border-radius: 5px;
		font-size: .7rem;
		margin-right: .3rem;
	}
	
	.mtPay-handle {
		background-color: #FFFFFF;
	}
	
	.mtPay-handle-add {
		color: #00aaee;
		font-size: 14px;
		padding: 10px;
	}
	
	.mtPay-handle-add .icon-icon02 {
		font-size: 22px;
		margin-right: 5px;
	}
	
	.mtPay-bottom-fix {
		position: fixed!important;
		width: 100%;
		background-color: #FFFFFF;
		bottom: 0;
	}
	
	.mtPay-bottom-fix-price {
		display: flex;
		margin: 10px;
		justify-content: space-between;
	}
	
	.mtPay-bottom-fix-btn {
		color: #FFFFFF;
		background-color: #00aaee;
		padding: 10px 0;
		text-align: center;
		font-size: .8rem;
		letter-spacing: 3px;
	}
	
	.mtPay-label {
		display: flex;
		line-height: 2;
		padding: 10px 10px 10px 0;
		margin-left: 10px;
	}
	
	.weui-check {
		position: absolute;
		left: -9999em;
	}
	
	.weui-icon-checked:before {
		content: '\EA01';
		color: #C9C9C9;
		font-size: 23px;
		display: block;
	}
	
	.weui-check:checked+.weui-icon-checked:before {
		content: '\EA06';
		color: #09BB07;
	}
	
	.mtPay-label>* {
		pointer-events: none;
	}
	
	.mtPay-label-content {
		flex: 1;
	}
	
	.mtPay-label-item-number {
		font-size: 14px!important;
		position: absolute!important;
		bottom: 10px;
		right: 0px;
	}
	
	.mtPay-label-item-number:before {
		display: none!important;
	}
	.mtPay-label-item-number input{
		width: 30px;
	}
	.mtPay-label-freq {
		float: right;
		color: #ff7900;
	}
	
	.selectAddCard-icon {
		margin-right: 10px;
		font-size: 24px;
	}
	
	.card-no {
		background-image: url(../assets/bukeyong.png);
		background-size: cover;
		height: 100%;
		width: 100%;
		z-index: 1;
		position: absolute;
	}
	.mtDialog-title{
		height: 44px;
		font-size: 16px;
		line-height: 44px;
	}
	.mtDialog-content{
		display: flex;
		height: 98px;
		align-items: center;
		justify-content: space-around;
	}
	.mtDialog-content-img img{
		width: 50px;
		vertical-align: bottom;
	}
	.mtDialog-title.vux-1px-b:after{
		border-color: #94daf6;
	}
</style>