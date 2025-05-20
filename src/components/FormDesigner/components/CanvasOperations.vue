<template>
  <div
    ref="canvasContainer"
    class="canvas-container"
    @mousedown="handleCanvasMouseDown"
    @mousemove="handleCanvasMouseMove"
    @mouseup="handleCanvasMouseUp"
    @mouseleave="handleCanvasMouseUp"
    @wheel.prevent.stop="handleWheel"
  >
    <div class="floating-panels">
      <slot name="floating-panels"></slot>
    </div>
    
    <div 
      ref="infiniteContent" 
      class="infinite-content"
      :style="transformStyle"
    >
      <slot></slot>
    </div>
    
    <slot name="add-canvas-btn"></slot>
    <slot name="minimap"></slot>
  </div>
</template>

<script>
export default {
  name: 'CanvasOperations',
  props: {
    // 接收画布列表
    canvasList: {
      type: Array,
      required: true
    },
    // 当前活动画布索引
    activeCanvasIndex: {
      type: Number,
      default: 0
    },
    // 当前活动画布ID
    canvasId: {
      type: Number,
      default: 0
    },
    // 当前组件索引
    currentComponentIndex: {
      type: Number,
      default: -1
    },
    // 初始缩放值
    initialScale: {
      type: Number,
      default: 1
    },
    // 最小缩放值
    minScale: {
      type: Number,
      default: 0.1
    },
    // 最大缩放值
    maxScale: {
      type: Number,
      default: 4
    },
    // 缩放步长
    scaleStep: {
      type: Number,
      default: 0.1
    }
  },
  data() {
    return {
      // 画布缩放相关状态
      canvasScale: this.initialScale,
      canvasPosition: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
      lastMousePos: { x: 0, y: 0 },
      isDraggingCanvas: false,
      canvasOffset: { x: 0, y: 0 },
      dragStart: { x: 0, y: 0 },
      isDraggingItem: false,
      dragItemIndex: -1,
      dragItemStartPos: { x: 0, y: 0 }
    }
  },
  computed: {
    // 计算样式，提供给父组件使用
    transformStyle() {
      return {
        transform: `translate(${this.canvasOffset.x}px, ${this.canvasOffset.y}px) scale(${this.canvasScale})`
      };
    }
  },
  methods: {
    // 缩放相关方法
    zoomIn() {
      const newScale = Math.min(
        this.canvasScale + this.scaleStep,
        this.maxScale
      );
      if (newScale !== this.canvasScale) {
        this.canvasScale = newScale;
        this.$emit('scale-change', this.canvasScale);
      }
    },

    zoomOut() {
      const newScale = Math.max(
        this.canvasScale - this.scaleStep,
        this.minScale
      );
      if (newScale !== this.canvasScale) {
        this.canvasScale = newScale;
        this.$emit('scale-change', this.canvasScale);
      }
    },

    resetZoom() {
      // 平滑过渡到100%缩放
      const currentScale = this.canvasScale;
      const targetScale = 1;
      const steps = 10;
      const duration = 200;
      const stepTime = duration / steps;
      const scaleIncrement = (targetScale - currentScale) / steps;
      
      // 开始动画
      let step = 0;
      const zoomInterval = setInterval(() => {
        step++;
        if (step >= steps) {
          this.canvasScale = targetScale;
          clearInterval(zoomInterval);
          
          // 重置完成后，触发重新渲染以确保锐化效果
          this.$nextTick(() => {
            // 应用一个临时的CSS滤镜，强制浏览器重新渲染
            const container = this.$refs.infiniteContent;
            if (container) {
              container.style.filter = 'contrast(1.01)';
              setTimeout(() => {
                container.style.filter = '';
              }, 50);
            }
          });
          this.$emit('scale-change', this.canvasScale);
        } else {
          this.canvasScale = currentScale + scaleIncrement * step;
          this.$emit('scale-change', this.canvasScale);
        }
      }, stepTime);
      
      // 重置位置
      this.canvasPosition = { x: 0, y: 0 };
      this.canvasOffset = { x: 0, y: 0 };
      this.$emit('offset-change', this.canvasOffset);
    },

    // 画布拖拽相关方法
    handleCanvasMouseDown(event) {
      // 只有在点击画布容器本身时才允许拖动
      if (
        event.target === this.$refs.canvasContainer ||
        event.target === this.$refs.infiniteContent
      ) {
        if (event.button === 0) {
          // 只响应左键
          this.isDraggingCanvas = true;
          this.dragStart = {
            x: event.clientX - this.canvasOffset.x,
            y: event.clientY - this.canvasOffset.y,
          };
          this.$refs.canvasContainer.style.cursor = "grabbing";
        }
      }
    },

    handleCanvasMouseMove(event) {
      if (this.isDraggingCanvas) {
        requestAnimationFrame(() => {
          this.canvasOffset = {
            x: event.clientX - this.dragStart.x,
            y: event.clientY - this.dragStart.y,
          };
          this.$emit('offset-change', this.canvasOffset);
        });
      }
    },

    handleCanvasMouseUp() {
      if (this.isDraggingCanvas) {
        this.isDraggingCanvas = false;
        this.$refs.canvasContainer.style.cursor = "grab";
      }
    },

    handleWheel(event) {
      // 检查事件源是否来自工具栏
      if (event.target.closest(".form-material")) {
        return; // 如果是工具栏中的滚动，直接返回不处理
      }

      if (event.ctrlKey) {
        // 缩放逻辑
        const delta = event.deltaY < 0 ? this.scaleStep : -this.scaleStep;
        const newScale = Math.max(
          this.minScale,
          Math.min(this.maxScale, this.canvasScale + delta)
        );

        if (newScale !== this.canvasScale) {
          // 获取鼠标在容器中的相对位置
          const container = this.$refs.canvasContainer;
          const rect = container.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          // 计算缩放中心点的偏移
          const scaleRatio = newScale / this.canvasScale;
          const offsetX = x - x * scaleRatio;
          const offsetY = y - y * scaleRatio;

          // 更新偏移和缩放
          this.canvasOffset.x += offsetX;
          this.canvasOffset.y += offsetY;
          this.canvasScale = newScale;
          
          this.$emit('scale-change', this.canvasScale);
          this.$emit('offset-change', this.canvasOffset);
        }
      }
    },

    // 画布项拖拽相关方法
    handleCanvasItemMouseDown(event, index) {
      // 如果是拖动手柄，则处理拖动逻辑
      if (event.target.closest(".canvas-drag-handle")) {
        this.isDraggingItem = true;
        this.dragItemIndex = index;
        const canvas = this.canvasList[index];

        this.dragItemStartPos = {
          x: event.clientX / this.canvasScale - (canvas.position?.x || 0),
          y: event.clientY / this.canvasScale - (canvas.position?.y || 0),
        };

        this.lastMousePos = {
          x: event.clientX,
          y: event.clientY,
        };

        document.addEventListener("mousemove", this.handleCanvasItemDrag);
        document.addEventListener("mouseup", this.handleCanvasItemDragEnd);
        
        // 通知父组件画布项被点击
        this.$emit('canvas-item-mousedown', { event, index });
      }
    },

    handleCanvasItemDrag(event) {
      if (!this.isDraggingItem) return;

      requestAnimationFrame(() => {
        // 计算鼠标移动的距离，并考虑缩放比例
        const deltaX = (event.clientX - this.lastMousePos.x) / this.canvasScale;
        const deltaY = (event.clientY - this.lastMousePos.y) / this.canvasScale;

        // 通知父组件更新画布位置
        this.$emit('canvas-item-drag', {
          index: this.dragItemIndex,
          deltaX,
          deltaY
        });

        // 更新上一次鼠标位置
        this.lastMousePos = {
          x: event.clientX,
          y: event.clientY,
        };
      });
    },

    handleCanvasItemDragEnd() {
      this.isDraggingItem = false;
      this.dragItemIndex = -1;
      this.lastMousePos = null;
      document.removeEventListener("mousemove", this.handleCanvasItemDrag);
      document.removeEventListener("mouseup", this.handleCanvasItemDragEnd);
      
      // 通知父组件拖拽结束
      this.$emit('canvas-item-dragend');
    },

    // 计算画布位置样式
    getCanvasPosition(canvas) {
      return {
        transform: `translate(${canvas.position?.x || 0}px, ${
          canvas.position?.y || 0
        }px)`,
        position: "absolute",
        top: 0,
        left: 0,
        width: (canvas.canvasData?.width || 900) + 'px',
        height: (canvas.canvasData?.height || 600) + 'px',
        background: canvas.canvasData?.background
      };
    },
    
    // 设置引用
    setInfiniteContentRef(ref) {
      this.$refs.infiniteContent = ref;
    }
  },
  // 向外部提供方法
  provide() {
    return {
      canvasOperations: {
        zoomIn: this.zoomIn,
        zoomOut: this.zoomOut,
        resetZoom: this.resetZoom,
        getCanvasPosition: this.getCanvasPosition,
        handleCanvasItemMouseDown: this.handleCanvasItemMouseDown
      }
    }
  },
  // 允许父组件通过ref访问这些方法
  expose: ['zoomIn', 'zoomOut', 'resetZoom', 'getCanvasPosition', 'handleCanvasItemMouseDown', 'setInfiniteContentRef']
};
</script>

<style lang="scss" scoped>
.canvas-container {
  position: relative;
  flex: 1;
  overflow: hidden;
  background: #f0f2f5;
  cursor: grab;
  user-select: none;
  transform-style: preserve-3d; /* 提高渲染质量 */
  -webkit-font-smoothing: antialiased; /* 文字渲染优化 */
  -moz-osx-font-smoothing: grayscale;

  &:active {
    cursor: grabbing;
  }
}

/* 保留原组件中的关键样式 */
:deep(.infinite-content) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d; /* 提高渲染质量 */
  display: flex;
  gap: 20px;
  padding: 20px;
  transform-origin: 0 0;

  &:active {
    cursor: grabbing;
  }
}

:deep(.floating-panels) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; // 允许点击穿透到底层画布
  z-index: 100;
}
</style> 