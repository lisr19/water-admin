<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">管理员管理</p>
      <Row>
        <Col span="2">
          <Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>
        </Col>

        <Col span="2">
          <Button type="error" class="my-btn" v-if="viewDelMany" @click="batchDel">批量删除</Button>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columns" :data="tableData" border @on-selection-change="batchSelect"
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <!--添加Modal-->
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="管理员添加：" width="600">
      <Form :model="addForm" ref="addForm" :rules="addRules" :label-width="90">
        <Card>
          <FormItem label="用户名：" prop="username">
            <Input clearable v-model="addForm.username" placeholder="请填写用户名姓名"/>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input clearable v-model="addForm.name" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="电话：" prop="phone">
            <Input clearable v-model="addForm.phone" placeholder="请填写电话"/>
          </FormItem>
          <FormItem label="邮箱：" prop="email">
            <Input clearable v-model="addForm.email" placeholder="请填写邮箱"/>
          </FormItem>
          <FormItem label="密码：" prop="password">
            <Input clearable v-model="addForm.password" type="password" placeholder="请输入密码"/>
          </FormItem>
          <FormItem label="确认密码：" prop="rePassword">
            <Input clearable v-model="addForm.rePassword" type="password" placeholder="请确认密码"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doManagerAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="管理员编辑：" width="600">
      <Form :model="editForm" ref="editForm" :rules="editRules" :label-width="90">
        <Card>
          <FormItem label="用户名：" prop="username">
            <Input clearable v-model="editForm.username" placeholder="请填写用户名姓名"/>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input clearable v-model="editForm.name" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="电话：" prop="phone">
            <Input clearable v-model="editForm.phone" placeholder="请填写电话"/>
          </FormItem>
          <FormItem label="邮箱：" prop="email">
            <Input clearable v-model="editForm.email" placeholder="请填写邮箱"/>
          </FormItem>
          <FormItem label="密码：" prop="password">
            <Input clearable v-model="editForm.password" type="password" placeholder="若不修改则可不填"/>
          </FormItem>
          <FormItem label="确认密码：" prop="rePassword">
            <Input clearable v-model="editForm.rePassword" type="password" placeholder="请确认密码"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doManagerEdit">确认</Button>
      </div>
    </Modal>

    <!--角色添加-->
    <Modal v-model="isRole" :mask-closable="false" :closable="false" title="角色编辑："  width="600">
      <Card>
        <p slot="title">角色：</p>
        <Row>
          <Col span="12">
            <Select clearable v-model="roleForm.roleId">
              <Option v-for="item in roleData" :value="item.id">{{item.name}}</Option>
            </Select>
          </Col>
          <Col span="4" offset="1">
            <Button type="primary" @click="doManagerRoleRelAdd">添加</Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <p slot="title">已有角色</p>
        <Tag type="border" closable color="default" v-for="(item,index) in roleArray" :key="item.id"
        :name="item.name" @on-close="doManagerRoleRelDel(item.id,index)">{{item.name}}
        </Tag>
      </Card>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelRoleModal">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { findManager, doManagerAdd, doManagerEdit, doManagerDel, doManagerDelMany, doManagerRoleRelAdd, doManagerRoleRelDel } from '../../api/manager'
import { findRoleAll } from '../../api/role'

import { adminColumns } from '../../libs/table'
import { adminRules } from '../../libs/rules'
import { hasOneOf, array4tree, ObjectContrast } from '@/libs/tools'

