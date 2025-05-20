export default {
  itemRenderList: [
    // label 名称
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '栅格宽度',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "span",
        value: 24,
        min: 1,
        max: 24,
        tag: 'el-slider'
      }
    },
    // 选项配置（仅对选项类组件显示）
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
        slot: 'slotConfig'
      },
      __label__: {
        label: '选项配置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        tag: 'slot',
        key: 'slotConfig'
      }
    },
    // 事件配置（所有组件）
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
        slot: 'eventConfig'
      },
      __label__: {
        label: '事件配置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        tag: 'slot',
        key: 'eventConfig'
      }
    }
  ]
}
