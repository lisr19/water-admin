<template>
	<div>
		<!--按钮部分-->
		<Card>
			<p slot="title">设备运行日志</p>
			<Row>
				<Col span="4" >
				<Input clearable icon="search" v-model="searchByName" @on-change="handleSearchByName"
				       placeholder="节点名/设备名搜索"/>
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
	import {runLogsList} from '@/api/equipment.js'
	export default {
		data () {
			return {
				searchByName:'',
				columns: [
					{
						title: '设备名称',
						align: 'center',
						key: 'device_name',
					},
					{
						title: '所属节点',
						align: 'center',
						key: 'node_name',
					},
					{
						title: '类型',
						align: 'center',
						key: 'type',
						render:(h,params)=>{
							if(params.row.type==1){
								return h('span', {
									style: {
										color:'#1890FF',
									}
								},'设备上线')
							}else if(params.row.type==2){
								return h('span', {
									style: {
										color:'red',
									}
								},'设备离线')
							}else{
								return h('span', {
									style: {
										color:'#0ded1d',
									}
								},'数据上传')
							}
						}
					},
					{
						title: '时间',
						align: 'center',
						key: 'add_time',
						// render: (h, params) => {
						// 	return h('span', [params.row.add_time ? params.row.add_time.slice(0, 10) : ''])
						// }
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
				let res = await runLogsList(params)
				if (res.errno === 0) {
					this.tableData = res.data.data
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

<style scoped>

</style>
