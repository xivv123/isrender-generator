// 单行文本组件配置
export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 24,
    // 正则校验规则
  },
  // 表单label配置，
  __label__:{
    label: '多行输入框',
    labelWidth: 100,
    showLabel: true,
    labelPosition: 'left',
  },
  __element__:{
    style: { width: '100%' },
    value: "",
    tag: 'el-input',
    // 元素的placeholder
    placeholder: '请输入内容',
    disabled: false,
    clearable: false,
    type:"textarea",
    maxlength: "10",
    // 图标
    'prefix-icon': '',
    'suffix-icon': '',
    // 只读属性
    readonly: false,
    // 字数限制
    // maxlength: null
  },
  // 正则验证规则
  __regrule__:{
    // 小标识
    // 是否必填
    required: true,
    regList: []
    // 验证规则
  },
  material:{
    icon: 'edit-outline'
  }
} 