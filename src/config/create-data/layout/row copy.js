// 单行文本组件配置
export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 24,
  },
  // 表单label配置，
  __label__:{
    label: '行容器',
    labelWidth: 100,
    showLabel: false,
    labelPosition: 'left',
  },
  __element__:{
    style: { width: '100%' },
    tag: 'el-row',
    children: []
  },
  material:{
    icon: 'edit'
  }
} 