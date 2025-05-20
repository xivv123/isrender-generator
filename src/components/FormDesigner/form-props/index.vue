<template>
  <div class="form-props-container" @wheel.stop :class="{ 'collapsed': isCollapsed, 'minimized': isMinimized }">
    <!-- 右上角最小化按钮 -->
    <div class="minimize-btn" @click.stop="toggleMinimize">
      <i :class="isMinimized ? 'el-icon-full-screen' : 'el-icon-minus'"></i>
    </div>

    <div class="props-wrapper">
      <!-- 画布属性 -->
      <template v-if="propList.type === 'canvas'">
        <div class="props-header">
          <i class="el-icon-document"></i>
          <span>画布属性</span>
        </div>
        <div class="props-content">
          <magicbox-form-core v-model="propsdatalocal" :renderdata="renderDataCanvas" />
        </div>
      </template>

      <!-- 表单属性 -->
      <template v-else-if="propList.type === 'form'">
        <div class="props-header">
          <i class="el-icon-tickets"></i>
          <span>表单属性</span>
        </div>
        <div class="props-content">
          <magicbox-form-core v-model="propsdatalocal" :renderdata="renderData" />
        </div>
      </template>

      <!-- 组件属性 -->
      <template v-else-if="propList.type === 'component'">
        <div class="props-header">
          <i class="el-icon-edit-outline"></i>
          <span>组件属性</span>
        </div>
        <div class="props-content">

          <!-- 根据数组动态渲染配置组件 -->
          <!-- label配置 -->
          <label-config v-if="shouldShowConfig('label')" :component-data="activeComponent"/>
          
          <!-- 默认值配置 -->
          <el-divider v-if="shouldShowConfig('value')">元素默认值配置</el-divider>
          <magicbox-form-core v-if="shouldShowConfig('value')" v-model="propsdatalocal" :renderdata="renderDataValue">
            <value-editor slot="defultValue" :current-item="currentComponent" :form-conf="formConf" v-model="propsdatalocal.value"/>
          </magicbox-form-core>
          
          <!-- 输入框配置 -->
          <input-config v-if="shouldShowConfig('input')" :component-data="activeComponent" @options-change="handleOptionsChange"/>
          
          <!-- 数字输入框配置 -->
          <number-input-config v-if="shouldShowConfig('number-input')" :component-data="activeComponent"/>

          <!-- 选择框配置 -->
          <select-config v-if="shouldShowConfig('select')" :component-data="activeComponent"/>

          <!-- slot 配置 -->
          <slot-config-dialog v-if="shouldShowConfig('slot')" :component-data="activeComponent" @options-change="handleOptionsChange"/>

          <!-- regrule配置 -->
          <regrule-config v-if="shouldShowConfig('regrule')" :component-data="activeComponent"/>

          <!-- 根据当前图表类型动态显示对应的配置组件 -->
          <component 
            :is="chartConfigComponent" 
            :component-data="activeComponent"
            @config-change="handleChartConfigChange"
          />

        </div>
      </template>

      <!-- 未选中任何对象时的提示 -->
      <div v-else class="empty-props">
        <i class="el-icon-edit"></i>
        <span>请选择画布、表单或组件进行编辑</span>
      </div>
    </div>
    
    <!-- 使用图标选择器组件 -->
    <!-- <icon-selector 
      v-model="iconDialogVisible"
      :initialIcon="selectedIcon"
      @select="handleIconSelect"
      @confirm="handleIconConfirm"
      @cancel="handleIconCancel"
    /> -->
    
    <!-- 使用Slot配置对话框组件 -->
    <!-- <slot-config-dialog
      :visible.sync="slotConfigVisible"
      :component-data="activeComponent"
      @save="handleSlotConfigSave"
    /> -->

    <!-- <div class="slot-config-wrapper">
      <slot-config-dialog
        v-if="showSlotConfig"
        :component-data="slotConfigComponent"
        @save="handleSlotConfigSave"
        @options-change="handleOptionsChange"
      />
    </div> -->

    <!-- 事件配置组件 -->
    <!-- <div class="event-config-wrapper">
      <event-config-dialog
        v-if="showEventConfig"
        :component-data="slotConfigComponent"
        @events-change="handleEventsChange"
      />
    </div> -->
  </div>
