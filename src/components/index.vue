<template>
	<div class="mt-index">
		<!--轮播-->
		<swiper :list="bannerList" :loop="true" :auto="true">
		</swiper>
		<!--轮播 end-->
		<div class="mt-nav">
			<div class="mt-font16">热门电影</div>
			<div class="mt-font12 mt-icon-right" @click="lookAll">查看全部</div>
		</div>
		<div class="mt-swiper-box">
			<div class="mt-swiper-item" v-for="item in hot_movie" @click="toMtDetail(item.id)">
				<img :src="item.path_vertical_s" />
				<div class="mt-swiper-item-name mt-ellipsis">{{item.movie_name}}</div>
			</div>
		</div>
		<div class="mt-cinema" style="height: 42px;">
			<sticky :check-sticky-support="false" style="z-index: 502;">
				<div class="mt-cinema-nav vux-1px-b">
					<div class="mt-cinema-nav-item vux-1px-r" @click="mtFiltrateArea">{{areaName}}</div>
					<div class="mt-cinema-nav-item" @click="mtAddress">离我最近</div>
				</div>
			</sticky>
		</div>
		<!--影院列表-->
		<div class="mt-cinema-list-box">
			<div class="mt-cinema-list vux-1px-b" v-for="item in cinemas" @click="toCinemaDetail(item.id)">
				<div class="mt-font14">{{item.cinema_name}}<div class="mt-distance mt-font14 mt-colorRed">{{item.distance_cn}}</div></div>
				<div class="mt-cinema-address mt-font12">{{item.cinema_address}}</div>
			</div>
		</div>
		<!--区域筛选-->
		<popup v-model="mtFiltrateVal" position="top" height="40%">
			<group class="mtFiltrate-item">
				<cell class="mt-font14" v-for="(item,index) in area_list" :key="index" :title="item.name" @click.native="filterArea(item.id,item.name)"></cell>
			</group>
		</popup>
		<!--订单悬浮-->
		<div class="mt-orderFixed" @click="toOrderList">
			<svg class="icon" aria-hidden="true">
				<use xlink:href="#icon-dingdan"></use>
			</svg>
			<div style="color: #666;">订单</div>
		</div>
		<!--城市-->
		<div class="mtCity" @click="selectCity"><span class="iconfont icon-ditu-copy-copy"></span>{{city_name}}</div>
		<popup v-model="isCity">
			<group title="选择城市">
				<cell v-for="(item,index) in city_list" :key="index" @click.native="changeCity(item.value)" :title="item.text"></cell>
			</group>
		</popup>
	</div>
</template>

<script>
	import {Swiper,Sticky,Popup,Cell,Group} from 'vux'
	var top=0;
	//滑动到顶部
    function goTop(ele){
   		var top=$(ele).offset().top//获取筛选栏距离顶部高度
 		$('html, body').animate({      //筛选栏点击后自动吸顶
            scrollTop: top
        }, 100);
    }
	export default{
		components:{
			Swiper,
			Sticky,
			Popup,
			Cell,
			Group,
			Popup
		},
		data(){
			return{
				bannerList:[],
				mtFiltrateVal:false,//区域筛选
				cinemas:[],//影院列表
				hot_movie:[],//热门影院
				area_list:{},//区域列表
				areaName:"全城",
				lat:"",//坐标
				lon:"",//坐标
				city_name:"",
				isCity:false,
				city_list:[],
			}
		},
		created:function(){
			var self=this;
			this.$wechat.ready(function(){
				self.mtAddress();
			})
		},
		methods:{
			getData:function(){
				this.$http.get('/wemovie/index.php',{params:{lat:this.lat,lon:this.lon}}).then((res)=>{
					if(res.data.code==200){
						var data=res.data.data;
						this.cinemas=data.cinemas;
						this.hot_movie=data.hot_movie;
						this.area_list=data.area_list;
						this.city_name=data.city_name;
						this.city_list=data.city_list;
						this.bannerList=data.banner.map((item, index) => ({
						  url: '',
						  img: "http://www.juyoufuli.com/data/afficheimg/"+item.ad_code,
						  title:item.ad_name
						}))
//						setTimeout(function(){
							$('html, body').animate({      //筛选栏点击后自动吸顶
					            scrollTop: 0
					        }, 100);
//						},200)
						console.log(res)
					}else{
						console.log(res)
						alert(res.data.message)
					}
				})
			},
			mtAddress:function(){
//				var _self=event.currentTarget;
//				goTop(_self);
				this.areaName="全城"
				var self=this;
			 	this.$wechat.getLocation({
			    	    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			    	    success: function (res) {
			    	    		console.log(res)
			   	    	 	self.lat=res.latitude;
			   	    	 	self.lon=res.longitude;
			   	    	 	self.getData();
			    	    },
			    	    cancel: function (res) {
			    	    		self.getData();
			    	    },
			    	    error:function(res){
			    	    		self.getData();
			    	    },
			    	    fail:function(){
			    	    		self.getData();
			    	    }
			    	});
			},
			mtFiltrateArea:function(){
				this.mtFiltrateVal=!this.mtFiltrateVal;
			},
			lookAll:function(){
				this.$router.push({
		  		 	name:"hotShowing",
		  		})
			},
			filterArea:function(areaId,name){
				this.mtFiltrateVal=!this.mtFiltrateVal;
				this.$http.get("/wemovie/index.php?act=areaCinemas",{params:{districtid:areaId,lat:this.lat,lon:this.lon}}).then((res)=>{
					var data=res.data.data;
					if(res.data.code=200){
						this.cinemas=data.cinemas;
						this.areaName=name;
					}
				})
			},
			toMtDetail:function(movie_id){
				this.$router.push({
		  		 	name:"mtDetail",
		  		 	params:{
						movie_id:movie_id
					}
		  		})
			},
			toCinemaDetail:function(cinema_id){
				this.$router.push({
		  		 	name:"cinemaDetail",
		  		 	query:{
						cinemaid:cinema_id,
					}
		  		})
			},
			//跳转订单列表
			toOrderList:function(){
				this.$router.push({
					name:"orderList"
				})
			},
			//选择城市
			selectCity:function(){
				this.isCity=!this.isCity;
			},
			changeCity:function(cityid){
				this.$http.get('/wemovie/index.php',{params:{lat:this.lat,lon:this.lon,cityid:cityid}}).then((res)=>{
					if(res.data.code==200){
						var data=res.data.data;
						this.cinemas=data.cinemas;
						this.hot_movie=data.hot_movie;
						this.area_list=data.area_list;
						this.city_name=data.city_name;
						this.city_list=data.city_list;
						this.bannerList=data.banner.map((item, index) => ({
						  url: '',
						  img: "http://www.juyoufuli.com/data/afficheimg/"+item.ad_code,
						  title:item.ad_name
						}));
						this.isCity=!this.isCity;
						console.log(res)
					}else{
						console.log(res)
						alert(res.data.message)
					}
				})
			}
		},
		watch:{
			mtFiltrateVal(curVal,oldVal){
				if(curVal==false){
					$('body').removeClass('mt-add');//去掉给body的类
           			 $(window).scrollTop(top);
           			 $(".vux-sticky-box").removeClass("mt-fixed")
				}else{
					var winScrollTop=$(window).scrollTop();
					if(winScrollTop<400){
						top = 400;
		            		$('body').css("top",-top+"px");//给body一个负的top值；
		            }else{
		            		top = $(window).scrollTop();//获取页面的scrollTop；
		            		$('body').css("top",-top+"px");//给body一个负的top值；
		            }
					$(".vux-sticky-box").addClass("mt-fixed")
		            $('body').addClass('mt-add');//给body增加一个类，position:fixed; 
				}
			}
		}
	}
