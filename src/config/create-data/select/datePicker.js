export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 24,
  },
  // 表单label配置，
  __label__:{
    label: '期日选择器',
    labelWidth: 100,
    showLabel: true,
    labelPosition: 'left',
  },
  __element__:{
    style: { width: '100%' },
    value: "",
    tag: 'el-date-picker',
    disabled: false,
    clearable: false,
    readonly: false,
  },
  // 正则验证规则
  __regrule__:{
    required: true,
    regList: []
  },
  material:{
    icon: 'date'
  }
} 