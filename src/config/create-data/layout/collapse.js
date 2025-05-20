// Collapse组件配置
export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 24,
    formId: ''
  },
  // 表单label配置
  __label__: {
    label: '折叠面板',
    labelWidth: 100,
    showLabel: true,
    labelPosition: 'left',
  },
  __element__: {
    style: { width: '100%' },
    tag: 'el-collapse',
    // 设置组件参数
    accordion: true, // 是否手风琴模式
    slot: {
      options: [
        {
          label: '面板1',
          value: '1',
          name: '1',
          props: {
            title: '面板1',
            name: '1',
            disabled: false
          },
          content: '我是面板1的内容'
        },
        {
          label: '面板2',
          value: '2',
          name: '2',
          props: {
            title: '面板2',
            name: '2',
            disabled: false
          },
          content: '我是面板2的内容'
        }
      ]
    },
  },
  material: {
    icon: 's-fold'
  }
} 