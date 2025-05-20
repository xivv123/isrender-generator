// 编辑器组件配置
export default {
  __config__: {
    label: '编辑器',
    showLabel: true,
    changeTag: true,
    labelWidth: 100, // 默认标签宽度为100px
    tag: 'tinymce',
    tagIcon: 'rich-text',
    defaultValue: null,
    span: 24,
    layout: 'colFormItem',
    required: true,
    regList: []
  },
  placeholder: '请输入',
  height: 300, // 编辑器高度
  branding: false // 隐藏右下角品牌烙印
} 