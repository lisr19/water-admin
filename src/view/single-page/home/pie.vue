<template>
  <div ref="dom" style="width: 100%"></div>
</template>

<script>
  import echarts from 'echarts'
  import { on, off } from '@/libs/tools'

  export default {
    name: "pie",
    props: {
      value: Array,
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
            formatter: '{b}<br>{c} ({d}%)'
          },
          // legend: {
          //   orient: 'vertical',
          //   left: 'left',
          //   data: legend
          // },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.value,
              labelLine: {
                normal: {
                  length: 1
                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        setTimeout(()=>{
          this.dom = echarts.init(this.$refs.dom)
          this.dom.setOption(option)
        },2000)
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
