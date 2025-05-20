// // 单选框组件配置
// export default {
//   __config__: {
//     label: '单选框组',
//     labelWidth: null,
//     showLabel: true,
//     tag: 'el-radio-group',
//     tagIcon: 'radio',
//     changeTag: true,
//     defaultValue: undefined,
//     layout: 'colFormItem',
//     span: 24,
//     optionType: 'default',
//     regList: [],
//     required: true,
//     border: false,
//     document: 'https://element.eleme.cn/#/zh-CN/component/radio'
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
//   style: {},
//   size: 'medium',
//   disabled: false
// } 

export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 24,
  },
  // 表单label配置，
  __label__:{
    label: '单选组',
    labelWidth: 100,
    showLabel: true,
    labelPosition: 'left',
  },
  __element__:{
    style: { width: '100%' },
    value: "",
    tag: 'el-radio-group',
    disabled: false,
    clearable: false,
    readonly: false,
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
    icon: 'circle-check'
  }
} 