<template>
  <!-- <el-dialog
    title="Slot配置"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
    class="slot-config-dialog"
    :append-to-body="true"
    :destroy-on-close="true"
  > -->
    <div class="slot-config-content">
      <!-- 选项类组件的配置 -->
      <template v-if="isOptionsComponent">
        <el-divider>配置选项</el-divider>
        <draggable
          :list="slotOptions"
          :animation="340"
          group="selectItem"
          handle=".option-drag"
          @change="handleOptionsChange"
        >
          <div v-for="(item, index) in slotOptions" :key="index" class="select-item">
            <div class="select-line-icon option-drag">
              <i class="el-icon-s-operation" />
            </div>
            <el-input v-model="item.label" placeholder="选项名" size="small" @input="handleOptionsChange" />
            <el-input v-if="item.name" v-model="item.name" placeholder="面板默认值" size="small" @input="handleOptionsChange" />
            <el-input v-if="item.content" v-model="item.content" placeholder="面板内容" size="small" @input="handleOptionsChange" />
            <el-input
              v-if="!item.content"
              placeholder="选项值"
              size="small"
              :value="item.value"
              @input="setOptionValue(item, $event)"
            />
            <div class="close-btn select-line-icon" @click="activeData.__element__.slot.options.splice(index, 1); handleOptionsChange()">
              <i class="el-icon-remove-outline" />
            </div>
          </div>
        </draggable>
        <div style="margin-left: 20px;">
          <el-button
            style="padding-bottom: 0"
            icon="el-icon-circle-plus-outline"
            type="text"
            @click="addSelectItem"
          >
            添加选项
          </el-button>
        </div>
        <el-divider />
      </template>
      
      <!-- 其他类型组件slot配置可以在这里添加 -->
      <template v-else>
        <div class="no-config">
          <el-alert
            title="当前组件不支持Slot配置或没有识别到可配置项"
            type="info"
            :closable="false"
            show-icon
          />
        </div>
      </template>
    </div>
    
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </span>
  </el-dialog> -->
</template>

<script>
export default {
  name: 'SlotConfigDialog',
  components: {
    draggable: () => import('vuedraggable')
  },
  props: {
    componentData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      slotOptions: []
    }
  },
  computed: {
    isOptionsComponent() {
      // 检查组件是否是选项类组件（select, radio, checkbox等）
      const tag = this.componentData?.__element__?.tag || '';
      return ['el-select', 'el-radio-group', 'el-checkbox-group', 'el-cascader', 'el-collapse'].includes(tag);
    },
    // 获取当前活动数据
    activeData() {
      return this.componentData;
    }
  },
  watch: {
    componentData: {
      handler(val) {
        this.initializeData();
      },
      immediate: true,
      deep: true
    },
    // 直接监听slotOptions变化，确保与activeData同步
    slotOptions: {
      handler(val) {
        if (this.activeData && this.activeData.__element__) {
          if (!this.activeData.__element__.slot) {
            this.$set(this.activeData.__element__, 'slot', {});
          }
          this.$set(this.activeData.__element__.slot, 'options', val);
        }
      },
      deep: true
    }
  },
  created() {
    this.initializeData();
  },
  methods: {
    // 初始化数据
    initializeData() {
      try {
        // 确保组件有必要的属性结构
        if (!this.activeData.__element__) {
          this.$set(this.activeData, '__element__', {});
        }
        if (!this.activeData.__element__.slot) {
          this.$set(this.activeData.__element__, 'slot', {});
        }
        if (!this.activeData.__element__.slot.options) {
          this.$set(this.activeData.__element__.slot, 'options', []);
        }
        // 设置本地引用，确保双向绑定
        if (this.activeData.renderdata.slot) {
          this.slotOptions = this.activeData.renderdata.slot.options;

        }
      } catch (error) {
        console.error('初始化Slot配置数据失败:', error);
        this.$message.error('初始化数据失败');
      }
    },
    
    // 添加新选项
    addSelectItem() {
      if (!this.activeData.__element__.slot.options) {
        this.$set(this.activeData.__element__.slot, 'options', []);
      }
      
      // 获取当前组件类型
      const componentTag = this.activeData.__element__.tag;
      let newOption = {};
      const index = this.activeData.__element__.slot.options.length + 1;
      
      // 根据组件类型创建不同结构的选项
      switch(componentTag) {
        case 'el-collapse':
          // 折叠面板特有结构
          newOption = {
            label: `面板${index}`,
            value: `${index}`,
            name: `${index}`,
            content: `我是面板${index}的内容`,
            props: {
              title: `面板${index}`,
              name: `${index}`,
              disabled: false
            }
          };
          break;
        case 'el-select':
        case 'el-radio-group':
        case 'el-checkbox-group':
        case 'el-cascader':
        default:
          // 通用选项结构
          newOption = {
            label: `选项${index}`,
            value: `value${index}`
          };
          break;
      }
      // // 触发选项变更事件
      // this.$emit('options-change', this.activeData);
      this.activeData.__element__.slot.options.push(newOption);
      this.$set(this.activeData.renderdata.slot, 'options', this.activeData.__element__.slot.options);
      this.handleOptionsChange();
    },
    
    // 设置选项值
    setOptionValue(item, value) {
      item.value = value;
      this.handleOptionsChange();
    },
    
    // 处理选项变化
    handleOptionsChange() {
      // 创建更新后的组件数据副本（深拷贝防止引用问题）
      const updatedComponentData = JSON.parse(JSON.stringify(this.activeData));
      
      // 发送options-change事件
      this.$emit('options-change', updatedComponentData);
    }
  }
}
</script>

<style lang="scss" scoped>
.slot-config-content {
  padding: 10px 0;
  
  .select-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    .option-drag {
      cursor: move;
      padding: 0 5px;
    }
    
    .select-line-icon {
      font-size: 16px;
      color: #909399;
      margin: 0 5px;
      
      i {
        display: inline-block;
        vertical-align: middle;
      }
    }
    
    .el-input {
      margin-right: 10px;
    }
    
    .close-btn {
      cursor: pointer;
      
      &:hover {
        color: #F56C6C;
      }
    }
  }
  
  .no-config {
    margin: 20px 0;
  }
}
</style> 