</script>

<style>
	.mt-orderFixed{
		border-radius: 50%;
	    background-color: #FFFFFF;
	    position: fixed;
	    bottom: 50px;
	    width: 3rem;
	    height: 3rem;
	    box-shadow: 1px 1px 10px;
	    right: 20px;
	    text-align: center;
	    font-size: .7rem;
	    line-height: 1.2;
	}
	.mt-orderFixed .icon{
		font-size: 1.2rem;
		margin-top: .4rem;
	}
	.mt-fixed{
		position: fixed;
		width: 100%;
		top: 0;
	}
	.mt-add{
		position: fixed;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
	.mt-ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.mt-ellipsis-2 {
		display: -webkit-box;
		overflow: hidden;
		white-space: normal!important;
		text-overflow: ellipsis;
		word-wrap: break-word;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical
	}
	.mtFiltrate-item .vux-no-group-title {
	    margin-top: 0;
	}
	.mt-nav{
		display: flex;
		padding:10px 15px;
		justify-content: space-between;
		align-items: center;
		background-color: #FFFFFF;
	}
	.mt-font12{
		font-size: 12px;
	}
	.mt-font14{
		font-size: 14px;
	}
	.mt-font16{
		font-size: 16px;
	}
	.mt-icon-right{
		color: #c8c8cd;
	}
	.mt-icon-right:after{
		content: "";
		display: inline-block;
		width: 6px;
		height: 6px;
		border-width: 2px 2px 0 0;
		border-color: #C8C8CD;
		border-style: solid;
		transform: matrix(0.71,0.71,-0.71,0.71,0,0);
		margin-left: 5px;
	}
	.mt-swiper-box::-webkit-scrollbar {
		display:none;
	}
	.mt-swiper-box{
		height: 160px;
		overflow-y:hidden;
		overflow-x: auto;
		white-space: nowrap;
		background-color: #FFFFFF;
		padding: 0 10px;
		display: flex;
       -webkit-overflow-scrolling: touch;
       margin-bottom: 15px;
	}
	.mt-swiper-item{
		display: inline-block;
		margin: 0 5px;
		width: 90px;
	}
	.mt-swiper-item img{
		width: 90px;
		height: 126px;
	}
	.mt-swiper-item-name{
		text-align: center;
		font-size: 14px;
	}
	.mt-cinema-nav{
		display: flex;
		background-color: #FFFFFF;
		padding: 10px 0;
	}
	.mt-cinema-nav-item{
		width: 50%;
		text-align: center;
		font-size: 14px;
		/*padding: 5px 0;*/
	}
	.mt-cinema-list-box{
		background-color: #FFFFFF;
	}
	.mt-cinema-list{
		margin-left: 15px;
		padding: 10px 0;
	}
	.mt-distance{
		float: right;
		margin-right: 10px;
	}
	.mt-cinema-address{
		color: #808080;
		margin-top: 5px;
	}
	.mt-colorRed{
		color: #f22824;
	}
	.mt-colorBlue{
		color: #00aaee;
	}
	.vux-popup-dialog.vux-popup-top{
		top: 42px!important;
	}
	.mtFiltrate-item{
		color: #333;
	}
	.mtCity{
		position: absolute;
	    top: 10px;
	    left: 10px;
	    background-color: rgba(0,0,0,.5);
	    padding: 2px 10px;
	    font-size: 12px;
	    color: #fff;
	    border-radius: 14px;
	    width: 50px;
	}
</style>