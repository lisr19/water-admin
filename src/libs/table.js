// 页面列表头

// 管理员列表
export const adminColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '账号',
    align: 'center',
    key: 'username'
  },
  {
    title: '姓名',
    align: 'center',
    key: 'name'
  },
  {
    title: '电话',
    align: 'center',
    key: 'phone'
  },
  {
    title: '邮箱',
    align: 'center',
    key: 'email'
  },
  {
    title: '角色',
    align: 'center',
    render: (h, params) => {
      let str = ''
      if (params.row[`roles`] && params.row.roles.length > 0) {
        params.row.roles.forEach(v => {
          str !== '' ? str = str + v.name + ' ' : str = v.name + ' '
        })
      } else {
        str = '暂无'
      }
      return h('span', [str])
    }
  }
]

// 角色
export const roleColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '角色名称',
    key: 'name'
  },
  {
    title: '角色别称',
    key: 'roleAlias'
  }
]

// 权限
export const accessColumns = [
  {
    title: '权限名称',
    key: 'name'
  },
  {
    title: '对应url',
    key: 'url'
  },
  {
    title: '对应前端组件',
    key: 'front'
  },
  {
    title: '应用类型',
    key: 'type',
    render: (h, params) => {
      return h('span', [
        params.row.type === 0 ? '无' : '管理端'
      ])
    }
  },
  {
    title: '层级',
    key: 'level'
  },
  {
    title: '操作',
    key: 'action',
    type: 'template',
    template: 'action'
  }
]

// 客户基本信息
export const customerInfoColumns = [
  // {
  //   type: 'selection',
  //   width: 60,
  //   align: 'center'
  // },
  {
    title: '客户头像',
    align: 'center',
    key: 'avatar',
    render: (h, params) => {
      return h('img', {
        style: {
          margin: '5px',
          display: 'inline-block',
          height: '40px',
          width: '40px',
          borderRadius: '5px'
        },
        attrs: {
          src: params.row['avatar']
            ? params.row['avatar'] + '?imageView2/1/w/45/h/45'
            : (params.row.gender === 2 ? require('@/assets/images/women.png') : require('@/assets/images/man.png'))
        }
      })
    }
  },
  {
    title: '账号/手机',
    align: 'center',
    key: 'username'
  },
  {
    title: '姓名',
    align: 'center',
    key: 'name'
  },
  {
    title: '年龄',
    width: 80,
    align: 'center',
    render: (h, params) => {
      let year = new Date().getFullYear()
      let age = 0
      if (params.row.birthYear < year) age = year - params.row.birthYear
      return h('span', [age])
    }
  },
  {
    title: '性别',
    width: 80,
    align: 'center',
    key: 'gender',
    render: (h, params) => {
      return h('span', [
        params.row.gender === 0 ? '无' : (params.row.gender === 1 ? '男' : '女')
      ])
    }
  },
  {
    title: '评分',
    align: 'center',
    width: 80,
    key: 'grade'
  },
  {
    title: '心脑血管疾病高危',
    width: 140,
    align: 'center',
    key: 'highRisk',
    render: (h, params) => {
      return h('span', [
        params.row.highRisk === 0 ? '否' : '是'
      ])
    }
  }
]

