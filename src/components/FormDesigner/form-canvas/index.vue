<template>
    <!-- canvas-design -->
    <div 
        class="main-content canvas-design" 
        @click="handleFormClick" 
        @wheel.stop="handleScroll" 
        :class="{ 'form-selected': isFormSelected, 'canvas-selected': isCanvasSelected }"
    >
    <!-- <div class="canvas-design"> -->
        <is-render-core v-model="formData" :renderdata="formCoreRenderData">
            <draggable 
                class="drawing-board"  
                :list="canvasComponents"
                :animation="340"
                group="componentsGroup"
                @end="handleDragEnd"
                @add="handleComponentAdd"
            >
                <draggable-item 
                    v-for="(item, index) in canvasComponents"
                    :key="item.id || item.__config__?.formId || index"
                    :current-item= currentItem(item)
                    :index="index" 
                    :drawing-list="canvasComponents"
                    :active-id.sync="activeComponentId"
                    :form-conf="formConf"
                    :itemConfloacl="itemConfloacl"
                    @copyItem="copyItem"
                    @deleteItem="deleteItem"
                    class="form-render-item"
                />
            </draggable>
        </is-render-core>
    <!-- </div> -->
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import DraggableItem from './DraggableItem.vue'
import CanvasHeader from './canvas-header.vue'
import CanvasTip from './canvas-tip.vue'
import isRenderCore from '@/components/is-render-core/form-core.vue'

