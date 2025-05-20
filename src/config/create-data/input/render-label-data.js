// 标签渲染配置数据
export default {
  size: 'small',
  labelPosition: 'right',
  labelWidth: 120,
  gutter: 15,
  disabled: false,
  validate: false,
  showSubmitBtn: true,
  showResetBtn: true,
  itemSpacing: 15,
  itemPaddingLeft: 10,
  itemRenderList: [
    // 标签名称配置
    {
      __element__: {
        type: 'el-input',
        key: 'label',
        value: "字段名称",
        placeholder: '请输入标签名称',
        maxlength: 30,
        clearable: true,
        events: {
          change: "handleLabelNameChange"
        }
      },
      __config__: {
        layout: 'colFormItem',
        span: 24
      },
      __label__: {
        label: '标签名称',
        labelWidth: 100,
        showLabel: true,
        labelPosition: 'left'
      }
    },

    // 标签宽度配置
    {
      __element__: {
        type: 'el-slider',
        key: 'labelWidth',
        value: 100,
        min: 0,
        max: 300,
        step: 10,
        'show-stops': true,
        'show-input': true,
        events: {
          change: "handleLabelWidthChange"
        }
      },
      __config__: {
        layout: 'colFormItem',
        span: 24
      },
      __label__: {
        label: '标签宽度',
        labelWidth: 100,
        showLabel: true,
        labelPosition: 'right'
      }
    },
    
    // 标签位置配置
    {
      __element__: {
        type: 'el-select',
        key: 'labelPosition',
        value: 'right',
        placeholder: '请选择标签位置',
        events: {
          change: "handleLabelPositionChange"
        }
      },
      options: [
        { label: '左对齐', value: 'left' },
        { label: '右对齐', value: 'right' },
        { label: '顶部对齐', value: 'top' }
      ],
      __config__: {
        layout: 'colFormItem',
        span: 24
      },
      __label__: {
        label: '标签位置',
        labelWidth: 100,
        showLabel: true,
        labelPosition: 'top'
      }
    },
    
    // 是否显示标签配置
    {
      __element__: {
        type: 'el-switch',
        key: 'showLabel',
        value: true,
        events: {
          change: "handleShowLabelChange"
        }
      },
      __config__: {
        layout: 'colFormItem',
        span: 24
      },
      __label__: {
        label: '显示标签',
        labelWidth: 100,
        showLabel: true,
        labelPosition: 'left'
      }
    }
  ]
}
