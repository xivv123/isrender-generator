<script>
import draggable from 'vuedraggable'
import render from '@/components/is-render-core/render.js'
// 导入布局系统中的方法
import { layouts as coreLayouts } from '@/components/is-render-core/layouts.js'

const components = {
    itemBtns (h, currentItem, index, list) {
        const { copyItem, deleteItem } = this.$listeners
        return [
            <span class="drawing-item-copy" title="复制" onClick={event => {
                copyItem(currentItem, list); event.stopPropagation()
            }}>
                <i class="el-icon-copy-document" />
            </span>,
            <span class="drawing-item-delete" title="删除" onClick={event => {
                deleteItem(index, list); event.stopPropagation()
            }}>
                <i class="el-icon-delete" />
            </span>
        ]
    }
}

// 使用布局系统中的方法，但添加设计时专用处理
const layouts = {
    colFormItem (h, currentItem, index, list) {
        const config = currentItem.__config__
        // 操作按钮
        const btns = components.itemBtns.call(this, h, currentItem, index, list)
        // 基础渲染
        const formModel = {} // 空的表单数据对象，设计时不需要实际数据
        // let itemConfloacl = this.itemConfloacl
        // currentItem.__label__.label = itemConfloacl.renderdata.label
        // debugger
        const rendered = coreLayouts.colFormItem.call(
            this, 
            h, 
            currentItem, 
            formModel, 
            this.formConf, 
            { actionButtons: btns }
        );
        // 如果渲染成功，添加设计时专用的属性
        if (rendered && rendered.data) {
            // 添加样式类
            const isActive = this.activeId === config.formId;
            rendered.data.class = isActive ? 
                'drawing-item active-from-item form-item-wrapper' : 
                'drawing-item form-item-wrapper';
        }
        
        return rendered;
    }    
}

function layoutIsNotFound () {
    throw new Error(`没有与${this.currentItem.__config__.layout}匹配的layout`)
}

export default {
    components: {
        render,
        draggable
    },
    // 渲染数据对象
    props: {
        // 当前项
        currentItem: {
            type: Object,
            required: true
        },
        // 索引
        index: {
            type: Number,
            required: true
        },
        // 绘制列表
        drawingList: {
            type: Array,
            required: true
        },
        // 激活ID
        activeId: {
            type: String,
            default: ''
        },
        // 表单配置
        formConf: {
            type: Object,
            required: true
        },
        // 表单数据
        value: {
            type: Object,
            default: () => ({})
        },
        itemConfloacl:{
            type: Object,
            default: () => {}
        }
    },
    render (h) {
        const layout = layouts[this.currentItem.__config__.layout]
        if (layout) {
            return layout.call(this, h, this.currentItem, this.index, this.drawingList)
        }
        return layoutIsNotFound.call(this)
    }
}
</script>
<style lang="scss" scoped>

@import './home.scss';

</style>