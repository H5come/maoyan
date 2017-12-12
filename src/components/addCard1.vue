<template>
	<div class="mt-addCard">
		<group title="请添加观影券/现金券/优惠码">
			<x-input title="账 号" type="number"  v-model="cardNum"></x-input>
			<x-input title="序列号" type="number" v-model="serialNumber"></x-input>
		</group>
		<group>
			<x-input title="密 码" type="password" v-model="pw"></x-input>
		</group>
		<x-button class="mt-addCard-btn" @click.native="addCard">确定</x-button>
	</div>
</template>

<script>
	import {XInput,Group,XButton} from "vux"
	export default{
		components:{
			XInput,
			Group,
			XButton
		},
		data(){
			return{
				cardNum:"",
				serialNumber:"",
				pw:"",
			}
		},
		methods:{
			addCard:function(){
				this.$http.post("/wemovie/card_order.php?act=addBindCard",{card_no:this.cardNum,card_number:this.serialNumber,card_password:this.pw}).then((res)=>{
					if(res.data.code==200){
						alert("添加成功！")
						this.$router.go(-1)
					}else{
						alert(res.data.message)
					}
				})
			}
		}
		
	}
</script>

<style>
	.mt-addCard .mt-addCard-btn{
		background-color: #00AAEE!important;
		margin-top: 1.5rem;
		width: 90%!important;
		color: #FFFFFF;
	}
</style>