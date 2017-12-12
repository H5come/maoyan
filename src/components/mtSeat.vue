<template>
	<div class="mtSeat">
		<div class="mtSeat-movieInfo">
			<div class="meSeatMC" v-show="isShow"></div>
			<h3 class="mt-font16" v-text="movie.movie_name"></h3>
			<div class="mt-font14" v-text="data.featureTimeStr+'('+data.language +data.screen_type+')'"></div>
			<div class="mtSeat-box">
				<div class="mtSeat-box-item"><img src="../assets/seat1.png" alt="" />可选</div>
				<div class="mtSeat-box-item"><img src="../assets/seat2.png" alt="" />已选</div>
				<div class="mtSeat-box-item"><img src="../assets/seat3.png" alt="" />已售</div>
				<div class="mtSeat-box-item"><img src="../assets/seat4.png" alt="" />情侣座</div>
			</div>
			<div class="mtSeat-selectBox">
				<div class="mtSeat-selectBox-item" v-for="item in seatArray">
					{{item}}
				</div>
			</div>
		</div>
		<div class="mtSeat-cinemaShow">
			<div class="mtSeat-cinemaName">{{cinema_name}}</div>
			<template v-for="item in seat_info">
					<div class="mtSeat-colNum">
						<div class="mtSeat-colNum-br"></div>
						<template v-for="item in item.seats">
							<div class="mtSeat-colNum-item" v-if="item[0].row_num">{{item[0].row_num}}</div>
							<div class="mtSeat-colNum-item" v-else></div>
						</template>
						<div class="mtSeat-colNum-br"></div>
					</div>
			</template>
			<div class="mtSeat-scroll">
				<div class="mtSeat-scroll-itemBox">
					<div class="mtSeat-scroll-item" v-for="item in seat_info">
						<div class="mtSeat-scroll-item-center">
							<span>银幕中央</span>
						</div>
						<div class="mtSeat-row" v-for="item in item.seats">
							<template v-for="item in item">
								<!--普通座位-->
								<template v-if="item.seat_type==0">
									<div class="mtSeat-row-item kong" v-if="item.seat_status==0" @click="selectSeat(item.conplesPos,item.row_num,item.col_num,item.seat_mark)"></div>
									<div class="mtSeat-row-item active" v-if="item.seat_status==1"></div>
								</template>
								<!--情侣座-->
								<template v-if="item.seat_type==1">
									<div class="mtSeat-row-item mtSeat-loveSeat" :data-row="item.row_num" :data-col="item.col_num" :data-no="item.seat_mark"  v-if="item.seat_status==0" @click="selectSeatLove(item.conplesPos,item.row_num,item.col_num,item.seat_mark)"></div>
									<div class="mtSeat-row-item mtSeat-loveSeat active" v-if="item.seat_status==1"></div>
								</template>
								<!--空的走廊-->
								<div class="mtSeat-noneSeat" v-if="item.seat_type==2"></div>
							</template>
						</div>
					</div>
				</div>
			</div> 
		</div>
		<!--手机号-->
		<group>
			<x-input placeholder="请输入手机号" type="tel" title="手机号" is-type="china-mobile" v-model="tel"></x-input>
		</group>
		<div class="mtSeat-bottom-msg"> 
			<p class="mtSeat-bottom-msg-title">注意事项：</p> 
			<p class="">1、选择你要预订的座位单击选中，重复点击取消所选座位；</p>
			<p class="">2、每笔订单最多可选购4张电影票；情侣座不单卖；</p> 
			<p class="">3、售票系统不支持您在所选的座位之间仅留一个空座位，请见谅</p> 
			<p class="">4、部分影院3D眼镜需要押金，请观影前准备好现金；</p> 
			<p class="">5、您锁定的座位，请在15分钟内支付。一旦未支付或订单失败，将无法人工保留所选座位，请见谅。</p> 
			<p class="">6、选座购票为特殊商品，出票成功后，如无使用问题，不得退换；</p>
			<p class="">7、付款后若没有出票成功，我们将自动为您退款。出票成功后，请妥善保存取票密码,若没有收到取票短信，请到订票中心查询，或拨打客服电话400-010-0689。</p> 
		</div>
		<div class="mtPay-bottom-fix-btn" @click="confirmBtn">确认选座</div>
	</div>
</template>

