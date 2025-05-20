// 折线图图表配置项更新处理函数
function handleLineConfigChange(parentInstance, value, formModel, fieldInfo) {
 
}

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
      slot: "defultValue" // 可以用于插入其他配置项
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
        value: "月度销售数据",
        tag: 'el-input',
        placeholder: '请输入图表标题',
        clearable: true,
        on: {
          change: handleLineConfigChange,
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
        clearable: true,
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // 图表网格设置 - 顶部边距
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '顶部边距',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "grid.top",
        value: "15%",
        tag: 'el-input',
        placeholder: '请输入顶部边距',
        clearable: true,
        on: {
          change: handleLineConfigChange,
        }
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
        },
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // 图表网格设置 - 顶部边距
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '顶部边距',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "grid.top",
        value: "15%",
        tag: 'el-input',
        placeholder: '请输入顶部边距',
        clearable: true,
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // 图表网格设置 - 底部边距
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '底部边距',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "grid.bottom",
        value: "15%",
        tag: 'el-input',
        placeholder: '请输入底部边距',
        clearable: true,
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // 图表提示框配置
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
        value: "axis",
        tag: 'el-select',
        placeholder: '请选择提示框触发方式',
        clearable: false,
        slot:{
          options: [
            { label: '坐标轴触发', value: 'axis' },
            { label: '数据项触发', value: 'item' },
            { label: '无', value: 'none' }
          ]
        },
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // X轴类型设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: 'X轴类型',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "xAxis.type",
        value: "category",
        tag: 'el-select',
        placeholder: '请选择X轴类型',
        clearable: false,
        slot:{
          options: [
            { label: '类目轴', value: 'category' },
            { label: '数值轴', value: 'value' },
            { label: '时间轴', value: 'time' }
          ]
        },
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // X轴边界间隙设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: 'X轴边界间隙',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "xAxis.boundaryGap",
        value: false,
        tag: 'el-switch',
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // 第一条数据线配置 - 分割线
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '第一条数据线设置',
        labelWidth: 125,
        showLabel: true,
      },
      __element__: {
        tag: 'el-divider',
        'content-position': 'left'
      }
    },
    // 第一条数据线名称
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '线条名称',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].name",
        value: "销售额",
        tag: 'el-input',
        placeholder: '请输入线条名称',
        clearable: true,
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // 第一条数据线平滑度
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '平滑曲线',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].smooth",
        value: true,
        tag: 'el-switch',
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // 第一条数据线宽度
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '线条宽度',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].lineStyle.width",
        value: 3,
        tag: 'el-input-number',
        min: 1,
        max: 10,
        step: 1
      }
    },
    // 第一条数据线颜色
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '线条颜色',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].lineStyle.color",
        value: "#409EFF",
        tag: 'el-color-picker',
        'show-alpha': true,
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // 第二条数据线配置 - 分割线
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '第二条数据线设置',
        labelWidth: 125,
        showLabel: true,
      },
      __element__: {
        tag: 'el-divider',
        'content-position': 'left'
      }
    },
    // 第二条数据线名称
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '线条名称',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[1].name",
        value: "订单数",
        tag: 'el-input',
        placeholder: '请输入线条名称',
        clearable: true,
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // 第二条数据线平滑度
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '平滑曲线',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[1].smooth",
        value: true,
        tag: 'el-switch',
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // 第二条数据线宽度
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '线条宽度',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[1].lineStyle.width",
        value: 3,
        tag: 'el-input-number',
        min: 1,
        max: 10,
        step: 1,
        on: {
          change: handleLineConfigChange,
        }
      }
    },
    // 第二条数据线颜色
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '线条颜色',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[1].lineStyle.color",
        value: "#67C23A",
        tag: 'el-color-picker',
        'show-alpha': true,
        on: {
          change: handleLineConfigChange,
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
        key: "legend.bottom",
        value: '10',
        tag: 'el-input',
        placeholder: '请选择图例位置',
        clearable: false,
        // slot:{
        //   options: [
        //     { label: '顶部', value: 'top' },
        //     { label: '底部', value: 'bottom' },
        //     { label: '左侧', value: 'left' },
        //     { label: '右侧', value: 'right' }
        //   ]
        // },
        on: {
          change: handleLineConfigChange,
        }
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
        step: 100,
        on: {
          change: handleLineConfigChange,
        }
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
        },
        on: {
          change: handleLineConfigChange,
        }
      }
    }
  ]
} 