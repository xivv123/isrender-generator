<template>
  <magicbox-form-core v-model="propsdatalocal1" :renderdata="renderDataGauge" />
</template>

<script>
import renderDataGauge from '@/config/create-data/echarts/gauge-ele'
// import MagicboxFormCore from '@/components/is-render-core/form-core.vue'
import {deepClone} from '@/components/is-render-core/utils/index.js'

export default {
  name: 'echartGaugeConfig',
  props: {
    componentData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      propsdatalocal1: {},
      renderDataGauge: renderDataGauge,
      isUpdating: false,

      gaugeOptions: {
        // title: { text: '业务完成率2', left: 'center' },
        // tooltip: { formatter: '{a} <br/>{b} : {c}%' },
        // series: [{
        //   name: '完成情况',
        //   type: 'gauge',
        //   radius: '80%',
        //   min: 0,
        //   max: 100,
        //   data: [{ value: 71, name: '完成率' }],
        //   progress: { show: true, width: 18 },
        //   axisTick: { show: false },
        //   detail: { formatter: '{value}%', fontSize: 30 }
        // }],
        // animationDuration: 1000,
        // animationEasing: 'cubicOut'
      }
    }
  },
  computed: {
    isGaugeComponent() {
      // 检查组件是否是仪表盘组件
      const tag = this.componentData?.__element__?.tag || '';
      // console.log('组件完整数据:', this.componentData);
      // 支持多种可能的仪表盘组件标签
      return tag === 'echarts_gauge_chart' || 
             tag === 'echarts-gauge-chart' || 
             tag === 'gauge_chart' || 
             tag === 'gauge-chart' ||
             (tag === 'div' && this.componentData?.__element__?.key === 'echarts_gauge_chart');
    },
    // 获取当前活动数据
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
          // 使用新的方法更新嵌套属性
          this.updateChartOptions(val);
          
          // 更新组件数据
          if (this.activeData && this.activeData.renderdata) {
            this.activeData.renderdata.chartOptions = deepClone(this.gaugeOptions);
            // this.$emit('config-change', val);
          }
        } finally {
          this.$nextTick(() => {
            this.isUpdating = false;
          });
        }
      },
      // immediate: true,
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
          this.setNestedValue(this.gaugeOptions, key, formValues[key]);
        }
      }
    },
    
    // 初始化数据
    initializeData() {
      try {
        if (!this.isGaugeComponent) return;
        
        this.isUpdating = true;
        // 从组件数据中获取仪表盘配置
        if (this.activeData.renderdata && this.activeData.renderdata.chartOptions) {
          const chartOptions = this.activeData.renderdata.chartOptions;
          
          // 深拷贝避免直接引用
          this.gaugeOptions = deepClone(chartOptions);
          
          // 初始化表单数据
          this.initFormData();
        }
      } catch (error) {
        console.error('初始化仪表盘配置数据失败:', error);
      } finally {
        this.$nextTick(() => {
          this.isUpdating = false;
        });
      }
    },
    
    // 初始化表单数据
    initFormData() {
      // 从renderDataGauge中获取所有配置项
      const formItems = this.renderDataGauge.itemRenderList || [];
      
      // 清空当前表单数据
      // this.propsdatalocal1 = {};
      
      // 遍历所有表单项
      formItems.forEach(item => {
        if (item.__element__ && item.__element__.key) {
          const key = item.__element__.key;
          const value = this.getNestedValue(this.gaugeOptions, key);
          
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
 