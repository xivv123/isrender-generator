<template>
  <div>
    <el-divider>表单验证配置</el-divider>
    <isrender-form v-model="dataLocal" :renderdata="regrule" />
  </div>
</template>
      
<script>
    import regrule from '@/config/create-data/regrule-attributes-data'
    // import MagicboxFormCore from '@/components/is-render-core/form-core.vue'
    import componentDataSync from '../mixins/component-data-sync'
    // import {deepClone} from '@/components/is-render-core/utils/index.js'
    export default {
        name: 'componentBaseRegrule',
        mixins: [componentDataSync],
        props: ['componentData'],
        data() {
          return {
            dataLocal: {},
            regrule,
          }
        },
        computed: {
          // 获取当前活动数据
          activeData() {
            return this.componentData;
          },
          
          // 提供渲染数据源
          renderSource() {
            return this.regrule;
          }
        }
        
        // 如果有特殊处理表单项的需求，可以添加processFormItem方法
        // methods: {
        //   processFormItem(key, item, renderdata) {
        //     // 自定义处理逻辑
        //   }
        // }
      }
      </script>
       