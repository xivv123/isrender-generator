<template>
    <magicbox-form-core v-model="dataLocal" :renderdata="numberInputEle" />
</template>
      
<script>
    import ValueEditor from './ele-base-value.vue'

    import numberInputEle from '@/config/create-data/input/number-input-ele'
    import MagicboxFormCore from '@/components/is-render-core/form-core.vue'
    // import {deepClone} from '@/components/is-render-core/utils/index.js'
    export default {
        name: 'componentInput',
        props: ['componentData'],
        components:{
            MagicboxFormCore,
            ValueEditor
        },
        data() {
          return {
            dataLocal: {},
            currentComponent: {}, // 当前编辑的组件配置

            numberInputEle
          }
        },
        computed: {
          // 获取当前活动数据
          activeData() {
            return this.componentData;
          }
        },
        watch: {
          dataLocal: {
            handler(val) {
              let renderdata = this.activeData && this.activeData.renderdata
              Object.keys(val).forEach(key => {
                this.$set(renderdata, key, val[key]);
              })
            },
            deep: true
          },
          componentData: {
            handler(newVal) {
              this.initializeData();
            },
            deep: true
          }
        },

        methods: {
          // 初始化数据
          initializeData() {
            if (!this.activeData || !this.activeData.renderdata) return;
            
              // 初始化表单数据
              const formItems = this.numberInputEle.itemRenderList || [];
              const renderdata = this.activeData.renderdata;
              
              // 遍历所有表单项，设置对应的值
              formItems.forEach(item => {
                const key = item.__element__.key;
                // 如果renderdata中存在该值，则使用它，否则使用默认值
                if (renderdata[key] !== undefined) {
                  this.$set(this.dataLocal, key, renderdata[key]);
                } else {
                  this.$set(this.dataLocal, key, item.__element__.value);
                  // 同时将默认值同步到renderdata
                  this.$set(renderdata, key, item.__element__.value);
                }
              })
          }
        }
      }
      </script>
       