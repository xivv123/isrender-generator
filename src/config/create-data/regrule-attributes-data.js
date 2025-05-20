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
        label: '是否必填',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "required",
        value: false,
        tag: 'el-switch',
      }
    }
  ]
}
