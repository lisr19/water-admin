<template>
	<div>
		<!--按钮部分-->
		<Card>
			<p slot="title">巡检管理</p>
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
		<Modal v-model="isAdd" :mask-closable="false" :closable="false" title="巡检任务添加：" width="600">
			<Form :model="addForm" ref="addForm" :rules="addRules" :label-width="130">
				<Card>
					<FormItem label="标题：" prop="title">
						<Input clearable v-model="addForm.title" placeholder="请填写标题"/>
					</FormItem>
                    <FormItem label="类型：" prop="type">
                        <Select clearable v-model="addForm.type" placeholder="请选择紧急类型" >
                            <Option value='1'>一般</Option>
                            <Option value='2'>紧急</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="巡检人：" prop="patrol_account_id" >
                        <Select v-model="addForm.patrol_account_id"  >
							<Option v-for="(item, index) in userData" :value="item.value" :key="index">{{item.name}}</Option>
						</Select>
                    </FormItem>
					<FormItem label="巡检时间：" prop="patrol_time" >
						<DatePicker ref="addDate" type="datetime"  placeholder="请选择巡检时间"   v-model="addForm.patrol_time"
						            @on-change="v=>{addForm.patrol_time=v}"
						></DatePicker>
					</FormItem>
                    <FormItem label="巡检节点：" prop="patrol_node_arr" >
                        <Select clearable :label-in-value="true" v-model="addForm.patrol_node_arr" multiple  @on-change="getChoice" >
							<Option v-for="(item, index) in nodeData" :value="item.value" :key="index">{{item.name}}</Option>
						</Select>
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
		<Modal v-model="isEdit" :mask-closable="false" :closable="false" title="巡检任务编辑：" width="600">
			<Form :model="editForm" ref="editForm" :rules="editRules" :label-width="130">
				<Card>
					<FormItem label="标题：" prop="title">
						<Input clearable v-model="editForm.title" placeholder="请填写标题"/>
					</FormItem>
                    <FormItem label="类型：" prop="type">
                        <Select clearable v-model="editForm.type" placeholder="请选择紧急类型" >
                            <Option value='1'>一般</Option>
                            <Option value='2'>紧急</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="巡检人：" prop="patrol_account_id" >
                        <Select v-model="editForm.patrol_account_id"  >
							<Option v-for="(item, index) in userData" :value="item.value" :key="index">{{item.name}}</Option>
						</Select>
                    </FormItem>
					<FormItem label="巡检时间：" prop="patrol_time" >
						<DatePicker ref="addDate" type="datetime"  placeholder="请选择巡检时间"   v-model="editForm.patrol_time"
						            @on-change="v=>{editForm.patrol_time=v}"
						></DatePicker>
					</FormItem>
                    <FormItem label="巡检节点：" prop="patrol_node_arr" >
                        <Select clearable :label-in-value="true" v-model="editForm.patrol_node_arr" multiple  @on-change="getEditChoice" >
							<Option v-for="(item, index) in nodeData" :value="item.value" :key="index">{{item.name}}</Option>
						</Select>
                    </FormItem>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="text" @click="cancelEditModal">取消</Button>
				<Button type="primary" @click="editList">确认</Button>
			</div>
		</Modal>
		<!--historyModel-->
		<Modal v-model="historyModel" :mask-closable="false" :closable="false" title="节点签到记录" width="1200">
			<Form  :label-width="100">
				<Card>
					<Table  :columns="columns1" :data="historyData" border></Table>
				</Card>
			</Form>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="primary" @click="cancelhistoryModel">关闭</Button>
			</div>
		</Modal>
		<!--图片放大-->
		<Modal v-model="img_show"  width="700" footer-hide=true>
			<div style="text-align:center;margin:20px">
				<img :src="this.img_url" style="max-width:100%">
			</div>
		</Modal>
	</div>
</template>

