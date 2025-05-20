export default {
  size: 'small',
  labelPosition: 'left',
  labelWidth: 100,
  gutter: 15,
  disabled: false,
  validate: false,
  showSubmitBtn: false,
  showResetBtn: false,
  thisOn: true,
  itemSpacing: 15,
  itemPaddingLeft: 10,
  itemRenderList: [
    // 表单名称
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单名称',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "formname",
        value: "我是默认数据",
        tag: 'el-input',
        placeholder: '请输入表单名称',
        clearable: true,
        disabled: false,
        readonly: false,
        maxlength: null
      },
      __regrule__: {
        required: true,
        regList: []
      },
      
    },
    // 标签位置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '标签位置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "labelPosition",
        value: "left",
        tag: 'el-select',
        placeholder: '请选择标签位置',
        clearable: true,
        disabled: false,
        slot: {
          options: [
            { label: '左对齐', value: 'left' },
            { label: '右对齐', value: 'right' },
            { label: '顶部对齐', value: 'top' }
          ]
        }
      },
      __regrule__: {
        required: false,
        regList: []
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
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "form_all_showLabel",
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
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "form_all_labelWidth",
        value: 100,
        tag: 'el-slider',
        min: 0,
        max: 200,
        display: 'form_all_showLabel',
        disabled: false
      },
      __regrule__: {
        required: false,
        regList: []
      }
    },
    // 表单尺寸
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单尺寸',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%', "fill": "#409EFF","text-color": "#FFFFFF"},
        key: "size",
        value: "small",
        tag: 'el-radio-group',
        size:"mini",
        slot: {
          tag: 'el-radio-button', //设置子组件的样式
          // 子组件数据
          options: [
            { label: '中等', value: 'medium', border: true},
            { label: '小型', value: 'small', border: true },
            { label: '迷你', value: 'mini', border: true }
          ]
        }
      },
      __regrule__: {
        required: false,
        regList: []
      }
    },
    // 禁用表单
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '禁用表单',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "disabled",
        value: false,
        tag: 'el-switch',
        disabled: false
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 禁用表单提示信息
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '禁用表单提示信息',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "disabled_form_message",
        value: "表单已禁用，请注意！",
        tag: 'el-input',
        type: 'textarea',
        rows: 2,
        placeholder: '请输入禁用表单时显示的提示信息',
        clearable: true,
        disabled: false,
        display: 'disabled'
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 栅格间隔
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '栅格间隔',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "gutter",
        value: 15,
        tag: 'el-input-number',
        min: 0,
        max: 50,
        step: 2,
        disabled: false
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 表单项间距
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单项间距',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "itemSpacing",
        value: 15,
        tag: 'el-slider',
        min: 0,
        max: 40,
        step: 1,
        disabled: false
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 表单项左边距
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单项左边距',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "itemPaddingLeft",
        value: 10,
        tag: 'el-slider',
        min: 0,
        max: 40,
        step: 1,
        disabled: false
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 表单验证
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单验证',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        // style: { width: '50%' },
        key: "validate",
        value: false,
        tag: 'el-switch',
        disabled: false
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 提交按钮
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '提交按钮',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "showSubmitBtn",
        value: false,
        tag: 'el-switch',
        disabled: false
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 重置按钮
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '重置按钮',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "showResetBtn",
        value: false,
        tag: 'el-switch',
        disabled: false
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    }
  ]
}
