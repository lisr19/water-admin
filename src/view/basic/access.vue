<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">权限管理</p>
      <Row>
        <Col span="2">
          <Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <tree-table
          :is-fold="false"
          border
          expand-key="name"
          :expand-type="false"
          :selectable="false"
          :columns="columns"
          :data="tableData"
          getCheckedProp
        >
          <template slot="action" slot-scope="{row}">
            <Button type="primary" style="width: 80px;marginRight: 20px;" v-if="viewEdit" @click="openEditModal(row)">编辑</Button>
            <Button type="error" style="width: 80px;" v-if="viewDel" @click="doAccessDel(row)">删除</Button>
          </template>
        </tree-table>
      </div>
    </Card>

    <!--添加Modal-->
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="角色添加：" width="550">
      <Form :model="addForm" ref="addForm" :label-width="120" :rules="rules">
        <FormItem label="权限名称：" prop="name">
          <Input clearable v-model="addForm.name" placeholder="权限名称"/>
        </FormItem>
        <FormItem label="对应url：" prop="url">
          <Input clearable v-model="addForm.url" placeholder="对应url"/>
        </FormItem>
        <FormItem label="对应前端组件：" prop="front">
          <Input clearable v-model="addForm.front" placeholder="对应前端组件"/>
        </FormItem>
        <FormItem label="应用类型：" prop="type">
          <Select clearable v-model="addForm.type" placeholder="请选择应用类型" style="width: 100%">
            <Option value="0" key="0">无</Option>
            <Option value="1" key="1">管理端</Option>
          </Select>
        </FormItem>
        <FormItem label="父级权限：">
          <Cascader :data="accessCas" change-on-select v-model="addForm.accessCas" placeholder="权限的父级权限"></Cascader>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doFunctionAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="角色添加：" width="550">
      <Form :model="editForm" ref="editForm" :label-width="120" :rules="rules">
        <FormItem label="权限名称：" prop="name">
          <Input clearable v-model="editForm.name" placeholder="权限名称"/>
        </FormItem>
        <FormItem label="对应url：" prop="url">
          <Input clearable v-model="editForm.url" placeholder="对应url"/>
        </FormItem>
        <FormItem label="对应前端组件：" prop="front">
          <Input clearable v-model="editForm.front" placeholder="对应前端组件"/>
        </FormItem>
        <FormItem label="应用类型：" prop="type">
          <Select clearable v-model="editForm.type" placeholder="请选择应用类型" style="width: 100%">
            <Option v-for="item in type" :value="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="父级权限：">
          <Cascader :data="accessCas" change-on-select v-model="editForm.accessCas" placeholder="权限的父级权限"></Cascader>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doFunctionEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {findFunctionAll,doFunctionAdd,doFunctionDel,doFunctionDelMany,doFunctionEdit} from "../../api/access";
  import {accessColumns} from '../../libs/table'
  import {accessRules} from "../../libs/rules";
  import {hasOneOf, array4tree,tools4Del,ObjectContrast,tools4Cas} from '@/libs/tools'


  export default {
    name: "access",
    computed: {
      access() {
        return this.$store.state.user.access
      },
      viewAdd() {
        // return hasOneOf(['access-add'], this.access)
        return true
      },
      viewEdit() {
        // return hasOneOf(['access-edit'], this.access)
        return true
      },
      viewDel() {
        // return hasOneOf(['access-del'], this.access)
        return true
      },
      viewDelMany() {
        // return hasOneOf(['access-delMany'], this.access)
        return true
      },
    },
    data() {
      return {
        isAdd: false,
        isEdit: false,
        columns: [],
        tableData: [],
        addForm: {},
        editForm: {},
        rules: {},
        accessCas:[],
        type:[
          {value:0,name:'无指定'},
          {value:1,name:'管理端'},
        ],
        resArray:[],//原始数据
        searchOption: {}, // 查询用参数
        formCopy:{}
      }
    },
    created(){
      this.columns = accessColumns
      this.rules = accessRules
    },
    mounted(){
      this.findFunctionAll()
    },
    methods:{
      //查询
      async findFunctionAll(params){
        let res = await findFunctionAll(params)
        if (res.code === 200) {
          this.resArray = JSON.parse(JSON.stringify(res.data))
          this.tableData = array4tree(v=>{
            v.label = v.name
            v.value = v.id
          },res.data)
          this.accessCas = JSON.parse(JSON.stringify(this.tableData))
          this.accessCas.unshift({name: '无', id: '0', pid: '0', label: '无', value: '0'})
        } else {
          this.$Message.error(res.data)
        }
      },
      //添加
      async doFunctionAdd(){
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            if(form[`accessCas`]&&form.accessCas.length>0){
              form.pid = form.accessCas[form.accessCas.length-1]
            }else{
              form.pid = 0
            }
            if(!form.type)form.type=0
            let res = await doFunctionAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findFunctionAll(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑
      async doFunctionEdit(){
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.editForm
            if(form[`accessCas`]&&form.accessCas.length>0){
              form.pid = form.accessCas[form.accessCas.length-1]
            }else{
              form.pid = 0
            }
            let array = []
            array = ObjectContrast(form,this.formCopy)
            // console.log(array)
            if(array.length > 0){
              let data = {}
              array.forEach(v=>{
                data[v] = form[v]
              })
              data.id = form.id
              let res = await doFunctionEdit(data)
              if (res.code === 200) {
                this.$Message.success('编辑成功')
                this.findFunctionAll(this.searchOption)
                this.cancelEditModal()
              } else { // 添加失败
                this.$Message.error(res.data)
              }
            }else{
              this.$Message.error('表单没有修改')
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //权限删除
      doAccessDel(row){
        this.$Modal.confirm({
          title: '请确认删除',
          content: `<p>删除数据: ${row.name} (包括其所有子类)后无法恢复,确认删除?</p>`,
          okText: '确认',
          onOk: async() => {
            if (row[`children`]) { // 若是该数据有子类
              let ids = ''
              ids = row.id
              let idArray = []
              tools4Del(row.children, idArray)
              ids = ids + ',' + idArray.join(',')
              let res = await doFunctionDelMany({ids:ids})
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.findFunctionAll()
              } else {
                this.$Message.error(res.message)
              }
              // console.log(ids)
            } else { // 若没有则删除单个
              let id = { id: row.id }
              let res = await doFunctionDel(id)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.findFunctionAll()
              } else {
                this.$Message.error(res.message)
              }
            }
          },
          // 取消删除
          onCancel: () => {
            this.$Message.info('取消删除！')
          }
        })
      },
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal(params) {
        let cas = []
        tools4Cas(this.resArray,parseInt(params.id),cas)
        params.accessCas = cas
        this.formCopy = Object.assign({},params)
        this.editForm = params
        this.isEdit = true
      },
      cancelEditModal() {
        this.$refs.editForm.resetFields()// 重置表单
        this.editForm = {}
        this.isEdit = false
      },
    }
  }
</script>

<style scoped>

</style>