export default {
  name: 'admin',
  computed: {
    access () {
      return this.$store.state.user.access
    },
    viewAdd () { // 该用户是否拥有用户添加权限
      // return hasOneOf(['admin-add'], this.access)
      return true
    },
    viewEdit () { // 该用户是否拥有用户信息编辑权限
      // return hasOneOf(['admin-edit'], this.access)
      return true
    },
    viewDel () { // 该用户是否拥有用户删除权限
      // return hasOneOf(['admin-del'], this.access)
      return true
    },
    viewDelMany () { // 该用户是否拥有用户删除权限
      // return hasOneOf(['admin-delMany'], this.access)
      return true
    },
    viewRole () { // 该用户是否拥有用户角色变更权限
      // if (hasOneOf(['admin-role-add'], this.access) && hasOneOf(['admin-role-del'], this.access)) {
      //   return true
      // } else {
      //   return false
      // }
      return true
    }
  },
  data () {
    // 校验
    const validatePassCheck = (rule, value, callback) => {
      if (value) {
        if ((this.addForm.password !== '' && this.addForm.password != null) || (this.editForm.password !== '' && this.editForm.password != null)) {
          if (value !== this.addForm.password) {
            if (value !== this.editForm.password) {
              callback(new Error('两次密码输入不一致'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      isAdd: false,
      isEdit: false,
      isRole: false,
      columns: [
        {
          title: '使用状态',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.isEnable === 1
                },
                style: {
                  marginRight: '10px',
                  display: this.viewEdit ? 'inline-block' : 'none'
                },
                on: {
                  'on-change': async (v) => {
                    let data = {}
                    data.id = params.row.id
                    if (v) {
                      data.isEnable = 1
                    } else {
                      data.isEnable = 0
                    }
                    let res = await doManagerEdit(data)
                    if (res.code === 200) {
                      this.$Message.success('变更成功')
                      this.findManager(this.searchOption)
                    } else { // 添加失败
                      this.$Message.error(res.data)
                    }
                  }
                }
              }),
              h('span', [
                params.row.isEnable === 0 ? '禁用' : '正常'
              ])
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 300,
          key: 'handle',
          render: (h, params) => {
            if (this.viewRole || this.viewEdit || this.viewDel) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  style: {
                    marginRight: '5px',
                    display: this.viewRole ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      let data = Object.assign({}, params.row)
                      this.openRoleModal(data)
                    }
                  }
                }, '角色'),
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    marginRight: '5px',
                    display: this.viewEdit ? 'inline-block' : 'none'
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
                    type: 'error'
                  },
                  style: {
                    display: this.viewDel ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '请确认删除',
                        content: `<p>删除数据: ${params.row.name} 后无法恢复,确认删除?</p>`,
                        okText: '确认',
                        onOk: () => {
                          let id = { id: params.row.id }
                          this.doManagerDel(id)
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
            } else {
              return h('span', '您没有操作该数据的权限')
            }
          }
        }
      ],
      tableData: [],
      roleData: [],
      roleArray: [],
      addForm: {},
      editForm: {},
      roleForm: {},
      addRules: {
        rePassword: [{ required: true, validator: validatePassCheck, trigger: 'blur' }, { required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      editRules: {
        rePassword: [{ validator: validatePassCheck, trigger: 'blur' }]
      },
      // 批量选择的id对象
      delId: {
        ids: ''
      },
      page: {// 页面翻页对象
        total: 1, // 数据总数
        currentPage: 1// 当前页面
      },
      formCopy: {},
      searchOption: {} // 查询用参数
    }
  },
  created () {
    this.columns = adminColumns.concat(this.columns)
    this.addRules = Object.assign(this.addRules, adminRules)
    this.addRules.password = [
    	{ required: true, message: '密码不能为空', trigger: 'blur' },
      {
      	required: true,
        pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
        message: '密码格式不正确,密码由6-20位大小写字母、数字、符号：?、!、@组成',
        trigger: 'blur'
      },
    ]
    this.editRules = Object.assign(this.editRules, adminRules)
  },
  mounted () {
    this.findManager()
    this.findRoleAll()
  },
  methods: {
    // 查询
    async findManager (params) {
      let res = await findManager(params)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.page = {
          total: res.data.total,
          currentPage: res.data.pageNum
        }
      } else {
        this.$Message.error(res.message)
      }
    },
    // 查询
    async findRoleAll () {
      let res = await findRoleAll()
      if (res.code === 200) {
        this.roleData = res.data
      } else {
        this.$Message.error(res.message)
      }
    },
    // 添加
    async doManagerAdd () {
      this.$refs.addForm.validate(async (valid) => { // 表单校验
        if (valid) { // 表单验证成功
          let form = this.addForm
          let res = await doManagerAdd(form)
          if (res.code === 200) { // 添加成功
            this.$Message.success('添加成功')
            this.findManager(this.searchOption)
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
    async doManagerEdit () {
      this.$refs.editForm.validate(async (valid) => { // 表单校验
        if (valid) { // 表单验证成功
          let form = this.editForm
          let array = []
          array = ObjectContrast(form, this.formCopy)
          // console.log(array)
          if (array.length > 0) {
            let data = {}
            array.forEach(v => {
              data[v] = form[v]
            })
            data.id = form.id
            let res = await doManagerEdit(data)
            if (res.code === 200) {
              this.$Message.success('编辑成功')
              this.findManager(this.searchOption)
              this.cancelEditModal()
            } else { // 添加失败
              this.$Message.error(res.data)
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
    async doManagerDel (params) {
      let res = await doManagerDel(params)
      if (res.code === 200) {
        this.$Message.success('删除成功')
        this.findManager(this.searchOption)
      } else {
        this.$Message.error(res.message)
      }
    },
    // 添加角色
    async doManagerRoleRelAdd () {
      if (this.roleForm[`roleId`] && this.roleForm != null) {
        let res = await doManagerRoleRelAdd(this.roleForm)
        if (res.code === 200) {
          this.$Message.success('添加成功')
          this.roleData.forEach(v => {
            if (v.id === this.roleForm.roleId) this.roleArray.push(v)
          })
        } else {
          this.$Message.error(res.message)
        }
      }
    },
    // 删除角色
    async doManagerRoleRelDel (roleId, index) {
      let data = {
        roleId: roleId,
        managerId: this.roleForm.managerId
      }
      let res = await doManagerRoleRelDel(data)
      if (res.code === 200) {
        this.$Message.success('删除成功')
        this.roleArray.splice(index, 1)
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
            let res = await doManagerDelMany(this.delId)
            if (res.code === 200) {
              this.$Message.success('删除成功')
              this.delId.ids = ''
              this.findManager(this.searchOption)
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
    cancelAddModal () {
      this.$refs.addForm.resetFields()// 重置表单
      this.addForm = {}
      this.isAdd = false
    },
    // 编辑modal打开
    openEditModal (params) {
      this.editForm = params
      this.isEdit = true
    },
    cancelEditModal () {
      this.$refs.editForm.resetFields()// 重置表单
      this.editForm = {}
      this.isEdit = false
    },
    openRoleModal (params) {
      this.roleForm.managerId = params.id
      this.roleArray = params.roles
      this.isRole = true
    },
    cancelRoleModal () {
      this.isRole = false
      this.roleArray = []
      this.roleForm = {}
      this.findManager(this.searchOption)
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
      this.findManager(this.searchOption)
    }
  }
}
</script>

<style scoped>

</style>
