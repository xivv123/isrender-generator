<template>
  <div class="magicbox-layouts">
    <slot></slot>
  </div>
</template>

<script>
import render from './render.js'
import { layouts } from './layouts.js'

export default {
  name: 'MagicboxLayouts',
  components: {
    render
  },
  props: {
    // 表单配置
    config: {
      type: Object,
      required: true
    },
    // 表单数据
    formModel: {
      type: Object,
      required: true
    },
    // 表单验证规则
    formRules: {
      type: Object,
      default: () => ({})
    },
    // 表单项渲染列表
    renderItems: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 合并配置的完整表单配置
    mergedConfig() {
      return {
        size: 'medium',
        labelPosition: 'right',
        labelWidth: 100,
        gutter: 0,
        disabled: false,
        ...this.config,
        itemRenderList: this.renderItems
      }
    }
  },
  methods: {
    // 渲染表单项
    renderItem(h, item, index) {
      const layout = item.__config__ && item.__config__.layout ? layouts[item.__config__.layout] : null;
      if (layout) {
        return layout.call(this, h, item, this.formModel, this.mergedConfig);
      }
      return null;
    }
  },
  render(h) {
    // 获取默认插槽内容
    const slotContent = this.$slots.default || [];
    
    // 如果有插槽内容，使用插槽内容
    if (slotContent.length > 0) {
      return h('div', { class: 'magicbox-layouts' }, slotContent);
    } 
    
    // 否则使用renderItems渲染
    const children = this.renderItems.map((item, index) => {
      return this.renderItem(h, item, index);
    });
    
    return h('div', { class: 'magicbox-layouts' }, children);
  }
}
</script>

<style scoped>
.magicbox-layouts {
  width: 100%;
}
  
.magicbox-layouts .form-row {
  margin-bottom: 15px;
}
</style> 