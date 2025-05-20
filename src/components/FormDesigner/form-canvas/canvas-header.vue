<template>
  <div class="canvas-header" @click="handleClick">
    <div class="canvas-title">
      <span class="title-text">{{formConf.formname}}</span>
      <!-- <span class="title-desc">拖拽左侧组件进行表单设计</span> -->
    </div>
    <div class="canvas-actions">
      <el-button :type="isLivePreview ? 'success' : 'info'" size="small" icon="el-icon-monitor"
        @click.stop="$emit('toggle-live-preview')">实时预览</el-button>
      <el-button type="primary" size="small" icon="el-icon-view" @click.stop="$emit('preview')">预览</el-button>
      <el-button type="success" size="small" icon="el-icon-document" @click.stop="$emit('generate-code')">生成代码</el-button>
      <el-button type="warning" size="small" icon="el-icon-setting" @click.stop="$emit('canvas-header-click')">画布属性</el-button>
      <el-button type="danger" size="small" icon="el-icon-delete" @click.stop="$emit('clear')">一键清空</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CanvasHeader',
  props: {
    isLivePreview: {
      type: Boolean,
      default: false
    },
    formConf:{
      type: Object,
    }
  },
  emits: ['preview', 'generate-code', 'clear', 'toggle-live-preview', 'canvas-header-click'],
  methods: {
    handleClick(event) {
      // 阻止事件冒泡
      event.stopPropagation();
    }
  }
}
</script>

<style lang="scss" scoped>
.canvas-header {
  position: relative; // 添加相对定位
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  margin: -1px -1px 0; // 通过负边距扩展边框
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 1px;
    background-color: #e4e7ed;
    z-index: 1;
  }

  .canvas-title {
    display: flex;
    align-items: center;

    .title-text {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-right: 12px;
      line-height: 1;
    }

    .title-desc {
      font-size: 12px;
      color: #909399;
      line-height: 1;
    }
  }

  .canvas-actions {
    display: flex;
    align-items: center;

    .el-button {
      margin-left: 8px;

      &:first-child {
        margin-left: 0;
      }

      // 优化按钮样式
      &.el-button--primary {
        background-color: #409EFF;
        border-color: #409EFF;
      }

      &.el-button--success {
        background-color: #67C23A;
        border-color: #67C23A;
      }

      // 添加hover效果
      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
