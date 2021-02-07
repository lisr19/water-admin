// 校验用判断

export const adminRules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { max: 20, message: '请输入20个以内字符', trigger: 'blur' },
    {
      pattern: /^(?!_)(?!.*?_$)[0-9a-zA-Z_]+$/,
      message: '用户名只含有字母、数字、下划线不能以下划线开头和结尾',
      trigger: 'blur'
    }
  ],
  name: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { max: 20, message: '请输入20个以内字符', trigger: 'blur' },
    {
      pattern: /^(?!_)(?!.*?_$)[a-zA-Z_\u4e00-\u9fa5]+$/,
      message: '姓名只含有汉字、字母、下划线不能以下划线开头和结尾',
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '电话号码不能为空', trigger: 'blur' },
    { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
  email: [
    {
      pattern: /^[A-Za-z0-9]+([._\\-]*[A-Za-z0-9])*@([A-Za-z0-9]+[-A-Za-z0-9]*[A-Za-z0-9]+.){1,63}[A-Za-z0-9]+$/,
      message: '不合法的邮箱',
      trigger: 'blur'
    }
  ],
  password: [
    {
      pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
      message: '密码格式不正确,密码由6-20位大小写字母、数字、符号：?、!、@组成',
      trigger: 'blur'
    }
  ]
}

export const accessRules={
  name: [
    { required: true, message: '权限名称不能为空', trigger: 'blur' },
    { max: 50, message: '请输入50个以内字符', trigger: 'blur' }
  ],
  url: [
    { required: true, message: 'url不能为空', trigger: 'blur' },
    { max: 50, message: '请输入50个以内字符', trigger: 'blur' }
  ],
  front: [
    { required: true, message: '对应组件不能为空', trigger: 'blur' },
    { max: 50, message: '请输入50个以内字符', trigger: 'blur' }
  ],
}

export const customerInfoRules = {
  username: [
    { required: true, message: '（账号）电话号码不能为空', trigger: 'blur' },
    { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { max: 20, message: '请输入20个以内字符', trigger: 'blur' },
    {
      pattern: /^(?!_)(?!.*?_$)[a-zA-Z_\u4e00-\u9fa5]+$/,
      message: '姓名只含有汉字、字母、下划线不能以下划线开头和结尾',
      trigger: 'blur'
    }
  ],
  email: [
    {
      pattern: /^[A-Za-z0-9]+([._\\-]*[A-Za-z0-9])*@([A-Za-z0-9]+[-A-Za-z0-9]*[A-Za-z0-9]+.){1,63}[A-Za-z0-9]+$/,
      message: '不合法的邮箱',
      trigger: 'blur'
    }
  ],
  gender: [{ required: true, type:'number',message: '性别不能为空', trigger: 'blur' }],
  password: [
    {
      pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
      message: '密码格式不正确,密码由6-20位大小写字母、数字、符号：?、!、@组成',
      trigger: 'blur'
    }
  ]
}

export const nurseInfoRules = {
  username: [
    { required: true, message: '（账号）电话号码不能为空', trigger: 'blur' },
    { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { max: 20, message: '请输入20个以内字符', trigger: 'blur' },
    {
      pattern: /^(?!_)(?!.*?_$)[a-zA-Z_\u4e00-\u9fa5]+$/,
      message: '姓名只含有汉字、字母、下划线不能以下划线开头和结尾',
      trigger: 'blur'
    }
  ],
  workYears:[{ pattern: /^([1-9][0-9]*)+(.[0-9]{1,3})?$/, message: '请填写数字', trigger: 'blur' }],
  email: [
    {
      pattern: /^[A-Za-z0-9]+([._\\-]*[A-Za-z0-9])*@([A-Za-z0-9]+[-A-Za-z0-9]*[A-Za-z0-9]+.){1,63}[A-Za-z0-9]+$/,
      message: '不合法的邮箱',
      trigger: 'blur'
    }
  ],
  idNumber: [
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式不正确', trigger: 'blur' }
  ],
  gender: [{ required: true, type:'number',message: '性别不能为空', trigger: 'blur' }],
  password: [
    {
      pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
      message: '密码格式不正确,密码由6-20位大小写字母、数字、符号：?、!、@组成',
      trigger: 'blur'
    }
  ]
}

export const nursingProgramRules = {
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  price:[{ required: true, message: '价格不能为空', trigger: 'blur' },
    { pattern: /^([1-9][0-9]*)+(.[0-9]{1,3})?$/, message: '请填写数字', trigger: 'blur' }
  ],
  content :[{ required: true, message: '内容不能为空', trigger: 'blur' }],
  serviceType: [{ required: true, type:'number',message: '类型不能为空', trigger: 'blur' }]
}