<script>
	import {Group,XInput} from "vux"
	export default{
		components:{
			Group,
			XInput
		},
		data(){
			return{
				id:this.$route.params.id,
				movie:{},//影片信息
				data:{},
				seat_info:[],//座位图数据
				cinema_name:"",
				seatArray:[],//选择的座位
				tel:"",//手机号
				seatsNo:[],
				isShow:true,//加载未完成时的显示状态
			}
		},
		created:function(){
			this.$http.get('/wemovie/movie.php?act=cinemaSeats',{params:{scheduleid:this.id}}).then((res)=>{
				if(res.data.code==200){
					var data=res.data.data;
					this.movie=data.movie;
					this.data=data;
					this.cinema_name=data.cinema.cinema_name;
					this.seat_info=data.seat_info;//座位图数据
					this.isShow=false;
					this.$nextTick(function(){
						var seatHeight= $(".mtSeat-scroll-item").height();
						var seatWidth=$(".mtSeat-scroll-item").width()
						$(".mtSeat-scroll").height(seatHeight+2);
						$(".mtSeat-scroll-itemBox").width(seatWidth*2)
						$(".mtSeat-scroll").scrollLeft(seatWidth-window.screen.availWidth/2)
						$(".mtSeat-cinemaShow").height(seatHeight+60)
					})
				}else{
					alert(res.data.message)
				}
				console.log(res)
			})
			console.log(this.data)
		},
		methods:{
			selectSeat:function(conplesPos,row,col,seatsNo){
				var self=event.currentTarget;
				var seatName=row+'排'+col+'座';
				if($(self).hasClass("select")){
					$(self).removeClass("select");//移除选中样式
					$(self).addClass("kong");
					this.seatArray.splice($.inArray(seatName, this.seatArray), 1);
					this.seatsNo.splice($.inArray(seatsNo, this.seatsNo), 1);
				}else{
					if(this.seatArray.length<4){
						$(self).addClass("select");
						$(self).removeClass("kong");
						this.seatArray.push(seatName);
						this.seatsNo.push(seatsNo);
					}else{
						alert("一次最多选择4个座位！")
					}
				}
			},
			//情侣座选座
			selectSeatLove:function(num,row,col,seatsNo){
				var self=event.currentTarget;
				var seatName=row+'排'+col+'座';
				//判断是否选中
				if($(self).hasClass("select")){
					if(num==1){
						var seatName1=$(self).next().attr("data-row")+'排'+$(self).next().attr("data-col")+"座";
						var seatsNo1=$(self).next().attr("data-no");
						$(self).removeClass("select").next().removeClass("select");
					}else if(num==2){
						var seatName1=$(self).prev().attr("data-row")+'排'+$(self).prev().attr("data-col")+"座";
						var seatsNo1=$(self).prev().attr("data-no");
						$(self).removeClass("select").prev().removeClass("select");
					}
					this.seatArray.splice($.inArray(seatName, this.seatArray), 1);
					this.seatsNo.splice($.inArray(seatsNo, this.seatsNo), 1);
					this.seatArray.splice($.inArray(seatName1, this.seatArray), 1);
					this.seatsNo.splice($.inArray(seatsNo1, this.seatsNo), 1);
				}else{
					if(this.seatArray.length<3){
						if(num==1){
							var seatName1=$(self).next().attr("data-row")+'排'+$(self).next().attr("data-col")+"座";
							var seatsNo1=$(self).next().attr("data-no");
							$(self).addClass("select").next().addClass("select");
						}else if(num==2){
							var seatName1=$(self).prev().attr("data-row")+'排'+$(self).prev().attr("data-col")+"座";
							var seatsNo1=$(self).prev().attr("data-no");
							$(self).addClass("select").prev().addClass("select");
						}
						this.seatArray.push(seatName,seatName1);
						this.seatsNo.push(seatsNo,seatsNo1);
					}else{
						alert("一次最多选择4个座位！")
					}
				}
			},
			confirmBtn:function(){
				var self=this;
				if(this.seatArray.length<1){
					alert("请选择座位！")
				}else if(!isPoneAvailable(self.tel)){
					alert("请输入正确的手机号！")
				}
				else{
				//座位是否留空状态
				var seatStats=true;
				//遍历已经选择的座位
				$(".mtSeat-row-item.select").each(function(index,val){
					if(($(this).prev().hasClass('kong')&&!$(this).prev().prev().hasClass('kong'))
					||($(this).next().hasClass('kong')&&!$(this).next().next().hasClass('kong'))
					){
						seatStats=false
					}
				})
				if(seatStats){
					self.$http.post("/wemovie/card_order.php?act=order",{
						scheduleid:self.data.scheduleid,
						featureTimeStr:self.data.featureTimeStr,
						movieName:self.data.movie.movie_name,
						cinemaName:self.data.cinema.cinema_name,
						language:self.data.language,
						seatsCount:self.seatArray.length,
						vipPrice:self.data.price,
						seatParam:{"scheduleid":self.data.scheduleid},
						movieId:self.data.movie_id,
						extInfo:self.data.extInfo,
						mobile:self.tel,
						seatsName:self.seatArray,
						seatsNo:self.seatsNo,
					}).then((res)=>{
						if(res.data.code==200){
							console.log(res)
							self.$router.push({
								name:"mtPay",
								params:{
									order_id:res.data.data.orderid
								}
							})
						}else{
							console.log(res)
							alert(res.data.message)
						}
					})
					}else{
						alert("不能留空座位！")
					}
				}
			}
		}
	}
	//验证手机号
	function isPoneAvailable(str) {  
          var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
          if (!myreg.test(str)) {  
              return false;  
          } else {  
              return true;  
          }  
      }  
