<template>
  <div>
    <el-divider>折线图配置</el-divider>
    <isrenderForm v-model="propsdatalocal1" :renderdata="renderDataGauge">
      <div slot="defultValue" class="line-data-editor">
        <div v-for="(series, seriesIndex) in lineOptions.series" :key="'series-' + seriesIndex" class="series-item">
          <div class="series-header">
            <el-input 
              v-model="series.name" 
              placeholder="系列名称" 
              size="small" 
              @input="handleSeriesChange"
              class="name-input"
            />
            <el-color-picker 
              v-model="series.itemStyle.color" 
              size="small" 
              @change="handleSeriesChange" 
              class="color-picker"
            />
            <div class="close-btn series-line-icon" @click="removeSeries(seriesIndex)">
              <i class="el-icon-delete" />
            </div>
          </div>
          
          <!-- 数据点编辑区域 -->
          <div class="data-points-container">
            <div class="data-points-header">
              <span>数据点</span>
              <el-button 
                type="text" 
                size="mini" 
                icon="el-icon-plus" 
                @click="addDataPoint(seriesIndex)"
              >
                添加数据点
              </el-button>
            </div>
            
            <div class="data-points-list">
              <div 
                v-for="(point, pointIndex) in series.data" 
                :key="'point-' + seriesIndex + '-' + pointIndex" 
                class="data-point-item"
              >
                <span class="point-index">{{pointIndex + 1}}.</span>
                <el-input-number
                  v-model="series.data[pointIndex]"
                  placeholder="数值"
                  size="small"
                  :step="1"
                  @change="handleSeriesChange"
                  class="value-input"
                />
                <div class="close-btn data-line-icon" @click="removeDataPoint(seriesIndex, pointIndex)">
                  <i class="el-icon-close" />
                </div>
              </div>
              <div v-if="!series.data || series.data.length === 0" class="empty-data-hint">
                <i class="el-icon-warning-outline"></i>
                <span>暂无数据点，请添加</span>
              </div>
            </div>
          </div>
          
          <el-divider v-if="seriesIndex < lineOptions.series.length - 1"></el-divider>
        </div>
        
        <div style="margin: 15px 0;">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="addSeries"
          >
            添加折线系列
          </el-button>
        </div>

        <!-- X轴数据配置 -->
        <el-divider>X轴数据</el-divider>
        <div class="x-axis-data">
          <div v-for="(item, index) in xAxisData" :key="'x-axis-' + index" class="x-axis-item">
            <span class="point-index">{{index + 1}}.</span>
            <el-input 
              v-model="xAxisData[index]" 
              placeholder="坐标值" 
              size="small" 
              @input="handleXAxisChange"
              class="value-input"
            />
            <div class="close-btn data-line-icon" @click="removeXAxisItem(index)">
              <i class="el-icon-close" />
            </div>
          </div>
          <div v-if="!xAxisData || xAxisData.length === 0" class="empty-data-hint">
            <i class="el-icon-warning-outline"></i>
            <span>暂无X轴数据，请添加</span>
          </div>
          
          <div style="margin: 10px 0;">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addXAxisItem"
            >
              添加X轴数据
            </el-button>
          </div>
        </div>
      </div>
    </isrenderForm>
  </div>
</template>

<script>
import renderDataGauge from '@/config/create-data/echarts/line-ele'
import {deepClone} from '@/components/is-render-core/utils/index.js'

