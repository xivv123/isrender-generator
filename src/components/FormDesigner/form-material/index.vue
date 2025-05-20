<template>
  <div class="form-material" @wheel.stop :class="{ 'collapsed': isCollapsed, 'minimized': isMinimized }">
    <!-- 右上角最小化按钮 -->
    <div class="minimize-btn" @click="toggleMinimize">
      <i :class="isMinimized ? 'el-icon-full-screen' : 'el-icon-minus'"></i>
    </div>
    
    <!-- 最左侧垂直图标菜单 -->
    <div class="side-menu">
      <div class="menu-items">
        <div class="menu-item" :class="{ active: currentMenu === 'components' }" @click="handleMenuClick('components')">
          <i class="el-icon-menu"></i>
          <span class="menu-tooltip">组件库</span>
        </div>
      </div>
    </div>

    <!-- 组件面板 -->
    <div class="component-panel" v-show="currentMenu === 'components'">
      <div class="panel-header">组件库</div>
      <div class="panel-content">
        <!-- 遍历所有组件类别 -->
        <div v-for="(category, catIndex) in componentCategories" :key="catIndex" class="component-section">
          <div class="section-header" @click="toggleSection(category.type)">
            <i :class="expandedSections[category.type] ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
            <span>{{ category.title }}</span>
          </div>
          <div class="section-content" v-show="expandedSections[category.type]">
            <draggable 
              class="components-list" 
              :list="category.components"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }" 
              :clone="cloneComponent"
              draggable=".component-item" 
              :sort="false" 
              @end="onEnd"
            >
              <div v-for="(item, index) in category.components" :key="index" class="component-item">
                <!-- 先暂时屏蔽 -->
                <!-- <div class="component-count" v-if="getComponentCount(item.type)">
                  {{ getComponentCount(item.type) }}
                </div> -->
                <i :class="item.icon || getIconClass(item)"></i>
                <span>{{ item.label || (item.__label__ && item.__label__.label) }}</span>
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { 
  inputComponents, 
  selectComponents, 
  layoutComponents 
} from '@/config/create-data/componets-attributes-data'

import { combinationComponents } from '@/config/components'

export default {
  name: 'FormMaterial',
  components: {
    draggable
  },
  props: {
    componentCounts: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      currentMenu: 'components',
      expandedSections: {
        input: true,
        select: true,
        layout: true,
        combination: true
      },
      isCollapsed: false,
      isMinimized: false,
      componentCategories: [
        {
          type: 'input',
          title: '输入型组件',
          components: inputComponents
        },
        {
          type: 'select',
          title: '选择型组件',
          components: selectComponents
        },
        {
          type: 'layout',
          title: '布局组件',
          components: layoutComponents
        },
        {
          type: 'combination',
          title: '组合组件',
          components: combinationComponents
        }
      ]
    }
  },
  methods: {
    handleMenuClick (menu) {
      this.currentMenu = menu
    },
    toggleSection (section) {
      this.$set(this.expandedSections, section, !this.expandedSections[section])
    },
    // toggleCollapse () {
    //   this.isCollapsed = !this.isCollapsed
    // },
    toggleMinimize() {
      this.isMinimized = !this.isMinimized
      if (this.isMinimized) {
        this.isCollapsed = false // 如果最小化，取消收缩状态
      }
    },
    getIconClass(item) {
      // 从不同的配置结构中获取图标
      if (item.material && item.material.icon) {
        return `el-icon-${item.material.icon}`
      }
      return 'el-icon-document'
    },
    cloneComponent(item) {
      // 深拷贝项目以避免引用问题
      const newItem = JSON.parse(JSON.stringify(item))
      const config = newItem.__config__
      
      // 生成唯一ID
      const idGlobal = Date.now()
      
      // 确保有基本配置
      if (config) {
        // 设置formId
        config.formId = idGlobal
        // 设置渲染key确保强制渲染
        config.renderKey = `${config.formId}${+new Date()}`
        // 设置span
        config.span = config.span || 24
        
        // 根据布局类型设置不同属性
        if (config.layout === 'colFormItem') {
          // 表单项需要有模型字段名
          // newItem.__vModel__ = `field${idGlobal}`
        } else if (config.layout === 'rowFormItem') {
          // 行布局需要有组件名和子元素数组
          config.componentName = `row${idGlobal}`
          if (!Array.isArray(config.children)) {
            config.children = []
          }
          // 行布局不需要标签
          delete config.label
        }
        
        // 处理子组件
        if (Array.isArray(config.children)) {
          config.children = config.children.map(childItem => {
            // 递归处理子组件
            return this.createIdAndKey(childItem)
          })
        }
      } else {
        // 如果没有config属性，创建一个
        newItem.__config__ = {
          formId: idGlobal,
          renderKey: idGlobal,
          label: newItem.label || '组件',
          labelWidth: null,
          showLabel: true,
          required: false,
          layout: 'colFormItem',
          span: 24
        }
      }
      
      // 生成placeholder
      if (newItem.placeholder !== undefined && config) {
        newItem.placeholder = newItem.placeholder + config.label
      }
      
      // 为组件添加基本ID
      if (!newItem.id) {
        const componentType = newItem.type || (config && config.tag) || 'unknown'
        newItem.id = `${componentType}_${idGlobal}`
      }
      
      newItem.renderdata = {
        label:"",
        labelPosition: "",
        form_all_showLabel:"",
        form_all_labelWidth:""
      }

      // 如果是行组件，确保有子元素数组
      if (config && config.layout === 'rowFormItem' && !Array.isArray(config.children)) {
        config.children = []
      }
      
      return newItem
    },
    
    // 辅助方法，用于创建子组件的ID和key
    createIdAndKey(item) {
      const idGlobal = Date.now() + Math.floor(Math.random() * 10000)
      const config = item.__config__ || {}
      
      config.formId = idGlobal
      config.renderKey = `${idGlobal}${+new Date()}`
      
      // 根据布局类型设置不同属性
      if (config.layout === 'colFormItem') {
        item.__vModel__ = `field${idGlobal}`
      } else if (config.layout === 'rowFormItem') {
        config.componentName = `row${idGlobal}`
        if (!Array.isArray(config.children)) {
          config.children = []
        }
        delete config.label
      }
      
      // 处理子组件
      if (Array.isArray(config.children)) {
        config.children = config.children.map(childItem => this.createIdAndKey(childItem))
      }
      
      item.__config__ = config
      return item
    },
    onEnd(evt) {
      this.$emit('drag-end', evt)
    },
    getComponentCount (type) {
      return this.componentCounts[type] || 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style/form-material.scss';
</style>
