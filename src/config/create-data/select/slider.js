// // 滑块组件配置
// export default {
//   __config__: {
//     label: '滑块',
//     tag: 'el-slider',
//     tagIcon: 'slider',
//     defaultValue: null,
//     span: 24,
//     showLabel: true,
//     layout: 'colFormItem',
//     labelWidth: null,
//     required: true,
//     regList: [],
//     changeTag: true,
//     document: 'https://element.eleme.cn/#/zh-CN/component/slider'
//   },
//   disabled: false,
//   min: 0,
//   max: 100,
//   step: 1,
//   'show-stops': false,
//   range: false
// } 

// // 开关组件配置
// export default {
//   __config__: {
//     label: '开关',
//     tag: 'el-switch',
//     tagIcon: 'switch',
//     defaultValue: false,
//     span: 24,
//     showLabel: true,
//     labelWidth: null,
//     layout: 'colFormItem',
//     required: true,
//     regList: [],
//     changeTag: true,
//     document: 'https://element.eleme.cn/#/zh-CN/component/switch'
//   },
//   style: {},
//   disabled: false,
//   'active-text': '',
//   'inactive-text': '',
//   'active-color': null,
//   'inactive-color': null,
//   'active-value': true,
//   'inactive-value': false
// } 


export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 24,
    // 正则校验规则
  },
  // 表单label配置，
  __label__:{
    label: '滑块',
    labelWidth: 100,
    showLabel: true,
    labelPosition: 'left',
  },
  __element__:{
    style: { width: '100%' },
    value: "",
    tag: 'el-slider',
    disabled: false,
    clearable: false,
    readonly: false,
    // 字数限制
  },
  // 正则验证规则
  __regrule__:{
    required: true,
    regList: []
  },
  material:{
    icon: 'set-up'
  }
} 