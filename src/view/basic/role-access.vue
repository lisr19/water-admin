<template>
  <!--角色权限变更Modal-->
  <div>
    <Card>
      <p slot="title">角色权限：</p>
      <Collapse value="系统管理">
        <Panel v-for="(item,index) in group" :key="index" :name="item.name">
          <span>{{item.label}}</span>
          <p slot="content">
            <Card v-for="(item2,index2) in item.children" :key="index2">
              <Checkbox v-model="group[index].children[index2].checkAll"
                        @on-change="handleCheckAll(index,index2)">{{item2.label+'（全选）'}}
              </Checkbox>
              <CheckboxGroup v-model="group[index].children[index2].checkAllGroup"
                             @on-change="v=>checkAllGroupChange(v,index,index2)">
                <Checkbox v-for="(item3,index3) in item2.children" :label="item3.label" :key="index3"></Checkbox>
              </CheckboxGroup>
            </Card>
          </p>
        </Panel>
      </Collapse>
    </Card>
  </div>
</template>

<script>
  import {array4tree} from '@/libs/tools'
  import {
    doRoleAccessRelAddMany,
    doRoleAccessRelDelMany
  } from '../../api/role'

  export default {
    name: 'role-access',
    data() {
      return {
        group: [], // 角色权限变更表单对象
        roleId: ''// 角色ID
      }
    },
    methods: {
      // 角色权限添加
      async doRoleFunctionAddMany(params) {
        let addDTOList = []
        let functionId = params.split(',')
        functionId.forEach(v=>{
          addDTOList.push({
            roleId: this.roleId,
            functionId: v
          })
        })
        let res = await doRoleAccessRelAddMany(addDTOList)
        if (res.code === 200) {
          this.$Message.success('添加成功')
        } else {
          this.$Message.error(res.message)
        }
      },
      // 角色权限删除
      async doRoleFunctionDelMany(params) {
        let data = {
          roleId: this.roleId,
          functionIds: params
        }
        let res = await doRoleAccessRelDelMany(data)
        if (res.code === 200) {
          this.$Message.success('删除成功')
        } else {
          this.$Message.error(res.message)
        }
      },

      // 多选选项全选
      handleCheckAll(index, index2) {
        let group = this.group
        if (group[index].children[index2].checkAll) { // 若为全选
          group[index].children[index2].checkAllGroup = []
          let array = []
          let params = ''
          if (group[index].children[index2].oldCheckAllGroup.length === 0) {//若数组更新前长度为0则添加父id
            params = this.group[index].children[index2].id
          }
          if (group[index].children[index2]['children']) {//判断该功能下是否有子类
            group[index].children[index2].children.forEach(v => {
              array.push(v.label)
              if (group[index].children[index2].oldCheckAllGroup.indexOf(v.label) === -1) { // 找出需要添加的id
                if (params) {
                  params = params + ',' + v.id.toString()
                } else {
                  params = v.id.toString()
                }
              }
            })
          }
          this.doRoleFunctionAddMany(params)
          group[index].children[index2].checkAllGroup = array
          group[index].children[index2].oldCheckAllGroup = array
          this.$set(group[index].children, index2, group[index].children[index2])
        } else { // 若为全不选
          let params = this.group[index].children[index2].id
          group[index].children[index2].children.forEach(v => {
            if (group[index].children[index2].oldCheckAllGroup.indexOf(v.label) !== -1) { // 找出需要添加的id
              params = params + ',' + v.id.toString()
            }
          })
          this.doRoleFunctionDelMany(params)
          group[index].children[index2].checkAllGroup = []
          group[index].children[index2].oldCheckAllGroup = []
          this.$set(group[index].children, index2, group[index].children[index2])
        }
      },

      // 多选选项状态(单选)
      checkAllGroupChange(v, index, index2) {
        this.$set(this.group[index].children, index2, this.group[index].children[index2])
        if (v.length === this.group[index].children[index2].children.length) {
          this.group[index].children[index2].checkAll = true
        } else {
          this.group[index].children[index2].checkAll = false
        }
        //因为每次点击只对一个选项进行操作，所以只考虑一次操作的情况实现逻辑
        if (v.length > this.group[index].children[index2].oldCheckAllGroup.length) { // 若为添加
          for (let i = 0; i < v.length; i++) {
            if (this.group[index].children[index2].oldCheckAllGroup.indexOf(v[i]) === -1) {
              let params = ''
              this.group[index].children[index2].children.forEach(k => {
                if (k.label === v[i]) {
                  if (this.group[index].children[index2].oldCheckAllGroup.length === 0) { // 若数组更新前长度为0则添加父id
                    params = this.group[index].children[index2].id
                  }
                  if (params) {
                    params = params + ',' + k.id.toString()
                  } else {
                    params = k.id.toString()
                  }
                  this.doRoleFunctionAddMany(params)
                }
              })
            }
          }
        } else { // 若为删除
          for (let i = 0; i < this.group[index].children[index2].oldCheckAllGroup.length; i++) {
            if (v.indexOf(this.group[index].children[index2].oldCheckAllGroup[i]) === -1) {
              let params = ''
              this.group[index].children[index2].children.forEach(k => {
                if (k.label === this.group[index].children[index2].oldCheckAllGroup[i]) {
                  if (v.length === 0) { // 若为全不选
                    params = this.group[index].children[index2].id
                  }
                  if (params) {
                    params = params + ',' + k.id.toString()
                  } else {
                    params = k.id.toString()
                  }
                  this.doRoleFunctionDelMany(params)
                }
              })
            }
          }
        }
        this.group[index].children[index2].oldCheckAllGroup = v
      },
    }
  }
</script>

<style scoped>

</style>
