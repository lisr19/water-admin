<template>
	<div>
		<!--按钮部分-->
		<Card>
			<p slot="title">角色列表</p>
			<Row>
				<Col span="4">
				<Button  type="primary" icon="ios-add-circle-outline" @click="isAdd=true" style="margin-right: 20px ">新增</Button>
				<!--<Button type="error" ghost @click="">批量删除</Button>-->
				</Col>
				<Col span="4" offset="16">
				<Input clearable icon="search" v-model="searchByName" @on-change="handleSearchByName"
				       placeholder="输入角色名搜索"/>
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
					<FormItem label="名称：" prop="name">
						<Input clearable v-model="addForm.name" placeholder="请填写角色名称"/>
					</FormItem>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="text" @click="cancelAddModal">取消</Button>
				<Button type="primary" @click="addRoleList">确认</Button>
			</div>
		</Modal>

		<!--编辑Modal-->
		<Modal v-model="isEdit" :mask-closable="false" :closable="false" title="设备编辑：" width="600">
			<Form :model="editForm" ref="editForm" :rules="editRules" :label-width="130">
				<Card>
					<FormItem label="名称：" prop="name">
						<Input clearable v-model="editForm.name" placeholder="请填写名称" />
					</FormItem>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="text" @click="cancelEditModal">取消</Button>
				<Button type="primary" @click="editRoleList">确认</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import {getRoleList,addRoleList,delRoleList,editRoleList} from '@/api/user'
	import { hasOneOf, array4tree, ObjectContrast } from '@/libs/tools'
	export default {
		components: {
		},
		data () {
			return {
				searchByPhone:'',
				searchByName:'',
				columns: [
					{
						title: '编号',
						align: 'center',
						key: 'id',
					},
					{
						title: '名称',
						align: 'center',
						key: 'name',
					},
					{
						title: '录入时间',
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
											this.$Modal.confirm({
												title: '请确认删除',
												content: `<p>删除数据: ${params.row.name} 后无法恢复,确认删除?</p>`,
												okText: '确认',
												onOk: () => {
													let id = {id: params.row.id}
													this.delRoleList(id)
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
					name: [ { required: true, message: '名称不能为空', trigger: 'blur' }],
				},
				editRules: {
					name: [ { required: true, message: '名称不能为空', trigger: 'blur' }],
				},
			}
		},
		created () {
			this.getRoleList({})
		},
		methods: {
			async openDetail(id){
				let res = await openDetail(id)
				if (res.errno === 0) {

				} else {
					this.$Message.error(res.data)
				}
			},
			// 查询
			async getRoleList (params) {
				if(this.searchByName){
					params.search=this.searchByName
				}else {
					params.search = ''
				}
				let res = await getRoleList(params)
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
			// 添加
			async addRoleList () {
				this.$refs.addForm.validate(async (valid) => { // 表单校验
					if (valid) { // 表单验证成功
						let form = Object.assign({}, this.addForm)
						// console.log(form)
						let res = await addRoleList(form)
						if (res.errno ===0) { // 添加成功
							this.$Message.success('添加成功')
							this.getRoleList(this.searchOption)
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
			async editRoleList () {
				this.$refs.editForm.validate(async (valid) => { // 表单校验
					if (valid) { // 表单验证成功
						let form = Object.assign({}, this.editForm)
						let array = []
						array = ObjectContrast(form, this.formCopy)
						if (array.length > 0) {
							let data = {}
							array.forEach(v => {
								data[v] = form[v]
							})
							data.id = form.id
							// console.log(data)
							let res = await editRoleList(data)
							if (res.errno ===0) {
								this.$Message.success('编辑成功')
								this.getRoleList(this.searchOption)
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
			async delRoleList (params) {
				let res = await delRoleList(params)
				if (res.errno === 0) {
					this.$Message.success('删除成功')
					this.getRoleList(this.searchOption)
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
				this.getRoleList(this.searchOption)
			},
			// 根据账号/手机查询
			handleSearchByPhone () {
				if (this.searchByPhone) { // 判断搜索条件是否为空
					this.searchOption.username = this.searchByPhone
				} else { // 重置搜索内容
					this.searchOption.username = ''
				}
				this.searchOption.page = 1 // 初始化页数
				this.findNurse(this.searchOption)
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
				this.searchOption.page = page
				this.getRoleList(this.searchOption)
			}
		}
	}
</script>

<style scoped>

</style>
