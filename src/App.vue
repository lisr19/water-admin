<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.ivu-page{
  margin-bottom: 2px;
}
.my-btn{
  width: 90%;
}
#app {
  .size;
}
</style>
