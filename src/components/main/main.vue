<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
	        <p  class="title">水资源实时监控与管理系统</p>
	        <p class="etitle">Real time monitoring and management system of water resources</p>
          <!--<img v-show="!collapsed" :src="maxLogo" key="max-logo" />-->
          <!--<img v-show="collapsed" :src="minLogo" key="min-logo" />-->
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :message-unread-count="unreadCount" :user-avatar="userAvatar"/>
          
          <!--<language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>-->
          <!--<error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store>-->
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <p style="width:100%;background-color:#fff;padding:0px 0px 10px 30px;" v-if="showProject">项目：
        <Select placeholder="请选择项目" v-model="project_id" style="width:300px" @on-change="setProject">
          <Option v-for="(item,index) in projectList" :key="index" :value="item.value">{{item.name}}</Option>
        </Select>
      </p>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <!--<div class="tag-nav-wrapper">-->
            <!--<tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>-->
          <!--</div>-->
          <Content class="content-wrapper">
            <keep-alive :include="cacheList" v-if="alive">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import {getProjectList} from '@/api/project'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.png'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      showProject:false,
      projectList:[],
      alive:true,
      project_id:'',
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    }
  },
  created () {
    if(localStorage.role_id==1){
      this.showProject=true;
    }
    this.getProjectList();
    if(localStorage.project_id){
      this.project_id=parseInt(localStorage.project_id)
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      'getUnreadMessageCount'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    //项目列表
    async getProjectList (params) {
      let res = await getProjectList(params)
      if (res.errno === 0) {
        this.projectList = res.data
        this.projectList.forEach((i)=>{
          i.value=i.id
        })
      } else {
        this.$Message.error(res.data)
      }
    },
    //设置项目
    setProject(e){
      localStorage.setItem('project_id',e);
      this.alive=false;
      this.$nextTick(function(){
        this.alive=true
      })
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  }
}
</script>
<style scoped lang="less">
	.logo-con{
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		.title{
			font-family: PingFangSC-Light, PingFang SC;
			font-size: 19px;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 26px;
			text-shadow: 0px 2px 4px rgba(6, 11, 57, 0.5);
		}
		.etitle{
			font-weight: 300;
			color: #FFFFFF;
			line-height: 8px;
			font-size: 6px;
			-webkit-transform:scale(0.6);
			width: 150%;
			text-shadow: 0px 2px 4px rgba(6, 11, 57, 0.5);
		}
	}
</style>
