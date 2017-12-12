<template>
	<div class="cinemaDetail">
		<div class="CD-showtime-info">
			<div class="CD-info">
				<div class="CD-cinema-name">{{cinemaDetail.cinema_name}}</div>
				<div class="CD-cinema-address">{{cinemaDetail.cinema_address}}</div>
			</div>
			<div class="CD-cinemaTel">
				<a :href="'tel:'+cinemaDetail.cinema_tel">
					<span class="iconfont icon-dianhua"></span>
				</a>
			</div>
		</div>
		<!--swiper start-->
	    <div class="swiper-container">
	    		<div class="cinemaDetail-swiper-bg" v-for="item in movies" v-if="item.active" :style="{backgroundImage:'url('+item.path_vertical_s+')'}"></div>
	        <div class="swiper-wrapper">
	            <div class="swiper-slide" v-for="item in movies" :data-id="item.id"><img :src="item.path_vertical_s" alt="" /></div>
	        </div>
	     </div>   
	     <div class="CD-movie-info-box" v-for="item in movies" v-if="item.active">
		     <div class="">{{item.movie_name}}<span style="color: #ffcc66;margin-left: 5px;">{{item.score}}分</span></div>
		     <div class="CD-movie-info mt-ellipsis">{{item.movie_length}}分钟|{{item.actor}}</div>
	     </div>
	     <!--温馨提示-->
	     <div class="cinema-msg">
	     	<icon type="info"></icon>
	     	<span>温馨提示：影院提前60分钟关闭网络售票</span>
	     </div>
	     <div class="mt-date-scroll">
			<div class="mt-date-scroll-item" v-for="item in time" :class="{active:item.active}" @click="selectDate(item.feature_date)">{{item.feature_date}}</div>
		</div>
		<div class="movieShow-timeAll vux-1px-t">
			<div class="vux-1px-b" v-for="item in plan">
				<div class="movieShow-time-box" v-if="item.is_cut==0" @click="toSeat(item.id)">
					<div class="movieShow-time">{{item.time}}</div>
					<div class="movieShow-house">
						<div class="mt-ellipsis">{{item.language}}</div>
						<div class="mt-ellipsis movieShow-house-ting">{{item.hall_name}}</div>
					</div>
					<div class="movieShow-price">{{item.price}}</div>
					<div class="movieShow-btn">
						<div class="movieShow-btn-ok">购票</div>
					</div>
				</div>
				<div v-else class="movieShow-time-box none">
					<div class="movieShow-time">{{item.time}}</div>
					<div class="movieShow-house">
						<div class="mt-ellipsis">{{item.language}}</div>
						<div class="mt-ellipsis movieShow-house-ting">{{item.hall_name}}</div>
					</div>
					<div class="movieShow-price">{{item.price}}</div>
					<div class="movieShow-btn">
						<div class="movieShow-btn-ok">购票</div>
					</div>
				</div>
			</div>
			<div class="movieShow-time-msg" v-if="plan.length==0">该影片当前无档期！</div>
		</div>	
	</div>
</template>

<script>
	import {Icon} from "vux"
	export default{
		components:{
			Icon
		},
		data(){
			return{
				cinemaid:this.$route.query.cinemaid,
				movieid:this.$route.query.movieid,
				params:this.$route.query,
				cinemaDetail:{},
				movies:[],
				movieBg:"",//切换电影改变背景
				time:{},//日期
				plan:[],//选择影厅
				slideIndex:0,//滑动切换
			}
		},
		methods:{
			getData:function(){
				var self=this;
				this.$http.get("/wemovie/movie.php?act=allCinemaDetail",{params:this.params}).then((res)=>{
					if(res.data.code==200){
						var data=res.data.data;
						this.cinemaDetail=data.cinemaDetail;
						this.movies=data.movies;
						this.time=data.time;
						this.plan=data.plan;
						var movieBgIndex=0;
						var movieArr=this.movies;
						for(var j = 0,len=movieArr.length; j < len; j++) {
   							if(movieArr[j].active==1){
   								movieBgIndex=j;
   								break;
   							}
						}
						this.$nextTick(function(){
							var mySwiper = new Swiper('.swiper-container',{
								slideToClickedSlide:true,
								slidesPerView: 4,
						        centeredSlides: true,
						        paginationClickable: true,
						        spaceBetween: 15,
						        onSlideChangeEnd: function(swiper){
						        		var slideIndex=swiper.activeIndex;
							        var movie_id=swiper.slides[slideIndex].getAttribute("data-id");
							        self.params.movieid=movie_id;
							        self.changeData();
							    }
							});
							mySwiper.slideTo(movieBgIndex, 500, false);
						})
					}else{
						alert(res.data.message)
					}
					console.log(res)
				})
			},
			selectkMovie:function(movie_id){
				datas.movieid=movie_id;
				this.changeData();
			},
			changeData:function(){
				this.$http.get("/wemovie/movie.php?act=allCinemaDetail",{params:this.params}).then((res)=>{
					if(res.data.code==200){
						console.log(res)
						var data=res.data.data;
						this.cinemaDetail=data.cinemaDetail;
						this.movies=data.movies;
						this.time=data.time;
						this.plan=data.plan;
					}else{
						alert(res.data.message)
					}
				})
			},
			selectDate:function(date){
				this.params.date=date;
				this.changeData();
			},
			toSeat:function(id){
				this.$router.push({
					name:"mtSeat",
					params:{
						id:id
					}
				})
			}
		},
		created:function(){
			this.params.date=this.params.date;
			this.params.cinemaid=this.params.cinemaid;
			this.params.movieid=this.params.movie_id;
			this.getData();
		},
	}

