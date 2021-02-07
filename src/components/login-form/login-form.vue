<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="name">
      <Input v-model.trim="form.name" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    nameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '用户不能为空', trigger: 'blur' },
	        {
		        required: true,
		        pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{1,30}$/,
		        message: '用户名错误',
		        trigger: 'blur'
	        },
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' },
	        {
		        required: true,
		        pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,30}$/,
		        message: '密码错误',
		        trigger: 'blur'
	        },
        ]
      }
    }
  },
  data () {
    return {
      form: {
        name: '',
        password: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        name: this.nameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    handleSubmit () {
    	if (this.form.name.length > 29) {
		    this.$Message.error('用户名错误')
		    return
	    }
	    if (this.form.password.length > 29) {
		    this.$Message.error('密码错误')
		    return
	    }
	    let reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
	    if ((reg.test(this.form.name))||(reg.test(this.form.password))) {
		    this.$Message.error('用户名或密码错误')
		    return
	    }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
	        this.$emit('on-success-valid', {
		        userName: this.form.name,
            password: this.form.password
          })
        }
      })
    }
  }
}
</script>
