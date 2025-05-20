<script>
import render from './render.js'
import {deepClone} from './utils/index.js'
import { form } from './layouts.js'

export default {
  name: 'isRender',
  components: { render },
  props: {
    // 渲染数据对象
    renderdata: {
      type: Object,
      required: true,
      default: () => ({})
    },
    // 表单数据
    value: {
      type: Object,
      default: () => ({})
    },
    // 父组件实例属性
    parentInstance: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      formModel: {},
      formRules: {},
      basicData: {}
    }
  },
  methods: {
      // 构建表单基本数据
      initFormData(componentList) {
          let formData = {}
          componentList.forEach(cur => {
              const element = cur.__element__
              // 添加 slot 数据处理机制
              const slot = cur.slot
              if (element && element.key) formData[element.key] = element.value
              if (slot) formData[slot] = ""
          })
          return formData;
      },

      // 构建表单验证规则
      buildRules(componentList) {
        let rules = {}
        const ruleTrigger = {
          'el-input': 'blur',
          'el-input-number': 'blur',
          'el-select': 'change',
          'el-radio-group': 'change',
          'el-checkbox-group': 'change',
          'el-cascader': 'change',
          'el-time-picker': 'change',
          'el-date-picker': 'change',
          'el-rate': 'change'
        };
        componentList.forEach(cur => {
          // 处理插槽占位符的验证规则
          if (cur.slot && typeof cur.slot === 'string' && cur.__slotRules__) {
            // 从插槽占位符配置中获取验证规则
            const slotRules = cur.__slotRules__;
            
            // 如果定义了字段名和规则，则添加到表单规则中
            if (slotRules.prop && Array.isArray(slotRules.rules)) {
              rules[slotRules.prop] = slotRules.rules;
            }
            return;
          }
          
          const regrule = cur.__regrule__
          const element = cur.__element__
          const label = cur.__label__

          if (regrule && Array.isArray(regrule.regList)) {
            if (regrule.required) {
              const required = { required: regrule.required, message: cur.placeholder }
              if (Array.isArray(regrule.defaultValue)) {
                required.type = 'array'
                required.message = `请至少选择一个${label && label.label ? label.label : ''}`
              }
              required.message === undefined && (required.message = `${label && label.label ? label.label : ''}不能为空`)
              regrule.regList.push(required)
            }
            
            if (element && element.key) {
              rules[element.key] = regrule.regList.map(item => {
                item.pattern && (item.pattern = eval(item.pattern))
                item.trigger = ruleTrigger && ruleTrigger[element.tag]
                return item
              })
            }
          }
        })
        return rules;
      },
      
      // 添加表单验证方法
      validate(callback) {
        // 尝试使用ref获取Element UI表单实例
        let elForm = this.$refs.elForm;
        
        // 如果通过ref找不到，尝试在子组件中查找
        if (!elForm) {
          elForm = this.$children.find(child => 
            child.$options && 
            (child.$options.componentName === 'ElForm' || child.$options.name === 'ElForm')
          );
        }
        
        if (elForm) {
          // 调用Element UI表单的validate方法
          return elForm.validate(callback);
        } else {
          console.warn('未找到ElForm实例，无法验证表单');
          // 如果没找到表单实例，返回验证失败
          if (typeof callback === 'function') {
            callback(false, {});
          }
          return Promise.reject('未找到表单实例');
        }
      }
  },
  mounted(){
    this.basicData = deepClone(this.renderdata)
    this.formModel = this.initFormData(this.basicData.itemRenderList || [])
    this.formRules = this.buildRules(this.basicData.itemRenderList || [])
      
    this.$emit('input', this.formModel)
  },
  
  render(h) {
    // 修改render函数返回，使其同时渲染配置表单和默认插槽内容
    const formRender = form.call(this, h, this.renderdata, this.formModel, this.formRules, this)
    
    // 检查formRender的结构，确保它有子元素
    if (formRender && formRender.children) {
      // 如果组件有默认插槽内容，添加到表单的子元素中
      if (this.$slots.default && this.$slots.default.length > 0) {
        // 找到el-form组件
        const elForm = formRender.children.find(child => 
          child.componentOptions && child.componentOptions.tag === 'el-form'
        )
        
        // 如果找到了el-form，将插槽内容添加到其子元素中
        if (elForm && elForm.componentOptions && elForm.componentOptions.children) {
          elForm.componentOptions.children = [
            ...elForm.componentOptions.children,
            ...this.$slots.default
          ]
        }
      }
    }
    
    return formRender
  }
}
</script>

<style scoped>
/* 使用scoped并增加特异性和命名空间 */
.magicbox-form-container {
  width: 100%;
}
  
.magicbox-form-container .form-buttons {
  margin-top: 20px;
  text-align: center;
}
  
/* 为所有表单项设置统一样式 */
.magicbox-form-container >>> .el-form-item {
  margin-bottom: 15px;
  padding-left: 10px;
  width: 100%;
}
  
/* 根据尺寸调整间距 */
.magicbox-form-container.medium >>> .el-form-item {
  margin-bottom: 22px;
}
  
.magicbox-form-container.small >>> .el-form-item {
  margin-bottom: 18px;
}
  
.magicbox-form-container.mini >>> .el-form-item {
  margin-bottom: 15px;
}
</style>
