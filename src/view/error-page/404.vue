<template>
  <!--<error-content code="404" desc="Oh~~您的页面好像飞走了~" :src="src"/>-->
	<div class="page">
		<img src="@/assets/images/building.png" alt="">
	</div>
</template>

<script>
import error404 from '@/assets/images/error-page/error-404.svg'
import errorContent from './error-content.vue'
export default {
  name: 'error_404',
  components: {
    errorContent
  },
  data () {
    return {
      src: error404
    }
  }
}
</script>
<style scoped lang="less">
	.page{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		img{
			width: 72%;
		}
	}
</style>
