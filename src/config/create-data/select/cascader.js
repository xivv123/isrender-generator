// 级联选择组件配置
// export default {
//   __config__: {
//     label: '级联选择',
//     method: 'get',
//     dataPath: 'list',
//     dataConsumer: 'options',
//     showLabel: true,
//     labelWidth: null,
//     tag: 'el-cascader',
//     tagIcon: 'cascader',
//     layout: 'colFormItem',
//     defaultValue: [],
//     dataType: 'dynamic',
//     span: 24,
//     required: true,
//     regList: [],
//     changeTag: true,
//   },
//   options: [{
//     id: 1,
//     value: 1,
//     label: '选项1',
//     children: [{
//       id: 2,
//       value: 2,
//       label: '选项1-1'
//     }]
//   }],
//   placeholder: '请选择',
//   style: { width: '100%' },
//   props: {
//     props: {
//       multiple: false,
//       label: 'label',
//       value: 'value',
//       children: 'children'
//     }
//   },
//   'show-all-levels': true,
//   disabled: false,
//   clearable: true,
//   filterable: false,
//   separator: '/'
// } 

// 单行文本组件配置
export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 24,
  },
  // 表单label配置，
  __label__:{
    label: '联级选择框',
    labelWidth: 100,
    showLabel: true,
    labelPosition: 'left',
  },
  __element__:{
    style: { width: '100%' },
    value: "",
    tag: 'el-cascader',
    // 元素的placeholder
    placeholder: '请选择',
    disabled: false,
    clearable: false,
    // 只读属性
    readonly: false,
    // 字数限制
    maxlength: null,
    slot: {
      options: [{
        id: 1,
        value: 1,
        label: '选项1',
        children: [{
          id: 2,
          value: 2,
          label: '选项1-1'
        }]
      }],
    },
  },
  // 正则验证规则
  __regrule__:{
    required: true,
    regList: []
  },
  material:{
    icon: 'd-arrow-right'
  }
} 
