// Dropdown组件配置
export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 6,
    formId: ''
  },
  // 表单label配置
  __label__: {
    label: '下拉菜单',
    labelWidth: 100,
    showLabel: true,
    labelPosition: 'left',
  },
  __element__: {
    style: { width: '100%' },
    tag: 'el-dropdown',
    // 设置组件参数
    type: 'default',
    size: 'medium',
    splitButton: false,
    hideOnClick: true,
    placement: 'bottom-end',
    triggerText: '下拉菜单',
    value:"",
    // 下拉菜单项配置
    menuItems: [
      {
        text: '黄金糕',
        disabled: false,
        divided: false,
        command: 'item1'
      },
      {
        text: '狮子头',
        disabled: false,
        divided: false,
        command: 'item2'
      },
      {
        text: '螺蛳粉',
        disabled: false,
        divided: false,
        command: 'item3'
      },
      {
        text: '双皮奶',
        disabled: true,
        divided: false,
        command: 'item4'
      },
      {
        text: '蚵仔煎',
        disabled: false,
        divided: true,
        command: 'item5'
      }
    ],
    // 默认插槽
    slot: {
      default: [],
      dropdown: []
    }
  },
  material: {
    icon: 'caret-bottom'
  }
} 