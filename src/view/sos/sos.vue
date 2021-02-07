<template>
	<div>
		<!--按钮部分-->
		<Card>
			求助列表
		</Card>

		<!--表格部分-->
		<Card>
			<div>
				<Table :columns="columns" :data="tableData" border
				></Table>
			</div>
			<div style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page show-total show-elevator :total="page.total" :current="page.currentPage"
					      @on-change="handlePageTurn"></Page>
				</div>
			</div>
		</Card>
		<!--紧急求助Modal-->
		<Modal v-model="isShow"  title="紧急求助：" width="1000">
			<div class="tip">
				<Icon type="md-alert" size="54" color="red"/>
				<span style="font-size: 40px">您有紧急求助尚未处理</span>
			</div>
			<div slot="footer">
				<Button type="error" @click="isShow = false">确定</Button>
			</div>
		</Modal>
		<!--跟进-->
		<Modal v-model="isEdit"  title="报警跟进：" width="500" height="300">
			<Input v-model="processResult" type="textarea"/>
			<!--自定义页脚-->
			<div slot="footer">
				<Button type="text" @click="cancelEditModal">取消</Button>
				<Button type="primary" @click="editModal">确认</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
import {
  getSosList, sosEdit
} from '../../api/sos'
import { sosColumns } from '../../libs/table'
import Config from '../../config/index'

export default {
  name: 'sos',
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
      processResult: null,
      handle: false,
      isShow: false,
      myHeader: { authorization: localStorage.getItem(Config.tokenName) },
      isAdd: false,
      isEdit: false,
      columns: [
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          width: '250',
          render: (h, params) => {
            if (this.viewEdit || this.viewDel) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    disabled: params.row.flag !== 0
                  },
                  style: {
                    marginRight: '5px',
                    display: this.viewEdit ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.sosEdit({ id: params.row.id, flag: 1 })
                      params.row.flag = 1
                      this.handle = true
                      // this.getSosList()
                    }
                  }
                }, '报警'),
                h('Button', {
                  props: {
                    type: 'primary',
                    disabled: params.row.flag !== 0
                  },
                  style: {
                    marginRight: '5px',
                    display: this.viewEdit ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.sosEdit({ id: params.row.id, flag: 2 })
                      params.row.flag = 2
                      this.handle = true
                      // this.getSosList()
                    }
                  }
                }, '无效'),
                h('Button', {
                  props: {
                    type: 'warning',
                    disabled: params.row.flag === 0
                  },
                  style: {
                    marginRight: '5px',
                    display: this.viewEdit ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.id = params.row.id
                      if (params.row.processResult && params.row.processResult !== 'null') {
                        this.processResult = params.row.processResult
                      } else {
                        this.processResult = null
                      }
                      this.isEdit = true
	                  this.handle = true
                    }
                  }
                }, '跟进')
                // h('Button', {
                //   props: {
                //     type: 'error'
                //   },
                //   style: {
                //     display: this.viewDel ? 'inline-block' : 'none'
                //   },
                //   on: {
                //     click: () => {
                //       this.$Modal.confirm({
                //         title: '请确认删除',
                //         content: `<p>删除数据后无法恢复,确认删除?</p>`,
                //         okText: '确认',
                //         onOk: () => {
                //           let id = {id: params.row.id}
                //           this.doApkVersionDel(id)
                //         },
                //         // 取消删除
                //         onCancel: () => {
                //           this.$Message.info('取消删除！')
                //         }
                //       })
                //     }
                //   }
                // }, '删除')
              ])
            } else {
              return h('span', '您没有操作该数据的权限')
            }
          }
        }
      ],
      tableData: [],
      accessData: [],
      // 批量选择的id对象
      delId: {
        ids: ''
      },
      page: {// 页面翻页对象
        total: 1, // 数据总数
        currentPage: 1// 当前页面
      },
      searchOption: {} // 查询用参数
    }
  },
  created () {
    this.columns = sosColumns.concat(this.columns)
    setInterval(() => { // 2分钟更新一次数据
      this.getSosList()
    }, 1000 * 60 * 2)
  },
  mounted () {
    this.handle = false
    this.getSosList()
  },
  activated () {
    this.handle = false
    this.getSosList()
  },
  methods: {
    // 查询列表
    async getSosList (params) {
	    console.log(this.handle)
	    let res = await getSosList(params)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.page = {
          total: res.data.total,
          currentPage: res.data.pageNum
        }
        this.tableData.forEach((item) => {
          if (item.flag === 0 && !this.handle) {
            this.isShow = true
          }
        })
      } else {
        this.$Message.error(res.data)
      }
    },
    async sosEdit (params) {
      let res = await sosEdit(params)
      if (res.code === 200) {

      }
    },
    cancelEditModal () {
      this.isEdit = false
    },
    editModal () {
      console.log(this.id)
      this.sosEdit({ id: this.id, processResult: this.processResult })
      this.isEdit = false
      this.$Message.success('变更成功')
      this.getSosList(this.searchOption)
    },
    // 页面翻页
    handlePageTurn (page) {
      this.searchOption.page = page
      this.getSosList(this.searchOption)
    }
  }
}
</script>

<style lang="less" scoped>
	.tip{
		display: flex;
		align-items: center;
		span{
			margin-left: 30px;
		}
	}
</style>
