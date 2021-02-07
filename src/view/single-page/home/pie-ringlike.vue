<template>
  <div ref="dom" style="width: 100%"></div>
</template>

<script>
  import echarts from 'echarts'
  import { on, off } from '@/libs/tools'

  export default {
    name: "pie-ringlike",
    props: {
      value1: Array,
      value2: Array,
      text: String,
      subtext: String
    },
    data () {
      return {
        dom: null
      }
    },
    methods: {
      resize () {
        this.dom.resize()
      }
    },
    mounted () {
      this.$nextTick(() => {
        // let legend = this.value.map(_ => _.name)
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br>{c} ({d}%)单'
          },
          series: [
            {
              name:'服务类型',
              type:'pie',
              selectedMode: 'single',
              radius: [0, '30%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:this.value1
            },
            {
              name:'服务',
              type:'pie',
              radius: ['40%', '55%'],
              data:this.value2
            }
          ]
        }
        setTimeout(()=>{
          this.dom = echarts.init(this.$refs.dom)
          this.dom.setOption(option)
        },2500)
        on(window, 'resize', this.resize)
      })
    },
    beforeDestroy () {
      off(window, 'resize', this.resize)
    }
  }
</script>

<style scoped>

</style>
