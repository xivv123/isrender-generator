// 下拉选择组件配置
// export default {
//   __config__: {
//     label: '下拉选择',
//     labelWidth: 100,
//     showLabel: true,
//     tag: 'el-select',
//     tagIcon: 'select',
//     layout: 'colFormItem',
//     span: 24,
//     required: true,
//     regList: [],
//     changeTag: true,
//   },
//   __slot__: {
//     options: [{
//       label: '选项一',
//       value: 1
//     }, {
//       label: '选项二',
//       value: 2
//     }]
//   },
//   placeholder: '请选择',
//   style: { width: '100%' },
//   clearable: true,
//   disabled: false,
//   filterable: false,
//   multiple: false
// } 

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
    label: '选择框',
    labelWidth: 100,
    showLabel: true,
    labelPosition: 'left',
  },
  __element__:{
    style: { width: '100%' },
    value: "",
    tag: 'el-select',
    // 元素的placeholder
    placeholder: '请选择',
    disabled: false,
    clearable: false,
    // 图标
    'prefix-icon': '',
    'suffix-icon': 'el-icon-edit',
    // 只读属性
    readonly: false,
    // 字数限制
    maxlength: null,
    slot: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
  },
  // 正则验证规则
  __regrule__:{
    required: true,
    regList: []
  },
  material:{
    icon: 'arrow-down'
  }
} 
