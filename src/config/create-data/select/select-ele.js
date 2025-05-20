export default {
  size: 'small',
  labelPosition: 'left',
  labelWidth: 80,
  gutter: 15,
  disabled: false,
  validate: false,
  showSubmitBtn: false,
  showResetBtn: false,
  thisOn: true,
  itemSpacing: 15,
  itemPaddingLeft: 10,
  itemRenderList: [
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '占位提示',
        labelWidth: 90,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "placeholder",
        value: "请输入内容",
        tag: 'el-input',
        placeholder: '请输入占位提示文字',
        clearable: true
      }
    },
    // disabled 配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '是否禁用',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "disabled",
        value: false,
        tag: 'el-switch'
      }
    },
    // clearable 配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '是否可清空',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "clearable",
        value: false,
        tag: 'el-switch'
      }
    },
    // readonly 配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '是否只读',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "readonly",
        value: false,
        tag: 'el-switch'
      }
    }
  ]
}
