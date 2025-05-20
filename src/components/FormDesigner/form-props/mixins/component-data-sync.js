/**
 * 组件数据同步混入
 * 提供组件ID跟踪和数据同步功能，防止组件切换时数据被错误覆盖
 */
export default {
  data() {
    return {
      lastComponentId: null // 记录上一个组件ID
    };
  },
  
  computed: {
    // 获取当前组件ID
    currentId() {
      return this.activeData && this.activeData.id;
    },
    
    // 获取渲染数据来源
    renderSource() {
      // 子组件应该覆盖这个计算属性，提供渲染数据来源（如label或inputEle等）
      return null;
    }
  },
  
  watch: {
    // 监听组件ID变化
    currentId: {
      handler(newId, oldId) {
        if (newId !== oldId) {
          console.log(`${this.$options.name || 'component'} ===== 组件ID变化:`, oldId, '->', newId);
          
          // 先记录旧组件ID
          this.lastComponentId = oldId;
          
          // 清空dataLocal，防止旧数据影响
          if (this.dataLocal) {
            Object.keys(this.dataLocal).forEach(key => {
              this.$delete(this.dataLocal, key);
            });
          }
          // 确保DOM更新后再初始化新数据
          this.$nextTick(() => {
            this.initializeData();
          });
        }
      },
      immediate: true
    },
    
    // 监听表单数据变化并同步到renderdata
    dataLocal: {
      handler(val) {
        // 如果组件ID不匹配，跳过更新
        if (this.currentId !== this.lastComponentId && this.lastComponentId !== null) {
          console.log(`${this.$options.name || 'component'} ===== 跳过dataLocal更新，当前组件ID不匹配`);
          return;
        }
        
        let renderdata = this.activeData && this.activeData.renderdata;
        if (!renderdata) return;
        
        console.log(`${this.$options.name || 'component'} ===== 更新renderdata, 组件ID:`, this.currentId);
        
        // 前置处理钩子
        if (this.beforeUpdateRenderdata) {
          this.beforeUpdateRenderdata(val, renderdata);
        }
        
        Object.keys(val).forEach(key => {
          this.$set(renderdata, key, val[key]);
        });
        
        // 后置处理钩子
        if (this.afterUpdateRenderdata) {
          this.afterUpdateRenderdata(val, renderdata);
        }
      },
      deep: true
    }
  },
  
  methods: {
    // 通用的初始化数据方法
    initializeData() {
      console.log(`${this.$options.name || 'component'} ===== 初始化数据, 组件ID:`, this.currentId);
      
      if (!this.activeData || !this.activeData.renderdata) return;
      
      // 获取渲染数据源
      const renderSource = this.renderSource;
      if (!renderSource || !renderSource.itemRenderList) {
        console.warn(`${this.$options.name || 'component'} ===== 渲染数据源不存在或格式错误`);
        return;
      }
      
      // 前置初始化钩子
      if (this.beforeInitialize) {
        this.beforeInitialize();
      }
      
      const formItems = renderSource.itemRenderList || [];
      const renderdata = this.activeData.renderdata;
      // 处理每个表单项
      formItems.forEach(item => {
        if (!item.__element__) return;
        
        const key = item.__element__.key;
        if (!key) return;
        
        // 调用子类提供的处理方法，或使用默认处理逻辑
        if (this.processFormItem) {
          this.processFormItem(key, item, renderdata);
        } else {
          // 默认处理逻辑：如果renderdata中存在该值，则使用它
          if (renderdata[key] !== undefined) {
            this.$set(this.dataLocal, key, renderdata[key]);
          }
        }
      });
      
      // 后置初始化钩子
      if (this.afterInitialize) {
        this.afterInitialize();
      }
      
      // 更新完成后，同步组件ID
      this.syncComponentId();
    },
    
    // 处理单个表单项的方法（子组件可覆盖此方法）
    processFormItem(key, item, renderdata) {
      if (renderdata[key] !== undefined) {
        this.$set(this.dataLocal, key, renderdata[key]);
      }
    },
    
    // 初始化完成后更新组件ID记录
    syncComponentId() {
      this.lastComponentId = this.currentId;
    }
  }
}; 