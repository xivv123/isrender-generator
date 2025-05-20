/**
 * 画布操作工具类
 * 提供画布拖拽、缩放等操作方法
 */
export default class CanvasOperations {
  constructor(options = {}) {
    // 缩放相关配置
    this.canvasScale = options.initialScale || 1;
    this.minScale = options.minScale || 0.1;
    this.maxScale = options.maxScale || 4;
    this.scaleStep = options.scaleStep || 0.1;
    
    // 拖拽相关状态
    this.isDraggingCanvas = false;
    this.canvasOffset = { x: 0, y: 0 };
    this.dragStart = { x: 0, y: 0 };
    
    // 画布项拖拽相关状态
    this.isDraggingItem = false;
    this.dragItemIndex = -1;
    this.lastMousePos = { x: 0, y: 0 };
    this.dragItemStartPos = { x: 0, y: 0 };
    
    // 回调函数
    this.onScaleChange = options.onScaleChange || function() {};
    this.onOffsetChange = options.onOffsetChange || function() {};
    this.onCanvasItemMouseDown = options.onCanvasItemMouseDown || function() {};
    this.onCanvasItemDrag = options.onCanvasItemDrag || function() {};
    this.onCanvasItemDragEnd = options.onCanvasItemDragEnd || function() {};
    
    // 引用
    this.canvasContainerRef = null;
    this.infiniteContentRef = null;
    this.canvasList = [];
  }
  
  // 初始化引用
  setRefs(canvasContainerRef, infiniteContentRef, canvasList) {
    this.canvasContainerRef = canvasContainerRef;
    this.infiniteContentRef = infiniteContentRef;
    this.canvasList = canvasList;
    return this;
  }
  
  // 缩放相关方法
  zoomIn() {
    const newScale = Math.min(
      this.canvasScale + this.scaleStep,
      this.maxScale
    );
    if (newScale !== this.canvasScale) {
      this.canvasScale = newScale;
      this.onScaleChange(this.canvasScale);
    }
    return this.canvasScale;
  }

  zoomOut() {
    const newScale = Math.max(
      this.canvasScale - this.scaleStep,
      this.minScale
    );
    if (newScale !== this.canvasScale) {
      this.canvasScale = newScale;
      this.onScaleChange(this.canvasScale);
    }
    return this.canvasScale;
  }

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
        setTimeout(() => {
          if (this.infiniteContentRef) {
            this.infiniteContentRef.style.filter = 'contrast(1.01)';
            setTimeout(() => {
              this.infiniteContentRef.style.filter = '';
            }, 50);
          }
        }, 0);
        