export default {
    name: 'FormCanvas',
    components: {
        CanvasHeader,
        CanvasTip,
        DraggableItem,
        draggable,
        isRenderCore
    },
    props: {
        value: {
            type: Array,
            default: () => []
        },

        currentIndex: {
            type: Number,
            default: -1
        },
        formConf: {
            type: Object
        },
        
        formrender: {
            type: Object
        },
        canvasId: {
            type: Object
        },

        selectedCanvasId: {
            type: Object,
            default: null
        },
        componentItem_default: {
            type: Object,
            default: null
        },
        itemConf: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            canvasComponents: this.value,
            formData: {},
            itemConfloacl: {},
            currentComponentIndex: -1,
            activeComponentId: '',
            isDragging: false,
            isLivePreview: true,
            isFormSelected: false,
            formCoreRenderData: {
                size: '',
                labelPosition: 'left',
                labelWidth: 190,
                gutter: 0,
                disabled: false,
                itemSpacing: 15,
                itemPaddingLeft: 10
            }
        }
    },
    computed: {
        isCanvasSelected() {
            return this.canvasId === this.selectedCanvasId;
        }
    },
    watch: {
        selectedCanvasId: {
            handler(newVal, oldVal) {
                // 当当前画布不再是选中状态时，清除表单选中状态
                if (oldVal === this.canvasId && newVal !== this.canvasId) {
                    this.deselectForm();
                }
            },
            immediate: true
        },
        value: {
            handler (val) {
                this.canvasComponents = val
            },
            deep: true
        },
        currentComponentIndex: {
            handler (val) {
                this.$emit('update:currentIndex', val);
            },
            immediate: true
        },
        currentIndex: {
            handler (val) {
                this.currentComponentIndex = val;
            },
            immediate: true
        },
        formConf: {
            handler (newVal) {
                if (newVal) {
                    // 创建新对象而不是直接赋值，避免引用问题
                    this.formCoreRenderData = {...newVal}
                }
            },
            deep: true  // 添加深度监听
        }

    },
    methods: {

        // 
        currentItem(item) {
            return item
        },

        handleFormClick (event) {
            // 检查是否点击了表单空白区域
            const isFormAreaClick = event.target.classList.contains('canvas-design') ||
                event.target.classList.contains('drawing-board');
            
            // 点击空白区域时选中整个表单
            if (isFormAreaClick) {
                event.stopPropagation();
                this.isFormSelected = true;
                
                // 发送表单配置到属性栏
                this.$emit('form-select', { type: 'form', id: this.canvasId})
                return;
            }

            // 查找并选中点击的组件项
            const itemWrapper = event.target.closest('.form-item-wrapper');
            if (!itemWrapper) return;
            
            this.isFormSelected = false;
            
            // 优先通过 data-form-id 查找组件
            // const formId = itemWrapper.getAttribute('data-form-id');
            // if (formId) {
            //     const index = this.canvasComponents.findIndex(
            //         comp => comp.__config__ && comp.__config__.formId === formId
            //     );
                
            //     if (index !== -1) {
            //         debugger
            //         this._selectComponent(index, formId);
            //         return;
            //     }
            // }
            
            // 回退到使用 DOM 索引
            const index = Array.from(itemWrapper.parentNode.children).indexOf(itemWrapper);
            if (index !== -1) {
                const targetComponent = this.canvasComponents[index];
                const componentFormId = targetComponent?.__config__?.formId;
                this._selectComponent(index, componentFormId, targetComponent);
            }
        },

        
        /**
         * 选中指定组件
         * @param {Number} index - 组件索引
         * @param {String} formId - 组件表单ID
         * @private
         */
        _selectComponent(index, formId, targetComponent) {
            this.currentComponentIndex = index;
            this.activeComponentId = formId;
            this.itemConfloacl = this.itemConf[targetComponent.id]
            // debugger
            this.$emit('component-click', targetComponent, 'component',  this.canvasId, this.currentComponentIndex)
        },

        handleCanvasHeaderClick () {
            this.isFormSelected = false;
            this.currentComponentIndex = -1;
        },

        handleScroll (event) {
            event.stopPropagation();
        },
        copyItem (item, list) {
            if (!item || !list || !Array.isArray(list)) {
                console.error('复制失败：无效的参数', { item, list });
                return;
            }
            
            const index = list.findIndex(comp => comp === item);
            
            if (index === -1) {
                console.warn('复制失败：在列表中未找到指定组件', item);
                return;
            }
            
            const newItem = JSON.parse(JSON.stringify(item));
            
            const uniqueTimestamp = Date.now();
            const randomSuffix = Math.floor(Math.random() * 10000);
            const newUniqueId = `${uniqueTimestamp}_${randomSuffix}`;
            
            console.log('复制组件，生成新的唯一ID:', newUniqueId);
            
            if (newItem.__config__) {
                newItem.__config__.formId = newUniqueId;
                
                if (newItem.__config__.renderKey) {
                    newItem.__config__.renderKey = uniqueTimestamp;
                }
                
                if (!newItem.__config__.layout) {
                    newItem.__config__.layout = item.__config__?.layout || 'colFormItem';
                }
                
                if (newItem.__config__.layout === 'colFormItem') {
                    newItem.__vModel__ = `field${newUniqueId}`;
                }
                
                console.log('新组件配置:', newItem.__config__);
            }
            
            if (newItem.id) {
                newItem.id = `${newItem.id.split('_')[0]}_${newUniqueId}`;
            } else {
                newItem.id = `component_${newUniqueId}`;
            }
            
            list.splice(index + 1, 0, newItem);
            
            this.$emit('update:value', [...this.canvasComponents]);
            
            this.activeComponentId = newItem.__config__?.formId;
            this.currentComponentIndex = index + 1;
            this.isFormSelected = false;
            
            this.$emit('component-click', index + 1);
            this.$emit('update:currentIndex', index + 1);
            
            console.log('成功复制组件, 新formId:', newItem.__config__?.formId);
            return newItem;
        },
        deleteItem (index, list) {
            if (index >= 0 && index < list.length) {
                list.splice(index, 1);
                
                this.$nextTick(() => {
                    const len = this.canvasComponents.length;
                    if (len) {
                        // 如果删除的不是最后一个，选中删除位置的组件
                        // 如果删除的是最后一个，选中新的最后一个
                        const newIndex = index < len ? index : len - 1;
                        const targetComponent = this.canvasComponents[newIndex];
                        
                        // 如果有下一个组件，选中它
                        if (targetComponent) {
                            this.currentComponentIndex = newIndex;
                            this.activeComponentId = targetComponent.__config__?.formId;
                            this.isFormSelected = false;
                            
                            this.$emit('update:currentIndex', newIndex);
                            this.$emit('component-click', newIndex);
                            
                            // 视觉上选中该组件
                            this.$nextTick(() => {
                                const formId = targetComponent.__config__?.formId;
                                const formItems = document.querySelectorAll(`[data-form-id="${formId}"]`);
                                if (formItems && formItems.length > 0) {
                                    formItems.forEach(el => {
                                        const parent = el.closest('.form-render-item');
                                        if (parent) {
                                            parent.classList.add('active-form-item');
                                        }
                                        el.classList.add('active-from-item');
                                    });
                                }
                            });
                        } else {
                            // 如果没有可选组件，清除选中状态
                            this.currentComponentIndex = -1;
                            this.activeComponentId = '';
                            this.isFormSelected = true;
                            
                            this.$emit('update:currentIndex', -1);
                        }
                    } else {
                        // 没有组件了，设置为选中表单
                        this.currentComponentIndex = -1;
                        this.activeComponentId = '';
                        this.isFormSelected = true;
                        
                        this.$emit('update:currentIndex', -1);
                    }
                });
            }
        },
        deselectForm() {
            this.isFormSelected = false;
            this.currentComponentIndex = -1;
        },
        
        /**
         * 清除画布上所有选中状态(由父组件调用)
         */
        clearAllSelection() {
            console.log('清除画布选中状态');
            this.isFormSelected = false;
            this.activeComponentId = '';
            this.currentComponentIndex = -1;
            
            // 移除DOM中可能存在的视觉选中效果
            this.$nextTick(() => {
                const activeItems = this.$el.querySelectorAll('.active-form-item, .active-from-item');
                if (activeItems && activeItems.length > 0) {
                    activeItems.forEach(el => {
                        el.classList.remove('active-form-item');
                        el.classList.remove('active-from-item');
                    });
                }
            });
        },
        handleDragEnd(event) {
            console.log('拖拽结束', event);
            
            // 拖拽结束后通知父组件更新
            this.$emit('input', this.canvasComponents);
        },
        handleComponentAdd(event) {
            console.log('组件添加', event);
            // 获取新添加的组件
            const newIndex = event.newIndex;
            const addedComponent = this.canvasComponents[newIndex];
            addedComponent.renderdata = this.componentItem_default
            
            if (addedComponent) {
                // 确保组件有唯一ID
                if (!addedComponent.id) {
                    const uniqueTimestamp = Date.now();
                    const randomSuffix = Math.floor(Math.random() * 10000);
                    addedComponent.id = `component_${uniqueTimestamp}_${randomSuffix}`;                    
                }
                
                // 触发component-add事件，将新添加的组件传递给父组件
                this.$emit('component-add', addedComponent);
                // debugger
                // 自动选中新添加的组件
                this._selectComponent(newIndex, addedComponent.__config__?.formId, addedComponent);
            }
            
            // 通知父组件更新
            this.$emit('input', this.canvasComponents);
        }
    },
    
}
</script>

<style lang="scss" scoped>
.form-canvas {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.main-content {
    display: flex;
    flex: 1;
    overflow: auto;
    position: relative;
    height: 100%;
    
    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
}

.canvas-design {
    flex: 1;
    position: relative;
    min-height: 200px;
    padding: 20px;
    overflow: auto;
    height: 100%;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    touch-action: none;
    -webkit-user-drag: none;
    user-select: none;
    
    &.is-dragging {
        cursor: grabbing !important;
        pointer-events: auto;

        * {
            pointer-events: none;
            user-select: none;
        }
    }

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
    }

    &.half-width {
        flex: 0 0 50%;
    }

    &.form-selected {
        border: 2px solid #a3d0fd;
        border-radius: 4px;

        .drawing-board {
            min-height: 200px;
        }
    }
}


@import './home.scss';

</style>