export default {
  name: 'echartLineConfig',
  props: {
    componentData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      propsdatalocal1: {},
      renderDataGauge,
      isUpdating: false,
      lastComponentId: null, // 记录上一次处理的组件ID，用于避免重复初始化
      lineOptions: {
        series: [],
        xAxis: {
          type: 'category',
          data: []
        }
      },
      xAxisData: [] // X轴数据单独存储，方便操作
    }
  },
  computed: {
    // 获取当前活动数据
    activeData() {
      return this.componentData;
    },
    // 获取组件ID，用于唯一标识当前编辑的组件
    // componentId() {
    //   return this.activeData?.id || '';
    // }
  },
  watch: {
    propsdatalocal1: {
      handler(val) {
        if (this.isUpdating) return;
        
        this.isUpdating = true;
        
        try {
          // 使用新的方法更新嵌套属性
          this.updateChartOptions(val);
          
          // 更新组件数据
          if (this.activeData && this.activeData.renderdata) {
            // 确保legend.data也被正确更新
            this.ensureLegendDataSync();
            
            // 深拷贝以避免引用问题
            this.activeData.renderdata.chartOptions = deepClone(this.lineOptions);
            
            // 发出配置变更事件
            this.$emit('config-change', deepClone(this.lineOptions));
          }
        } finally {
          this.$nextTick(() => {
            this.isUpdating = false;
          });
        }
      },
      deep: true
    },
    // componentId: {
    //   handler(newId, oldId) {
    //     if (newId && newId !== this.lastComponentId) {
    //       this.lastComponentId = newId;
    //       this.initializeData();
    //     }
    //   },
    //   immediate: true
    // }
    componentData: {
      handler(val) {
        if (!this.isUpdating) {
          this.initializeData();
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.initializeData();
  },
  methods: {
    // 添加新的折线系列
    addSeries() {
      if (!this.lineOptions.series) {
        this.$set(this.lineOptions, 'series', []);
      }
      
      // 生成随机颜色
      const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      
      // 创建新系列
      const newSeriesIndex = this.lineOptions.series.length + 1;
      const newSeries = {
        name: `系列${newSeriesIndex}`,
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
          color: randomColor
        }
      };
      
      // 添加到系列集合
      this.lineOptions.series.push(newSeries);
      this.handleSeriesChange();
    },
    
    // 移除折线系列
    removeSeries(seriesIndex) {
      if (this.lineOptions.series && 
          seriesIndex >= 0 && 
          seriesIndex < this.lineOptions.series.length) {
        this.lineOptions.series.splice(seriesIndex, 1);
        this.handleSeriesChange();
      }
    },
    
    // 添加数据点
    addDataPoint(seriesIndex) {
      if (this.lineOptions.series && 
          seriesIndex >= 0 && 
          seriesIndex < this.lineOptions.series.length) {
        
        if (!this.lineOptions.series[seriesIndex].data) {
          this.$set(this.lineOptions.series[seriesIndex], 'data', []);
        }
        
        // 添加默认值为随机数
        const randomValue = Math.floor(Math.random() * 200) + 50;
        this.lineOptions.series[seriesIndex].data.push(randomValue);
        this.handleSeriesChange();
      }
    },
    
    // 移除数据点
    removeDataPoint(seriesIndex, pointIndex) {
      if (this.lineOptions.series && 
          seriesIndex >= 0 && 
          seriesIndex < this.lineOptions.series.length &&
          this.lineOptions.series[seriesIndex].data &&
          pointIndex >= 0 &&
          pointIndex < this.lineOptions.series[seriesIndex].data.length) {
        
        this.lineOptions.series[seriesIndex].data.splice(pointIndex, 1);
        this.handleSeriesChange();
      }
    },
    
    // 添加X轴数据项
    addXAxisItem() {
      // 确保xAxisData已初始化
      if (!this.xAxisData) {
        this.xAxisData = [];
      }
      
      // 获取下一个索引作为默认值
      const newIndex = this.xAxisData.length + 1;
      this.xAxisData.push(`类别${newIndex}`);
      
      // 更新图表选项
      this.handleXAxisChange();
    },
    
    // 移除X轴数据项
    removeXAxisItem(index) {
      if (this.xAxisData && index >= 0 && index < this.xAxisData.length) {
        this.xAxisData.splice(index, 1);
        this.handleXAxisChange();
      }
    },
    
    // 处理X轴数据变化
    handleXAxisChange() {
      // 确保xAxis存在
      if (!this.lineOptions.xAxis) {
        this.$set(this.lineOptions, 'xAxis', {
          type: 'category',
          data: []
        });
      }
      
      // 更新xAxis.data
      this.lineOptions.xAxis.data = deepClone(this.xAxisData);
      
      // 确保组件数据更新
      if (this.activeData && this.activeData.renderdata) {
        this.activeData.renderdata.chartOptions = deepClone(this.lineOptions);
      }
    },
    
    // 处理系列数据变化
    handleSeriesChange() {
      // 更新图例数据
      this.ensureLegendDataSync();
      
      // 确保组件数据更新
      if (this.activeData && this.activeData.renderdata) {
        this.activeData.renderdata.chartOptions = deepClone(this.lineOptions);
      }
    },
    
    // 确保legend.data与series中的name保持同步
    ensureLegendDataSync() {
      if (!this.lineOptions.series || !this.lineOptions.series.length) return;
      
      if (!this.lineOptions.legend) this.lineOptions.legend = {};
      if (!this.lineOptions.legend.data || !Array.isArray(this.lineOptions.legend.data)) {
        this.lineOptions.legend.data = [];
      }
      
      // 从series中提取所有名称
      const seriesNames = this.lineOptions.series.map(item => item.name || '');
      
      // 更新legend.data
      this.lineOptions.legend.data = seriesNames;
    },
    
    // 根据点路径设置对象中的值
    setNestedValue(obj, path, value) {
      // 对于数组索引格式: 'series[0].data[0].value'
      const arrayPattern = /(\w+)\[(\d+)\]/g;
      const parts = path.replace(arrayPattern, '$1.$2').split('.');
      
      let current = obj;
      
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        // 确保路径上的对象存在
        if (current[key] === undefined) {
          // 如果下一部分是数字，则创建数组，否则创建对象
          current[key] = !isNaN(parts[i + 1]) ? [] : {};
        }
        current = current[key];
      }
      
      const lastKey = parts[parts.length - 1];
      current[lastKey] = value;
    },
    
    // 根据点路径获取对象中的值
    getNestedValue(obj, path) {
      // 对于数组索引格式: 'series[0].data[0].value'
      const arrayPattern = /(\w+)\[(\d+)\]/g;
      const parts = path.replace(arrayPattern, '$1.$2').split('.');
      
      let current = obj;
      
      for (const part of parts) {
        if (current === undefined || current === null) {
          return undefined;
        }
        current = current[part];
      }
      
      return current;
    },
    
    // 更新图表配置选项
    updateChartOptions(formValues) {
      // 遍历所有表单值，将其应用到图表选项中
      for (const key in formValues) {
        if (Object.prototype.hasOwnProperty.call(formValues, key)) {
          this.setNestedValue(this.lineOptions, key, formValues[key]);
        }
      }
    },
    
    // 初始化数据
    initializeData() {
      try {
        this.isUpdating = true;
        
        // 从组件数据中获取折线图配置
        if (this.activeData && this.activeData.renderdata && this.activeData.renderdata.chartOptions) {
          const chartOptions = this.activeData.renderdata.chartOptions;
          
          // 深拷贝避免直接引用
          this.lineOptions = deepClone(chartOptions);
          
          // 初始化X轴数据
          if (this.lineOptions.xAxis && this.lineOptions.xAxis.data) {
            this.xAxisData = deepClone(this.lineOptions.xAxis.data);
          } else {
            this.xAxisData = [];
          }
          
          // 确保系列数据存在
          if (!this.lineOptions.series || !Array.isArray(this.lineOptions.series)) {
            this.lineOptions.series = [];
          }
          
          // 确保每个系列都有itemStyle
          this.lineOptions.series.forEach(series => {
            if (!series.itemStyle) {
              this.$set(series, 'itemStyle', { color: '#5470c6' });
            }
          });
          
          // 确保legend.data与series的name保持同步
          this.ensureLegendDataSync();
          
          // 初始化表单数据
          this.initFormData();
        } else {
          // 如果没有现有配置，创建默认配置
          this.createDefaultChartOptions();
        }
      } catch (error) {
        console.error('初始化折线图配置数据失败:', error);
      } finally {
        this.$nextTick(() => {
          this.isUpdating = false;
        });
      }
    },
    
    // 创建默认的图表配置
    createDefaultChartOptions() {
      // 默认的X轴数据
      this.xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      // 默认配置
      this.lineOptions = {
        title: {
          text: '折线图示例'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['系列1']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '系列1',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210],
            itemStyle: {
              color: '#5470c6'
            }
          }
        ]
      };
      
      // 更新组件数据
      if (this.activeData && this.activeData.renderdata) {
        this.activeData.renderdata.chartOptions = deepClone(this.lineOptions);
      }
    },
    
    // 初始化表单数据
    initFormData() {
      // 从renderDataGauge中获取所有配置项
      const formItems = this.renderDataGauge.itemRenderList || [];
      
      // 清空当前表单数据
      this.propsdatalocal1 = {};
      
      // 遍历所有表单项
      formItems.forEach(item => {
        if (item.__element__ && item.__element__.key) {
          const key = item.__element__.key;
          const value = this.getNestedValue(this.lineOptions, key);
          
          // 如果在图表选项中找到了对应的值，则使用它，否则使用默认值
          if (value !== undefined) {
            this.$set(this.propsdatalocal1, key, value);
          } else {
            this.$set(this.propsdatalocal1, key, item.__element__.value);
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.line-data-editor {
  padding: 10px 0;
  
  .series-item {
    margin-bottom: 15px;
    border: 1px solid #EBEEF5;
    border-radius: 4px;
    padding: 10px;
    background-color: #FAFAFA;
    
    .series-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      
      .name-input {
        flex: 1;
        margin-right: 10px;
      }
      
      .color-picker {
        margin-right: 10px;
      }
      
      .series-line-icon {
        font-size: 16px;
        color: #909399;
        margin: 0 5px;
        
        i {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
    
    .data-points-container {
      background-color: #fff;
      border: 1px solid #EBEEF5;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 10px;
      
      .data-points-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        font-weight: bold;
      }
      
      .data-points-list {
        .data-point-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          
          .point-index {
            width: 30px;
            text-align: right;
            margin-right: 10px;
            color: #606266;
          }
          
          .value-input {
            flex: 1;
          }
          
          .data-line-icon {
            margin-left: 10px;
            color: #909399;
            cursor: pointer;
            
            &:hover {
              color: #F56C6C;
            }
          }
        }
      }
    }
  }
  
  .x-axis-data {
    background-color: #FAFAFA;
    border: 1px solid #EBEEF5;
    border-radius: 4px;
    padding: 10px;
    
    .x-axis-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      .point-index {
        width: 30px;
        text-align: right;
        margin-right: 10px;
        color: #606266;
      }
      
      .value-input {
        flex: 1;
      }
      
      .data-line-icon {
        margin-left: 10px;
        color: #909399;
        cursor: pointer;
        
        &:hover {
          color: #F56C6C;
        }
      }
    }
  }
  
  .empty-data-hint {
    color: #909399;
    padding: 10px;
    text-align: center;
    
    i {
      margin-right: 5px;
    }
  }
  
  .close-btn {
    cursor: pointer;
    
    &:hover {
      color: #F56C6C;
    }
  }
}
</style>
 