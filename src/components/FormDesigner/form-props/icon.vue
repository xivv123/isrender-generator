<template>
  <div>
    <el-dialog
      title="选择图标"
      :visible.sync="visible"
      width="70%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <div class="icon-container">
        <div 
          v-for="icon in iconList" 
          :key="icon" 
          class="icon-item" 
          :class="{ 'selected': selectedIcon === icon }"
          @click="selectIcon(icon)"
        >
          <i :class="icon"></i>
          <span class="icon-name">{{ icon }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'IconSelector',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 初始选中的图标
    initialIcon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedIcon: this.initialIcon,
      iconList: [
        'el-icon-info', 'el-icon-error', 'el-icon-success', 'el-icon-warning', 'el-icon-question',
        'el-icon-back', 'el-icon-arrow-left', 'el-icon-arrow-down', 'el-icon-arrow-right', 'el-icon-arrow-up',
        'el-icon-caret-left', 'el-icon-caret-bottom', 'el-icon-caret-top', 'el-icon-caret-right',
        'el-icon-d-arrow-left', 'el-icon-d-arrow-right', 'el-icon-minus', 'el-icon-plus',
        'el-icon-remove', 'el-icon-circle-plus', 'el-icon-remove-outline', 'el-icon-circle-plus-outline',
        'el-icon-close', 'el-icon-check', 'el-icon-circle-close', 'el-icon-circle-check',
        'el-icon-zoom-out', 'el-icon-zoom-in', 'el-icon-d-caret', 'el-icon-sort',
        'el-icon-sort-down', 'el-icon-sort-up', 'el-icon-tickets', 'el-icon-document',
        'el-icon-goods', 'el-icon-sold-out', 'el-icon-news', 'el-icon-message',
        'el-icon-date', 'el-icon-printer', 'el-icon-time', 'el-icon-bell',
        'el-icon-mobile-phone', 'el-icon-service', 'el-icon-view', 'el-icon-menu',
        'el-icon-more', 'el-icon-more-outline', 'el-icon-star-on', 'el-icon-star-off',
        'el-icon-location', 'el-icon-location-outline', 'el-icon-phone', 'el-icon-phone-outline',
        'el-icon-picture', 'el-icon-picture-outline', 'el-icon-delete', 'el-icon-search',
        'el-icon-edit', 'el-icon-edit-outline', 'el-icon-rank', 'el-icon-refresh',
        'el-icon-share', 'el-icon-setting', 'el-icon-upload', 'el-icon-upload2',
        'el-icon-download', 'el-icon-loading'
      ]
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  watch: {
    initialIcon(newVal) {
      this.selectedIcon = newVal;
    }
  },
  methods: {
    // 选择图标
    selectIcon(icon) {
      this.selectedIcon = icon;
      this.$emit('select', icon);
    },
    
    // 确认选择
    handleConfirm() {
      if (this.selectedIcon) {
        this.$emit('confirm', this.selectedIcon);
        this.visible = false;
      }
    },
    
    // 取消选择
    handleCancel() {
      this.visible = false;
      this.$emit('cancel');
    },
    
    // 关闭对话框
    handleClose() {
      this.visible = false;
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
/* 图标选择器样式 */
.icon-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 90px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 10px;
  
  &:hover {
    background-color: #f5f7fa;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  &.selected {
    background-color: #ecf5ff;
    border-color: #409EFF;
    color: #409EFF;
  }
  
  i {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .icon-name {
    font-size: 12px;
    text-align: center;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
