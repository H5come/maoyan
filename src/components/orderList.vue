<template>
	<div class="orderList">
        <div class="orderList-item" v-for="item in list" @click="toOrderDetail(item.id)"> 
	        	<div class="orderList-item-left">
	        		<span class="orderList-item-left-icon"></span>
	        	</div>
	        	<div class="orderList-right">
	        		<h4 class="mt-font16">{{item.movie_name}} {{item.count}}张</h4>
	        		<p class="mt-font14">{{item.featuretime}}</p>
	        		<p class="mt-font14">{{item.cinema_name}}</p>
	        	</div>
        </div>
	    <div class="orderNone" v-show="orderNone">还没有订单哦亲</div>
	</div>
</template>

<script>
	export default{
		created:function(){
			this.$http.get("/wemovie/order.php").then((res)=>{
				if(res.data.code==200){
					console.log(res)
					this.list=res.data.data;
				}else{
					console.log(res)
					this.orderNone=true
				}
			})
		},
		data(){
			return {
				list:[],
				orderNone:false,//是否有订单 默认为false
			}
		},
		methods:{
			toOrderDetail:function(order_id){
				this.$router.push({
					name:"orderDetail",
					params:{
						order_id:order_id
					}
				})
			}
		}
	}
</script>

<style>
	.orderList-item{
		background-color: #FFFFFF;
		padding: 15px;
		display: flex;
		margin-top: 15px;
		align-items: center;
	}
	.orderList-item-left-icon{
		display: inline-block;
	    width: 45px;
	    height: 45px;
	    background: #ccc;
	    border-radius: 50%;
	    color: #fff;
	    text-align: center;
	    background: url(../assets/movie-seatIcon.png);
	    margin-right: 15px;
	}
	.orderList-right .mt-font16{
		color: #333333;
	}
	.orderList-right .mt-font14{
		color: #8f8f94;
	}
	.orderNone{
		text-align: center;
		margin-top: 3rem;
	}
</style>