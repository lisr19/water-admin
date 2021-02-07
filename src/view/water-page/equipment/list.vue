<template>
	<div>
		<!--按钮部分-->
		<Card>
			<p slot="title">设备列表</p>
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
					<FormItem label="名称：" prop="name">
						<Input clearable v-model="addForm.name" placeholder="请填写设备名称"/>
					</FormItem>
					<FormItem label="类型：" prop="device_type_id">
						<Select clearable v-model="addForm.device_type_id" placeholder="请选择类型">
							<Option v-for="(item,index) in typeList" :key="index" :value="item.value">{{item.name}}</Option>
						</Select>
					</FormItem>
					<template v-if="addForm.device_type_id===1">
						<FormItem label="SN：" prop="sn">
							<Input clearable v-model="addForm.sn"  placeholder="请输入SN"/>
						</FormItem>
						<FormItem label="登录账号：" prop="account">
							<Input clearable v-model="addForm.account"  placeholder="请输入登录账号"/>
						</FormItem>
						<FormItem label="登录密码：" prop="password">
							<Input type="password" clearable v-model="addForm.password"  placeholder="请输入登录密码"/>
						</FormItem>
						<FormItem label="设备通道：" prop="channel">
							<Input clearable v-model="addForm.channel"  placeholder="请输入设备通道"/>
						</FormItem>
						<FormItem label="环境图片：" prop="img">
							<div class="demo-upload-list" v-if="addForm.img">
								<img :src="addForm.img">
								<div class="demo-upload-list-cover">
									<Icon type="ios-eye-outline" ></Icon>
								</div>
							</div>
							<Upload
								:headers="headers"
								:show-upload-list="false"
								:on-success="handleSuccess"
								:on-error="handleError"
								:format="['jpg','jpeg','png']"
								:on-format-error="handleFormatError"
								multiple
								type="drag"
								action="https://water.longse.cn/home/file/upload"
								style="display: inline-block;width:58px;">
								<div style="width: 58px;height:58px;line-height: 58px;">
									<Icon type="ios-camera" size="20"></Icon>
								</div>
							</Upload>
						</FormItem>
					</template>
					<template v-if="addForm.device_type_id===2||addForm.device_type_id===4">
						<FormItem label="客户端ID：" prop="dtu_clientid">
							<Input clearable v-model="addForm.dtu_clientid"  placeholder="请输入客户端ID"/>
						</FormItem>
						<FormItem v-if="addForm.device_type_id===2" label="订阅主题：" prop="subscribe_topic">
							<Input clearable v-model="addForm.subscribe_topic"  placeholder="请输入订阅主题"/>
						</FormItem>
					</template>
					<template v-if="addForm.device_type_id===3">
						<FormItem label="温度临界值" prop="temperature">
							预警：<Input  clearable v-model="addForm.temperature" style="width:100px" />°C
							告警：<Input  clearable v-model="addForm.temperature1" style="width:100px" />°C
						</FormItem>
						<FormItem label="有机含碳量临界值" prop="TOC">
							预警：<Input clearable v-model="addForm.TOC" style="width:100px"  />mg/L
							告警：<Input clearable v-model="addForm.TOC1" style="width:100px"  />mg/L
						</FormItem>
						<FormItem label="化学需氧量临界值" prop="COD">
							预警：<Input clearable v-model="addForm.COD" style="width:100px"  />mg/L
							告警：<Input clearable v-model="addForm.COD1" style="width:100px"  />mg/L
						</FormItem>
					</template>
					<template v-if="addForm.device_type_id===5">
						<FormItem label="水位临界值" prop="level">
							预警：<Input  clearable v-model="addForm.level" style="width:100px" />m
							告警：<Input  clearable v-model="addForm.level1" style="width:100px" />m
						</FormItem>
					</template>
					<template v-if="addForm.device_type_id===6">
						<FormItem label="雨量临界值" prop="rainfall">
							预警：<Input  clearable v-model="addForm.rainfall" style="width:100px" />mm/min
							告警：<Input  clearable v-model="addForm.rainfall1" style="width:100px" />mm/min
						</FormItem>
					</template>
					<template v-if="addForm.device_type_id===7">
						<FormItem label="流量临界值" prop="speed">
							预警：<Input  clearable v-model="addForm.speed" style="width:100px" />m/s
							告警：<Input  clearable v-model="addForm.speed1" style="width:100px" />m/s
						</FormItem>
					</template>
					<template v-if="addForm.device_type_id===8">
						<FormItem label="溶解氧临界值" prop="dissolved_oxygen">
							预警：<Input  clearable v-model="addForm.dissolved_oxygen" style="width:100px" />mg/L
							告警：<Input  clearable v-model="addForm.dissolved_oxygen1" style="width:100px" />mg/L
						</FormItem>
						<FormItem label="浊度临界值" prop="turbidity">
							预警：<Input  clearable v-model="addForm.turbidity" style="width:100px" />NTU
							告警：<Input  clearable v-model="addForm.turbidity1" style="width:100px" />NTU
						</FormItem>
						<FormItem label="叶绿素临界值" prop="chlorophyll">
							预警：<Input  clearable v-model="addForm.chlorophyll" style="width:100px" />ug/L
							告警：<Input  clearable v-model="addForm.chlorophyll1" style="width:100px" />ug/L
						</FormItem>
						<FormItem label="悬浮物临界值" prop="suspended">
							预警：<Input  clearable v-model="addForm.suspended" style="width:100px" />mg/L
							告警：<Input  clearable v-model="addForm.suspended1" style="width:100px" />mg/L
						</FormItem>
					</template>
					<template v-if="addForm.device_type_id===9">
						<FormItem label="PH临界值" prop="PH">
							<p>
								<span style="margin-right:10px">酸度</span>
								预警：<Input  clearable v-model="addForm.PH" style="width:100px" />pH
								告警：<Input  clearable v-model="addForm.PH1" style="width:100px" />pH
							</p>
							<p style="margin-top:10px">
								<span style="margin-right:10px">碱度</span>
								预警：<Input  clearable v-model="addForm.PH2" style="width:100px" />pH
								告警：<Input  clearable v-model="addForm.PH3" style="width:100px" />pH
							</p>
						</FormItem>
						<FormItem label="电导率临界值" prop="EC">
							预警：<Input  clearable v-model="addForm.EC" style="width:100px" />mS/cm
							告警：<Input  clearable v-model="addForm.EC1" style="width:100px" />mS/cm
						</FormItem>
						<FormItem label="镉离子临界值" prop="cadmium_ion">
							预警：<Input  clearable v-model="addForm.cadmium_ion" style="width:100px" />ppm
							告警：<Input  clearable v-model="addForm.cadmium_ion1" style="width:100px" />ppm
						</FormItem>
						<FormItem label="氰离子临界值" prop="cryanide_ion">
							预警：<Input  clearable v-model="addForm.cryanide_ion" style="width:100px" />ppm
							告警：<Input  clearable v-model="addForm.cryanide_ion1" style="width:100px" />ppm
						</FormItem>
						<FormItem label="铅离子临界值" prop="lead_ion">
							预警：<Input  clearable v-model="addForm.lead_ion" style="width:100px" />ppm
							告警：<Input  clearable v-model="addForm.lead_ion1" style="width:100px" />ppm
						</FormItem>
					</template>
					<FormItem label="安装时间：" prop="install_time">
						<DatePicker type="datetime"  placeholder="请选择安装时间"   v-model="addForm.install_time"
						            @on-change="v=>{addForm.install_time=v}"
						            ></DatePicker>
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
					<FormItem label="名称：" prop="name">
						<Input clearable v-model="editForm.name" placeholder="请填写设备名称"/>
					</FormItem>
					<FormItem label="类型：" prop="device_type_id">
						<Select clearable v-model="editForm.device_type_id" placeholder="请选择类型" >
							<Option v-for="(item,index) in typeList" :key="index" :value="item.value">{{item.name}}</Option>
						</Select>
					</FormItem>
					<template v-if="editForm.device_type_id===1">
						<FormItem label="SN：" prop="sn">
							<Input clearable v-model="editForm.sn"  placeholder="请输入SN"/>
						</FormItem>
						<FormItem label="登录账号：" prop="account">
							<Input clearable v-model="editForm.account"  placeholder="请输入登录账号"/>
						</FormItem>
						<FormItem label="登录密码：" prop="password">
							<Input type="password" clearable v-model="editForm.password"  placeholder="请输入登录密码"/>
						</FormItem>
						<FormItem label="设备通道：" prop="channel">
							<Input clearable v-model="editForm.channel"  placeholder="请输入设备通道"/>
						</FormItem>
						<FormItem label="环境图片：" prop="img">
							<div class="demo-upload-list" v-if="editForm.img">
								<img :src="editForm.img">
								<div class="demo-upload-list-cover">
									<Icon type="ios-eye-outline" ></Icon>
								</div>
							</div>
							<Upload
								:headers="headers"
								:show-upload-list="false"
								:on-success="handleSuccess"
								:on-error="handleError"
								:format="['jpg','jpeg','png']"
								:on-format-error="handleFormatError"
								multiple
								type="drag"
								action="https://water.longse.cn/home/file/upload"
								style="display: inline-block;width:58px;">
								<div style="width: 58px;height:58px;line-height: 58px;">
									<Icon type="ios-camera" size="20"></Icon>
								</div>
							</Upload>
						</FormItem>
					</template>
					<template v-if="editForm.device_type_id===2||editForm.device_type_id===4">
						<FormItem label="客户端ID：" prop="dtu_clientid">
							<Input clearable v-model="editForm.dtu_clientid"  placeholder="请输入客户端ID"/>
						</FormItem>
						<FormItem v-if="editForm.device_type_id===2" label="订阅主题：" prop="subscribe_topic">
							<Input clearable v-model="editForm.subscribe_topic"  placeholder="请输入订阅主题"/>
						</FormItem>
					</template>
					<template v-if="editForm.device_type_id===3">
						<FormItem label="温度临界值" prop="temperature">
							预警：<Input  clearable v-model="editForm.temperature" style="width:100px" />°C
							告警：<Input  clearable v-model="editForm.temperature1" style="width:100px" />°C
						</FormItem>
						<FormItem label="有机含碳量临界值" prop="TOC">
							预警：<Input clearable v-model="editForm.TOC" style="width:100px"  />mg/L
							告警：<Input clearable v-model="editForm.TOC1" style="width:100px"  />mg/L
						</FormItem>
						<FormItem label="化学需氧量临界值" prop="COD">
							预警：<Input clearable v-model="editForm.COD" style="width:100px"  />mg/L
							告警：<Input clearable v-model="editForm.COD1" style="width:100px"  />mg/L
						</FormItem>
					</template>
					<template v-if="editForm.device_type_id===5">
						<FormItem label="水位临界值" prop="level">
							预警：<Input  clearable v-model="editForm.level" style="width:100px" />m
							告警：<Input  clearable v-model="editForm.level1" style="width:100px" />m
						</FormItem>
					</template>
					<template v-if="editForm.device_type_id===6">
						<FormItem label="雨量临界值" prop="rainfall">
							预警：<Input  clearable v-model="editForm.rainfall" style="width:100px" />mm/min
							告警：<Input  clearable v-model="editForm.rainfall1" style="width:100px" />mm/min
						</FormItem>
					</template>
					<template v-if="editForm.device_type_id===7">
						<FormItem label="流量临界值" prop="speed">
							预警：<Input  clearable v-model="editForm.speed" style="width:100px" />m/s
							告警：<Input  clearable v-model="editForm.speed1" style="width:100px" />m/s
						</FormItem>
					</template>
					<template v-if="editForm.device_type_id===8">
						<FormItem label="溶解氧临界值" prop="dissolved_oxygen">
							预警：<Input  clearable v-model="editForm.dissolved_oxygen" style="width:100px" />mg/L
							告警：<Input  clearable v-model="editForm.dissolved_oxygen1" style="width:100px" />mg/L
						</FormItem>
						<FormItem label="浊度临界值" prop="turbidity">
							预警：<Input  clearable v-model="editForm.turbidity" style="width:100px" />NTU
							告警：<Input  clearable v-model="editForm.turbidity1" style="width:100px" />NTU
						</FormItem>
						<FormItem label="叶绿素临界值" prop="chlorophyll">
							预警：<Input  clearable v-model="editForm.chlorophyll" style="width:100px" />ug/L
							告警：<Input  clearable v-model="editForm.chlorophyll1" style="width:100px" />ug/L
						</FormItem>
						<FormItem label="悬浮物临界值" prop="suspended">
							预警：<Input  clearable v-model="editForm.suspended" style="width:100px" />mg/L
							告警：<Input  clearable v-model="editForm.suspended1" style="width:100px" />mg/L
						</FormItem>
					</template>
					<template v-if="editForm.device_type_id===9">
						<FormItem label="PH临界值" prop="PH">
							<p>
								<span style="margin-right:10px">酸度</span>
								预警：<Input  clearable v-model="editForm.PH" style="width:100px" />pH
								告警：<Input  clearable v-model="editForm.PH1" style="width:100px" />pH
							</p>
							<p style="margin-top:10px">
								<span style="margin-right:10px">碱度</span>
								预警：<Input  clearable v-model="editForm.PH2" style="width:100px" />pH
								告警：<Input  clearable v-model="editForm.PH3" style="width:100px" />pH
							</p>
						</FormItem>
						<FormItem label="电导率临界值" prop="EC">
							预警：<Input  clearable v-model="editForm.EC" style="width:100px" />mS/cm
							告警：<Input  clearable v-model="editForm.EC1" style="width:100px" />mS/cm
						</FormItem>
						<FormItem label="镉离子临界值" prop="cadmium_ion">
							预警：<Input  clearable v-model="editForm.cadmium_ion" style="width:100px" />ppm
							告警：<Input  clearable v-model="editForm.cadmium_ion1" style="width:100px" />ppm
						</FormItem>
						<FormItem label="氰离子临界值" prop="cryanide_ion">
							预警：<Input  clearable v-model="editForm.cryanide_ion" style="width:100px" />ppm
							告警：<Input  clearable v-model="editForm.cryanide_ion1" style="width:100px" />ppm
						</FormItem>
						<FormItem label="铅离子临界值" prop="lead_ion">
							预警：<Input  clearable v-model="editForm.lead_ion" style="width:100px" />ppm
							告警：<Input  clearable v-model="editForm.lead_ion1" style="width:100px" />ppm
						</FormItem>
					</template>
					<FormItem label="安装时间：" prop="install_time" >
						<DatePicker ref="editDate" type="datetime"  placeholder="请选择安装时间"   v-model="editForm.install_time"
						            @on-change="v=>{editForm.install_time=v}"
						></DatePicker>
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
		<!--命令下发Modal-->
		<Modal v-model="isorder" :mask-closable="false" :closable="false" title="远程命令：" width="600" >
			<p style="margin:20px 0px 20px 0px">主题：{{topic}}</p>
			<Input clearable v-model="content"  placeholder="请输入内容" style="width:70%;margin-right:10px"/>
			<Button type="primary" @click="sendorder()">发送</Button>
			<div id="scrolldIV" style="border:1px solid #e1e1e1;border-radius:2px;padding:5px;margin-top:10px;height:150px;max-height:150px;overflow-y: scroll;">
				<p v-for="(item,index) in msg_data" :key="index">
					{{item}}
				</p>
			</div>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="primary" @click="closeorder()">关闭</Button>
			</div>
		</Modal>
		<!--视频查看Modal-->
		<Modal v-model="iscamera" :mask-closable="false" :footer-hide="true" title="查看视频监控：" width="755" >
			<iframe id="iframeId" :src="camera_url" frameborder="0" style="width:100%;height:650px"  scrolling="no">
			</iframe>
		</Modal>
	</div>
