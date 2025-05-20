<template>
  <div>
    <el-divider>元素配置</el-divider>
    <isrender-form v-model="dataLocal" :renderdata="inputEle" >
      <el-form-item slot="prefix-icon" label="头部图标" prop="prefix-icon">
        <el-input placeholder="请点击左侧选择内容" v-model="dataLocal['prefix-icon']" >
          <el-button slot="prepend" icon="el-icon-search" @click="openIconSelector('prefix-icon')"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item slot="suffix-icon" label="尾部图标" prop="suffix-icon">
        <el-input placeholder="请点击右侧选择内容" v-model="dataLocal['suffix-icon']" >
          <el-button slot="append" icon="el-icon-search" @click="openIconSelector('suffix-icon')"></el-button>
        </el-input>
      </el-form-item>
    </isrender-form>

    <!-- 插槽配置 -->
    <!-- <slot-config-dialog :component-data="activeComponent" @options-change="handleOptionsChange"/> -->

    <!-- 使用图标选择器组件 -->
    <icon-selector 
      v-model="iconDialogVisible"
      :initialIcon="selectedIcon"
      @select="handleIconSelect"
      @confirm="handleIconConfirm"
      @cancel="handleIconCancel"
    />
  </div>
</template>
      
<script>
    import ValueEditor from './ele-base-value.vue'
    
    import inputEle from '@/config/create-data/input/input-ele'
    // import isRenderCore from '@/components/is-render-core/form-core.vue'
    import isRenderCore from '@/components/isrender-form/core.vue'
    import componentDataSync from '../mixins/component-data-sync'
    import IconSelector from '../icon.vue'

    export default {
        name: 'componentInput',
        mixins: [componentDataSync],
        props: ['componentData'],
        components:{
          isRenderCore,
          ValueEditor,
          IconSelector,
        },
        data() {
          return {
            dataLocal: {},
            iconDialogVisible: false,
            selectedIcon: '',
            currentIconType: '',
            inputEle
          }
        },
        computed: {
          // 获取当前活动数据
          activeData() {
            return this.componentData;
          },
          
          // 提供渲染数据源
          renderSource() {
            return this.inputEle;
          }
        },
        methods:{
          openIconSelector(iconType) {
            this.currentIconType = iconType; // 记录当前正在编辑的图标类型
            this.selectedIcon = this.dataLocal[iconType] || ''; // 设置当前选中的图标
            this.iconDialogVisible = true; // 显示选择器
          },
          // 处理图标选择
          handleIconSelect(icon) {
            this.selectedIcon = icon;
          },
          // 处理图标确认
          handleIconConfirm(icon) {
            if (icon && this.currentIconType) {
              // 根据当前正在编辑的图标类型更新相应的属性
              this.dataLocal[this.currentIconType] = icon;
              this.activeData.renderdata[this.currentIconType] = icon;
            }
          },
          // beforeUpdateRenderdata(value, renderdata) {
          //   value['prefix-icon'] = renderdata['prefix-icon']
          //   value['suffix-icon'] = renderdata['suffix-icon'] 
          // },
          // afterUpdateRenderdata (value, renderdata) {
          //   value['prefix-icon'] = renderdata['prefix-icon']
          //   value['suffix-icon'] = renderdata['suffix-icon'] 
          // },
          // beforeUpdateRenderdata () {
          //   this.dataLocal['prefix-icon'] = this.activeData.renderdata['prefix-icon']
          //   this.dataLocal['suffix-icon'] = this.activeData.renderdata['suffix-icon']
          // },
          
        }
      }
      </script>
       