</script>

<style>
	.CD-showtime-info{
		background-color: #FFFFFF;
		display: flex;
		padding: 10px;
	}
	.CD-cinema-name{
		font-size: .8rem;
	}
	.CD-info{
		flex: 1;
	}
	.CD-cinemaTel{
		width: 2rem;
	}
	.CD-cinemaTel a{
		display: inline-block;
		width: 2rem;
		height: 2rem;
		text-align: center;
	}
	.CD-cinema-address{
		font-size: .6rem;
		color: #666;
	}
	.iconfont.icon-dianhua{
		font-size: 1.3rem;
		color: #00aaee;
	}
	.cinemaDetail .swiper-slide img{
		width: 100%;
		transform: scale(.88);
		vertical-align: middle;
		transform-origin: bottom center;
		transition: transform .2s linear;
		border: 1px solid transparent;
	}
	.cinemaDetail .swiper-slide.swiper-slide-active img{
		transform: scale(1);
		border: 1px solid #FFFFFF;
	}
	.cinemaDetail .swiper-container{
		background-color: #ccc;
		height: 7.5rem;
	}
	.cinemaDetail .swiper-container:after{
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		line-height: 0;
		font-size: 0;
		border: .3rem dashed transparent;
		border-bottom: .3rem solid #FFFFFF;
		bottom: 0;
		left: 50%;
		margin-left: -.3rem;
	}
	.cinemaDetail .swiper-slide{
		margin: .5rem 0;
		height: 6.5rem;
	}
	.cinemaDetail-swiper-bg{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		filter: blur(1rem);
		/*background-image: url(../assets/15044923909181.jpg);*/
		background-size: cover;
		background-position: center;
	}
	.CD-movie-info-box{
		background-color: #FFFFFF;
		text-align: center;
		font-size: 16px;
		padding: 10px;
	}
	.CD-movie-info{
		color: #666666;
		font-size: 14px;
		text-align: center;
	}
	.cinema-msg{
		padding: 10px;
		font-size: 14px;
		background-color: #ffebec;
		color: #f45453;
	}
	.cinema-msg i{
		color:#f45453;
		font-size: 20px;
	}
	.cinema-msg span{
		vertical-align: middle;
	}
	.movieShow-time-box{
		display:flex;
		height: 3.5rem;
		margin-left: 15px;
		align-items: center;
	}
	.movieShow-time{
		width: 25%;
	}
	.movieShow-house{
		font-size: .7rem;
		width: 30%;
	}
	.movieShow-price{
		width: 20%;
	}
	.movieShow-btn{
		width: 25%;
		font-size: .7rem;
	}
	.movieShow-house-ting{
		color: #666666;
	}
	.movieShow-price{
		color: #f67070;
	}
	.movieShow-btn-ok{
		width: 70%;
	    margin: 0 auto;
	    text-align: center;
	    border: 1px solid #00aaee;
	    color: #00aaee;
	    padding: .2rem 0;
	    border-radius: 5px;
	}
	.movieShow-timeAll{
		background-color: #FFFFFF;
	}
	.movieShow-time-box.none,
	.movieShow-time-box.none .movieShow-price,
	.movieShow-time-box.none .movieShow-house-ting,
	.movieShow-time-box.none .movieShow-btn-ok{
		color: #ccc!important;
		border-color: #ccc!important;
	}
	.movieShow-time-msg{
		text-align: center;
		font-size: 16px;
		padding: 30px 0;
	}
</style>