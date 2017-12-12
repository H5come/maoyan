<template>
	<div class="weui_loading_toast" id="global_loading">
	    <div class="weui_mask_transparent"></div>
	    <div class="weui_toast">
	      <i class="weui-loading weui-icon_toast1"></i>
	      <p class="weui_toast_content">加载中</p>
	    </div>
  	</div>
</template>

<script>
</script>

<style>
	#global_loading{
		font-size: 16px;
	}
.weui_mask_transparent{
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
}
.weui_toast{
	position: fixed;
	z-index: 5001;
	width: 120px; 
	min-height:120px;
	top: 180px;
	left: 50%;
	margin-left: -60px;
	background: rgba(17, 17, 17, 0.7);
	text-align: center;
	border-radius: 5px;
	color: #FFFFFF;
}
.weui-loading.weui-icon_toast1{
	width: 38px;
	height: 38px;
	margin-top:24px;
}
</style>