<template>
	<div>
		<!--按钮部分-->
		<Card>
			<p slot="title">信息发布</p>
			<Row>
                <Col span="4">
				<Button  type="primary" icon="ios-add-circle-outline" @click="isAdd=true" style="margin-right: 20px ">新增</Button>
				<!--<Button type="error" ghost @click="">批量删除</Button>-->
				</Col>
				<Col span="4" offset="16">
				<Input clearable icon="search" v-model="searchByName" @on-change="handleSearchByName"
				       placeholder="标题搜索"/>
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
        <!--添加Modal-->
		<Modal v-model="isAdd" :mask-closable="false" :closable="false" title="信息添加：" width="600">
			<Form :model="addForm" ref="addForm" :rules="addRules" :label-width="130">
				<Card>
					<FormItem label="标题：" prop="title">
						<Input clearable v-model="addForm.title" placeholder="请填写标题"/>
					</FormItem>
                    <FormItem label="类型：" prop="type">
                        <Select clearable v-model="addForm.type" placeholder="请选择发布类型" >
                            <Option value='1'>大屏端</Option>
                            <Option value='2'>移动端</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="发送对象：" prop="user_arr" v-if="addForm.type=='2'">
                        <Select clearable :label-in-value="true" v-model="addForm.user_arr" multiple  @on-change="getChoice" >
							<Option v-for="(item, index) in userData" :value="item.value" :key="index">{{item.name}}</Option>
						</Select>
                    </FormItem>
                    <FormItem label="方式：" prop="way">
                        <Select clearable v-model="addForm.way" placeholder="请选择发布方式" >
                            <Option value='1'>平台信息</Option>
                            <Option value='2'>短信</Option>
                        </Select>
                    </FormItem>
					<FormItem label="内容：" prop="content" >
                        <Input v-model="addForm.content" type="textarea" :rows="4" placeholder="请输入内容" />
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
		<Modal v-model="isEdit" :mask-closable="false" :closable="false" title="信息编辑：" width="600">
			<Form :model="editForm" ref="editForm" :rules="editRules" :label-width="130">
				<Card>
					<FormItem label="标题：" prop="title">
						<Input clearable v-model="editForm.title" placeholder="请填写标题"/>
					</FormItem>
                    <FormItem label="类型：" prop="type">
                        <Select clearable v-model="editForm.type" placeholder="请选择发布类型" >
                            <Option value='1'>大屏端</Option>
                            <Option value='2'>移动端</Option>
                        </Select>
                    </FormItem>
					<FormItem label="发送对象：" prop="user_arr" v-if="editForm.type=='2'">
                        <Select clearable :label-in-value="true" v-model="editForm.user_arr" multiple  @on-change="getEditChoice" >
							<Option v-for="(item, index) in userData" :value="item.value" :key="index">{{item.name}}</Option>
						</Select>
                    </FormItem>
                    <FormItem label="方式：" prop="way">
                        <Select clearable v-model="editForm.way" placeholder="请选择发布方式" >
                            <Option value='1'>平台信息</Option>
                            <Option value='2'>短信</Option>
                        </Select>
                    </FormItem>
					<FormItem label="内容：" prop="content" >
                        <Input v-model="editForm.content" type="textarea" :rows="4" placeholder="请输入内容" />
					</FormItem>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="text" @click="cancelEditModal">取消</Button>
				<Button type="primary" @click="editList">确认</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import {getList,addList,editList,delList} from '@/api/msg.js'
	import {idsList} from '@/api/user.js'
	export default {
		data () {
			return {
                isAdd:false,
                isEdit:false,
                addForm:{
					user_arr:[]
				},
				editForm:{},
				searchByName:'',
				columns: [
					{
						title: '标题',
						align: 'center',
						key: 'title',
					},
					{
						title: '类型',
						align: 'center',
						key: 'type',
						render:(h,params)=>{
							if(params.row.type==1){
								return h('span', {},'大屏端')
							}else if(params.row.type==2){
								return h('span', {},'移动端')
							}
						}
                    },
                    {
						title: '发布方式',
						align: 'center',
						key: 'way',
						render:(h,params)=>{
							if(params.row.way==1){
								return h('span', {},'平台信息')
							}else if(params.row.way==2){
								return h('span', {},'短信')
							}
						}
                    },
                    {
						title: '发布状态',
						align: 'center',
						key: 'status',
						render:(h,params)=>{
							return h('i-switch', {
								props: {
									value: params.row.status===0?false:true,
								},
								on: {
									'on-change': (value) => { //值发生了改变调用方法
										this.updateWorked({id:params.row.id,status:value===false?0:1})
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
						title: '时间',
						align: 'center',
						key: 'add_time',
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
                                            data.type=data.type.toString()
											data.way=data.way.toString()
											data.user_arr=JSON.parse(data.user_arr)
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
				tableData: [],
				userData:[],
                addRules: {
					title: [ { required: true, message: '标题不能为空', trigger: 'blur' }],
					type: [ { required: true, message: '请选择类型',trigger: 'change' }],
					way: [ { required: true, message: '请选择发布方式', trigger: 'change' }],
					user_arr: [ { required: true, type: 'array',min: 1,message: '请选择发送对象', trigger: 'change' }],
                    content: [ { required: true, message: '请输入发布内容', trigger: 'blur' }]
                },
                editRules: {
					title: [ { required: true, message: '标题不能为空', trigger: 'blur' }],
					type: [ { required: true, message: '请选择类型',trigger: 'change' }],
					user_arr: [ { required: true, type: 'array',min: 1,message: '请选择发送对象', trigger: 'change' }],
                    way: [ { required: true, message: '请选择发布方式', trigger: 'change' }],
                    content: [ { required: true, message: '请输入发布内容', trigger: 'blur' }]
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
            // 编辑
			async editList () {
				this.$refs.editForm.validate(async (valid) => { // 表单校验
					if (valid) { // 表单验证成功
						let form = Object.assign({}, this.editForm)
						if(form.type=='2'){
							form.user_arr=JSON.stringify(form.user_arr)
						};
                        let res = await editList(form)
                        if (res.errno ===0) {
                            this.$Message.success('编辑成功')
                            this.getList(this.searchOption)
                            this.cancelEditModal()
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
            // 添加
			async addList () {
				this.$refs.addForm.validate(async (valid) => { // 表单校验
					if (valid) { // 表单验证成功
						let form = Object.assign({}, this.addForm)
						form.project_id=localStorage.project_id
						if(form.type=='2'){
							form.user_arr=JSON.stringify(form.user_arr)
						};
						let res = await addList(form)
						if (res.errno ===0) { // 添加成功
							this.$Message.success('添加成功')
							this.getList(this.searchOption)
							this.cancelAddModal()
						} else { // 添加失败
							this.$Message.error(res.errmsg)
						}
					} else {
						this.$Message.error('请正确填写表单')
					}
				})
            },
            //修改状态
            async updateWorked(params){
				let res = await editList(params)
				if (res.errno === 0) {
					this.$Message.success('修改成功')
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
            cancelAddModal () {
				this.$refs.addForm.resetFields()// 重置表单
				this.addForm = {}
				this.isAdd = false
			},
			getChoice(data){
				this.addForm.user_arr=[]
				data.forEach(i=>{
					this.addForm.user_arr.push(i.value)
				})
			},
			getEditChoice(data){
				this.editForm.user_arr=[]
				data.forEach(i=>{
					this.editForm.user_arr.push(i.value)
				})
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
		}
	}
</script>

<style scoped>

</style>
