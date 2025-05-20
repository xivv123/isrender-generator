<template>
  <div>
    <el-divider>表单标签配置</el-divider>
    <isrender-form  v-model="dataLocal" :renderdata="label" />
  </div>
</template>
      
<script>
    import label from '@/config/create-data/label-attributes-data'
    import componentDataSync from '../mixins/component-data-sync'

    export default {
        name: 'component-base-label',
        mixins: [componentDataSync],
        components:{
          // isrenderForm
        },
        props: {
          componentData: {
            type: Object,
            default: () => ({})
          }
        },
        data() {
          return {
            dataLocal: {},
            label
          }
        },
        computed: {
          // 获取当前活动数据
          activeData() {
            return this.componentData;
          },
          
          // 提供渲染数据源
          renderSource() {
            return this.label;
          }
        }
      }
      </script>
       