</template>

<script>
import MagicboxFormCore from '@/components/is-render-core/form-core.vue'
import IconSelector from './icon.vue'
// import ValueEditor from './ValueEditor.vue'
import SlotConfigDialog from './components/ele-base-slot.vue'

import EventConfigDialog from '../components/EventConfigDialog.vue'
import PieConfig from './components/echart-pie.vue'
import GaugeConfig from './components/echart-gauge.vue'
import LineConfig from './components/echart-line.vue'
import labelConfig from './components/ele-base-label.vue'
import regruleConfig from './components/ele-base-regrule.vue'
import inputConfig from './components/ele-input.vue'
import numberInputConfig from './components/ele-number-input.vue'
import selectConfig from './components/ele-select.vue'

import ValueEditor from './components/ele-base-value.vue'

// 表单属性渲染数据
import renderData from '@/config/create-data/form-attributes-data'
// 画布数据渲染
import renderDataCanvas from '@/config/create-data/canvas-attributes-data'
import renderDataLabel from '@/config/create-data/label-attributes-data'
import renderDataValue from '@/config/create-data/value-attributes-data'
import renderDataRegrule from '@/config/create-data/regrule-attributes-data'
import renderDataConfig from '@/config/create-data/config-attributes-data'
import renderDataInputEle from '@/config/create-data/input/input-ele'

import {deepClone} from '@/components/is-render-core/utils/index.js'

// 默认值编辑器的基础配置模板
const defaultValueEditorTemplate = {
  __config__: {
    layout: 'colFormItem',
    span: 24,
  },
  __label__: {
    label: '元素默认值',
    showLabel: true,
  },
  __element__: {
    key: 'value',
    // 其他属性将从原始组件复制
  },
  __regrule__: {
    required: false
  }
};



