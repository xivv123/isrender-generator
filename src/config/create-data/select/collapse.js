// // 多选框组件配置
// export default {
//   __config__: {
//     label: '多选框组',
//     tag: 'el-checkbox-group',
//     tagIcon: 'checkbox',
//     defaultValue: ['1'],
//     span: 24,
//     showLabel: true,
//     labelWidth: null,
//     layout: 'colFormItem',
//     optionType: 'default',
//     required: true,
//     regList: [],
//     changeTag: true,
//     border: false,
//     document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
//   },
//   __slot__: {
//     options: [{
//       label: 'Option 1',
//       value: '1'
//     }, {
//       label: 'Option 2',
//       value: '2'
//     }, {
//       label: 'Option 3',
//       value: '3'
//     }]
//   },
//   style: {},
//   size: 'medium',
//   min: null,
//   max: null,
//   disabled: false
// } 



export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 24
  },
  // 表单label配置，
  __label__:{
    label: '折叠面板',
    labelWidth: 100,
    showLabel: true,
    labelPosition: 'left',
  },
  __element__:{
    style: { width: '100%' },
    tag: 'el-collapse',
    value: ['1'],  // 默认打开第一个面板
    slot:{},
    accordion: false  // 是否手风琴模式
  },
  // 正则验证规则
  __regrule__:{
    required: false,
    regList: []
  },
  material:{
    icon: 'el-icon-s-fold'
  }
} 
