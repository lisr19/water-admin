<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">角色管理</p>
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
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="角色添加：" width="500">
      <Form :model="addForm" ref="addForm" :label-width="100" :rules="rules">
        <FormItem label="角色名称：" prop="name">
          <Input clearable v-model="addForm.name" placeholder="角色名称"/>
        </FormItem>
        <FormItem label="角色别名：" prop="roleAlias">
          <Input clearable v-model="addForm.roleAlias " placeholder="角色别名"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doRoleAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="角色编辑：" width="500">
      <Form :model="editForm" ref="editForm" :label-width="100" :rules="rules">
        <FormItem label="角色名称：" prop="name">
          <Input clearable v-model="editForm.name" placeholder="角色名称"/>
        </FormItem>
        <FormItem label="角色别名：" prop="roleAlias">
          <Input clearable v-model="editForm.roleAlias " placeholder="角色别名"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doRoleEdit">确认</Button>
      </div>
    </Modal>

    <!--权限Modal-->
    <Modal v-model="isAccess" @on-cancel="cancelAccessModal" title="角色权限变更：" width="700">
      <role-access ref="roleAccess"></role-access>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAccessModal">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { findRole, doRoleAdd, doRoleEdit, doRoleDel, doRoleDelMany } from '../../api/role'
import { findFunctionAll } from '../../api/access'
import { roleColumns } from '../../libs/table'
import { hasOneOf, array4tree, tools4Del, ObjectContrast } from '@/libs/tools'
import roleAccess from './role-access'

export default {
  name: 'role',
  components: {
    roleAccess
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    viewAdd () { // 该用户是否拥有用户添加权限
      // return hasOneOf(['role-add'], this.access)
      return true
    },
    viewEdit () { // 该用户是否拥有用户信息编辑权限
      // return hasOneOf(['role-edit'], this.access)
      return true
    },
    viewDel () { // 该用户是否拥有用户删除权限
      // return hasOneOf(['role-del'], this.access)
      return true
    },
    viewDelMany () { // 该用户是否拥有用户删除权限
      // return hasOneOf(['role-delMany'], this.access)
      return true
    },
    viewAccess () {
      // if (hasOneOf(['role-access-add'], this.access) && hasOneOf(['role-access-del'], this.access)) {
      //   return true
      // } else {
      //   return false
      // }
      return true
    }
  },
  data () {
    return {
      isAdd: false,
      isEdit: false,
      isAccess: false,
      columns: [
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          render: (h, params) => {
            if (this.viewAccess || this.viewEdit || this.viewDel) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  style: {
                    marginRight: '5px',
                    display: this.viewAccess ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      let data = Object.assign({}, params.row)
                      this.openAccessModal(data)
                    }
                  }
                }, '权限'),
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
                          this.doRoleDel(id)
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
      tableData: [{}],
      accessData: [],
      addForm: {},
      editForm: {},
      rules: {
        name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' },
          { max: 15, message: '请输入15个以内字符', trigger: 'blur' }
        ],
        roleAlias: [
          { required: true, message: '角色别名不能为空', trigger: 'blur' },
          { max: 15, message: '请输入15个以内字符', trigger: 'blur' }
        ]
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
    this.columns = roleColumns.concat(this.columns)
  },
  mounted () {
    this.findRole()
    this.findFunctionAll()
  },
  methods: {
    // 查询
    async findRole (params) {
      let res = await findRole(params)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.page = {
          total: res.data.total,
          currentPage: res.data.pageNum
        }
      } else {
        this.$Message.error(res.data)
      }
    },
    // 查询
    async findFunctionAll () {
      let res = await findFunctionAll()
      if (res.code === 200) {
        this.accessData = array4tree((v) => {
          v.value = v.id
          v.label = v.name
        }, res.data)
      } else {
        this.$Message.error(res.data)
      }
    },
    // 添加
    async doRoleAdd () {
      this.$refs.addForm.validate(async (valid) => { // 表单校验
        if (valid) { // 表单验证成功
          let form = this.addForm
          let res = await doRoleAdd(form)
          if (res.code === 200) { // 添加成功
            this.$Message.success('添加成功')
            this.findRole(this.searchOption)
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
    async doRoleEdit () {
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
            let res = await doRoleEdit(data)
            if (res.code === 200) {
              this.$Message.success('编辑成功')
              this.findRole(this.searchOption)
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
    async doRoleDel (params) {
      let res = await doRoleDel(params)
      if (res.code === 200) {
        this.$Message.success('删除成功')
        this.findRole(this.searchOption)
      } else {
	        this.$Message.error(res.message)
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
    openAccessModal (params) {
      let functions = params.functions
      let group = []
	      group = JSON.parse(JSON.stringify(this.accessData))
	      group.forEach(v => {
	      	if (v.children) {
		        v.children.forEach(k => {
			        k.checkAll = false
			        k.checkAllGroup = []
			        k.oldCheckAllGroup = []
			        functions.forEach(j => {
				        if (j.pid.toString() === k.id) {
					        k.checkAllGroup.push(j.name)
					        if (k.checkAllGroup.length === k.children.length) { // 若全选
						        k.checkAll = true
					        }
				        }
			        })
			        k.oldCheckAllGroup = k.checkAllGroup
		        })
	        }
      })
      this.$refs.roleAccess.roleId = params.id
      this.$refs.roleAccess.group = group
      this.isAccess = true
    },
    // 角色权限编辑modal关闭
    cancelAccessModal () {
      this.findRole()
      this.isAccess = false
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
            let res = await doRoleDelMany(this.delId)
            if (res.code === 200) {
              this.$Message.success('删除成功')
              this.delId.ids = ''
              this.findRole(this.searchOption)
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
      this.findRole(this.searchOption)
    }
  }
}
</script>

<style scoped>

</style>
