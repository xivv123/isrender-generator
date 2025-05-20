// 仪表盘图表配置项更新处理函数
function handleGaugeConfigChange(parentInstance, value, formModel, fieldInfo) {
  // 获取对应的配置项名称
  const configKey = fieldInfo.key;
  
  console.log(`仪表盘配置项 ${configKey} 已更新为:`, value);
  
  // 如果有父实例且有formData，则尝试更新图表配置
  if (parentInstance && parentInstance.formData && parentInstance.formData.echarts_gauge_chart) {
    const gaugeChart = parentInstance.formData.echarts_gauge_chart;
    
    // 更新图表配置
    if (gaugeChart.chartOptions) {
      // 基于configKey更新不同的配置项
      switch (configKey) {
        case "title_text":
          if (gaugeChart.chartOptions.title) {
            gaugeChart.chartOptions.title.text = value;
          }
          break;
        case "gauge_min":
          if (gaugeChart.chartOptions.series && gaugeChart.chartOptions.series.length > 0) {
            gaugeChart.chartOptions.series[0].min = value;
          }
          break;
        case "gauge_max":
          if (gaugeChart.chartOptions.series && gaugeChart.chartOptions.series.length > 0) {
            gaugeChart.chartOptions.series[0].max = value;
          }
          break;
        case "gauge_value":
          if (gaugeChart.chartOptions.series && gaugeChart.chartOptions.series.length > 0 && 
              gaugeChart.chartOptions.series[0].data && gaugeChart.chartOptions.series[0].data.length > 0) {
            gaugeChart.chartOptions.series[0].data[0].value = value;
          }
          break;
        case "gauge_name":
          if (gaugeChart.chartOptions.series && gaugeChart.chartOptions.series.length > 0 && 
              gaugeChart.chartOptions.series[0].data && gaugeChart.chartOptions.series[0].data.length > 0) {
            gaugeChart.chartOptions.series[0].data[0].name = value;
          }
          break;
        case "progress_show":
          if (gaugeChart.chartOptions.series && gaugeChart.chartOptions.series.length > 0 && 
              gaugeChart.chartOptions.series[0].progress) {
            gaugeChart.chartOptions.series[0].progress.show = value;
          }
          break;
        case "progress_width":
          if (gaugeChart.chartOptions.series && gaugeChart.chartOptions.series.length > 0 && 
              gaugeChart.chartOptions.series[0].progress) {
            gaugeChart.chartOptions.series[0].progress.width = value;
          }
          break;
        case "axis_tick_show":
          if (gaugeChart.chartOptions.series && gaugeChart.chartOptions.series.length > 0) {
            gaugeChart.chartOptions.series[0].axisTick = gaugeChart.chartOptions.series[0].axisTick || {};
            gaugeChart.chartOptions.series[0].axisTick.show = value;
          }
          break;
        case "animation_duration":
          if (gaugeChart.chartOptions) {
            gaugeChart.chartOptions.animationDuration = value;
          }
          break;
        case "animation_easing":
          if (gaugeChart.chartOptions) {
            gaugeChart.chartOptions.animationEasing = value;
          }
          break;
      }
      
      // 如果有图表实例引用，直接更新图表
      if (parentInstance.$refs && parentInstance.$refs.echarts_gauge_chart) {
        const chartInstance = parentInstance.$refs.echarts_gauge_chart;
        if (chartInstance && chartInstance.setOption) {
          // 根据不同的配置项构建更新对象
          const updateOptions = {};
          
          if (configKey === 'title_text') {
            updateOptions.title = { text: value };
          } else if (configKey.startsWith('gauge_')) {
            // 处理仪表盘系列相关配置
            updateOptions.series = [{}];
            
            if (configKey === 'gauge_value') {
              updateOptions.series[0].data = [{ value: value }];
            } else if (configKey === 'gauge_name') {
              updateOptions.series[0].data = [{ name: value }];
            } else if (configKey === 'gauge_min') {
              updateOptions.series[0].min = value;
            } else if (configKey === 'gauge_max') {
              updateOptions.series[0].max = value;
            }
          } else if (configKey.startsWith('progress_')) {
            // 处理进度条相关配置
            updateOptions.series = [{
              progress: {}
            }];
            
            if (configKey === 'progress_show') {
              updateOptions.series[0].progress.show = value;
            } else if (configKey === 'progress_width') {
              updateOptions.series[0].progress.width = value;
            }
          } else if (configKey === 'axis_tick_show') {
            updateOptions.series = [{
              axisTick: { show: value }
            }];
          } else if (configKey.startsWith('animation_')) {
            // 处理动画相关配置
            if (configKey === 'animation_duration') {
              updateOptions.animationDuration = value;
            } else if (configKey === 'animation_easing') {
              updateOptions.animationEasing = value;
            }
          }
          
          // 应用更新
          chartInstance.setOption(updateOptions);
        }
      }
      
      console.log("仪表盘配置已更新");
      return true;
    }
  }
  
  console.warn("未找到仪表盘数据或无法更新");
  return false;
}

export default {
  itemRenderList: [
    {
      slot: "gaugeConfig" // 可以用于插入其他配置项
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
        key: "title_text",
        value: "业务完成率",
        tag: 'el-input',
        placeholder: '请输入图表标题',
        clearable: true,
        on: {
          change: handleGaugeConfigChange,
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
        key: "gauge_value",
        value: 70,
        tag: 'el-slider',
        min: 0,
        max: 100,
        step: 1,
        'show-input': true,
        'show-stops': false,
        on: {
          change: handleGaugeConfigChange,
        }
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
        key: "gauge_name",
        value: "完成率",
        tag: 'el-input',
        placeholder: '请输入仪表盘名称',
        clearable: true,
        on: {
          change: handleGaugeConfigChange,
        }
      }
    },
    // 仪表盘最小值
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 12,
      },
      __label__: {
        label: '最小值',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "gauge_min",
        value: 0,
        tag: 'el-input-number',
        min: 0,
        max: 1000,
        step: 10,
        on: {
          change: handleGaugeConfigChange,
        }
      }
    },
    // 仪表盘最大值
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 12,
      },
      __label__: {
        label: '最大值',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "gauge_max",
        value: 100,
        tag: 'el-input-number',
        min: 0,
        max: 1000,
        step: 10,
        on: {
          change: handleGaugeConfigChange,
        }
      }
    },
    // 进度条显示设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 12,
      },
      __label__: {
        label: '显示进度条',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "progress_show",
        value: true,
        tag: 'el-switch',
        on: {
          change: handleGaugeConfigChange,
        }
      }
    },
    // 进度条宽度设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 12,
      },
      __label__: {
        label: '进度条宽度',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "progress_width",
        value: 18,
        tag: 'el-input-number',
        min: 1,
        max: 30,
        step: 1,
        on: {
          change: handleGaugeConfigChange,
        }
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
        key: "axis_tick_show",
        value: false,
        tag: 'el-switch',
        on: {
          change: handleGaugeConfigChange,
        }
      }
    },
    // 颜色设置分割线
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
    // 动画配置分割线
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
        span: 12,
      },
      __label__: {
        label: '动画时长',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "animation_duration",
        value: 1000,
        tag: 'el-input-number',
        min: 0,
        max: 5000,
        step: 100,
        on: {
          change: handleGaugeConfigChange,
        }
      }
    },
    // 动画缓动效果
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 12,
      },
      __label__: {
        label: '动画效果',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "animation_easing",
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
          change: handleGaugeConfigChange,
        }
      }
    }
  ]
} 