// 护士信息
export const nurseInfoColumns = [
  // {
  //   type: 'selection',
  //   width: 60,
  //   align: 'center'
  // },
  {
    title: '护士头像',
    align: 'center',
    width: '130',
    key: 'avatar',
    render: (h, params) => {
      return h('img', {
        style: {
          margin: '5px',
          display: 'inline-block',
          height: '40px',
          width: '40px',
          borderRadius: '5px'
        },
        attrs: {
          src: params.row['avatar']
            ? params.row['avatar'] + '?imageView2/1/w/45/h/45'
	          : (params.row.gender === 2 ? require('@/assets/images/nurse1.png') : require('@/assets/images/nurse2.png'))
        }
      })
    }
  },
  {
    title: '账号/电话',
    align: 'center',
    width: '180',
    key: 'username'
  },
  {
    title: '姓名',
    align: 'center',
    width: '120',
    key: 'name'
  },
  {
    title: '性别',
    align: 'center',
    width: '90',
    key: 'gender',
    render: (h, params) => {
      return h('span', [
        params.row.gender === 0 ? '无' : (params.row.gender === 1 ? '男' : '女')
      ])
    }
  },
  {
    title: '专长',
    align: 'center',
    width: '90',
    key: 'speciality',
    render: (h, params) => {
      if (params.row.speciality) {
        let texts = ''// 表格列显示文字
        if (params.row.speciality) {
          if (params.row.speciality.length > 15) { // 进行截取列显示字数
            texts = params.row.speciality.substring(0, 15) + '...'
          } else {
            texts = params.row.speciality
          }
        }
        return h('p', [
          h('Poptip', {
            props: {
              trigger: 'hover',
              placement: 'top'
            }
          }, [// 这个中括号表示是Tooltip标签的子标签
            texts, // 表格列显示文字
            h('p', {
              slot: 'content',
              style: {
                maxWidth: '300px',
                fontSize: '14px',
                whiteSpace: 'normal'
              }
            }, params.row.speciality)// 整个的信息即气泡内文字
          ])
        ])
      } else {
        return h('span', [
          params.row.speciality === '' ? '无' : params.row.speciality
        ])
      }
    }
  },
  {
    title: '工作医院',
    align: 'center',
    width: '140',
    key: 'hospital'
  },
  {
    title: '工作部门',
    align: 'center',
    width: '100',
    key: 'department'
  },
  {
    title: '工作年限(年)',
    align: 'center',
    width: '120',
    key: 'workYears'
  },
  {
    title: '服务区域',
    align: 'center',
    width: '120',
    key: 'serviceArea',
    render: (h, params) => {
      if (params.row.serviceArea) {
        let texts = ''// 表格列显示文字
        if (params.row.serviceArea) {
          if (params.row.serviceArea.length > 15) { // 进行截取列显示字数
            texts = params.row.serviceArea.substring(0, 15) + '...'
          } else {
            texts = params.row.serviceArea
          }
        }
        return h('p', [
          h('Poptip', {
            props: {
              trigger: 'hover',
              placement: 'top'
            }
          }, [// 这个中括号表示是Tooltip标签的子标签
            texts, // 表格列显示文字
            h('p', {
              slot: 'content',
              style: {
                maxWidth: '300px',
                fontSize: '14px',
                whiteSpace: 'normal'
              }
            }, params.row.serviceArea)// 整个的信息即气泡内文字
          ])
        ])
      } else {
        return h('span', [
          params.row.serviceArea === '' ? '无' : params.row.serviceArea
        ])
      }
    }

  }
]
// 待审护士信息
export const nursePendingColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '护士头像',
    align: 'center',
    key: 'avatar',
    render: (h, params) => {
      return h('img', {
        style: {
          margin: '5px',
          display: 'inline-block',
          height: '40px',
          width: '40px',
          borderRadius: '5px'
        },
        attrs: {
          src: params.row['avatar']
            ? params.row['avatar'] + '?imageView2/1/w/45/h/45'
            : 'http://sdcmi.halohealth.cn/images/1552373693998.jpg'
        }
      })
    }
  },
  {
    title: '姓名',
    align: 'center',
    key: 'name'
  },
  {
    title: '电话',
    align: 'center',
    key: 'phone'
  },
  {
    title: '性别',
    align: 'center',
    key: 'gender',
    render: (h, params) => {
      return h('span', [
        params.row.gender === 0 ? '无' : (params.row.gender === 1 ? '男' : '女')
      ])
    }
  },
  {
    title: '资质状态',
    align: 'center',
    key: 'status',
    render: (h, params) => {
      return h('span', [
        params.row.status === 0 ? '' : '未审核'
      ])
    }
  }
]

// 订单信息
export const ordersInfoColumns = [
  {
    title: '订单号',
    align: 'center',
    key: 'id',
    width: 150,
    fixed: 'left'
  },
  {
    title: '客户姓名',
    align: 'center',
    key: 'contact'
  },
  {
    title: '客户手机',
    align: 'center',
    key: 'contactPhone'
  },
  {
    title: '护理服务',
    align: 'center',
    key: 'nursingServiceName'
  },
  {
    title: '服务地址',
    align: 'center',
    key: 'serviceAddress'
  },
  {
    title: '金额（￥）',
    align: 'center',
    key: 'amount'
  },
  {
    title: '预约时间',
    align: 'center',
    key: 'serviceTime'
  },
  {
    title: '接单护士',
    align: 'center',
    key: 'nurses',
    render: (h, params) => {
      let str = ''
      if (params.row.nurseList != null && params.row.nurseList.length > 0) {
        params.row.nurseList.forEach(v => {
          if (str !== '') {
            str = str + ',' + v.name
          } else {
            str = v.name
          }
        })
      }
      return h('span', [str])
    }
  },
  {
    title: '订单状态',
    align: 'center',
    key: 'orderStatus',
    render: (h, params) => {
      let str = ''
      switch (params.row.orderStatus) {
        case 0:
          str = '订单提交'
          break
        case -1:
          str = '订单拒绝'
          break
        case -2:
          str = '订单取消'
          break
        case 1:
          str = '订单支付完成'
          break
        case 2:
          str = '订单审核通过'
          break
        case 3:
          str = '订单已接单'
          break
        case 4:
          str = '订单处理中'
          break
        case 5:
          str = '订单完成，待评价'
          break
        case 6:
          str = '再次预约，待评价'
          break
        case 7:
          str = '转院，待评价'
          break
        case 8:
          str = '用户评价完成'
          break
        case 9:
          str = '护士评价完成'
          break
        case 10:
          str = '互评完成'
          break
      }
      return h('span', [str])
    }
  }
]

