<template>
  <div 
    class="minimap-container"
    @mouseenter="handleMinimapEnter"
    @mousemove="handleMinimapMove"
    @mouseleave="handleMinimapLeave"
    @click="handleMinimapClick"
  >
    <div class="minimap-header">导航器</div>
    <div class="minimap-content">
      <div class="minimap-viewport" :style="minimapViewportStyle">
        <div class="minimap-infinite-content" :style="minimapContentStyle">
          <div 
            v-for="(canvas, index) in canvasList" 
            :key="canvas.id" 
            class="minimap-canvas"
            :class="{ 'is-active': index === activeCanvasIndex }" 
            :style="getMinimapCanvasStyle(canvas)"
          >
            <div class="minimap-canvas-content">
              <form-canvas 
                v-model="canvas.components" 
                :is-preview="true" 
                :scale="minimapScale" 
                preview-mode 
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 只保留一个指示器，根据悬停状态切换样式 -->
      <div 
        class="minimap-indicator" 
        :class="{ 'is-hover': showMinimapHover }"
        :style="showMinimapHover ? minimapHoverIndicatorStyle : minimapViewportIndicatorStyle"
      ></div>
    </div>
  </div>
</template>

<script>
import FormCanvas from '../form-canvas/index.vue'

export default {
  name: 'MiniMap',
  
  components: {
    FormCanvas
  },
  
  props: {
    canvasList: {
      type: Array,
      required: true
    },
    activeCanvasIndex: {
      type: Number,
      required: true
    },
    canvasOffset: {
      type: Object,
      required: true,
      default: () => ({ x: 0, y: 0 })
    },
    canvasScale: {
      type: Number,
      required: true,
      default: 1
    },
    containerRef: {
      type: [HTMLElement, null],
      required: false,
      default: null
    }
  },
  
  data() {
    return {
      minimapScale: 0.1,
      showMinimapHover: false,
      minimapHoverPosition: { x: 0, y: 0 },
      minimapRect: null
    }
  },
  
  computed: {
    minimapContentStyle() {
      return {
        transform: `translate(${this.canvasOffset.x * this.minimapScale}px, ${this.canvasOffset.y * this.minimapScale}px) scale(${this.canvasScale})`,
        position: 'absolute',
        width: '3000px',
        height: '3000px'
      }
    },
    
    minimapViewportStyle() {
      return {
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }
    },
    
    minimapViewportIndicatorStyle() {
      if (!this.containerRef) return {}
      
      const rect = this.containerRef.getBoundingClientRect()
      const scale = this.minimapScale
      
      return {
        width: `${rect.width * scale}px`,
        height: `${rect.height * scale}px`,
        transform: `translate(${-this.canvasOffset.x * scale}px, ${-this.canvasOffset.y * scale}px)`,
        opacity: 0.8
      }
    },
    
    minimapHoverIndicatorStyle() {
      if (!this.minimapRect || !this.showMinimapHover) return {}
      
      const viewportWidth = this.containerRef?.clientWidth * this.minimapScale
      const viewportHeight = this.containerRef?.clientHeight * this.minimapScale
      
      return {
        width: `${viewportWidth}px`,
        height: `${viewportHeight}px`,
        transform: `translate(${this.minimapHoverPosition.x}px, ${this.minimapHoverPosition.y}px)`,
        opacity: 0.8
      }
    }
  },
  
  methods: {
    getMinimapCanvasStyle(canvas) {
      const scale = this.minimapScale
      return {
        position: 'absolute',
        width: `${800 * scale}px`,
        height: `${600 * scale}px`,
        transform: `translate(${(canvas.position?.x || 0) * scale}px, ${(canvas.position?.y || 0) * scale}px)`,
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '2px',
        overflow: 'hidden'
      }
    },
    
    handleMinimapEnter(event) {
      this.showMinimapHover = true
      this.minimapRect = event.currentTarget.getBoundingClientRect()
    },
    
    handleMinimapMove(event) {
      if (!this.minimapRect) return
      
      const contentRect = event.currentTarget.querySelector('.minimap-content').getBoundingClientRect()
      const x = event.clientX - contentRect.left
      const y = event.clientY - contentRect.top
      
      const viewportWidth = this.containerRef.clientWidth * this.minimapScale
      const viewportHeight = this.containerRef.clientHeight * this.minimapScale
      
      this.minimapHoverPosition = {
        x: Math.max(0, Math.min(x - viewportWidth / 2, contentRect.width - viewportWidth)),
        y: Math.max(0, Math.min(y - viewportHeight / 2, contentRect.height - viewportHeight))
      }
    },
    
    handleMinimapLeave() {
      this.showMinimapHover = false
      this.minimapRect = null
    },
    
    handleMinimapClick(event) {
      if (!this.minimapRect) return
      
      const contentRect = event.currentTarget.querySelector('.minimap-content').getBoundingClientRect()
      const x = event.clientX - contentRect.left
      const y = event.clientY - contentRect.top
      
      const totalWidth = 3000 * this.minimapScale
      const totalHeight = 3000 * this.minimapScale
      
      const ratioX = x / totalWidth
      const ratioY = y / totalHeight
      
      const canvasX = -(ratioX * 3000 - this.containerRef.clientWidth / 2)
      const canvasY = -(ratioY * 3000 - this.containerRef.clientHeight / 2)
      
      this.$emit('update:canvas-offset', { x: canvasX, y: canvasY })
    },
    
    updateMinimapScale() {
      const container = this.$el.querySelector('.minimap-content')
      if (!container) return
      
      const contentWidth = 3000
      const contentHeight = 3000
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      
      this.minimapScale = Math.min(
        containerWidth / contentWidth,
        containerHeight / contentHeight
      ) * 0.8
    }
  },
  
  mounted() {
    this.updateMinimapScale()
    window.addEventListener('resize', this.updateMinimapScale)
  },
  
  beforeDestroy() {
    window.removeEventListener('resize', this.updateMinimapScale)
  }
}
</script>

<style lang="scss" scoped>
.minimap-container {
  position: fixed;
  right: 340px;
  bottom: 20px;
  width: 240px;
  height: 180px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
  pointer-events: auto;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .minimap-header {
    height: 24px;
    line-height: 24px;
    padding: 0 8px;
    background: #f5f7fa;
    border-bottom: 1px solid #ddd;
    font-size: 12px;
    color: #666;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 4px;

    i {
      font-size: 14px;
      color: #909399;
    }
  }

  .minimap-content {
    position: relative;
    height: calc(100% - 24px);
    background: #f5f7fa;
    overflow: hidden;

    .minimap-viewport {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .minimap-infinite-content {
      position: absolute;
      transform-origin: 0 0;
      will-change: transform;
      transition: transform 0.15s;

      .minimap-canvas {
        position: absolute;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.15s ease-out;

        &:hover {
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .minimap-canvas-content {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;

          :deep(.form-canvas) {
            transform-origin: 0 0;
            pointer-events: none;

            .form-item-wrapper {
              margin: 1px;
              padding: 1px;
              min-height: auto;
              border: 1px solid rgba(0, 0, 0, 0.05);
            }
          }
        }
      }
    }

    .minimap-indicator {
      position: absolute;
      border: 2px solid #409EFF;
      background: rgba(64, 158, 255, 0.1);
      pointer-events: none;
      z-index: 11;
      transition: all 0.15s ease-out;
      box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.3);

      &.is-hover {
        z-index: 12;
        border-color: #67C23A;
        background: rgba(103, 194, 58, 0.1);
        box-shadow: 0 0 0 1px rgba(103, 194, 58, 0.3);
      }
    }
  }
}
</style> 