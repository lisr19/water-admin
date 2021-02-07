<template>
	<div>
		<!--按钮部分-->
		<Card>
			<p slot="title">水质预警</p>
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
	import {resourcesList} from '@/api/warning.js'
	export default {
		data () {
			return {
				searchByName:'',
				columns: [
					{
						title: '节点名称',
						align: 'center',
						key: 'node_name'
					},
					{
						title: '温度℃',
						align: 'center',
						key: 'temperature'
					},
					{
						title: '浊度NTU',
						align: 'center',
						key: 'turbidity'
					},
					{
						title: '有机含碳量mg/L',
						align: 'center',
						key: 'TOC'
					},
					{
						title: '化学需氧量mg/L',
						align: 'center',
						key: 'COD'
					},
					{
						title: 'PH',
						align: 'center',
						key: 'PH'
					},
					{
						title: '电导率mS/cm',
						align: 'center',
						key: 'EC'
					},
					{
						title: '悬浮物mg/L',
						align: 'center',
						key: 'suspended'
					},
					{
						title: '溶解氧mg/L',
						align: 'center',
						key: 'dissolved_oxygen'
					},
					{
						title: '镉离子ppm',
						align: 'center',
						key: 'cadmium_ion'
					},
					{
						title: '氰离子ppm',
						align: 'center',
						key: 'cryanide_ion'
					},
					{
						title: '铅离子ppm',
						align: 'center',
						key: 'lead_ion'
					},
					{
						title: '叶绿素ug/L',
						align: 'center',
						key: 'chlorophyll'
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
				let res = await resourcesList(params)
				if (res.errno === 0) {
					let result= res.data.data;
					for(var i in result){
						result[i].cellClassName={}
						if(result[i].temperature_status==1){
							result[i].cellClassName.temperature='alarm-cell'
						}else if(result[i].temperature_status==2){
							result[i].cellClassName.temperature='warn-cell'
						}else{
							result[i].cellClassName.temperature='normal-cell'
						};
						if(result[i].turbidity_status==1){
							result[i].cellClassName.turbidity='alarm-cell'
						}else if(result[i].turbidity_status==2){
							result[i].cellClassName.turbidity='warn-cell'
						}else{
							result[i].cellClassName.turbidity='normal-cell'
						};
						if(result[i].TOC_status==1){
							result[i].cellClassName.TOC='alarm-cell'
						}else if(result[i].TOC_status==2){
							result[i].cellClassName.TOC='warn-cell'
						}else{
							result[i].cellClassName.TOC='normal-cell'
						};
						if(result[i].COD_status==1){
							result[i].cellClassName.COD='alarm-cell'
						}else if(result[i].COD_status==2){
							result[i].cellClassName.COD='warn-cell'
						}else{
							result[i].cellClassName.COD='normal-cell'
						};
						if(result[i].PH_status==1){
							result[i].cellClassName.PH='alarm-cell'
						}else if(result[i].PH_status==2){
							result[i].cellClassName.PH='warn-cell'
						}else{
							result[i].cellClassName.PH='normal-cell'
						};
						if(result[i].EC_status==1){
							result[i].cellClassName.EC='alarm-cell'
						}else if(result[i].EC_status==2){
							result[i].cellClassName.EC='warn-cell'
						}else{
							result[i].cellClassName.EC='normal-cell'
						};
						if(result[i].suspended_status==1){
							result[i].cellClassName.suspended='alarm-cell'
						}else if(result[i].suspended_status==2){
							result[i].cellClassName.suspended='warn-cell'
						}else{
							result[i].cellClassName.suspended='normal-cell'
						};
						if(result[i].dissolved_oxygen_status==1){
							result[i].cellClassName.dissolved_oxygen='alarm-cell'
						}else if(result[i].dissolved_oxygen_status==2){
							result[i].cellClassName.dissolved_oxygen='warn-cell'
						}else{
							result[i].cellClassName.dissolved_oxygen='normal-cell'
						};
						if(result[i].cadmium_ion_status==1){
							result[i].cellClassName.cadmium_ion='alarm-cell'
						}else if(result[i].cadmium_ion_status==2){
							result[i].cellClassName.cadmium_ion='warn-cell'
						}else{
							result[i].cellClassName.cadmium_ion='normal-cell'
						};
						if(result[i].cryanide_ion_status==1){
							result[i].cellClassName.cryanide_ion='alarm-cell'
						}else if(result[i].cryanide_ion_status==2){
							result[i].cellClassName.cryanide_ion='warn-cell'
						}else{
							result[i].cellClassName.cryanide_ion='normal-cell'
						};
						if(result[i].lead_ion_status==1){
							result[i].cellClassName.lead_ion='alarm-cell'
						}else if(result[i].lead_ion_status==2){
							result[i].cellClassName.lead_ion='warn-cell'
						}else{
							result[i].cellClassName.lead_ion='normal-cell'
						};
						if(result[i].chlorophyll_status==1){
							result[i].cellClassName.chlorophyll='alarm-cell'
						}else if(result[i].chlorophyll_status==2){
							result[i].cellClassName.chlorophyll='warn-cell'
						}else{
							result[i].cellClassName.chlorophyll='normal-cell'
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
	background-color:red  !important;
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