</template>
<script>
	import mqtt from 'mqtt'
	import {getList,addList,delList,getTypeList,editList,openDetail} from '@/api/equipment'
	import { hasOneOf, array4tree, ObjectContrast } from '@/libs/tools'
	export default {
		components: {
		},
		data () {
			return {
				headers:{},
				typeName:'',
				searchByPhone:'',
				searchByName:'',
				columns: [
					{
						title: '名称',
						align: 'center',
						key: 'name',
					},
					{
						title: '类型',
						align: 'center',
						key: 'device_type_name',
					},
					{
						title: '状态',
						align: 'center',
						render: (h, params) => {
							if(params.row.status==0){
								return h('span',{
									style: {
										color:'red',
									}
								},'离线');
							}else{
								return h('span',{
									style: {
										color:'#1890FF',
									}
								},'在线');
							}
						}
					},
					{
						title: '安装时间',
						align: 'center',
						key: 'install_time',
						// render: (h, params) => {
						// 	return h('span', [params.row.install_time ? params.row.install_time.slice(0, 10) : ''])
						// }
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
						width:250,
						render: (h, params) => {
							let edit_but=h('Button', {
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
											this.editForm.img=''
											this.openDetail({id:id})
											// let data = Object.assign({}, params.row)
											// this.formCopy = Object.assign({}, data)
											// this.openEditModal(data)

										}
									}
								}, '编辑');
							let delete_but=h('Button', {
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
													// let id = {id: params.row.id}
													// let device_type_id = {id: params.row.device_type_id}
													this.delList({id:params.row.id,device_type_id: params.row.device_type_id})
												},
												// 取消删除
												onCancel: () => {
													this.$Message.info('取消删除！')
												}
											})
										}
									}
								}, '删除');
							let order_but=h('Button', {
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
											if(params.row.status==1){
												if(params.row.device_type_id==2){
													this.topic=params.row.subscribe_topic;
												}else{
													this.topic='/sys/'+params.row.dtu_clientid+'/property/set'
												}
												this.mqtt_connect();
												this.isorder=true;
											}else{
												this.$Message.info('设备离线，无法使用远程命令');
											}
										}
									}
								}, '远程命令');
							let camera_but=h('Button', {
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
											if(params.row.status==1){
												let id = params.row.id
												this.getcamerainfo({id:id});
											}else{
												this.$Message.info('设备离线，无法查看监控');
											}
										}
									}
								}, '查看监控');
							let but=[];
							if(params.row.device_type_id==1){
								but.push(camera_but);
							};
							if(params.row.device_type_id==2||params.row.device_type_id==4){
								but.push(order_but);
							};
							but.push(edit_but,delete_but);
							return h('div',but)
						}
					}
				],
				tableData: [],
				isAdd: false,
				isEdit: false,
				isorder:false,
				iscamera:false,
				client:'',
				topic:'',
				content:'',
				msg_data:[],
				camera_url:'',
				addForm: {
					device_type_id:'',
					img:''
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
					sn: [ { required: true, message: 'SN不能为空' }],
					account: [ { required: true, message: '账号不能为空' }],
					password: [ { required: true, message: '密码不能为空' }],
					channel: [ { required: true, message: '设备通道不能为空' }],
					img: [ { required: true, message: '环境图片不能为空' }],
					dtu_clientid: [ { required: true, message: '客户端ID不能为空' }],
					subscribe_topic: [ { required: true, message: '订阅主题不能为空' }],

					temperature: [ { required: true, message: '温度临界值不能为空' }],
					TOC: [ { required: true, message: '有机含碳量临界值不能为空' }],
					COD: [ { required: true, message: '化学需氧量临界值不能为空' }],

					dissolved_oxygen: [ { required: true, message: '溶解氧临界值不能为空' }],
					turbidity: [ { required: true, message: '浊度临界值不能为空' }],
					chlorophyll: [ { required: true, message: '叶绿素临界值不能为空' }],
					suspended: [ { required: true, message: '悬浮物临界值不能为空' }],

					PH: [ { required: true, message: 'PH临界值不能为空' }],
					EC: [ { required: true, message: '电导率临界值不能为空' }],
					cadmium_ion: [ { required: true, message: '镉离子临界值不能为空' }],
					cryanide_ion: [ { required: true, message: '氰离子临界值不能为空' }],
					lead_ion: [ { required: true, message: '铅离子临界值不能为空' }],

					level: [ { required: true, message: '水位临界值不能为空' }],
					speed: [ { required: true, message: '流量临界值不能为空' }],
					rainfall: [ { required: true, message: '雨量临界值不能为空' }],
					
				},
				editRules: {
					name: [ { required: true, message: '设备名称不能为空', trigger: 'blur' }],
					device_type_id: [ { required: true, message: '设备类型不能为空' }],
					sn: [ { required: true, message: 'SN不能为空' }],
					account: [ { required: true, message: '账号不能为空' }],
					password: [ { required: true, message: '密码不能为空' }],
					channel: [ { required: true, message: '设备通道不能为空' }],
					img: [ { required: true, message: '环境图片不能为空' }],
					dtu_clientid: [ { required: true, message: '客户端ID不能为空' }],
					subscribe_topic: [ { required: true, message: '订阅主题不能为空' }],

					temperature: [ { required: true, message: '温度临界值不能为空' }],
					TOC: [ { required: true, message: '有机含碳量临界值不能为空' }],
					COD: [ { required: true, message: '化学需氧量临界值不能为空' }],

					dissolved_oxygen: [ { required: true, message: '溶解氧临界值不能为空' }],
					turbidity: [ { required: true, message: '浊度临界值不能为空' }],
					chlorophyll: [ { required: true, message: '叶绿素临界值不能为空' }],
					suspended: [ { required: true, message: '悬浮物临界值不能为空' }],

					PH: [ { required: true, message: 'PH临界值不能为空' }],
					EC: [ { required: true, message: '电导率临界值不能为空' }],
					cadmium_ion: [ { required: true, message: '镉离子临界值不能为空' }],
					cryanide_ion: [ { required: true, message: '氰离子临界值不能为空' }],
					lead_ion: [ { required: true, message: '铅离子临界值不能为空' }],

					level: [ { required: true, message: '水位临界值不能为空' }],
					speed: [ { required: true, message: '流量临界值不能为空' }],
					rainfall: [ { required: true, message: '雨量临界值不能为空' }],
				},
			}
		},
		created () {
			if(!localStorage.project_id){
				this.$Message.warning({content:'您还未选择项目',duration: 5});
				return;
			}
			this.getList({})
			this.getTypeList()
		},
		mounted(){
			this.headers.Authorization=localStorage.token;
		},
		methods: {
			changeType(e){
				if(e){
					this.typeName =e.label
				}else {
					this.typeName =''
				}

			},
			//摄像头监控
			async getcamerainfo(id){
				let res = await openDetail(id);
				let info = res.data.info;
				this.camera_url="wm_admin/demo/index.html?sn="+info.sn+"&account="+info.account+"&password="+info.password+"&channel="+info.channel;
				this.iscamera=true;
			},
			async openDetail(id){
				let res = await openDetail(id)
				if (res.errno === 0) {
					let info = res.data.info
					let data = Object.assign({}, res.data)
					if(res.data.device_type_id===1){
						data.sn = info.sn
						data.account = info.account
						data.password = info.password
						data.channel = info.channel
						data.device_type_id=1
						data.img=info.img
					}else if(res.data.device_type_id===3){
						data.temperature = info.temperature
						data.TOC = info.TOC
						data.COD = info.COD
						data.temperature1 = info.temperature1
						data.TOC1 = info.TOC1
						data.COD1 = info.COD1
						data.device_type_id=3
					}else if(res.data.device_type_id===5){
						data.level = info.level
						data.level1 = info.level1
						data.device_type_id=5
					}else if(res.data.device_type_id===6){
						data.rainfall = info.rainfall
						data.rainfall1 = info.rainfall1
						data.device_type_id=6
					}else if(res.data.device_type_id===7){
						data.speed = info.speed
						data.speed1 = info.speed1
						data.device_type_id=7
					}else if(res.data.device_type_id===8){
						data.dissolved_oxygen = info.dissolved_oxygen
						data.dissolved_oxygen1 = info.dissolved_oxygen1
						data.turbidity = info.turbidity
						data.turbidity1 = info.turbidity1
						data.chlorophyll = info.chlorophyll
						data.chlorophyll1 = info.chlorophyll1
						data.suspended = info.suspended
						data.suspended1 = info.suspended1
						data.device_type_id=8
					}else if(res.data.device_type_id===9){
						data.PH = info.PH
						data.PH1 = info.PH1
						data.PH2 = info.PH2
						data.PH3 = info.PH3
						data.EC = info.EC
						data.EC1 = info.EC1
						data.cadmium_ion = info.cadmium_ion
						data.cadmium_ion1 = info.cadmium_ion1
						data.cryanide_ion = info.cryanide_ion
						data.cryanide_ion1 = info.cryanide_ion1
						data.lead_ion = info.lead_ion
						data.lead_ion1 = info.lead_ion1
						data.device_type_id=9
					}

					this.formCopy = Object.assign({}, data)
					this.openEditModal(data)
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
			// 获取设备类型
			async getTypeList (params) {
				let res = await getTypeList(params)
				if (res.errno === 0) {
					this.typeList = res.data
					this.typeList.forEach((i)=>{
						i.value=i.id
					})
				} else {
					this.$Message.error(res.errmsg)
				}
			},
			// 添加
			async addList () {
				this.$refs.addForm.validate(async (valid) => { // 表单校验
					if (valid) { // 表单验证成功
						let form = Object.assign({}, this.addForm)
						form.project_id=localStorage.project_id
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
			//连接mqtt
			async mqtt_connect(){
				this.msg_data=[];
				this.client  = mqtt.connect('ws://52.81.152.99:1884',{username:'water_project',password:'wp8156491687'});
				let that=this;
				try {
					this.client.on('connect', () => {
						this.$Message.success('成功连接数据中心服务器');
						this.client.subscribe('order_return', function (err) {
							if (err){
								this.$Message.error('订阅服务器消息主题失败');
							}
						})
					});
				} catch (error) {
					this.$Message.error('连接数据中心服务器失败');
				};
				this.client.on('error', () => {
					this.$Message.error('连接数据中心服务器失败');
				});
				this.client.on('message', function (topic, message) {
					let info=new TextDecoder().decode(message);
					console.log(info);
					that.msg_data.push(info)
					that.$nextTick(function(){
						var div = document.getElementById('scrolldIV');
						div.scrollTop = div.scrollHeight;
					})
				})
			},
			//下发命令
			sendorder(){
				if(this.client){
					if(!this.topic||!this.content){
						this.$Message.error('主题和命令内容不能为空');
						return;
					}
					let data={
						topic:this.topic,
						content:this.content
					};
					this.client.publish('order_info', JSON.stringify(data));
					this.$Message.success('已发送');
				}
			},
			closeorder(){
				this.client.end();
				this.isorder=false;
			},
			// 编辑
			async editList () {
				this.$refs.editForm.validate(async (valid) => { // 表单校验
					if (valid) { // 表单验证成功
						let form = Object.assign({}, this.editForm)
						if (this.$refs.editDate.publicStringValue && this.$refs.editDate.publicStringValue != null) {
							form.install_time = this.$refs.editDate.publicStringValue
						}
						console.log(form);
						let res = await editList(form)
						console.log(res);
						if (res.errno ===0) {
							this.$Message.success('编辑成功')
							this.getList(this.searchOption)
							this.cancelEditModal()
						} else { // 添加失败
							this.$Message.error(res.errmsg)
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
			//图片上传
			handleSuccess (res, file) {
				this.addForm.img=res.url;
				this.editForm.img=res.url
			},
			handleError (error, file) {
                this.$Message.error('上传失败')
			},
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件' + file.name + '格式不正确，请上传jpg或png图片'
                });
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

<style scoped>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
