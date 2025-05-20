<template>
  <div>
    <el-divider>选择框配置</el-divider>
    <magicbox-form-core v-model="dataLocal" :renderdata="selectEle" />
    
    <!-- 插槽配置（选项管理） -->
    <!-- <slot-config-dialog :component-data="activeComponent" @options-change="handleOptionsChange"/> -->
  </div>
</template>
      
<script>
    import ValueEditor from './ele-base-value.vue'
    import SlotConfigDialog from './ele-base-slot.vue'
    import selectEle from '@/config/create-data/select/select-ele'
    import MagicboxFormCore from '@/components/is-render-core/form-core.vue'
    import componentDataSync from '../mixins/component-data-sync'

    export default {
        name: 'componentSelect',
        mixins: [componentDataSync],
        props: ['componentData'],
        components:{
            MagicboxFormCore,
            ValueEditor,
            SlotConfigDialog
        },
        emits: ['options-change'],
        data() {
          return {
            dataLocal: {},
            selectEle
          }
        },
        computed: {
          // 获取当前活动数据
          activeData() {
            return this.componentData;
          },
          
          // 提供渲染数据源
          renderSource() {
            return this.selectEle;
          },
          
          // 获取当前组件数据（用于传递给SlotConfigDialog）
          activeComponent() {
            return this.activeData;
          }
        },
        
        methods: {
          // 处理选项变化
          handleOptionsChange(updatedComponent) {
            if (updatedComponent && updatedComponent.__element__ && updatedComponent.__element__.slot) {
              // 确保renderdata中的slot与__element__中的slot保持一致
              if (!this.activeData.renderdata.slot) {
                this.$set(this.activeData.renderdata, 'slot', {});
              }
              
              // 同步选项数据
              if (updatedComponent.__element__.slot.options) {
                this.$set(this.activeData.renderdata.slot, 'options', updatedComponent.__element__.slot.options);
              }
              
              // 同步折叠面板数据
              if (updatedComponent.__element__.slot.default) {
                this.$set(this.activeData.renderdata.slot, 'default', updatedComponent.__element__.slot.default);
              }
              
              // 向上传递事件，通知父组件更新
              this.$emit('options-change', this.activeData);
            }
          },
          
          // 处理单个表单项
          processFormItem(key, item, renderdata) {
            // 如果renderdata中存在该值，则使用它，否则使用默认值
            if (renderdata[key] !== undefined) {
              this.$set(this.dataLocal, key, renderdata[key]);
            } else {
              // 设置默认值
              this.$set(this.dataLocal, key, item.__element__.value);
              // 同时将默认值同步到renderdata
              this.$set(renderdata, key, item.__element__.value);
            }
          }
        }
      }
      </script>
       