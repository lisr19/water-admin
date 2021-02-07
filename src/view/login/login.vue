<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        // console.log(res)
        if (res.errno === 0) {
	        this.$router.push({
		            name: this.$config.homeName
		          })
          // if (res.data.managerInfo.isEnable === 1) {
          //   this.$router.push({
          //     name: this.$config.homeName
          //   })
          // } else {
          //   this.$Message.info('登录失败！该用户已被禁用')
          // }
        } else {
	        this.$Message.error(res.errmsg)
        }
      })
    }
  }
}
</script>

<style>

</style>
