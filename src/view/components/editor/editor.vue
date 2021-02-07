<template>
  <div>
    <editor ref="editor" :value="content" @on-change="handleChange"/>
    <Button @click="changeContent">清空编辑器内容</Button>
  </div>
</template>

<script>
import Editor from '_c/editor'
export default {
  name: 'editor_page',
  components: {
    Editor
  },
  data () {
    return {
      content: ''
    }
  },
  methods: {
    handleChange (html, text) {
      // console.log(html, text)
      this.$emit('getContent',html)
    },
    setContent(content){
      this.$refs.editor.setHtml(content)
    },
    changeContent () {
      this.$refs.editor.setHtml('')
    }
  }
}
</script>

<style>

</style>
