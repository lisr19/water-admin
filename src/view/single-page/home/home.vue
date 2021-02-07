<template>
	<div>
		<Row :gutter="20">
			<i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
				<infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
					<count-to :end="infor.count" count-class="count-style"/>
					<p>{{ infor.title }}</p>
				</infor-card>
			</i-col>
		</Row>
		<Row :gutter="20" style="margin-top: 10px;">
			<i-col :md="24" :lg="8" style="margin-bottom: 20px;">
				<Card shadow>
					<chart-pie style="height: 300px;" :value="pieData" text="设备"></chart-pie>
				</Card>
			</i-col>
			<i-col :md="24" :lg="16" style="margin-bottom: 20px;">
				<Card shadow>
					<chart-bar style="height: 300px;" :value="barData" text="水资源监测"/>
				</Card>
			</i-col>
		</Row>
		<Row>
			<Card shadow>
				<example style="height: 310px;"/>
			</Card>
		</Row>
	</div>
</template>

<script>
	import InforCard from '_c/info-card'
	import CountTo from '_c/count-to'
	import { ChartPie, ChartBar } from '_c/charts'
	import Example from './example.vue'
	export default {
		name: 'home',
		components: {
			InforCard,
			CountTo,
			ChartPie,
			ChartBar,
			Example
		},
		data () {
			return {
				inforCardData: [
					{ title: '项目', icon: 'md-person-add', count: 24, color: '#2d8cf0' },
					{ title: '设备', icon: 'md-person-add', count: 203, color: '#ff9900' },
					{ title: '节点', icon: 'md-locate', count: 2320, color: '#19be6b' },
					{ title: '监测设备', icon: 'md-locate', count: 820, color: '#be4829' },
					{ title: '通讯故障', icon: 'md-help-circle', count: 12, color: '#e8c6ff' },
					{ title: '设备故障', icon: 'md-help-circle', count: 32, color: '#62f8ff' },
				],
				pieData: [
					{ value: 335, name: '视频设备' },
					{ value: 310, name: '通讯设备' },
					{ value: 234, name: '监测设备' },
				],
				barData: {
					Mon: 13253,
					Tue: 34235,
					Wed: 26321,
					Thu: 12340,
					Fri: 24643,
					Sat: 1322,
					Sun: 1324
				}
			}
		},
		mounted () {
			//
		}
	}
</script>

<style lang="less">
	.count-style{
		font-size: 50px;
	}
</style>