// 标签
export const labelsColumns = [
  {
    title: '标签名称',
    key: 'content'
  },
  {
    title: '层级',
    key: 'level'
  },
  {
    title: '标签解释',
    key: 'comment'
  },
  {
    title: '操作',
    key: 'action',
    type: 'template',
    template: 'action'
  }
]

// 健康档案相关类型
export const healthTypesColumns = [
  {
    title: '类型名称',
    key: 'name'
  },
  {
    title: '层级',
    key: 'level'
  },
  {
    title: '操作',
    key: 'action',
    type: 'template',
    template: 'action'
  }
]

// 护理项目相关类型
export const programTypesColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '类型名称',
    key: 'name'
  }
]

// 护理项目
export const programColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '服务名称',
    align: 'center',
    key: 'name'
  },
  {
    title: '服务图片',
    align: 'center',
    key: 'picUrl',
    render: (h, params) => {
      return h('img', {
        style: {
          margin: '5px',
          display: 'inline-block',
          height: '40px',
          width: '40px',
          borderRadius: '5px'
        },
        attrs: {
          src: params.row['picUrl']
            ? params.row['picUrl'] + '?imageView2/1/w/45/h/45'
            : 'http://sdcmi.halohealth.cn/images/1552373693998.jpg'
        }
      })
    }
  },
  {
    title: '需要护士（人）',
    align: 'center',
    key: 'numberOfNurse'
  },
  {
    title: '价格（¥）',
    align: 'center',
    key: 'price',
    render: (h, params) => {
      return h('span', [
        params.row.hasChild === 1 ? '/' : params.row.price
      ])
    }
  },
  {
    title: '有子服务',
    align: 'center',
    key: 'hasChild',
    render: (h, params) => {
      return h('span', [
        params.row.hasChild === 0 ? '否' : '有'
      ])
    }
  },
  {
    title: '常用项目',
    align: 'center',
    key: 'common',
    render: (h, params) => {
      return h('span', [
        params.row.common === 0 ? '否' : '是'
      ])
    }
  }
]

// 护理子项目
export const programChildColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '服务名称',
    align: 'center',
    key: 'name'
  },
  {
    title: '价格（¥）',
    align: 'center',
    key: 'price'
  }
]

// 服务耗材
export const serviceConsumeColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '耗材名称',
    align: 'center',
    key: 'name'
  },
  {
    title: '耗材总价',
    align: 'center',
    key: 'amount'
  }
]

// 宣传教育相关类型
export const educationTypesColumns = [
  {
    title: '类型名称',
    key: 'name'
  }
]

// 宣传教育
export const educationColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '宣教名称',
    key: 'name'
  },
  {
    title: '描述',
    key: 'shortDesc'
  }
]

// 版本管理
// 管理员列表
export const apkVersionColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '添加日期',
    align: 'center',
    key: 'addTime'
  },
  {
    title: 'app类型',
    align: 'center',
    key: 'appType',
    render: (h, params) => {
      return h('span', [params.row.appType === 1 ? '安卓用户端' : '安卓护士端'])
    }
  },
  {
    title: '主版本号',
    align: 'center',
    key: 'majorVersionNumber'
  },
  {
    title: '子版本号',
    align: 'center',
    key: 'minorVersionNumber'
  },
  {
    title: '修正版本号',
    align: 'center',
    key: 'revisionNumber'
  },
  {
    title: '二维码',
    align: 'center',
    key: 'picUrl',
    render: (h, params) => {
      return h('img', {
        style: {
          margin: '5px',
          display: 'inline-block',
          height: '50px',
          width: '50px',
          borderRadius: '5px'
        },
        attrs: {
          src: params.row['qrcodeUrl']
            ? params.row['qrcodeUrl'] + '?imageView2/1/w/45/h/50'
            : 'http://sdcmi.halohealth.cn/images/1552373693998.jpg'
        }
      })
    }
  }
]

export const sosColumns = [
  // {
  // 	type: 'selection',
  // 	width: 60,
  // 	align: 'center'
  // },
  {
    title: '求救时间',
    align: 'center',
    key: 'addTime'
  },
  {
    title: '订单地址',
    align: 'center',
    key: 'address'
  },
  {
    title: '用户姓名',
    align: 'center',
    key: 'name'
  },
  {
    title: '手机号',
    align: 'center',
    key: 'username'
  },
  {
    title: '联系人姓名',
    align: 'center',
    key: 'contact'
  },
  {
    title: '联系人电话',
    align: 'center',
    key: 'contactPhone'
  },
  {
    title: '处理状态',
    align: 'center',
    key: 'flag',
    render: (h, params) => {
      return h('span', [
        params.row.flag === 0 ? '未处理' : (params.row.flag === 1 ? '已报警' : '无效')
      ])
    }
  }
]
