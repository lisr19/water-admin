<template>
	<div>
		<!--按钮部分-->
		<div class="btns">
			<span class="btn org">
				<Icon type="md-albums" size="24" style="margin-right: 5px"/>
				项目设置
			</span>
			<span class="btn btn2" @click="openSet">
				<Icon type="md-analytics" size="25" style="margin-right: 5px"/>
				节点设置</span>
		</div>
		<Card>
			<p slot="title">项目列表</p>
			<Row>
				<Col span="4">
				<Button  type="primary" icon="ios-add-circle-outline" @click="isAdd=true" style="margin-right: 20px ">新增</Button>
				<!--<Button type="error" ghost @click="">批量删除</Button>-->
				</Col>
				<Col span="4" offset="16">
				<Input clearable icon="search" v-model="searchByName" @on-change="handleSearchByName"
				       placeholder="输入设备名搜索"/>
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
		<Modal v-model="isAdd" :mask-closable="false" :closable="false" title="设备添加：" width="600">
			<Form :model="addForm" ref="addForm" :rules="addRules" :label-width="130">
				<Card>
					<FormItem label="项目名称：" prop="name">
						<Input clearable v-model="addForm.name" placeholder="请填写项目名称"/>
					</FormItem>
					<FormItem label="联系人：" prop="link_people">
						<Input clearable v-model="addForm.link_people" placeholder="请填写联系人"/>
					</FormItem>
					<FormItem label="联系电话：" prop="link_phone">
						<Input clearable v-model="addForm.link_phone" placeholder="请填写联系电话"/>
					</FormItem>
					<FormItem label="备注：" prop="remark">
						<Input clearable v-model="addForm.remark"  placeholder="请输入备注"/>
					</FormItem>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="text" @click="cancelAddModal">取消</Button>
				<Button type="primary" @click="addList">确认</Button>
			</div>
		</Modal>

		<!--编辑Modal-->
		<Modal v-model="isEdit" :mask-closable="false" :closable="false" title="设备编辑：" width="600">
			<Form :model="editForm" ref="editForm" :rules="editRules" :label-width="130">
				<Card>
					<FormItem label="项目名称：" prop="name">
						<Input clearable v-model="editForm.name" placeholder="请填写项目名称"/>
					</FormItem>
					<FormItem label="联系人：" prop="link_people">
						<Input clearable v-model="editForm.link_people" placeholder="请填写联系人"/>
					</FormItem>
					<FormItem label="联系电话：" prop="link_phone">
						<Input clearable v-model="editForm.link_phone" placeholder="请填写联系电话"/>
					</FormItem>
					<FormItem label="备注：" prop="remark">
						<Input clearable v-model="editForm.remark"  placeholder="请输入备注"/>
					</FormItem>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="text" @click="cancelEditModal">取消</Button>
				<Button type="primary" @click="editList">确认</Button>
			</div>
		</Modal>

		<!--节点弹窗Modal-->
		<Modal v-model="showNode" :mask-closable="false" :closable="false" :title=currentName  width="1000">
			<Table  :columns="columnsByNode" :data="nodeData" border
			></Table>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="primary" @click="showNode=false">关闭</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import {getList,addList,delList,editList,getNodeById,editNodeWorked} from '@/api/project'
	import { hasOneOf, array4tree, ObjectContrast } from '@/libs/tools'
	export default {
		components: {
		},
		data () {
			return {
				currentName:'详情',
				showNode:false,
				searchByPhone:'',
				searchByName:'',
				columns: [
					{
						title: '项目名称',
						align: 'center',
						key: 'name',
					},
					{
						title: '节点',
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
											let id = params.row.id
											this.currentName = params.row.name +'节点'
											this.getNodeById({id:id})
											this.showNode = true
										}
									}
								}, '查看')
							])
						}
					},
					{
						title: '联系人',
						align: 'center',
						key: 'link_people',
					},
					{
						title: '联系电话',
						align: 'center',
						key: 'link_phone',
					},
					{
						title: '备注',
						align: 'center',
						key: 'remark',
					},
					{
						title: '添加时间',
						align: 'center',
						key: 'add_time',
						// render: (h, params) => {
						// 	return h('span', [params.row.add_time ? params.row.add_time.slice(0, 10) : ''])
						// }
					},
					{
						title: '操作',
						align: 'center',
						key: 'handle',
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
							])
						}
					}
				],
				columnsByNode: [
					{
						title: '名称',
						align: 'center',
						key: 'name',
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

					{
						title: '工作时间',
						align: 'center',
						key: 'work_time',
					},

					{
						title: '备注',
						align: 'center',
						key: 'remark',
					},
					// {
					// 	title: '状态',
					// 	align: 'center',
					// 	key: 'status',
					// 	render: (h, params) => {
					// 		return h('span', [params.row.status===0 ?'启用': '禁用'])
					// 	}
					// },
					{
						title: '启用状态',
						align: 'center',
						key: 'status',
						render:(h,params)=>{
							return h('i-switch',{
								props: {
									value: params.row.status===0?false:true,
									disabled: true
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
				],
				tableData: [],
				nodeData: [], //节点数据
				isAdd: false,
				isEdit: false,
				addForm: {
					device_type_id:''
				},
				editForm: {},
				formCopy:{},
				detailData: {},
				typeList:[], //设备类型
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
					name: [ { required: true, message: '设备名称不能为空', trigger: 'blur' }],
					device_type_id: [ { required: true, message: '设备类型不能为空' }],
				},
				editRules: {
					name: [ { required: true, message: '设备名称不能为空', trigger: 'blur' }],
					device_type_id: [ { required: true, message: '设备类型不能为空' }],
				},
			}
		},
		created () {
			this.getList({})
		},
		methods: {
			openSet(){
				this.$router.push({name:'节点管理'})
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
			async getList (params) {
				if(this.searchByName){
					params.search=this.searchByName
				}else {
					params.search=''
				}
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
			// 查询
			async getNodeById () {
				let params={
					id:localStorage.project_id
				}
				let res = await getNodeById(params)
				if (res.errno === 0) {
					this.nodeData=res.data
				} else {
					this.$Message.error(res.data)
				}
			},

			// 添加
			async addList () {
				this.$refs.addForm.validate(async (valid) => { // 表单校验
					if (valid) { // 表单验证成功
						let form = Object.assign({}, this.addForm)
						// console.log(form)
						let res = await addList(form)
						if (res.errno ===0) { // 添加成功
							this.$Message.success('添加成功')
							this.getList(this.searchOption)
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
			async editList () {
				this.$refs.editForm.validate(async (valid) => { // 表单校验
					if (valid) { // 表单验证成功
						let form = Object.assign({}, this.editForm)
						// if (this.$refs.editDate.publicStringValue && this.$refs.editDate.publicStringValue != null) {
						// 	form.install_time = this.$refs.editDate.publicStringValue
						// }
						let array = []
						array = ObjectContrast(form, this.formCopy)
						if (array.length > 0) {
							let data = {}
							array.forEach(v => {
								data[v] = form[v]
							})
							data.id = form.id
							// console.log(data)
							let res = await editList(data)
							if (res.errno ===0) {
								this.$Message.success('编辑成功')
								this.getList(this.searchOption)
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
			async delList (params) {
				let res = await delList(params)
				if (res.errno === 0) {
					this.$Message.success('删除成功')
					this.getList(this.searchOption)
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
				this.getList(this.searchOption)
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
				this.getList(this.searchOption)
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