</script>

<style>
	.mtSeat{
		padding-bottom: 50px;
		background: #f2f1f6;
	}
	.mtSeat-movieInfo{
		background-color: #FFFFFF;
		text-align: center;
		padding: 10px;
		line-height: 1.8rem;
	}
	.mtSeat-box-item{
		display: inline-block;
		font-size: .7rem;
		margin-right: .25rem;
	}
	.mtSeat-box-item img{
		width: 1rem;
		vertical-align: sub;
		margin-right: .1rem;
	}
	.mtSeat-selectBox{
		display: flex;
		margin: 0 20px;
		justify-content: space-around;
	}
	.mtSeat-selectBox-item{
		font-size: 14px;
	}

	.mtSeat-row{
		white-space:nowrap;
		font-size: 0;
	}
	.mtSeat-noneSeat{
		display: inline-block;
		width: .8rem;
		height: .8rem;
		margin-top: .2rem;
		margin-right: .2rem;
		margin-left: .2rem;
	}
	.mtSeat-row-item{
		display: inline-block;
		width: .8rem;
		height: .8rem;
		margin-top: .2rem;
		margin-right: .2rem;
		margin-left: .2rem;
		background-image: url(../assets/seat1.png);
		background-size: cover;
	}	
	.mtSeat-row-item.active{
		background-image: url(../assets/seat3.png);
	}
	.mtSeat-row-item.mtSeat-loveSeat{
		background-image: url(../assets/seat4.png);
	}
	.mtSeat-row-item.mtSeat-loveSeat.active{
		background-image: url(../assets/seat3.png);
	}
	.mtSeat-row-item.select{
		background-image: url(../assets/seat2.png);
	}
	.mtSeat-cinemaShow{
		position: relative;
	}
	.mtSeat-cinemaName{
		text-align: center;
		font-size: .8rem;
		margin-bottom: 10px;
	}
	.mtSeat-colNum{
		position: absolute;
		text-align: center;
		background-color: rgba(0,0,0,.4);
		color: #FFFFFF;
		border-radius: 10px;
		top: 2rem;
		left: 10px;
		z-index: 1;
		
	}
	.mtSeat-colNum-item{
		width: 1.2rem;
		height: .8rem;
		font-size: .7rem;
		margin-top: .2rem;
		line-height: 1;
	}
	.mtSeat-colNum-br{
		height: 1rem;
	}
	.mtSeat-scroll{
		position: absolute;
	    overflow-x: scroll;
	    overflow-y: hidden;
	    height: 210px;
	    width: 100%;
	    -webkit-overflow-scrolling: touch;
	}
	.mtSeat-scroll-itemBox{
		height: 100%;
		position: absolute;
	}
	.mtSeat-scroll-item{
		position: absolute;
		background: url(../assets/mtCinema-centerXian.png) center top repeat-y;;
		left: 50%;
		transform: translateX(-50%);
	}
	.mtSeat-scroll-item-center{
		text-align: center;
		font-size: .7rem;
		line-height: 1;
	}
	.mtSeat-scroll-item-center span{
		display: inline-block;
		padding: .25rem;
		background-color: #ccc;
	}
	.mtSeat .mtPay-bottom-fix-btn{
		position: fixed;
		bottom: 0;
		width: 100%;
	}
	.meSeatMC{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		z-index: 1;
	}
	.mtSeat-bottom-msg{
		margin: 10px;
		font-size: 14px;
		color: #8F8F94;
	}
	.mtSeat-bottom-msg-title{
		color: #333;
		margin-bottom: 5px;
	}
</style>