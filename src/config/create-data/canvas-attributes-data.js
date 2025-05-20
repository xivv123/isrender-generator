export default {
  size: 'small',
  labelPosition: 'left',
  labelWidth: 100,
  itemRenderList: [
    // 画布标题
    {
      type: 'el-input',
      __config__: {
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '画布名称',
        labelWidth: 70,
        showLabel: true
      },
      __element__: {
        key: 'canvasTitle',
        tag: 'el-input',
        placeholder: '请输入画布名称',
        clearable: true,
        value: '新画布'
      }
    },
    // 画布类型
    {
      type: 'el-input',
      __config__: {
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '画布类型',
        labelWidth: 70,
        showLabel: true
      },
      __element__: {
        key: 'canvasType',
        tag: 'el-input',
        value: '普通表单'
      }
    },
    // 画布描述
    {
      type: 'el-input',
      __config__: {
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '画布描述',
        labelWidth: 70,
        showLabel: true
      },
      __element__: {
        key: 'canvasDescription',
        tag: 'el-input',
        type: 'textarea',
        rows: 2,
        placeholder: '请输入画布描述',
        value: ''
      }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '画布尺寸(宽度)',
        labelWidth: 120,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "canvasWidth",
        value: 900,
        tag: 'el-input-number',
        min: 0,
      }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '画布尺寸(高度)',
        labelWidth: 120,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "canvasHeight",
        value: 600,
        tag: 'el-input-number',
        min: 0,
      }
    },
    // 画布背景色
    {
      type: 'el-color-picker',
      __config__: {
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '背景色',
        showLabel: true
      },
      __element__: {
        style: { width: '100%' },
        key: 'background',
        tag: 'el-color-picker',
        'show-alpha': true,
        value: '#ffffff'
      }
    },
    // 边框样式
    {
      type: 'el-select',
      __config__: {
        layout: 'colFormItem',
        span: 24,
        formId: 'canvas_border_style_field'
      },
      __label__: {
        label: '边框样式',
        showLabel: true
      },
      __element__: {
        key: 'borderStyle',
        tag: 'el-select',
        placeholder: '请选择边框样式',
        value: 'none',
        style: { width: '100%' },
        slot: {
          options: [
            { label: '无', value: 'none' },
            { label: '实线', value: 'solid' },
            { label: '虚线', value: 'dashed' },
            { label: '点线', value: 'dotted' }
          ]
        }
      }
    },
    // 边框颜色 - 条件显示
    {
      type: 'el-color-picker',
      __config__: {
        layout: 'colFormItem',
        span: 24,
        formId: 'canvas_border_color_field',
        display: 'formData.borderStyle !== "none"'
      },
      __label__: {
        label: '边框颜色',
        showLabel: true
      },
      __element__: {
        key: 'borderColor',
        tag: 'el-color-picker',
        value: '#dddddd'
      }
    },
    // 边框宽度 - 条件显示
    {
      type: 'el-input-number',
      __config__: {
        layout: 'colFormItem',
        span: 24,
        formId: 'canvas_border_width_field',
        display: 'formData.borderStyle !== "none"'
      },
      __label__: {
        label: '边框宽度',
        showLabel: true
      },
      __element__: {
        key: 'borderWidth',
        tag: 'el-input-number',
        min: 1,
        max: 10,
        step: 1,
        value: 1,
        style: { width: '100%' }
      }
    },
    // 圆角大小
    {
      type: 'el-input-number',
      __config__: {
        layout: 'colFormItem',
        span: 24,
        formId: 'canvas_border_radius_field'
      },
      __label__: {
        label: '圆角大小',
        showLabel: true
      },
      __element__: {
        key: 'borderRadius',
        tag: 'el-input-number',
        min: 0,
        max: 30,
        step: 1,
        value: 4,
        style: { width: '100%' }
      }
    }
  ]
}

