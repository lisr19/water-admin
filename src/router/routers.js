import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
	{
		path: '/login',
		name: 'login',
		meta: {
			title: 'Login - 登录',
			hideInMenu: true
		},
		component: () => import('@/view/login/login.vue')
	},
	{
		path: '/',
		name: '_home',
		redirect: '/home',
		component: Main,
		meta: {
			hideInMenu: true,
			notCache: true
		},
		children: [
			{
				path: '/home',
				name: 'home',
				meta: {
					hideInMenu: true,
					title: '首页',
					notCache: true,
					icon: 'md-home'
				},
				component: () => import('@/view/single-page/home')
			}
		]
	},
	{
		path: '/equipment',
		name: '系统汇总',
		meta: {
			icon: 'md-cloud-upload',
			title: '系统汇总'
		},
		component: Main,
		children: [
			{
				path: '/404',
				name: '水质指标7天趋势',
				meta: {
					icon: 'ios-document',
					title: '水质指标7天趋势'
				},
				component: () => import('@/view/error-page/404.vue')
			},
			{
				path: '/404',
				name: '水质主要指标总体监控',
				meta: {
					icon: 'ios-document',
					title: '水质主要指标总体监控'
				},
				component: () => import('@/view/error-page/404.vue')
			},
			{
				path: '/404',
				name: '水质监测点数据汇总',
				meta: {
					icon: 'ios-document',
					title: '水质监测点数据汇总'
				},
				component: () => import('@/view/error-page/404.vue')
			},
			{
				path: '/404',
				name: '24小时设备状态异常表',
				meta: {
					icon: 'ios-document',
					title: '24小时设备状态异常表'
				},
				component: () => import('@/view/error-page/404.vue')
			},
		]
	},
	{
		path: '/equipment',
		name: '设备管理',
		meta: {
			icon: 'md-cloud-upload',
			title: '设备管理'
		},
		component: Main,
		children: [
			{
				path: '/equipment/list',
				name: '设备列表',
				meta: {
					icon: 'ios-document',
					title: '设备列表'
				},
				component: () => import('@/view/water-page/equipment/list.vue')
			},
			{
				path: '/equipment/type',
				name: '设备类型',
				meta: {
					icon: 'ios-document',
					title: '设备类型'
				},
				component: () => import('@/view/water-page/equipment/type.vue')
			},
		]
	},
	{
		path: '/project',
		name: '项目管理',
		meta: {
			icon: 'md-cloud-upload',
			title: '项目管理'
		},
		component: Main,
		children: [
			{
				path: '/project/list',
				name: '项目设置',
				meta: {
					icon: 'ios-document',
					title: '项目设置'
				},
				component: () => import('@/view/water-page/project/list.vue')
			},
			{
				path: '/project/node',
				name: '节点管理',
				meta: {
					icon: 'ios-document',
					title: '节点管理'
				},
				component: () => import('@/view/water-page/project/node.vue')
			},
		]
	},
	{
		path: '/run',
		name: '运营管理',
		meta: {
			icon: 'md-cloud-upload',
			title: '运营管理'
		},
		component: Main,
		children: [
			{
				path: '/404',
				name: '水质分析',
				meta: {
					icon: 'ios-document',
					title: '水质分析'
				},
				component: () => import('@/view/error-page/404.vue')
			},
			{
				path: '/404',
				name: '水资源在线',
				meta: {
					icon: 'ios-document',
					title: '水资源在线'
				},
				component: () => import('@/view/error-page/404.vue')
			},
			{
				path: '/404',
				name: '溯源分析',
				meta: {
					icon: 'ios-document',
					title: '溯源分析'
				},
				component: () => import('@/view/error-page/404.vue')
			},
			{
				path: '/run/waterWm',
				name: '水面监控',
				meta: {
					icon: 'ios-document',
					title: '水面监控'
				},
				component: () => import('@/view/water-page/run/waterWm.vue')
			},
			{
				path: '/run/report',
				name: '上报管理',
				meta: {
					icon: 'ios-document',
					title: '上报管理'
				},
				component: () => import('@/view/water-page/run/report.vue')
			},
			{
				path: '/run/patrol',
				name: '巡检管理',
				meta: {
					icon: 'ios-document',
					title: '巡检管理'
				},
				component: () => import('@/view/water-page/run/patrol.vue')
			},
			{
				path: '/run/msg',
				name: '信息发布',
				meta: {
					icon: 'ios-document',
					title: '信息发布'
				},
				component: () => import('@/view/water-page/run/msg.vue')
			},
			{
				path: '/run/deviceLogs',
				name: '设备运行日志',
				meta: {
					icon: 'ios-document',
					title: '设备运行日志'
				},
				component: () => import('@/view/water-page/run/deviceLogs.vue')
			}
		]
	},
	{
		path: '/warn',
		name: '预警告警',
		meta: {
			icon: 'md-cloud-upload',
			title: '预警告警'
		},
		component: Main,
		children: [
			{
				path: '/warn/resources',
				name: '水质预警',
				meta: {
					icon: 'ios-document',
					title: '水质预警'
				},
				component: () => import('@/view/water-page/warn/resources.vue')
			},
			{
				path: '/warn/environment',
				name: '水环境预警',
				meta: {
					icon: 'ios-document',
					title: '水环境预警'
				},
				component: () => import('@/view/water-page/warn/environment.vue')
			},
			{
				path: '/404',
				name: '时空分布',
				meta: {
					icon: 'ios-document',
					title: '时空分布'
				},
				component: () => import('@/view/error-page/404.vue')
			},
			{
				path: '/warn/typhoon',
				name: '台风预警',
				meta: {
					icon: 'ios-document',
					title: '台风预警'
				},
				component: () => import('@/view/water-page/warn/typhoon.vue')
			}
		]
	},
	{
		path: '/equipment',
		name: '模型库管理',
		meta: {
			icon: 'md-cloud-upload',
			title: '模型库管理'
		},
		component: Main,
		children: [
			{
				path: '/404',
				name: '漂浮物',
				meta: {
					icon: 'ios-document',
					title: '漂浮物'
				},
				component: () => import('@/view/error-page/404.vue')
			},
			{
				path: '/404',
				name: '污染预警分析',
				meta: {
					icon: 'ios-document',
					title: '污染预警分析'
				},
				component: () => import('@/view/error-page/404.vue')
			},
		]
	},
	{
		path: '/system',
		name: '系统管理',
		meta: {
			icon: 'md-cloud-upload',
			title: '系统管理'
		},
		component: Main,
		children: [
			{
				path: '/system/user',
				name: '用户管理',
				meta: {
					icon: 'ios-document',
					title: '用户管理'
				},
				component: () => import('@/view/water-page/system/user.vue')
			},
			{
				path: '/system/role',
				name: '角色管理',
				meta: {
					icon: 'ios-document',
					title: '角色管理'
				},
				component: () => import('@/view/water-page/system/role.vue')
			},
		]
	},
	{
		path: '/401',
		name: 'error_401',
		meta: {
			hideInMenu: true
		},
		component: () => import('@/view/error-page/401.vue')
	},
	{
		path: '/500',
		name: 'error_500',
		meta: {
			hideInMenu: true
		},
		component: () => import('@/view/error-page/500.vue')
	},
	{
		path: '*',
		name: 'error_404',
		meta: {
			hideInMenu: true
		},
		component: () => import('@/view/error-page/404.vue')
	}
]
