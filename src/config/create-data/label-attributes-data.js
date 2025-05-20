export default {
  size: 'small',
  labelPosition: 'left',
  labelWidth: 90,
  gutter: 15,
  disabled: false,
  validate: false,
  showSubmitBtn: false,
  showResetBtn: false,
  thisOn: true,
  itemSpacing: 15,
  itemPaddingLeft: 10,
  itemRenderList: [
    // label 名称
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '标签名称',
        labelWidth: 80,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "label",
        value: "",
        tag: 'el-input',
        placeholder: '请输入'
      }
    },
    // 显示标签
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '显示标签',
        labelWidth: 80,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "showLabel",
        value: true,
        tag: 'el-switch',
        disabled: false
      },
      __regrule__: {
        required: false,
        regList: []
      },
    },
    // 标签宽度
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '标签宽度',
        labelWidth: 80,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "labelWidth",
        value: 100,
        tag: 'el-slider',
        min: 0,
        max: 200,
        display: 'showLabel',
        disabled: false
      },
      __regrule__: {
        required: false,
        regList: []
      }
    }
  ]
}
