export default {
  size: 'small',
  labelPosition: 'left',
  labelWidth: 70,
  gutter: 15,
  disabled: false,
  validate: false,
  showSubmitBtn: false,
  showResetBtn: false,
  thisOn: true,
  itemSpacing: 15,
  itemPaddingLeft: 10,
  itemRenderList: [
    // 标题配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '图表标题',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "title.text",
        value: "业务完成率9",
        tag: 'el-input',
        placeholder: '请输入图表标题',
        clearable: true,
      }
    },
    // 标题位置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '标题位置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "title.left",
        value: "center",
        tag: 'el-select',
        placeholder: '请选择标题位置',
        clearable: false,
        slot:{
          options: [
            { label: '左侧', value: 'left' },
            { label: '中间', value: 'center' },
            { label: '右侧', value: 'right' }
          ]
        }

      }
    },
    // 仪表盘值配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '仪表盘当前值',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].data[0].value",
        value: 75,
        tag: 'el-slider',
        min: 0,
        max: 100,
        step: 1,
        'show-stops': false,
      }
    },
    // 仪表盘名称配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '仪表盘名称',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].data[0].name",
        value: "完成率",
        tag: 'el-input',
        placeholder: '请输入仪表盘名称',
        clearable: true,
      }
    },
    // 系列名称
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '系列名称',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].name",
        value: "完成情况",
        tag: 'el-input',
        placeholder: '请输入系列名称',
        clearable: true,
      }
    },
    // 半径大小设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '仪表盘大小',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].radius",
        value: "80%",
        tag: 'el-select',
        placeholder: '请选择仪表盘大小',
        clearable: false,
        slot:{
          options: [
            { label: '小(60%)', value: '60%' },
            { label: '中(80%)', value: '80%' },
            { label: '大(100%)', value: '100%' }
          ]
        }
        
      }
    },
    // 进度条显示设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '显示进度条',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].progress.show",
        value: true,
        tag: 'el-switch',
      }
    },
    // 进度条宽度设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '进度条宽度',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].progress.width",
        value: 18,
        tag: 'el-input-number',
        min: 1,
        max: 30,
        step: 1,
      }
    },
    // 刻度显示设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '显示刻度',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].axisTick.show",
        value: false,
        tag: 'el-switch',
      }
    },
    // 详情文本设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '详情文本格式',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].detail.formatter",
        value: "{value}%",
        tag: 'el-input',
        placeholder: '请输入详情文本格式，如 {value}%',
        clearable: true,
      }
    },
    // 详情文本大小设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '详情文本大小',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].detail.fontSize",
        value: 30,
        tag: 'el-input-number',
        min: 12,
        max: 60,
        step: 1,
      }
    },
    // 颜色区间设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '颜色区间设置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        tag: 'el-divider',
        'content-position': 'left'
      }
    },
    // 颜色区间说明
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __element__: {
        tag: 'el-alert',
        title: '仪表盘使用三个颜色区间：红色(0-30%)、黄色(30-70%)、绿色(70-100%)',
        type: 'info',
        'show-icon': true,
        closable: false
      }
    },
    // 动画持续时间
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '动画时长',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "animationDuration",
        value: 1000,
        tag: 'el-input-number',
        min: 100,
        max: 5000,
        step: 100,
      }
    }
  ]
} 