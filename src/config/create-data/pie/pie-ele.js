// 饼图图表配置项更新处理函数
function handlePieConfigChange(parentInstance, value, formModel, fieldInfo) {
  // 获取对应的配置项名称
  const configKey = fieldInfo.key;
  
  console.log(`饼图配置项 ${configKey} 已更新为:`, value);
  
  // 如果有父实例且有formData，则尝试更新图表配置
  if (parentInstance && parentInstance.formData && parentInstance.formData.echarts_pie_chart) {
    const pieChart = parentInstance.formData.echarts_pie_chart;
    
    // 更新图表配置
    if (pieChart.chartOptions) {
      // 基于configKey更新不同的配置项
      switch (configKey) {
        case "title_text":
          if (pieChart.chartOptions.title) {
            pieChart.chartOptions.title.text = value;
          }
          break;
        case "series_name":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0) {
            pieChart.chartOptions.series[0].name = value;
          }
          break;
        case "radius_inner":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0) {
            // 如果已经有radius设置，则保留外半径
            const currentRadius = Array.isArray(pieChart.chartOptions.series[0].radius) 
              ? pieChart.chartOptions.series[0].radius 
              : ['0%', '70%'];
            pieChart.chartOptions.series[0].radius = [`${value}%`, currentRadius[1]];
          }
          break;
        case "radius_outer":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0) {
            // 如果已经有radius设置，则保留内半径
            const currentRadius = Array.isArray(pieChart.chartOptions.series[0].radius) 
              ? pieChart.chartOptions.series[0].radius 
              : ['0%', '70%'];
            pieChart.chartOptions.series[0].radius = [currentRadius[0], `${value}%`];
          }
          break;
        case "legend_position":
          if (pieChart.chartOptions.legend) {
            // 根据位置设置不同的属性
            const positions = value.split('-');
            if (positions.length === 2) {
              // 清除可能存在的位置属性
              delete pieChart.chartOptions.legend.top;
              delete pieChart.chartOptions.legend.bottom;
              delete pieChart.chartOptions.legend.left;
              delete pieChart.chartOptions.legend.right;
              
              // 设置垂直位置
              if (positions[0] === 'top') {
                pieChart.chartOptions.legend.top = 10;
              } else if (positions[0] === 'bottom') {
                pieChart.chartOptions.legend.bottom = 10;
              }
              
              // 设置水平位置
              if (positions[1] === 'left') {
                pieChart.chartOptions.legend.left = 'left';
              } else if (positions[1] === 'center') {
                pieChart.chartOptions.legend.left = 'center';
              } else if (positions[1] === 'right') {
                pieChart.chartOptions.legend.left = 'right';
              }
            }
          }
          break;
        case "legend_orient":
          if (pieChart.chartOptions.legend) {
            pieChart.chartOptions.legend.orient = value;
          }
          break;
        case "label_show":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0 && 
              pieChart.chartOptions.series[0].label) {
            pieChart.chartOptions.series[0].label.show = value;
          }
          break;
        case "label_position":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0 && 
              pieChart.chartOptions.series[0].label) {
            pieChart.chartOptions.series[0].label.position = value;
          }
          break;
        case "label_formatter":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0 && 
              pieChart.chartOptions.series[0].label) {
            pieChart.chartOptions.series[0].label.formatter = value;
          }
          break;
        case "border_radius":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0 && 
              pieChart.chartOptions.series[0].itemStyle) {
            pieChart.chartOptions.series[0].itemStyle.borderRadius = value;
          }
          break;
        case "rose_type":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0) {
            // 如果值为false，则删除该属性，否则设置为area
            if (value) {
              pieChart.chartOptions.series[0].roseType = 'area';
            } else {
              delete pieChart.chartOptions.series[0].roseType;
            }
          }
          break;
        // 处理数据项更新
        case "series_data":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0) {
            // 更新整个数据数组
            pieChart.chartOptions.series[0].data = value;
          }
          break;
        // 处理单个数据项更新
        case "series_data_item":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0 &&
              pieChart.chartOptions.series[0].data && fieldInfo.index !== undefined) {
            // 更新特定索引的数据项
            if (fieldInfo.dataField === 'name') {
              pieChart.chartOptions.series[0].data[fieldInfo.index].name = value;
            } else if (fieldInfo.dataField === 'value') {
              pieChart.chartOptions.series[0].data[fieldInfo.index].value = parseFloat(value);
            }
          }
          break;
        // 处理添加数据项
        case "add_data_item":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0 &&
              pieChart.chartOptions.series[0].data) {
            // 添加新数据项
            pieChart.chartOptions.series[0].data.push({
              name: value.name || `数据项${pieChart.chartOptions.series[0].data.length + 1}`,
              value: parseFloat(value.value) || 0
            });
          }
          break;
        // 处理删除数据项
        case "remove_data_item":
          if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0 &&
              pieChart.chartOptions.series[0].data && typeof value === 'number') {
            // 删除指定索引的数据项
            pieChart.chartOptions.series[0].data.splice(value, 1);
          }
          break;
      }
      
      // 如果有图表实例引用，直接更新图表
      if (parentInstance.$refs && parentInstance.$refs.echarts_pie_chart) {
        const chartInstance = parentInstance.$refs.echarts_pie_chart;
        if (chartInstance && chartInstance.setOption) {
          // 根据不同的配置项构建更新对象
          const updateOptions = {};
          
          if (configKey === 'title_text') {
            updateOptions.title = { text: value };
          } else if (configKey === 'series_name') {
            updateOptions.series = [{ name: value }];
          } else if (configKey.startsWith('radius_')) {
            // 处理饼图半径相关配置
            const currentSeries = pieChart.chartOptions.series[0];
            const currentRadius = Array.isArray(currentSeries.radius) 
              ? currentSeries.radius 
              : ['0%', '70%'];
              
            updateOptions.series = [{ 
              radius: configKey === 'radius_inner' 
                ? [`${value}%`, currentRadius[1]] 
                : [currentRadius[0], `${value}%`] 
            }];
          } else if (configKey.startsWith('legend_')) {
            // 处理图例相关配置
            updateOptions.legend = {};
            
            if (configKey === 'legend_orient') {
              updateOptions.legend.orient = value;
            } else if (configKey === 'legend_position') {
              const positions = value.split('-');
              if (positions.length === 2) {
                // 垂直位置
                if (positions[0] === 'top') {
                  updateOptions.legend.top = 10;
                  delete updateOptions.legend.bottom;
                } else if (positions[0] === 'bottom') {
                  updateOptions.legend.bottom = 10;
                  delete updateOptions.legend.top;
                }
                
                // 水平位置
                if (positions[1] === 'left') {
                  updateOptions.legend.left = 'left';
                } else if (positions[1] === 'center') {
                  updateOptions.legend.left = 'center';
                } else if (positions[1] === 'right') {
                  updateOptions.legend.left = 'right';
                }
              }
            }
          } else if (configKey.startsWith('label_')) {
            // 处理标签相关配置
            updateOptions.series = [{
              label: {}
            }];
            
            if (configKey === 'label_show') {
              updateOptions.series[0].label.show = value;
            } else if (configKey === 'label_position') {
              updateOptions.series[0].label.position = value;
            } else if (configKey === 'label_formatter') {
              updateOptions.series[0].label.formatter = value;
            }
          } else if (configKey === 'border_radius') {
            updateOptions.series = [{
              itemStyle: { borderRadius: value }
            }];
          } else if (configKey === 'rose_type') {
            updateOptions.series = [{}];
            if (value) {
              updateOptions.series[0].roseType = 'area';
            } else {
              // 对于ECharts，无法通过设置null或undefined来删除属性
              // 所以这里我们重新获取完整的系列配置，然后删除roseType
              const fullSeriesConfig = JSON.parse(JSON.stringify(pieChart.chartOptions.series[0]));
              delete fullSeriesConfig.roseType;
              updateOptions.series[0] = fullSeriesConfig;
            }
          } else if (configKey === 'series_data' || configKey === 'series_data_item' || 
                    configKey === 'add_data_item' || configKey === 'remove_data_item') {
            // 数据相关更新，直接更新整个数据数组
            updateOptions.series = [{
              data: pieChart.chartOptions.series[0].data
            }];
          }
          
          // 应用更新
          chartInstance.setOption(updateOptions);
        }
      }
      
      console.log("饼图配置已更新");
      return true;
    }
  }
  
  console.warn("未找到饼图数据或无法更新");
  return false;
}

