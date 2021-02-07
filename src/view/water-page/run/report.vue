<template>
	<div>
		<!--按钮部分-->
		<Card>
			<p slot="title">信息上报</p>
			<Row>
				<Col span="4">
				<Input clearable icon="search" v-model="searchByName" @on-change="handleSearchByName"
				       placeholder="标题/节点名/上报人/处理人搜索"/>
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
		<!--detailModel-->
		<Modal v-model="detailModel" :mask-closable="false" :closable="false" :title="'上报信息：'+detailData.node_name+'-'+detailData.title" width="800">
			<Form  :label-width="100">
				<Card>
					<FormItem label="上报人：">
						<p>{{detailData.user_name}}</p>
					</FormItem>
					<FormItem label="上报时间：">
						<p>{{detailData.add_time}}</p>
					</FormItem>
					<FormItem label="描述：">
						<p>{{detailData.describe}}</p>
					</FormItem>
					<FormItem label="图片：">
						<div v-if="detailData.image_arr">
							<img style="width:300px;margin-right:5px" v-for="(item,index) in detailData.image_arr" :key="index" :src="item">
						</div>
					</FormItem>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="primary" @click="canceldetailModal">关闭</Button>
			</div>
		</Modal>
		<!--historyModel-->
		<Modal v-model="historyModel" :mask-closable="false" :closable="false" :title="'问题跟踪：'+detailData.node_name+'-'+detailData.title" width="800">
			<Form  :label-width="100">
				<Card>
					<template v-if="historyData.length>0" >
						<div  v-for="(item,index) in historyData" :key="index">
							<FormItem :label="item.user_name+'：'">
								<p>{{item.content}}({{item.add_time}})</p>
							</FormItem>
						</div>
					</template>
					<template v-else >
						<span>暂无数据</span>
					</template>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="primary" @click="cancelhistoryModel">关闭</Button>
			</div>
		</Modal>
		<!--dealModel-->
		<Modal v-model="dealModel" :mask-closable="false" :closable="false" :title="'处理分配：'+detailData.node_name+'-'+detailData.title" width="600">
			<Form :model="editForm" ref="editForm" :rules="editRules" :label-width="100">
				<Card>
					<FormItem label="处理人：" prop="deal_account_id">
						<Select clearable v-model="editForm.deal_account_id"   placeholder="请选择处理人">
							<Option v-for="(item, index) in userData" :value="item.value" :key="index">{{item.name}}</Option>
						</Select>
					</FormItem>
					<FormItem label="备注：">
						<Input v-model="editForm.deal_remark" type="textarea" :rows="4" placeholder="请输入内容" />
					</FormItem>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="text" @click="canceldealModel">取消</Button>
				<Button type="primary" @click="editList">确认</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import {getList,historyList,editList,delList} from '@/api/report.js'
	import {idsList} from '@/api/user.js'
	export default {
		data () {
			return {
				detailModel:false,
				historyModel:false,
				dealModel:false,
				detailData:{},
				searchByName:'',
				editForm:{},
				columns: [
					{
						title: '标题',
						align: 'center',
						key: 'title',
					},
					{
						title: '节点',
						align: 'center',
						key: 'node_name',
					},
					{
						title: '上报信息',
						align: 'center',
						render:(h,params)=>{
							return h('div', [
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
											let data=Object.assign({}, params.row);
											data.image_arr=JSON.parse(data.image_arr);
											this.detailData=data;
											this.detailModel=true;
										}
									}
								}, '查看'),
							])
						}
					},
					{
						title: '问题跟踪',
						align: 'center',
						render:(h,params)=>{
							return h('div', [
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
											this.detailData=Object.assign({}, params.row);
											this.getHistoryList(params.row.id)
										}
									}
								}, '查看'),
							])
						}
					},
					{
						title: '处理状态',
						align: 'center',
						key: 'status',
						render:(h,params)=>{
							if(params.row.status==0){
								return h('span', {
									style:{
										color:'red'
									}
								},'未处理')
							}else if(params.row.status==1){
								return h('span', {
									style:{
										color:'#1890FF'
									}
								},'处理中')
							}else{
								return h('span', {
									style:{
										color:'#0ded1d'
									}
								},'已结束')
							}
						}
					},
					{
						title: '处理人',
						align: 'center',
						key: 'deal_user_name',
					},
					{
						title: '处理时间',
						align: 'center',
						key: 'deal_time',
					},
					{
						title: '操作',
						align: 'center',
						key: 'handle',
						render: (h, params) => {
							let deal_but=h('Button', {
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
											this.detailData=Object.assign({}, params.row);
											this.editForm.id=params.row.id;
											if(params.row.deal_account_id){
												this.editForm.deal_account_id=params.row.deal_account_id;
												this.editForm.deal_remark=params.row.deal_remark;
											}
											this.dealModel=true;
										}
									}
								}, '处理分配');
							let re_deal_but=h('Button', {
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
											this.detailData=Object.assign({}, params.row);
											this.editForm.id=params.row.id;
											if(params.row.deal_account_id){
												this.editForm.deal_account_id=params.row.deal_account_id;
												this.editForm.deal_remark=params.row.deal_remark;
											}
											this.dealModel=true;
										}
									}
								}, '重新分配');
							let del_but=h('Button', {
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
											this.$Modal.confirm({
												title: '请确认删除',
												content: `<p>删除数据: ${params.row.name} 后无法恢复,确认删除?</p>`,
												okText: '确认',
												onOk: () => {
													let id = {id: params.row.id}
													this.delList(id)
												},
												// 取消删除
												onCancel: () => {
													this.$Message.info('取消删除！')
												}
											})
										}
									}
								}, '删除')
							let but=[];
							if(params.row.status!=2){
								if(params.row.deal_account_id){
									but.push(re_deal_but)
								}else{
									but.push(deal_but)
								}
							};
							but.push(del_but)
							return h('div', but);
						}
					}
				],
				tableData: [],
				userData:[],
				historyData:[],
				editRules: {
					deal_account_id: [ { required: true,type: 'number', message: '处理人不能为空',trigger: 'change' }]
				},
				page: {// 页面翻页对象
					total: 1, // 数据总数
					currentPage: 1// 当前页面
				},
				searchOption: {}, // 查询用参数
			}
		},
		created () {
			if(!localStorage.project_id){
				this.$Message.warning({content:'您还未选择项目',duration: 5});
				return;
			}
			this.getList({})
			this.getUserList()
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
			//用户列表
			async getUserList () {
				let params={
					project_id:localStorage.project_id
				}
				let res = await idsList(params)
				if (res.errno === 0) {
					this.userData = res.data
					this.userData.forEach((i)=>{
						i.value=i.id
					})
				} else {
					this.$Message.error(res.data)
				}
			},
			//问题跟踪历史
			async getHistoryList(report_id){
				let params={
					report_id:report_id
				}
				let res = await historyList(params)
				if (res.errno === 0) {
					this.historyData = res.data;
					setTimeout(()=>{
						this.historyModel=true;
					},300)
				} else {
					this.$Message.error(res.data)
				}
			},
            // 编辑
			async editList () {
				console.log(this.editForm)
				this.$refs.editForm.validate(async (valid) => { // 表单校验
					if (valid) { // 表单验证成功
						let form = Object.assign({}, this.editForm)
                        let res = await editList(form)
                        if (res.errno ===0) {
                            this.$Message.success('分配成功')
                            this.getList(this.searchOption)
                            this.canceldealModel()
                        } else { // 添加失败
                            this.$Message.error(res.message)
                        }
					} else {
						this.$Message.error('请正确填写表单')
					}
				})
			},
            // 删除
			async delList (params) {
				let res = await delList(params)
				if (res.errno === 0) {
					this.$Message.success('删除成功')
					this.getList(this.searchOption)
				} else {
					this.$Message.error(res.message)
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
			canceldetailModal () {
				this.detailModel = false
				this.detailData = {}
			},
			cancelhistoryModel () {
				this.historyModel=false
				this.detailData = {}
				this.historyData =[];
			},
			canceldealModel () {
				this.dealModel=false
				this.detailData = {}
				this.editForm={}
			}
		}
	}
</script>

<style scoped>

</style>
