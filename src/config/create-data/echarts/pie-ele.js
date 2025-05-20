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
    {
      slot: "defultValue"
    },
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
        value: "Referer of a Website",
        tag: 'el-input',
        placeholder: '请输入图表标题',
        clearable: true
      }
    },
    // 副标题配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '副标题',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "title.subtext",
        value: "Fake Data",
        tag: 'el-input',
        placeholder: '请输入副标题',
        clearable: true
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
    // 提示框配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '提示框触发',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "tooltip.trigger",
        value: "item",
        tag: 'el-select',
        placeholder: '请选择提示框触发方式',
        clearable: false,
        slot:{
          options: [
            { label: '数据项触发', value: 'item' },
            { label: '坐标轴触发', value: 'axis' },
            { label: '无', value: 'none' }
          ]
        }
      }
    },
    // 图例设置 - 分割线
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '图例设置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        tag: 'el-divider',
        'content-position': 'left'
      }
    },
    // 图例方向配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '图例方向',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "legend.orient",
        value: "vertical",
        tag: 'el-select',
        placeholder: '请选择图例方向',
        clearable: false,
        slot:{
          options: [
            { label: '垂直排列', value: 'vertical' },
            { label: '水平排列', value: 'horizontal' }
          ]
        }
      }
    },
    // 图例位置设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '图例位置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "legend.left",
        value: "left",
        tag: 'el-select',
        placeholder: '请选择图例位置',
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
    // 系列设置 - 分割线
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '饼图设置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        tag: 'el-divider',
        'content-position': 'left'
      }
    },
    // 饼图系列名称
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
        value: "Access From",
        tag: 'el-input',
        placeholder: '请输入系列名称',
        clearable: true
      }
    },
    // 饼图类型
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '饼图类型',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "chart_type",
        value: "pie",
        tag: 'el-radio-group',
        slot:{
          options: [
            { label: '饼图', value: 'pie' },
            { label: '环形图', value: 'ring' }
          ]
        }
      }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '饼图半径',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].radius_outer",
        value: 70,
        tag: 'el-slider',
        min: 30,
        max: 100,
        step: 5,
        // 'show-input': true,
        'input-size': 'mini'
      }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '内径百分比',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].radius_inner",
        value: 40,
        tag: 'el-slider',
        min: 0,
        max: 70,
        step: 5,
        // 'show-input': true,
        'input-size': 'mini'
      }
    },
    // 饼图高亮样式 - 分割线
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '高亮效果',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        tag: 'el-divider',
        'content-position': 'left'
      }
    },
    // 阴影模糊大小
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '阴影模糊',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].emphasis.itemStyle.shadowBlur",
        value: 10,
        tag: 'el-slider',
        min: 0,
        max: 20,
        step: 1
      }
    },
    // 阴影颜色
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '阴影颜色',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].emphasis.itemStyle.shadowColor",
        value: "rgba(0, 0, 0, 0.5)",
        tag: 'el-color-picker',
        'show-alpha': true
      }
    },
    // 数据项设置 - 分割线
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '数据项设置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        tag: 'el-divider',
        'content-position': 'left'
      }
    },
    // 数据项说明
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __element__: {
        tag: 'el-alert',
        title: '数据项通过系统数据绑定功能进行配置，此处仅提供基础样式设置',
        type: 'info',
        'show-icon': true,
        closable: false
      }
    },
    // 动画设置 - 分割线
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '动画设置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        tag: 'el-divider',
        'content-position': 'left'
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
        step: 100
      }
    },
    // 动画缓动效果
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '动画效果',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "animationEasing",
        value: "cubicOut",
        tag: 'el-select',
        placeholder: '请选择动画效果',
        slot: {
          options: [
            { label: '线性', value: 'linear' },
            { label: '弹性', value: 'elasticOut' },
            { label: '反弹', value: 'bounceOut' },
            { label: '立方', value: 'cubicOut' },
            { label: '四次方', value: 'quarticOut' }
          ]
        }
      }
    }
  ]
}