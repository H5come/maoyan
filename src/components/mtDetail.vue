<template>
	<div>
		<div class="mtDetail-top">
			<div class="mtDetail-top-bg" :style="{backgroundImage:'url('+movie_detail.path_vertical_s+')'}">
				<div class="mtDetail-top-bg-ceng"></div>
			</div>
			<div class="mtDetail-top-content">
				<div class="mtDetail-top-content-left">
					<img :src="movie_detail.path_vertical_s" alt="" />
				</div>
				<div class="mtDetail-top-content-right">
					<div class="mt-ellipsis mt-font16">{{movie_detail.movie_name}}</div>
					<rater v-model="PF" disabled active-color="#fc6" :font-size="18"></rater><span class="mt-PF" v-text="PF*2"></span>
					<div class="mt-font12">{{movie_detail.movie_type}}</div>
					<div class="mt-font12">{{movie_detail.movie_length}}分钟</div>
					<div class="mt-font12">{{movie_detail.publish_time}}上映</div>
				</div>
			</div>
		</div>
		<div class="mt-movie-details" @click="desShow=!desShow">
			<div class="mt-movie-details-des" :class="{heightAuto:desShow}" v-html="movie_detail.intro"></div>
			<div class="mt-center">
				<x-icon v-show="desShow===false" type="ios-arrow-down" size="26"></x-icon>
				<x-icon v-show="desShow===true" type="ios-arrow-up" size="26"></x-icon>
			</div>
		</div>
		<div class="mt-cinema-box" style="height: 80px;">
		<div class="mt-cinema">
				<div class="mt-date-scroll">
					<div class="mt-date-scroll-item" v-for="item in dateList" @click="selectDate(item.date)" :class="{active:item.active}">{{item.date}}</div>
				</div>
				<div class="mt-cinema-nav vux-1px-b vux-1px-t">
					<div class="mt-cinema-nav-item vux-1px-r" @click="mtFiltrateVal=!mtFiltrateVal">{{activeArea}}</div>
					<div class="mt-cinema-nav-item" @click="getAddress">离我最近</div>
				</div>
		</div>
		</div>
		<!--影院列表-->
		<div class="mt-cinema-list-box">
			<div class="mt-cinema-list vux-1px-b" v-for="item in cinemas" @click="toCinemaDetail(item.id)">
				<div class="mt-font14">{{item.cinema_name}}<div class="mt-distance mt-font14 mt-colorRed">{{item.distance_cn}}</div></div>
				<div class="mt-cinema-address mt-font12">{{item.cinema_address}}</div>
			</div>
		</div>
		<!--区域筛选-->
		<popup v-model="mtFiltrateVal" position="bottom" max-height="40%">
			<group class="mtFiltrate-item">
				<cell class="mt-font14" v-for="(item,index) in area_list" :key="index" :title="item.name" @click.native="filterArea(item.id,item.name)"></cell>
			</group>
		</popup>
	</div>
</template>