<script>
	import {getList,addList,editList,delList,historyList} from '@/api/patrol.js'
	import {getNodeById} from '@/api/project'
	import {idsList} from '@/api/user.js'
	export default {
		data () {
			return {
				historyModel:false,
                isAdd:false,
				isEdit:false,
				img_url:'',
				img_show:false,
                addForm:{
					patrol_node_arr:[]
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
								return h('span', {},'一般')
							}else{
								return h('span', {
									style:{
										color:'red'
									}
								},'紧急')
							}
						}
					},
					{
						title: '巡检人',
						align: 'center',
						key: 'patrol_user_name',
					},
					{
						title: '巡检时间',
						align: 'center',
						key: 'patrol_time',
					},
					{
						title: '状态',
						align: 'center',
						key: 'status',
						render:(h,params)=>{
							if(params.row.status==0){
								return h('span', {
									style:{
										color:'red'
									}
								},'未巡检')
							}else if(params.row.status==1){
								return h('span', {
									style:{
										color:'#1890FF'
									}
								},'正在巡检')
							}else{
								return h('span', {
									style:{
										color:'#0ded1d'
									}
								},'完成巡检')
							}
						}
					},
					{
						title: '签到记录',
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
											this.getHistoryList(params.row.id)
										}
									}
								}, '查看')
							])
						}
					},
					{
						title: '审核人',
						align: 'center',
						key: 'verity_user_name',
					},
					{
						title: '审核状态',
						align: 'center',
						key: 'verity_status',
						render:(h,params)=>{
							if(params.row.status==2){
								if(params.row.verity_status==0){
									return h('div',[
										h('span', {
											style:{
												color:'red'
											}
										},'未审核'),
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
														this.updateWorked(params.row.id)
													}
												}
											}, '通过')
										])
								}else{
									return h('span', {
										style:{
											color:'#0ded1d'
										}
									},'已审核')
								}
							}
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
											data.type=data.type.toString();
											data.patrol_node_arr=JSON.parse(data.patrol_node_arr)
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
												content: `<p>删除数据: ${params.row.title} 后无法恢复,确认删除?</p>`,
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
				columns1:[
					{
						title: '节点',
						align: 'center',
						key: 'name',
					},
					{
						title: '位置',
						align: 'center',
						key: 'position',
					},
					{
						title: '时间',
						align: 'center',
						key: 'add_time',
					},
					{
						title: '状态',
						align: 'center',
						key: 'status',
						render:(h,params)=>{
							if(params.row.status==1){
								return h('span', {
									style:{
										color:'#0ded1d'
									}
								},'已打卡')
							}else{
								return h('span', {
									style:{
										color:'red'
									}
								},'未打卡')
							}
						}
					},
					{
						title: '备注',
						align: 'center',
						key: 'remark',
					},
					{
						title: '图片',
						align: 'center',
						key: 'img_arr',
						render: (h, params) => {
							if(params.row.img_arr){
								let list =JSON.parse(params.row.img_arr);
								let arr=[]
								for(let i in list){
									arr.push( [
										h('img', {
											props: {
												type: 'primary',
												size: 'small'
											},
											attrs: {
												src: list[i], uid : i , style: "width: 50px;height: 50px;"						
											},
											style: {
											},
											on: {
												click: (e) => {
													let index= e.target.getAttribute("uid");
													this.img_url=list[index];
													this.img_show=true
												}
											}
										}),
									])
								};
								return h('div', {},arr)
							}
                    	}
					}
				],
				tableData: [],
				userData:[],
				nodeData:[],
				historyData:[],
                addRules: {
					title: [ { required: true, message: '标题不能为空', trigger: 'blur' }],
					type: [ { required: true, message: '请选择类型',trigger: 'change' }],
					patrol_account_id: [ { required: true,type: 'number', message: '请选择巡检人', trigger: 'change' }],
					patrol_node_arr: [ { required: true, type: 'array',min: 1,message: '请选择巡检节点', trigger: 'change' }],
                    patrol_time: [ { required: true, message: '请选择巡检时间', trigger: 'blur'  }]
                },
                editRules: {
					title: [ { required: true, message: '标题不能为空', trigger: 'blur' }],
					type: [ { required: true, message: '请选择类型',trigger: 'change' }],
					patrol_account_id: [ { required: true, type: 'number',message: '请选择巡检人', trigger: 'change' }],
					patrol_node_arr: [ { required: true, type: 'array',min: 1,message: '请选择巡检节点', trigger: 'change' }],
                    patrol_time: [ { required: true, message: '请选择巡检时间', trigger: 'blur'  }]
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
			this.getNodeById()
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
			//节点列表
			async getNodeById () {
				let params={
					id:localStorage.project_id
				}
				let res = await getNodeById(params)
				if (res.errno === 0) {
					this.nodeData=res.data
					this.nodeData.forEach((i)=>{
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
						form.patrol_node_arr=JSON.stringify(form.patrol_node_arr)
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
						form.patrol_node_arr=JSON.stringify(form.patrol_node_arr)
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
			//签到记录
			async getHistoryList(patrol_id){
				let params={
					patrol_id:patrol_id
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
            //修改状态
            async updateWorked(params){
				let data={
					id:params,
					verity_status:1,
					verity_account_id:localStorage.account_id
				}
				let res = await editList(data)
				if (res.errno === 0) {
					this.$Message.success('审核成功')
					this.getList(this.searchOption)
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
				this.addForm.patrol_node_arr=[]
				data.forEach(i=>{
					this.addForm.patrol_node_arr.push(i.value)
				})
			},
			getEditChoice(data){
				this.editForm.patrol_node_arr=[]
				data.forEach(i=>{
					this.editForm.patrol_node_arr.push(i.value)
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
			cancelhistoryModel () {
				this.historyModel=false
				this.historyData =[];
			},
		}
	}
</script>

<style scoped>

</style>