        this.onScaleChange(this.canvasScale);
      } else {
        this.canvasScale = currentScale + scaleIncrement * step;
        this.onScaleChange(this.canvasScale);
      }
    }, stepTime);
    
    // 重置位置
    this.canvasOffset = { x: 0, y: 0 };
    this.onOffsetChange(this.canvasOffset);
    
    return this;
  }

  // 画布拖拽相关方法
  handleCanvasMouseDown(event) {
    // 只有在点击画布容器本身时才允许拖动
    if (
      this.canvasContainerRef && 
      (event.target === this.canvasContainerRef || 
       event.target === this.infiniteContentRef)
    ) {
      if (event.button === 0) {
        // 只响应左键
        this.isDraggingCanvas = true;
        this.dragStart = {
          x: event.clientX - this.canvasOffset.x,
          y: event.clientY - this.canvasOffset.y,
        };
        if (this.canvasContainerRef) {
          this.canvasContainerRef.style.cursor = "grabbing";
        }
      }
    }
    return this;
  }

  handleCanvasMouseMove(event) {
    if (this.isDraggingCanvas) {
      requestAnimationFrame(() => {
        this.canvasOffset = {
          x: event.clientX - this.dragStart.x,
          y: event.clientY - this.dragStart.y,
        };
        this.onOffsetChange(this.canvasOffset);
      });
    }
    return this;
  }

  handleCanvasMouseUp() {
    if (this.isDraggingCanvas) {
      this.isDraggingCanvas = false;
      if (this.canvasContainerRef) {
        this.canvasContainerRef.style.cursor = "grab";
      }
    }
    return this;
  }

  handleWheel(event) {
    // 检查事件源是否来自工具栏
    if (event.target.closest(".form-material")) {
      return this; // 如果是工具栏中的滚动，直接返回不处理
    }

    if (event.ctrlKey) {
      // 缩放逻辑
      const delta = event.deltaY < 0 ? this.scaleStep : -this.scaleStep;
      const newScale = Math.max(
        this.minScale,
        Math.min(this.maxScale, this.canvasScale + delta)
      );

      if (newScale !== this.canvasScale && this.canvasContainerRef) {
        // 获取鼠标在容器中的相对位置
        const rect = this.canvasContainerRef.getBoundingClientRect();
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
        
        this.onScaleChange(this.canvasScale);
        this.onOffsetChange(this.canvasOffset);
      }
    }
    return this;
  }

  // 画布项拖拽相关方法
  handleCanvasItemMouseDown(event, index) {
    // 先通知父组件
    this.onCanvasItemMouseDown(event, index);
    
    // 如果是拖动手柄，则处理拖动逻辑
    if (event.target.closest(".canvas-drag-handle")) {
      this.isDraggingItem = true;
      this.dragItemIndex = index;
      
      if (index >= 0 && index < this.canvasList.length) {
        const canvas = this.canvasList[index];
        
        this.dragItemStartPos = {
          x: event.clientX / this.canvasScale - (canvas.position?.x || 0),
          y: event.clientY / this.canvasScale - (canvas.position?.y || 0),
        };

        this.lastMousePos = {
          x: event.clientX,
          y: event.clientY,
        };

        document.addEventListener("mousemove", this.handleCanvasItemDragBound = this.handleCanvasItemDrag.bind(this));
        document.addEventListener("mouseup", this.handleCanvasItemDragEndBound = this.handleCanvasItemDragEnd.bind(this));
      }
    }
    return this;
  }

  handleCanvasItemDrag(event) {
    if (!this.isDraggingItem) return this;

    requestAnimationFrame(() => {
      // 计算鼠标移动的距离，并考虑缩放比例
      const deltaX = (event.clientX - this.lastMousePos.x) / this.canvasScale;
      const deltaY = (event.clientY - this.lastMousePos.y) / this.canvasScale;

      // 通知父组件更新画布位置
      this.onCanvasItemDrag({
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
    return this;
  }

  handleCanvasItemDragEnd() {
    this.isDraggingItem = false;
    this.dragItemIndex = -1;
    this.lastMousePos = null;
    
    document.removeEventListener("mousemove", this.handleCanvasItemDragBound);
    document.removeEventListener("mouseup", this.handleCanvasItemDragEndBound);
    
    // 通知父组件拖拽结束
    this.onCanvasItemDragEnd();
    return this;
  }

  // 计算画布位置样式
  getCanvasPosition(canvas) {
    // 从propList.canvas中获取画布属性，而不是从根级属性
    const canvasProps = canvas.propList?.canvas || {};
    
    return {
      transform: `translate(${canvas.position?.x || 0}px, ${
        canvas.position?.y || 0
      }px)`,
      position: "absolute",
      top: 0,
      left: 0,
      width: (canvasProps.canvasWidth || canvas.width || 900) + 'px',
      height: (canvasProps.canvasHeight || canvas.height || 600) + 'px',
      background: (canvasProps.background || canvas.background || '#ffffff'),
      borderStyle: (canvasProps.borderStyle || canvas.borderStyle || 'solid'),
      borderWidth: (canvasProps.borderWidth || canvas.borderWidth || 1) + 'px',
      borderColor: (canvasProps.borderColor || canvas.borderColor || '#e0e0e0'),
      borderRadius: (canvasProps.borderRadius || canvas.borderRadius || 4) + 'px'
    };
  }
  
  // 获取当前缩放值
  getScale() {
    return this.canvasScale;
  }
  
  // 获取当前偏移值
  getOffset() {
    return this.canvasOffset;
  }
  
  // 设置缩放值
  setScale(scale) {
    this.canvasScale = Math.max(this.minScale, Math.min(this.maxScale, scale));
    this.onScaleChange(this.canvasScale);
    return this;
  }
  
  // 设置偏移值
  setOffset(offset) {
    this.canvasOffset = offset;
    this.onOffsetChange(this.canvasOffset);
    return this;
  }
} 