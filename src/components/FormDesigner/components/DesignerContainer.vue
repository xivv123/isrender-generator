<template>
  <div class="form-designer">
    <div class="designer-container">
      <div class="center-panel">
        <div 
          ref="canvasContainer"
          class="canvas-container"
          @mousedown="handleCanvasMouseDown"
          @mousemove="handleCanvasMouseMove"
          @mouseup="handleCanvasMouseUp"
          @mouseleave="handleCanvasMouseUp"
          @wheel.prevent.stop="handleWheel"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesignerContainer',
  methods: {
    handleCanvasMouseDown(event) {
      this.$emit('canvas-mouse-down', event);
    },
    handleCanvasMouseMove(event) {
      this.$emit('canvas-mouse-move', event);
    },
    handleCanvasMouseUp(event) {
      this.$emit('canvas-mouse-up', event);
    },
    handleWheel(event) {
      this.$emit('canvas-wheel', event);
    }
  },
  mounted() {
    // 暴露canvas容器元素给父组件
    this.$parent.$refs.canvasContainer = this.$refs.canvasContainer;
  },
  beforeDestroy() {
    // 清理引用，避免内存泄漏
    if (this.$parent.$refs.canvasContainer === this.$refs.canvasContainer) {
      this.$parent.$refs.canvasContainer = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.form-designer {
  height: 100%;
  background: #f5f7fa;

  .designer-container {
    display: flex;
    height: 100%;
    overflow: hidden;

    .center-panel {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #fff;

      .canvas-container {
        position: relative;
        flex: 1;
        overflow: hidden;
        background: #f0f2f5;
        cursor: grab;
        user-select: none;
        transform-style: preserve-3d;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        &:active {
          cursor: grabbing;
        }
      }
    }
  }
}
</style> 