<template>
	<div class="payOk">
		<msg title="支付成功" :buttons="buttons"></msg>
	</div>
</template>

<script>
	import {Msg} from "vux"
	export default{
		components:{
			Msg
		},
		data(){
			return{
				buttons: [{
			        type: 'primary',
			        text: '完成',
			        onClick: this.okBtn
			      }]
			}
		},
		methods:{
			okBtn:function(){
				this.$router.push({
					name:'orderList'
				})
			}
		}
	}
</script>

<style>
</style>