<script>
	import {Rater,Sticky,TabItem,Tab,throttle,Popup,Cell,Group} from 'vux'
	var top=0;
	export default{
		data(){
			return{
				PF:0,//评分
				desShow:false,//影片简介默认不显示全部
				allParams:{},//电影id
				movie_detail:{},//电影详情
				index:0,
				dateList:[],//时间排期
				cinemas:[],//影院列表
				mtFiltrateVal:false,//区域筛选
				area_list:{},//区域列表
				activeArea:"全城",
			}
		},
		components:{
			Rater,
			Sticky,
			TabItem,
			Tab,
			Popup,
			Cell,
			Group
		},
		methods:{
			getData:function(){
				this.$http.get("/wemovie/movie.php?act=movieCinemas",{params:this.allParams}).then((res)=>{
					if(res.data.code==200){
						var data=res.data.data;
						this.movie_detail=data.movie_detail;
						this.PF=data.movie_detail.score/2;
						this.dateList=data.plan_date;
						this.cinemas=data.cinemas;
						this.area_list=data.area_list
					}else{
						alert(res.data.message)
					}
					console.log(res)
				})
			},
			test:function(){
				var top=$(".mt-cinema-box").offset().top;
				$('html, body').animate({      //筛选栏点击后自动吸顶
		            scrollTop: top
		        }, 100);
			},
			filterArea:function(areaId,areaName){
				this.mtFiltrateVal=!this.mtFiltrateVal;
				this.allParams.districtid=areaId;
				this.activeArea=areaName;
				this.getData()
			},
			toCinemaDetail:function(cinema_id){
				this.allParams.cinemaid=cinema_id;
				this.$router.push({
					name:"cinemaDetail",
					query:this.allParams
					
				})
			},
			selectDate:function(date){
				this.allParams.date=date;
				console.log(this.allParams)
				this.getData();
			},
			getAddress:function(){
				var self=this;
				this.$wechat.getLocation({
			    	    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			    	    success: function (res) {
			    	    	console.log(res)
			   	    	 self.allParams.lat=res.latitude;
			   	    	 self.allParams.lon=res.longitude;
			   	    	 self.getData();
			    	    },
			    	    cancel: function (res) {
			        	    self.getData();
			    	    },
			    	    fail:function(){
			   	    	 	self.getData();
			    	    }
			    	});
			}
		},
		created:function(){
			var self=this;
			this.$wechat.ready(function(){
				self.allParams.movie_id=self.$route.params.movie_id
				self.getAddress();
			})
		},
		mounted:function(){
			$(window).on('scroll', throttle(function(){
				var top=$('.mt-cinema-box').offset().top
				var scrollTop=$(window).scrollTop();
				if(scrollTop>=top){
					$(".mt-cinema").addClass("top");
				}else{
					$(".mt-cinema").removeClass("top")
				}
			},16));
		},
		destroyed () {
			$(window).off();//销毁滚动监听
		},
	}
</script>

<style>
	.mt-cinema.top{
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 1;
	}
	.mtDetail-top{
		height: 180px;
		position: relative;
		overflow: hidden;
	}
	.mtDetail-top-bg{
		height: 100%;
		/*background-image: url(../assets/15044923909181.jpg);*/
		background-position: center;
		background-size: cover;
		filter: blur(20px);
	}
	.mtDetail-top-content{
		display: flex;
		position: absolute;
		top:0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: 15px;
		
	}
	.mtDetail-top-content-left{
		margin-right:15px;
	}
	.mtDetail-top-content-left img{
		width: 100px;
		border: 2px solid #FFFFFF;
	}
	.mtDetail-top-bg-ceng{
		height: 100%;
		background-color: #40454d;
    		opacity: .55;
	}
	.mtDetail-top-content-right{
		color: #FFFFFF;
		flex: 1;
		line-height: 2;
		overflow: hidden;
	}
	.mtDetail-top-content-right .mt-font12{
		opacity: .9;
	}
	.mt-PF{
		font-size: 18px;
		color: #ffcc66;
	}
	.mt-movie-details{
		color: #555;
		padding: 10px 15px 0;
		font-size: 14px;
		background-color: #FFFFFF;
		margin-bottom: 15px;
	}
	.mt-center{
		text-align: center;
		line-height: 1;
	}
	.mt-movie-details-des{
		height: 66px;
		overflow: hidden;
	}
	.mt-movie-details-des.heightAuto{
		height: auto;
	}
	.mt-date-scroll{
		overflow-x: scroll;
		white-space: nowrap;
		line-height: 38px;
		background-color: #FFFFFF;
		font-size: 14px;
		color: #444444;
	}
	.mt-date-scroll-item{
		display: inline-block;
		margin: 0 15px;
	}
	.mt-date-scroll-item.active{
		color: #00AAEE;
		border-bottom: 2px solid #00AAEE;
	}
</style>