export default {
  itemRenderList: [
    {
      slot: "pieConfig" // 可以用于插入其他配置项
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
        span: 12,
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
        span: 12,
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
    // 饼图半径设置
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
        key: "series[0].radius",
        value: "50%",
        tag: 'el-select',
        placeholder: '请选择饼图半径',
        clearable: false,
        slot:{
          options: [
            { label: '小(30%)', value: '30%' },
            { label: '中(50%)', value: '50%' },
            { label: '大(70%)', value: '70%' }
          ]
        }
      }
    },
    // 南丁格尔玫瑰图设置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '玫瑰图',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].roseType",
        value: false,
        tag: 'el-switch',
        'active-text': '启用',
        'inactive-text': '禁用'
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
        span: 12,
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
        step: 1,
        'show-input': true
      }
    },
    // 阴影颜色
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 12,
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
    // 数据项表格
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
        componentName: 'PieDataEditor',
        defaultValue: [
          { value: 1048, name: '搜索引擎' },
          { value: 735, name: '直接访问' },
          { value: 580, name: '邮件营销' },
          { value: 484, name: '联盟广告' },
          { value: 300, name: '视频广告' }
        ]
      },
      __label__: {
        label: '饼图数据',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "series[0].data",
        tag: 'pie-data-editor',
        config: {
          // 数据编辑器配置
          columns: [
            { prop: 'name', label: '名称', type: 'input', width: '180', placeholder: '请输入数据名称' },
            { prop: 'value', label: '数值', type: 'number', width: '120', placeholder: '请输入数值' }
          ],
          // 默认数据
          defaultData: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
          ],
          // 操作按钮
          buttons: [
            { type: 'primary', label: '添加数据', action: 'add' },
            { type: 'danger', label: '删除', action: 'delete' }
          ],
          // 表格设置
          tableConfig: {
            border: true,
            stripe: true,
            'highlight-current-row': true,
            'max-height': '300'
          }
        }
      }
    },
    // 饼图数据配置说明
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __element__: {
        tag: 'el-alert',
        title: '通过上方数据编辑器可以添加、编辑和删除饼图的数据项',
        type: 'success',
        'show-icon': true,
        closable: false,
        description: '每个数据项包含名称和数值两个字段，名称将显示在图例和提示框中，数值决定了扇区的大小'
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
        span: 12,
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
        span: 12,
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
  ],
  // 自定义组件配置
  customComponents: [
    {
      name: 'PieDataEditor',
      component: {
        template: `
        <div class="pie-data-editor">
          <el-table
            :data="localData"
            v-bind="tableConfig"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" placeholder="请输入名称" @change="handleDataChange"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="数值"
              width="120">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.value" :precision="0" :step="1" :min="0" @change="handleDataChange"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pie-data-editor__footer">
            <el-button type="primary" @click="handleAdd">添加数据项</el-button>
          </div>
        </div>
        `,
        props: {
          value: {
            type: Array,
            default: () => []
          },
          config: {
            type: Object,
            default: () => ({})
          }
        },
        data() {
          return {
            localData: [],
            selectedRows: [],
            tableConfig: {
              border: true,
              stripe: true,
              'highlight-current-row': true,
              'max-height': '300'
            }
          }
        },
        watch: {
          value: {
            handler(val) {
              if (val && val.length > 0) {
                this.localData = JSON.parse(JSON.stringify(val));
              } else {
                this.localData = this.config.defaultData ? JSON.parse(JSON.stringify(this.config.defaultData)) : [];
              }
            },
            immediate: true
          }
        },
        methods: {
          handleDataChange() {
            this.$emit('input', this.localData);
            this.$emit('change', this.localData);
          },
          handleAdd() {
            this.localData.push({
              name: `数据项${this.localData.length + 1}`,
              value: 0
            });
            this.handleDataChange();
          },
          handleDelete(index) {
            this.localData.splice(index, 1);
            this.handleDataChange();
          },
          handleSelectionChange(selection) {
            this.selectedRows = selection;
          }
        }
      }
    }
  ]
} 