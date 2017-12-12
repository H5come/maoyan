<template>
	<div>
		<div style="height: 44px;">
			<sticky :check-sticky-support="false">
		        <tab :line-width=2 active-color='#00aaee' v-model="index">
		        		<tab-item v-for="(item, index) in titles" :key="index">{{item}}</tab-item>
	        		</tab>
	        	</sticky>	
	    </div>
      <swiper v-model="index" ref="swiper" :show-dots="false" @on-index-change="setHeight">
        <swiper-item  v-for="(item,index) in lists" :key="index">
        	  <div :class="'mt-hot-swiper-box'+index">
	        	<div class="mt-hot-swiper" v-for="hotItems in item" @click="toMtDetail(hotItems.id,index)">
	        		<div class="mt-hot-swiper-img">
		        		<x-img default-src="../../static/zhanwei.jpg" :src="hotItems.path_vertical_s"></x-img>
		        </div>
		        <div class="vux-1px-b mt-hot-swiper-right">
		          	<div class="mt-hot-movieName mt-ellipsis-2">{{hotItems.movie_name}}<i class="mt-pf">{{hotItems.score}}</i></div>
		          	<div class="mt-font12 mt-ellipsis">导演：{{hotItems.director}}</div>
		          	<div class="mt-font12 mt-ellipsis">主演：{{hotItems.actor}}</div>
		          	<div class="mt-font12 mt-ellipsis mt-sysj-color" v-show="index==1">{{hotItems.publish_time}}上映</div>
		        </div>
	         </div>
	      </div>  
        </swiper-item>
      </swiper>
    </div>
</template>

<script>
	import {Tab,Swiper,TabItem,SwiperItem,Sticky,XImg} from 'vux'
	export default{
		components:{
			Tab,
			Swiper,
			TabItem,
			SwiperItem,
			Sticky,
			XImg
		},
		data(){
			return{
				titles:["正在热映","即将上映"],
				index:0,
				lists:{},
			}
		},
		methods:{
			getData:function(){
				this.$http.get("/wemovie/movie.php?act=movies").then((res)=>{
					if(res.data.code==200){
						this.lists=res.data.data;
						this.$nextTick(function(){
							var mtswiperbox=$(".mt-hot-swiper-box0").height()+10;
							this.$refs.swiper.xheight=mtswiperbox+'px'
						})
					}
					console.log(res)
				})
			},
			setHeight:function(currentIndex){
				if(currentIndex==0){
					var mtswiperbox=$(".mt-hot-swiper-box0").height()+10;
				}else{
					var mtswiperbox=$(".mt-hot-swiper-box1").height()+10;
				}
				this.$refs.swiper.xheight=mtswiperbox+'px';
			},
			toMtDetail:function(movie_id,index){
				if(index==0){
					this.$router.push({
			  		 	name:"mtDetail",
			  		 	params:{
							movie_id:movie_id
						}
			  		})
				}
			}
		},
		created:function(){
			this.getData();
		},
	}
</script>

<style>
	.mt-hot-swiper{
		display: flex;
		height: 110px;
		margin: 10px 0;
		overflow: hidden;
	}
	.mt-hot-swiper-img{
		margin: 0 15px;
		margin-bottom: 10px;
	}
	.mt-hot-swiper img{
		display: inline-block;
		width: 75px;
		height: 105px;
	}
	.mt-hot-swiper-right{
		width: calc(100% - 120px);
		padding-right: 15px;
	}
	.mt-pf{
		float: right;
		color: #f22824;
		position: absolute;
	    right: 0;
	    top: 0px;
	    font-size: 18px;
	}
	.mt-hot-swiper-right .mt-font12{
		color: #808080;
	}
	.mt-hot-movieName{
		height: 46px;
		line-height: 1.4;
		position: relative;
		padding-right: 30px;
		font-size: 16px;
	}
	.mt-hot-swiper-right .mt-sysj-color{
		color: #f22824;
	}
</style>