<template>
  <div>
    <div class="demo-upload-list" v-for="(item,index) in uploadList" >
      <template v-if="item.status === 'finished'">
        <img :src="'http://'+item.url">
        <div class="demo-upload-list-cover" >
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item,index)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      v-show="uploadList.length<3"
      ref="upload"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="10240"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :headers="myHeader"
      type="drag"
      name="imgFile"
      :action="baseUrl"
      style="display: inline-block;width:58px;">
      <div  style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal v-model="visible" >
      <img :src="'http://'+imgUrl" v-if="visible" style="width: 100%">
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>
<script>
  import Config from '../../../config/index'
  export default {
    name: 'img-upload-more',
    data () {
      return {
        myHeader: { authorization: localStorage.hmAppToken },
        imgName: '',
        imgUrl:'',
        visible: false,
        uploadList: [],
        baseUrl:'',
      }
    },
    methods: {
      handleView (file) {
        this.imgUrl = file.url
        this.visible = true
      },
      handleRemove (file,index) {
        this.$emit('delImg',index)
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      },
      handleSuccess (res, file) {
        this.$emit('imgUpload', res.data.url)
        file.url = res.data.url
        file.name = '图片'
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '上传的图片格式错误',
          desc: '上传的图片格式不对，只支持jpg,jpeg,png'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出上传限制大小',
          desc: '上传的图片最大不能超过10MB'
        })
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 3
        if (!check) {
          this.$Notice.warning({
            title: '最多只能上传三张.'
          })
        }
        return check
      },
      // 更新图片信息
      updateImgUrl (params) {
        this.$refs.upload.fileList = params
        this.uploadList = this.$refs.upload.fileList
      },
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList
    },
    created(){
      this.baseUrl = Config.imgBaseUrl
    }
  }
</script>
<style>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.1);
  }
  /*.demo-upload-list:hover .demo-upload-list-cover{*/
    /*display: block;*/
  /*}*/
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