export default {
  components: { 
    MagicboxFormCore,
    IconSelector,
    ValueEditor,
    SlotConfigDialog,
    EventConfigDialog,
    GaugeConfig,
    LineConfig,
    PieConfig,
    labelConfig,
    regruleConfig,
    inputConfig,
    selectConfig,
    numberInputConfig
  },
  props: {
    propList:{
      type: Object,
      default: () => {}
    },
    propsdata:{
      type: Object,
      default: () => {}
    },
    activepropdataId:{
      type: String,
    },
    
  },
  
  data() {
    return {
      propsdatalocal: {},
      renderData: renderData, // 渲染表单数据
      renderDataCanvas: renderDataCanvas, // 渲染表单数据
      // renderDataLabel: renderDataLabel, // 渲染label 数据
      // renderDataRegrule: renderDataRegrule, // 校验规则渲染
      // renderDataInputEle: renderDataInputEle, 
      // renderDataConfig: renderDataConfig, // 配置属性渲染
      // mergedRenderData: mergeRenderData(renderDataLabel, renderDataRegrule, renderDataInputEle, renderDataConfig), // 合并后的渲染数据
      renderDataValue,
      isMinimized: false,
      isCollapsed: false,
      iconDialogVisible: false,
      selectedIcon: '',
      eleTag: '',
      elePlaceholder:'',
      currentIconType: '', // 记录当前正在编辑的图标类型
      currentComponent: {}, // 当前编辑的组件配置
      // 表单全局配置
      formConf: {
        size: 'medium',
        labelPosition: 'top',
        labelWidth: 90,
        disabled: false,
        itemSpacing: 15
      },
      slotConfigVisible: false, // 控制Slot配置弹窗的可见性
      showSlotConfig: false,
      showEventConfig: false,
      slotConfigComponent: {},
    }
  },
  computed: {
    // 从propList.component中获取当前活动的组件数据
    activeComponent() {
      if (this.propList && this.propList.component && this.activepropdataId) {
        return this.propList.component[this.activepropdataId] || null;
      }
      return null;
    },
    
    // 判断当前活动组件的图表类型
    chartType() {
      if (!this.activeComponent) return '';
      
      const tag = this.activeComponent?.__element__?.tag || '';
      const key = this.activeComponent?.__element__?.key || '';
      
      // 判断是否为仪表盘组件
      if (tag === 'echarts_gauge_chart' || tag === 'echarts-gauge-chart' || 
          tag === 'gauge_chart' || tag === 'gauge-chart' ||
          (tag === 'div' && key === 'echarts_gauge_chart')) {
        return 'gauge';
      }
      
      // 判断是否为折线图组件
      if (tag === 'echarts_line_chart' || tag === 'echarts-line-chart' || 
          tag === 'line_chart' || tag === 'line-chart' ||
          (tag === 'div' && key === 'echarts_line_chart')) {
        return 'line';
      }
      
      // 判断是否为饼图组件
      if (tag === 'echarts_pie_chart' || tag === 'echarts-pie-chart' || 
          tag === 'pie_chart' || tag === 'pie-chart' ||
          (tag === 'div' && key === 'echarts_pie_chart')) {
        return 'pie';
      }
      
      return '';
    },
    
    // 根据图表类型返回对应的配置组件
    chartConfigComponent() {
      switch (this.chartType) {
        case 'gauge':
          return 'GaugeConfig';
        case 'line':
          return 'LineConfig';
        case 'pie':
          return 'PieConfig';
        default:
          return null;
      }
    },
    
    // 根据当前激活的组件类型，决定显示哪些配置组件
    activeComponentConfigs() {
      const configs = [];
      if (!this.activeComponent) return configs;
      
      const component = this.activeComponent;
      const elementTag = component.__element__?.tag || '';
      const elementType = component.__element__?.type || '';
      
      // 检查是否有标签配置
      if (component.__label__) configs.push('label')
      // 检查是否有标签配置
      if (component.__element__.slot) configs.push('slot')
      // 检查是否有regrule配置
      if (component.__regrule__) configs.push('regrule')
      // 检查是否有默认值配置
      if (component.__element__?.value !== undefined) configs.push('value')
      
      // 根据组件类型添加特定配置
      if (elementTag === 'el-input' && elementType === 'number') {
        configs.push('number-input');
      } else if (elementTag === 'el-input') {
        configs.push('input');
      }   else if (elementTag === 'el-select' || elementTag === 'el-radio-group' || elementTag === 'el-checkbox-group') {
        configs.push('select');
      }
      
      return configs;
    }
  },
  methods: {

    toggleMinimize() {
      this.isMinimized = !this.isMinimized;
      if (this.isMinimized) {
        this.isCollapsed = false; // 如果最小化，取消收缩状态
      }
      this.$emit('toggle-minimize', this.isMinimized);
    },

    // 创建默认值编辑组件的配置
    createDefaultValueConf(item) {
      // 从模板创建配置
      const template = deepClone(defaultValueEditorTemplate);
      
      // 从原始组件复制关键属性
      if (item.__element__) {
        // 复制必要的属性
        template.__element__.tag = item.__element__.tag;
        template.__element__.placeholder = item.__element__.placeholder || '请输入默认值';
        template.__element__.value = item.renderdata.value;
        
        // 复制其他可能需要的属性
        template.__element__.type = item.__element__.type;
        template.__element__.clearable = item.__element__.clearable;
        
        // 复制选项（如el-select需要）
        if (item.__element__.slot && item.__element__.slot.options) {
          template.__element__.slot = { options: item.__element__.slot.options };
        }
      }
      
      // 设置当前组件并同步值
      this.currentComponent = template;
      
      // 同步值到propsdatalocal
      if (item.__element__ && item.__element__.value !== undefined) {
        this.$set(this.propsdatalocal, 'value', item.__element__.value);
      }
    },

    // 处理选项变化
    handleOptionsChange(updatedComponent) {
      console.log('选项已更新:', updatedComponent);
      // 更新组件数据
      if (updatedComponent && updatedComponent.__element__ && updatedComponent.__element__.slot) {
        // 检查是否有渲染数据
        if (!updatedComponent.renderdata) {
          updatedComponent.renderdata = {};
        }
        
        // 确保renderdata中的slot与__element__中的slot保持一致
        if (!updatedComponent.renderdata.slot) {
          updatedComponent.renderdata.slot = {};
        }
        
        // 同步选项数据
        if (updatedComponent.__element__.slot.options) {
          updatedComponent.renderdata.slot.options = updatedComponent.__element__.slot.options;
        }
        
        // 同步折叠面板数据
        if (updatedComponent.__element__.slot.default) {
          updatedComponent.renderdata.slot.default = updatedComponent.__element__.slot.default;
        }
        
        // 发送更新事件
        this.$emit('updatePropList', updatedComponent, 'component');
      }
    },

    // 处理事件变化
    handleEventsChange(updatedComponent) {
      console.log('事件已更新:', updatedComponent);
      // 处理从EventConfigDialog组件发出的事件更新
      if (updatedComponent && updatedComponent.__element__ && updatedComponent.__element__.on) {
        // 发送更新事件
        this.$emit('updatePropList', updatedComponent, 'component');
      }
    },

    // 统一处理图表配置变化
    handleChartConfigChange(updatedComponent) {
      console.log(`${this.chartType}图表配置已更新:`, updatedComponent);
      // 发送更新事件
      this.$emit('updatePropList', updatedComponent, 'component');
    },

    shouldShowConfig(configType) {
      return this.activeComponentConfigs.includes(configType);
    }
  },
  watch:{
    // 监听默认值变化，同步到原始组件
    'propsdatalocal.value': function(newVal) {
      // 同步到原始组件
      if (this.activepropdataId && this.propList.component && this.propList.component[this.activepropdataId]) {
        const component = this.propList.component[this.activepropdataId];
        if (component.__element__) {
          component.__element__.value = newVal;
        }
        if (component.renderdata) {
          component.renderdata.value = newVal;
        }
      }
    },
    
    propsdatalocal: {
      handler(n) {
        this.$emit('updatePropList', n, this.propList.type)
       },
      deep: true
    },
    
    propList: {
      handler(newVal) {
        const type = newVal['type']
        const item = newVal.component[this.activepropdataId]

        if (type === "component") {
          // 先清空 propsdatalocal，保持响应式
          // Object.keys(this.propsdatalocal).forEach(key => {this.$delete(this.propsdatalocal, key)})
          // 将组件的属性设置到 propsdatalocal
          if ( newVal.component && this.activepropdataId && item && item['renderdata']) {
            // this.eleTag = item.__element__.tag
            
            // 创建默认值编辑组件的配置
            this.createDefaultValueConf(item)
            
            const renderdata = item['renderdata']
            Object.keys(renderdata).forEach(key => {
              this.$set(this.propsdatalocal, key, renderdata[key])
            })
          }
        } else {
          // 处理其他类型的属性
          if (newVal[type]) {
            Object.keys(newVal[type]).forEach(key => {
              // 只有当属性值不同时才更新，避免不必要的重新渲染
              if (JSON.stringify(this.propsdatalocal[key]) !== JSON.stringify(newVal[type][key])) {
                this.$set(this.propsdatalocal, key, newVal[type][key]);
              }
            })
          }
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './style/index.scss';

  // 添加选项配置样式
  .slot-config-wrapper {
    margin-top: 5px;
  }

  // 添加事件配置样式
  .event-config-wrapper {
    margin-top: 15px;
  }
</style>
