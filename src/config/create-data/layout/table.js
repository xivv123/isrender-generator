// Table组件配置
export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 24,
    formId: ''
  },
  // 表单label配置
  __label__: {
    label: '表格',
    labelWidth: 100,
    showLabel: true,
    labelPosition: 'left',
  },
  __element__: {
    style: { width: '100%' },
    tag: 'el-table',
    border: true,
    stripe: true,
    'highlight-current-row': true,
    // 表格列配置
    columns: [
      {
        prop: 'date',
        label: '日期',
        width: '180'
      },
      {
        prop: 'name',
        label: '姓名',
        width: '180'
      },
      {
        prop: 'address',
        label: '地址'
      }
    ],
    // 默认数据
    data: [
      {
        date: '2023-01-01',
        name: '张三',
        address: '北京市朝阳区'
      },
      {
        date: '2023-01-02',
        name: '李四',
        address: '上海市浦东新区'
      }
    ],
    // 默认插槽
    slot: {
      default: []
    }
  },
  material: {
    icon: 's-grid'
  }
} 