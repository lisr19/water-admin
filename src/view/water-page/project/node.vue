<template>
	<div>
		<!--按钮部分-->
		<div class="btns">
			<span class="btn" @click="openSet" >
					<Icon type="md-albums" size="24" style="margin-right: 5px"/>
				项目设置</span>
			<span class="btn btn2 org" >
				<Icon type="md-analytics" size="25" style="margin-right: 5px"/>
				节点设置</span>
		</div>
		<Card>
			<p slot="title">节点列表</p>
			<Row>
				<Col span="4">
				<Button  type="primary" icon="ios-add-circle-outline" @click="isAdd=true" style="margin-right: 20px ">新增</Button>
				<!--<Button type="error" ghost @click="">批量删除</Button>-->
				</Col>
				<Col span="4" offset="16">
				<Input clearable icon="search" v-model="searchByName" @on-change="handleSearchByName"
				       placeholder="输入关键字搜索"/>
				</Col>
			</Row>
		</Card>
		<!--表格部分-->
		<Card style="margin-top: 15px">
			<div>
				<Table  :columns="columns" :data="tableData" border @on-selection-change="batchSelect"
				></Table>
			</div>
			<div class="" style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page show-total show-elevator :total="page.total" :current="page.currentPage"
					      @on-change="handlePageTurn"></Page>
				</div>
			</div>
		</Card>

		<!--添加Modal-->
		<Modal v-model="isAdd" :mask-closable="false" :closable="false" title="节点添加：" width="600">
			<Form :model="addForm" ref="addForm" :rules="addRules" :label-width="130">
				<Card>
					<FormItem label="节点名称：" prop="name">
						<Input clearable v-model="addForm.name" placeholder="请填写节点名称"/>
					</FormItem>
					<FormItem label="节点位置：" prop="position">
						<Input clearable v-model="addForm.position" placeholder="请填写节点位置" />
					</FormItem>
					<FormItem label="节点坐标：" prop="coordinate">
						<Input clearable v-model="addForm.coordinate" placeholder="坐标格式：[116.00000000,39.00000000]"/>
					</FormItem>
					<FormItem label="工作时间：" prop="work_time" >
						<TimePicker type="timerange" placement="bottom-end" placeholder="请选择工作时间"   format="HH:mm"
						            v-model="addForm.work_time"   @on-change="v=>{addForm.work_time=v}"
						></TimePicker>
						<!--<DatePicker  type="date"  placeholder="请选择工作时间"   v-model="addForm.work_time"-->
						            <!--@on-change="v=>{addForm.work_time=v}"-->
						<!--&gt;</DatePicker>-->
					</FormItem>
					<FormItem label="备注：" prop="remark">
						<Input clearable v-model="addForm.remark"  placeholder="请输入备注"/>
					</FormItem>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="text" @click="cancelAddModal">取消</Button>
				<Button type="primary" @click="addtNodeList">确认</Button>
			</div>
		</Modal>

		<!--编辑Modal-->
		<Modal v-model="isEdit" :mask-closable="false" :closable="false" title="节点编辑：" width="600">
			<Form :model="editForm" ref="editForm" :rules="editRules" :label-width="130">
				<Card>
					<FormItem label="节点名称：" prop="name">
						<Input clearable v-model="editForm.name" placeholder="请填写节点名称"/>
					</FormItem>
					<FormItem label="节点位置：" prop="position">
						<Input clearable v-model="editForm.position" placeholder="请填写节点位置"/>
					</FormItem>
					<FormItem label="节点坐标：" prop="coordinate">
						<Input clearable v-model="editForm.coordinate" placeholder="坐标格式：[116.00000000,39.00000000]"/>
					</FormItem>
					<FormItem label="工作时间：" prop="work_time" >
						<TimePicker ref="editDate" type="timerange" placement="bottom-end" placeholder="请选择工作时间" format="HH:mm"
						            v-model="editForm.work_time"   @on-change="v=>{editForm.work_time=v}"
						></TimePicker>
					</FormItem>
					<FormItem label="备注：" prop="remark">
						<Input clearable v-model="editForm.remark"  placeholder="请输入备注"/>
					</FormItem>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="text" @click="cancelEditModal">取消</Button>
				<Button type="primary" @click="editNodeList">确认</Button>
			</div>
		</Modal>

		<!--设备绑定model-->
		<Modal v-model="showBind" :mask-closable="false" :closable="false" title="设备绑定：" width="600">
			<Form >
				<Card>
					<p slot="title">设备绑定：</p>
					<FormItem label="" prop="project_id">
						<Select clearable :label-in-value="true"  multiple v-model="choiceIds" @on-change="getChoice" >
							<Option v-for="(item, index) in deviceList" :value="item.value" :key="index">{{item.name}}</Option>
						</Select>
					</FormItem>
				</Card>
				<Card style="margin-top: 15px">
					<p slot="title">已绑设备：</p>
					<Tag type="border" color="default" v-for="(item,index) in isBindList" :key="item.id"
					     :name="item.name">{{item.name}}
					</Tag>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="text" @click="showBind=false">取消</Button>
				<Button type="primary" @click="bindNodeDevice">确认</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import {getNodeList,addtNodeList,deltNodeList,editNodeList,openDetail,
		editNodeWorked,getProjectList,bindNodeDevice,bindDeviceList} from '@/api/project'
	import { getDeviceList } from '@/api/equipment'
	import { hasOneOf, array4tree, ObjectContrast } from '@/libs/tools'
	export default {
		components: {
		},
		data () {
			return {
				isBindList:[],
				node_id:'',
				device_list:[],
				deviceList:[],//绑定设备
				choiceIds:[],//已选择绑定设备
				showBind:false,
				showNode:false,
				searchByPhone:'',
				searchByName:'',
				columns: [
					{
						title: '名称',
						align: 'center',
						key: 'name',
					},
					{
						title: '所属项目',
						align: 'center',
						key: 'project_name',
					},
					{
						title: '位置',
						align: 'center',
						key: 'position',
					},
					{
						title: '坐标',
						align: 'center',
						key: 'coordinate',
					},

					// {
					// 	title: '工作时间',
					// 	align: 'center',
					// 	key: 'work_time',
					// 	render: (h, params) => {
					// 		return h('span', params.row.work_time.replace(',','-'))
					// 	}
					// },
					{
						title: '备注',
						align: 'center',
						key: 'remark',
					},
					{
						title: '绑定设备',
						align: 'center',
						key: 'status',
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
											let id = {id: params.row.id}
											this.showBind =true
											this.node_id = params.row.id
											this.choiceIds = []
											this.bindDeviceList(id)
										}
									}
								}, '查看'),
							])
						}
					},
					{
						title: '启用状态',
						align: 'center',
						key: 'status',
						render:(h,params)=>{
							return h('i-switch', {
								props: {
									value: params.row.status===0?false:true,
								},
								on: {
									'on-change': (value) => { //值发生了改变调用方法
										this.editNodeWorked({id:params.row.id,status:value===false?0:1})
									}
								}
							}, [
								h('span', {
									slot: 'open',
									domProps:{
										innerHTML: '是'
									}
								}),
								h('span', {
									slot:  'close',
									domProps:{
										innerHTML: '否'
									}
								})
							])
						}
					},
					{
						title: '操作',
						align: 'center',
						key: 'handle',
						width: 250,
						render: (h, params) => {
							return h('div', [
								// h('Button', {
								// 	props: {
								// 		type: 'text'
								// 	},
								// 	style: {
								// 		marginRight: '5px',
								// 		color:'#1890FF',
								// 		background: '#ECF6FF'
								// 	},
								// 	on: {
								// 		click: () => {
								// 			let id = {id: params.row.id}
								// 			this.openDetail(id)
								// 		}
								// 	}
								// }, '详情'),
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
											let data = Object.assign({}, params.row)
											this.formCopy = Object.assign({}, data)
											this.openEditModal(data)
										}
									}
								}, '编辑'),
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
											this.$Modal.confirm({
												title: '请确认删除',
												content: `<p>删除数据: ${params.row.name} 后无法恢复,确认删除?</p>`,
												okText: '确认',
												onOk: () => {
													let id = {id: params.row.id}
													this.deltNodeList(id)
												},
												// 取消删除
												onCancel: () => {
													this.$Message.info('取消删除！')
												}
											})
										}
									}
								}, '删除')
							])
						}
					}
				],
				tableData: [],
				isAdd: false,
				isEdit: false,
				addForm: {
					device_type_id:''
				},
				editForm: {},
				formCopy:{},
				detailData: {},
				typeList:[], //类型
				// 批量选择的id对象
				delId: {
					ids: ''
				},
				page: {// 页面翻页对象
					total: 1, // 数据总数
					currentPage: 1// 当前页面
				},
				searchOption: {}, // 查询用参数
				addRules: {
					name: [ { required: true, message: '名称不能为空', trigger: 'blur' }],
					device_type_id: [ { required: true, message: '设备类型不能为空' }],
				},
				editRules: {
					name: [ { required: true, message: '名称不能为空', trigger: 'blur' }],
					device_type_id: [ { required: true, message: '类型不能为空' }],
				},
			}
		},
		created () {
			if(!localStorage.project_id){
				this.$Message.warning({content:'您还未选择项目',duration: 5});
				return;
			}
			this.getNodeList({})
			this.getDeviceList()
		},
		methods: {
			getChoice(data){
				let device_list = []
				data.forEach(i=>{
					device_list.push({id:i.value,name:i.label})
				})
				this.device_list = device_list
			},
			openSet(){
				this.$router.push({name:'项目设置'})
			},
			async openDetail(id){
				let res = await openDetail(id)
				if (res.errno === 0) {

				} else {
					this.$Message.error(res.data)
				}
			},
			async editNodeWorked(params){
				let res = await editNodeWorked(params)
				if (res.errno === 0) {
					this.$Message.success('操作成功')
				} else {
					this.$Message.error(res.data)
				}
			},
			// 查询
			async getNodeList (params) {
				if(this.searchByName){
					params.search=this.searchByName
				}else {
					params.search=''
				}
				params.project_id=localStorage.project_id
				let res = await getNodeList(params)
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
			//设备下拉列表
			async getDeviceList () {
				let params={
					project_id:localStorage.project_id
				}
				let res = await getDeviceList(params)
				if (res.errno === 0) {
					this.deviceList = res.data
					this.deviceList.forEach((i)=>{
						i.value=i.id
					})
				} else {
					this.$Message.error(res.errmsg)
				}
			},
			//节点绑定设备
			async bindNodeDevice () {
				let parmas ={
					node_id:this.node_id,
					device_list:JSON.stringify(this.device_list),
				}
				let res = await bindNodeDevice(parmas)
				if (res.errno === 0) {
					this.showBind =false
				} else {
					this.$Message.error(res.errmsg)
				}
			},
			//节点已绑定设备
			async bindDeviceList (parmas) {
				let res = await bindDeviceList(parmas)
				if (res.errno === 0) {
					this.isBindList =res.data
					this.isBindList.forEach((i)=>{
						this.choiceIds .push(i.id)
					})
				} else {
					this.$Message.error(res.errmsg)
				}
			},
			// 查询
			async getNodeById (params) {
				let res = await getNodeById(params)
				if (res.errno === 0) {

				} else {
					this.$Message.error(res.errmsg)
				}
			},

			// 添加
			async addtNodeList () {
				this.$refs.addForm.validate(async (valid) => { // 表单校验
					if (valid) { // 表单验证成功
						let form = Object.assign({}, this.addForm)
						// console.log(form)
						form.project_id=localStorage.project_id;
						let res = await addtNodeList(form)
						if (res.errno ===0) { // 添加成功
							this.$Message.success('添加成功')
							this.getNodeList(this.searchOption)
							this.cancelAddModal()
						} else { // 添加失败
							this.$Message.error(res.message)
						}
					} else {
						this.$Message.error('请正确填写表单')
					}
				})
			},
			// 编辑
			async editNodeList () {
				this.$refs.editForm.validate(async (valid) => { // 表单校验
					if (valid) { // 表单验证成功
						let form = Object.assign({}, this.editForm)
						let isChange = false
						let array = []
						if (this.$refs.editDate.publicStringValue && this.$refs.editDate.publicStringValue != null) {
							if(form.work_time.toString()!==this.formCopy.work_time){
								form.work_time = this.$refs.editDate.publicStringValue
								isChange = true
							}else {
								isChange = false
							}
							console.log(isChange);
						}
						array = ObjectContrast(form, this.formCopy)
						if (array.length > 0 || isChange===true) {
							let data = {}
							array.forEach(v => {
								data[v] = form[v]
							})
							data.id = form.id
							data.work_time = form.work_time
							// console.log(data)
							let res = await editNodeList(data)
							if (res.errno ===0) {
								this.$Message.success('编辑成功')
								this.getNodeList(this.searchOption)
								this.cancelEditModal()
							} else { // 添加失败
								this.$Message.error(res.message)
							}
						} else {
							this.$Message.error('表单没有修改')
						}
					} else {
						this.$Message.error('请正确填写表单')
					}
				})
			},
			// 删除
			async deltNodeList (params) {
				let res = await deltNodeList(params)
				if (res.errno === 0) {
					this.$Message.success('删除成功')
					this.getNodeList(this.searchOption)
				} else {
					this.$Message.error(res.message)
				}
			},
			// 批量删除
			batchDel () {
				if (this.delId.ids) {
					this.$Modal.confirm({ // 打开确认对话框
						title: '请确认删除',
						content: `<p>删除数据后无法恢复,确认删除?</p>`,
						okText: '确认',
						// 确认删除
						onOk: async () => {
							let res = await doNurseDelMany(this.delId)
							if (res.code === 200) {
								this.$Message.success('删除成功')
								this.delId.ids = ''
								this.findNurse(this.searchOption)
							} else {
								this.$Message.error(res.message)
							}
						},
						// 取消删除
						onCancel: () => {
							this.$Message.info('取消删除！')
						}
					})
				} else {
					this.$Message.info('请选择需要删除的数据！')
				}
			},
			// 根据姓名查询
			handleSearchByName () {
				if (this.searchByName) { // 判断搜索条件是否为空
					this.searchOption.search = this.searchByName
				} else { // 重置搜索内容
					this.searchOption.search = ''
				}
				this.searchOption.page = 1 // 初始化页数
				this.getNodeList(this.searchOption)
			},
			// modal打开
			openModal (params) {
				this.detailData = params
				this.isDetail = true
			},
			cancelModal () {
				this.detailData = {}
				this.isDetail = false
			},
			cancelAddModal () {
				this.$refs.addForm.resetFields()// 重置表单
				this.addForm = {}
				this.isAdd = false
			},
			// 编辑modal打开
			openEditModal (params) {
				this.editForm = params
				if(params.work_time){
					this.editForm.work_time=params.work_time.split(',')
				}
				console.log(this.editForm.work_time);
				setTimeout(()=>{
					this.isEdit = true
				},300)
			},
			cancelEditModal () {
				this.$refs.editForm.resetFields()// 重置表单
				this.editForm = {}
				this.isEdit = false
			},
			// 批量选择
			batchSelect (selection) {
				this.delId.ids = ''
				selection.forEach(row => {
					if (this.delId.ids === '') {
						this.delId.ids = row.id
					} else {
						this.delId.ids = this.delId.ids + ',' + row.id
					}
				})
			},
			// 页面翻页
			handlePageTurn (page) {
				console.log(page);
				this.searchOption.page = page
				this.getNodeList(this.searchOption)
			}
		}
	}
</script>

<style scoped lang="less">
	.btns{
		display: flex;
		font-size: 16px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		margin-bottom:18px ;
		.btn{
			padding: 0 25px;
			height: 42px;
			line-height: 42px;
			background: #FFFFFF;
			border-radius: 5px;
			display: flex;
			align-items: center;
			text-align: center;
			cursor:pointer;
		}
		.btn2{
			margin-left: 25px;
		}
		.org{
			color: #FF8040;
		}
	}
</style>
