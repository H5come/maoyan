<template>
  <div id="app">
    <loading v-show="showLoading"></loading>
  	<transition name="router-fade" mode="out-in">
    		<router-view></router-view>
    </transition>
  </div>
</template>

<script>
import loading from './components/loading.vue'
import {mapGetters} from 'vuex'
export default {
  name: 'app',
  components:{
  	loading
  },
  computed:mapGetters([
  	'showLoading'
  ])
   
}

</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
body {
  background-color: #fbf9fe;
  max-width: 540px;
}

#app{
	min-height: 100vh;
	/*overflow: scroll;*/
	/*-webkit-overflow-scrolling: touch;*/
}
.router-fade-enter-active, .router-fade-leave-active {
	transition: opacity .2s linear;
}
.router-fade-enter, .router-fade-leave-active {
  	opacity: 0;
}
</style>
