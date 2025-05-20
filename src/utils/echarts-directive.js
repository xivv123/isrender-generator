/**
 * ECharts指令 - 用于在表单中渲染ECharts图表
 * 使用方法: v-echart="chartOptions"
 */
import * as echarts from 'echarts';
import { debounce } from 'lodash-es';

// 存储所有图表实例，用于窗口大小变化时更新
const chartInstances = new WeakMap();
// 存储组件ID到元素的映射，用于通过ID查找图表实例
const idToElementMap = new Map();

// 处理窗口大小变化时的图表调整
const resizeHandler = debounce(() => {
  chartInstances.forEach((instance, el) => {
    if (instance && instance.resize) {
      instance.resize();
    }
  });
}, 100);

// 当窗口大小变化时调整所有图表
window.addEventListener('resize', resizeHandler);

export default {
  // 安装方法，供Vue.use()调用
  install(Vue) {
    // 注册全局指令
    Vue.directive('echart', {
      // 当元素被插入到DOM中时
      inserted(el, binding, vnode) {
        // 添加组件ID支持
        const componentId = binding.value?.id || vnode.key || el.getAttribute('id');
        if (componentId) {
          // 如果没有id属性，则添加
          if (!el.id) {
            el.id = componentId;
          }
          // 保存ID到元素的映射
          idToElementMap.set(componentId, el);
        }
        
        // 初始化图表
        initChart(el, binding, vnode);
      },
      // 当组件更新时
      update(el, binding, vnode) {
        // 如果配置变了，更新图表
        updateChart(el, binding, vnode);
      },
      // 当元素解绑时
      unbind(el) {
        // 移除ID映射
        idToElementMap.forEach((element, id) => {
          if (element === el) {
            idToElementMap.delete(id);
          }
        });
        
        // 销毁图表实例
        disposeChart(el);
      }
    });
    
    // 添加全局方法，通过ID更新图表
    Vue.prototype.$updateChartById = function(id, options) {
      const el = idToElementMap.get(id);
      if (!el) {
        console.warn(`ID为${id}的图表元素不存在`);
        return false;
      }
      
      const chart = chartInstances.get(el);
      if (!chart) {
        console.warn(`ID为${id}的图表实例不存在`);
        return false;
      }
      
      try {
        chart.setOption(options, true);
        console.log(`成功更新ID为${id}的图表`);
        return true;
      } catch (error) {
        console.error(`更新ID为${id}的图表失败:`, error);
        return false;
      }
    };
  }
};

/**
 * 初始化图表
 * @param {HTMLElement} el - 图表容器元素
 * @param {Object} binding - Vue指令绑定对象
 * @param {VNode} vnode - 虚拟节点
 */
function initChart(el, binding, vnode) {
  // 确保容器有高度
  if (!el.style.height) {
    el.style.height = '300px';
  }

  // 获取图表配置
  const options = getChartOptions(binding, vnode);
  if (!options) return;

  try {
    // 检查是否已有实例
    let chart = chartInstances.get(el);
    if (!chart) {
      // 创建ECharts实例
      chart = echarts.init(el);
      // 保存实例以便后续引用
      chartInstances.set(el, chart);
      console.log('成功创建图表实例', el.id);
    }
    
    // 设置图表配置
    chart.setOption(options, true);
    
    // 绑定到Vue组件实例，方便组件内部访问
    if (vnode.context && el.id) {
      vnode.context.$refs = vnode.context.$refs || {};
      vnode.context.$refs[el.id] = chart;
    }
  } catch (error) {
    console.error('初始化图表失败:', error);
  }
}

/**
 * 更新图表
 * @param {HTMLElement} el - 图表容器元素
 * @param {Object} binding - Vue指令绑定对象
 * @param {VNode} vnode - 虚拟节点
 */
function updateChart(el, binding, vnode) {
  // 获取更新的图表配置
  const options = getChartOptions(binding, vnode);
  if (!options) return;

  try {
    // 获取现有实例或初始化新实例
    let chart = chartInstances.get(el);
    if (!chart) {
      initChart(el, binding, vnode);
      return;
    }
    
    // 更新图表配置
    chart.setOption(options, true);
    console.log('成功更新图表', el.id);
  } catch (error) {
    console.error('更新图表失败:', error);
  }
}

/**
 * 销毁图表实例
 * @param {HTMLElement} el - 图表容器元素
 */
function disposeChart(el) {
  const chart = chartInstances.get(el);
  if (chart) {
    chart.dispose();
    chartInstances.delete(el);
  }
}

/**
 * 从绑定或组件实例中获取图表配置
 * @param {Object} binding - Vue指令绑定对象
 * @param {VNode} vnode - 虚拟节点
 * @returns {Object|null} 图表配置选项
 */
function getChartOptions(binding, vnode) {
  // 1. 直接从绑定值获取chartOptions
  if (binding.value) {
    if (typeof binding.value === 'object') {
      if (binding.value.chartOptions) {
        return binding.value.chartOptions;
      }
      return binding.value;
    }
  }
  
  // 2. 尝试从组件实例中获取
  const componentInstance = vnode.context;
  if (componentInstance) {
    // 如果绑定值是字符串，则尝试从组件的formData中获取对应名称的配置
    if (typeof binding.value === 'string' && componentInstance.formData) {
      const formItem = componentInstance.formData[binding.value];
      if (formItem && formItem.chartOptions) {
        return formItem.chartOptions;
      }
    }
    
    // 从组件的renderdata.chartOptions获取
    if (binding.value && binding.value.renderdata && binding.value.renderdata.chartOptions) {
      return binding.value.renderdata.chartOptions;
    }
    
    // 从组件的chartOptions获取
    if (componentInstance.chartOptions) {
      return componentInstance.chartOptions;
    }
  }
  
  return null;
} 