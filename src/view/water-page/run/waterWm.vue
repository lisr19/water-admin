<template>
	<div>
		<!--按钮部分-->
		<Card>
			<p slot="title">设备运行日志</p>
			<Row>
				<Col span="4" >
				<Input clearable icon="search" v-model="searchByName" @on-change="handleSearchByName"
				       placeholder="设备名/节点名搜索"/>
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
		<!--视频查看Modal-->
		<Modal v-model="iscamera" :mask-closable="false" :footer-hide="true" title="查看视频监控：" width="755" >
			<iframe id="iframeId" :src="camera_url" frameborder="0" style="width:100%;height:650px"  scrolling="no">
			</iframe>
		</Modal>
		<!--识别Model-->
		<Modal v-model="identifyModel" :mask-closable="false" :closable="false" title="监控识别记录" width="800">
			<Form  :label-width="100">
				<Card>
					<Table  :columns="columns1" :data="identifyData" border></Table>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="primary" @click="cancelidentifyModel">关闭</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import {getList,getIdentify} from '@/api/waterWm.js'
	export default {
		data () {
			return {
				searchByName:'',
				camera_url:'',
				iscamera:false,
				columns: [
					{
						title: '设备名称',
						align: 'center',
						key: 'name',
					},
					{
						title: '所属节点',
						align: 'center',
						key: 'node_name',
					},
					{
						title: '状态',
						align: 'center',
						key: 'status',
						render:(h,params)=>{
							if(params.row.status==0){
								return h('span', {
									style: {
										color:'red',
									}
								},'离线')
							}else{
								return h('span', {
									style: {
										color:'#0ded1d',
									}
								},'在线')
							}
						}
					},
					{
						title: '实时视频',
						align: 'center',
						render: (h, params) => {
							return h('div',[
								h('Button', {
									props: {
										type: 'text'
									},
									style: {
										marginRight: '5px',
										color:'#1890FF',
										background: '#ECF6FF'
									},
									on: {
										click: () => {
											if(params.row.status==0){
												this.$Message.info('设备离线，无法查看监控');
											}else{
												this.camera_url="wm_admin/demo/index.html?sn="+params.row.sn+"&account="+params.row.account+"&password="+params.row.password+"&channel="+params.row.channel;
												this.iscamera=true;
											}
										}
									}
								}, '查看')
							])
						}
					},
					{
						title: '监控识别',
						align: 'center',
						render: (h, params) => {
							return h('div',[
								h('Button', {
									props: {
										type: 'text'
									},
									style: {
										marginRight: '5px',
										color:'#1890FF',
										background: '#ECF6FF'
									},
									on: {
										click: () => {
											this.getIdentifyList(params.row.id)
										}
									}
								}, '查看')
							])
						}
					},
				],
				columns1:[
					{
						title: '类型',
						align: 'center',
						key: 'type',
						render:(h,params)=>{
							if(params.row.type==1){
								return h('span', {},'船舶')
							}else{
								return h('span', {},'悬浮物')
							}
						}
					},
					{
						title: '识别内容',
						align: 'center',
						key: 'content'
					},
					{
						title: '识别时间',
						align: 'center',
						key: 'add_time'
					}
				],
				tableData: [],
				identifyData:[],
				identifyModel:false,
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
				let res = await getList(params)
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
			},
			//监控识别记录
			async getIdentifyList(device_id){
				let params={
					device_id:device_id
				}
				let res = await getIdentify(params)
				if (res.errno === 0) {
					this.identifyData = res.data;
					setTimeout(()=>{
						this.identifyModel=true;
					},300)
				} else {
					this.$Message.error(res.data)
				}
			},
			cancelidentifyModel () {
				this.identifyModel=false
				this.identifyData =[];
			}
		}
	}
</script>

<style scoped>

</style>
