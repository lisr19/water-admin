<template>
	<div>
		<!--按钮部分-->
		<Card>
			<p slot="title">水环境预警</p>
			<Row>
				<Col span="4" >
				<Input clearable icon="search" v-model="searchByName" @on-change="handleSearchByName"
				       placeholder="节点名搜索"/>
				</Col>
				<Col span="4" offset="16">
					<div class="mark">
						<div class="mark1"></div>
						<p class="text1">正常</p>
						<div class="mark2"></div>
						<p class="text1">预警</p>
						<div class="mark3"></div>
						<p>告警</p>
					</div>
				</Col>
			</Row>
		</Card>
		<!--表格部分-->
		<Card style="margin-top: 15px">
			<div>
				<Table  :columns="columns" :data="tableData" border></Table>
			</div>
			<div class="" style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page show-total show-elevator :total="page.total" :current="page.currentPage"
					      @on-change="handlePageTurn"></Page>
				</div>
			</div>
		</Card>
	</div>
</template>

<script>
	import {environmentList} from '@/api/warning.js'
	export default {
		data () {
			return {
				searchByName:'',
				columns: [
					{
						title: '节点名称',
						align: 'center',
						key: 'node_name',
					},
					{
						title: '水位m',
						align: 'center',
						key: 'level'
					},
					{
						title: '流速m³/s',
						align: 'center',
						key: 'speed'
					},
					{
						title: '雨量mm',
						align: 'center',
						key: 'rainfall'
					},
					{
						title: '时间',
						align: 'center',
						key: 'add_time',
						width:170
					}
				],
				tableData: [],
				page: {// 页面翻页对象
					total: 1, // 数据总数
					currentPage: 1// 当前页面
				},
				searchOption: {}, // 查询用参数
			}
		},
		created () {
			if(!localStorage.project_id){
				this.$Message.warning({content:'您还未选择项目',duration: 10});
				return;
			}
			this.getList({})
		},
		methods: {
			// 查询
			async getList (params) {
				if(this.searchByName){
					params.search=this.searchByName
				}else {
					params.search = ''
				}
				params.project_id=localStorage.project_id
				let res = await environmentList(params)
				if (res.errno === 0) {
					let result= res.data.data;
					for(var i in result){
						result[i].cellClassName={}
						if(result[i].level_status==1){
							result[i].cellClassName.level='alarm-cell'
						}else if(result[i].level_status==2){
							result[i].cellClassName.level='warn-cell'
						}else{
							result[i].cellClassName.level='normal-cell'
						};
						if(result[i].speed_status==1){
							result[i].cellClassName.speed='alarm-cell'
						}else if(result[i].speed_status==2){
							result[i].cellClassName.speed='warn-cell'
						}else{
							result[i].cellClassName.speed='normal-cell'
						};
						if(result[i].rainfall_status==1){
							result[i].cellClassName.rainfall='alarm-cell'
						}else if(result[i].rainfall_status==2){
							result[i].cellClassName.rainfall='warn-cell'
						}else{
							result[i].cellClassName.rainfall='normal-cell'
						};
					}
					this.tableData=result;
					this.page = {
						total: res.data.count,
						currentPage: res.data.currentPage
					}
				} else {
					this.$Message.error(res.data)
				}
			},
			// 根据查询
			handleSearchByName () {
				if (this.searchByName) { // 判断搜索条件是否为空
					this.searchOption.search = this.searchByName
				} else { // 重置搜索内容
					this.searchOption.search = ''
				}
				this.searchOption.page = 1 // 初始化页数
				this.getList(this.searchOption)
			},
			// 页面翻页
			handlePageTurn (page) {
				this.searchOption.page = page
				this.getList(this.searchOption)
			}
		}
	}
</script>

<style >
.alarm-cell{
    background-color: #f58b45 !important;
    color: #fff;
}
.warn-cell{
	background-color:rgb(255, 0, 0)  !important;
    color: #fff;
}
.normal-cell{
    background-color: #2df54e !important;
    color: #fff;
}
.mark{
	height:32px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size:12px;
}
.mark1{
	width:15px;
	height:16px;
	background-color:#2df54e;
	border-radius:2px;
	margin-right:5px
}
.mark2{
	width:15px;
	height:16px;
	background-color:#f58b45;
	border-radius:2px;
	margin-right:5px
}
.mark3{
	width:15px;
	height:16px;
	background-color:red;
	border-radius:2px;
	margin-right:5px
}
.text1{
	margin-right:10px
}
</style>
