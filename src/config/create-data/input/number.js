// 单行文本组件配置
export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 12,
    // 正则校验规则
  },
  // 表单label配置，
  __label__:{
    label: '计数器',
    labelWidth: 100,
    showLabel: true,
    labelPosition: 'left',
  },
  __element__:{
    style: { width: '100%' },
    value: "",
    tag: 'el-input-number',
    disabled: false,
    clearable: true,
  },
  // 正则验证规则
  __regrule__:{
    // 小标识
    // 是否必填
    required: true,
    regList: []
  },
  material:{
    icon: 'circle-plus-outline'
  }

} 