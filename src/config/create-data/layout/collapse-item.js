// Collapse Item组件配置
export default {
  __config__: {
    layout: 'colFormItem',
    span: 24,
    formId: '',
    parent: 'el-collapse' // 指定父组件类型，表示只能放在el-collapse内
  },
  __element__: {
    tag: 'el-collapse-item',
    name: '', // 面板的名称，会被自动生成唯一值
    title: '新面板', // 面板标题
    disabled: false // 是否禁用
  },
  material: {
    icon: 'el-icon-s-operation'
  }
} 