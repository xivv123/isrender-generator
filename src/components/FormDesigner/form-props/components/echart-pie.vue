<template>
  <div>
    <el-divider>饼状图配置</el-divider>
    <isRender v-model="propsdatalocal1" :renderdata="renderDataPie">
      <div slot="defultValue" class="pie-data-editor">
        <div v-for="(item, index) in pieOptions.series[0].data" :key="index" class="data-item">
          <el-input 
            v-model="item.name" 
            placeholder="名称" 
            size="small" 
            @input="handleDataChange" 
            class="name-input"
          />
          <el-input-number
            v-model="item.value"
            placeholder="数值"
            size="small"
            :min="0"
            :step="1"
            @change="handleDataChange"
            class="value-input"
          />
          <div class="close-btn data-line-icon" @click="removeDataItem(index)">
            <i class="el-icon-delete" />
          </div>
        </div>
        <div style="margin: 10px 0 15px 0;">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="addDataItem"
          >
            添加数据项
          </el-button>
        </div>
      </div>
    </isRender>
  </div>
</template>

<script>
import renderDataPie from '@/config/create-data/echarts/pie-ele'
import {deepClone} from '@/components/is-render-core/utils/index.js'

export default {
  name: 'echartPie',
  props: {
    componentData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      propsdatalocal1: {},
      renderDataPie,
      isUpdating: false,
      pieOptions: {
        series: [{ data: [] }]
      }
    }
  },
  computed: {
    activeData() {
      return this.componentData;
    }
  },
  watch: {
    propsdatalocal1: {
      handler(val) {
        if (this.isUpdating) return;
        this.isUpdating = true;
        
        try {
          this.updateChartOptions(val);
          if (this.activeData && this.activeData.renderdata) {
            this.activeData.renderdata.chartOptions = deepClone(this.pieOptions);
            this.syncLegendData();
          }
        } finally {
          this.$nextTick(() => {
            this.isUpdating = false;
          });
        }
      },
      deep: true
    },
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
    setNestedValue(obj, path, value) {
      const arrayPattern = /(\w+)\[(\d+)\]/g;
      const parts = path.replace(arrayPattern, '$1.$2').split('.');
      
      let current = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (current[key] === undefined) {
          current[key] = !isNaN(parts[i + 1]) ? [] : {};
        }
        current = current[key];
      }
      
      const lastKey = parts[parts.length - 1];
      current[lastKey] = value;
    },
    
    getNestedValue(obj, path) {
      const arrayPattern = /(\w+)\[(\d+)\]/g;
      const parts = path.replace(arrayPattern, '$1.$2').split('.');
      
      let current = obj;
      for (const part of parts) {
        if (current === undefined || current === null) return undefined;
        current = current[part];
      }
      
      return current;
    },
    
    updateChartOptions(formValues) {
      for (const key in formValues) {
        if (Object.prototype.hasOwnProperty.call(formValues, key)) {
          if (key === 'chart_type') {
            continue;
          } else if (key === 'series[0].radius_outer' || key === 'series[0].radius_inner') {
            this.updateChartRadius(formValues);
          } else {
            this.setNestedValue(this.pieOptions, key, formValues[key]);
          }
        }
      }
    },
    
    updateChartRadius(formValues) {
      const chartType = formValues['chart_type'] || 'pie';
      const outerRadius = formValues['series[0].radius_outer'] || 70;
      const innerRadius = formValues['series[0].radius_inner'] || 40;
      
      if (chartType === 'pie') {
        this.setNestedValue(this.pieOptions, 'series[0].radius', `${outerRadius}%`);
      } else if (chartType === 'ring') {
        this.setNestedValue(this.pieOptions, 'series[0].radius', [`${innerRadius}%`, `${outerRadius}%`]);
      }
    },
    
    syncLegendData() {
      if (!this.pieOptions.series || !this.pieOptions.series.length || !this.pieOptions.series[0].data) return;
      
      if (!this.pieOptions.legend) this.pieOptions.legend = {};
      if (!this.pieOptions.legend.data) this.pieOptions.legend.data = [];
      
      const dataNames = this.pieOptions.series[0].data.map(item => item.name || '');
      this.pieOptions.legend.data = dataNames;
    },
    
    initializeData() {
      try {
        this.isUpdating = true;
        
        if (this.activeData && this.activeData.renderdata && this.activeData.renderdata.chartOptions) {
          const chartOptions = this.activeData.renderdata.chartOptions;
          this.pieOptions = deepClone(chartOptions);
          
          if (this.pieOptions.series && this.pieOptions.series[0] && this.pieOptions.series[0].radius) {
            const radius = this.pieOptions.series[0].radius;
            
            if (Array.isArray(radius)) {
              this.$set(this.propsdatalocal1, 'chart_type', 'ring');
              
              const innerRadius = parseInt(radius[0]) || 40;
              const outerRadius = parseInt(radius[1]) || 70;
              
              this.$set(this.propsdatalocal1, 'series[0].radius_inner', innerRadius);
              this.$set(this.propsdatalocal1, 'series[0].radius_outer', outerRadius);
            } else {
              this.$set(this.propsdatalocal1, 'chart_type', 'pie');
              
              const outerRadius = parseInt(radius) || 70;
              this.$set(this.propsdatalocal1, 'series[0].radius_outer', outerRadius);
            }
          }
          
          this.initFormData();
        }
      } catch (error) {
        console.error('初始化饼图配置数据失败:', error);
      } finally {
        this.$nextTick(() => {
          this.isUpdating = false;
        });
      }
    },
    
    initFormData() {
      const formItems = this.renderDataPie.itemRenderList || [];
      
      formItems.forEach(item => {
        if (item.__element__ && item.__element__.key) {
          const key = item.__element__.key;
          const value = this.getNestedValue(this.pieOptions, key);
          
          if (value !== undefined) {
            this.$set(this.propsdatalocal1, key, value);
          } else if (item.__element__.value !== undefined) {
            this.$set(this.propsdatalocal1, key, item.__element__.value);
          }
        }
      });
    },
    
    addDataItem() {
      if (!this.pieOptions.series) {
        this.$set(this.pieOptions, 'series', [{ type: 'pie', data: [] }]);
      }
      
      if (!this.pieOptions.series[0]) {
        this.$set(this.pieOptions.series, 0, { type: 'pie', data: [] });
      }
      
      if (!this.pieOptions.series[0].data) {
        this.$set(this.pieOptions.series[0], 'data', []);
      }
      
      const newIndex = this.pieOptions.series[0].data.length + 1;
      const newItem = {
        name: `数据项${newIndex}`,
        value: 100
      };
      
      this.pieOptions.series[0].data.push(newItem);
      this.handleDataChange();
    },
    
    removeDataItem(index) {
      if (this.pieOptions.series && 
          this.pieOptions.series[0] && 
          this.pieOptions.series[0].data &&
          index >= 0 && 
          index < this.pieOptions.series[0].data.length) {
        this.pieOptions.series[0].data.splice(index, 1);
        this.handleDataChange();
      }
    },
    
    handleDataChange() {
      this.syncLegendData();
      
      if (this.activeData && this.activeData.renderdata) {
        this.activeData.renderdata.chartOptions = deepClone(this.pieOptions);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pie-data-editor {
  padding: 10px 0;
  
  .data-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    .name-input {
      width: 85%;
      margin-right: 10px;
    }
    
    .value-input {
      width: 15%;
      margin-right: 10px;
    }
    
    .data-line-icon {
      font-size: 16px;
      color: #909399;
      margin: 0 5px;
      
      i {
        display: inline-block;
        vertical-align: middle;
      }
    }
    
    .close-btn {
      cursor: pointer;
      
      &:hover {
        color: #F56C6C;
      }
    }
  }
}
</style>
 