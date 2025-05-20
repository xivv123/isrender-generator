<script>
import render from '@/components/is-render-core/render.js'
// 导入布局系统中的方法
import { layouts as coreLayouts } from '@/components/is-render-core/layouts.js'

// 使用布局系统中的方法，但添加设计时专用处理
const layouts = {
    colFormItem (h, currentItem) {
        // 获取表单数据的值
        let formModel = typeof this.value === 'object' ? this.value : { value: this.value }
        
        // 修改组件的值处理函数，确保能把值传回父组件
        if (currentItem && currentItem.__element__ && !currentItem.__element__.on) {
            currentItem.__element__.on = {}
        }
        
        if (currentItem && currentItem.__element__ && currentItem.__element__.on) {
            const originalInput = currentItem.__element__.on.input
            currentItem.__element__.on.input = (instance, val) => {
                // 使用$emit直接触发input事件，支持v-model
                this.$emit('input', val)
                
                // 如果原本有input事件处理器，也要调用
                if (typeof originalInput === 'function') {
                    originalInput(instance, val)
                }
            }
        }
        
        // 如果是日期或时间选择器，修改style属性设置宽度为100%
        if (currentItem.__element__ && 
            (currentItem.__element__.tag === 'el-date-picker' || 
             currentItem.__element__.tag === 'el-time-picker')) {
            if (!currentItem.__element__.style) {
                currentItem.__element__.style = {};
            }
            currentItem.__element__.style.width = '100%';
        }
        
        const rendered = coreLayouts.colFormItem.call(
            this, 
            h, 
            currentItem, 
            formModel, 
            this.formConf
        );
        
        if (rendered && rendered.data) {
            if (!rendered.data.style) rendered.data.style = {};
            rendered.data.style.paddingLeft = '0px';
            rendered.data.style.paddingRight = '0px';
        }
        
        return rendered;
    }    
}

export default {
    components: { render },
    props: {
        // 当前项
        currentItem: {
            type: Object,
            required: true
        },
        // 表单配置
        formConf: {
            type: Object,
            required: true
        },
        // 表单数据，使用了v-model
        value: {
            type: [String, Number, Boolean, Array, Object],
            default: ''
        }
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    render (h) {
        const layout = layouts[this.currentItem.__config__.layout]
        return layout.call(this, h, this.currentItem)
    }
}
</script>

<style>
/* 确保所有内部元素没有左右内边距 */
:deep(.el-col) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
