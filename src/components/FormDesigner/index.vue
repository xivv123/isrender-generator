<template>
  <div class="form-designer-wrapper">
    <designer-container @canvas-mouse-down="handleCanvasMouseDown" @canvas-mouse-move="handleCanvasMouseMove" @canvas-mouse-up="handleCanvasMouseUp" @canvas-wheel="handleWheel">
      <div class="floating-panels">
        <!-- 左侧组件工具栏 -->
        <form-material :component-counts="componentCounts" />
        <!-- 中间工具栏 -->
        <div class="center-toolbar">
          <div class="zoom-controls">
            <el-button-group>
              <el-button size="mini" icon="el-icon-zoom-out" @click="zoomOut" />
              <el-button size="mini" >{{ Math.round(canvasScale * 100) }}%</el-button >
              <el-button size="mini" icon="el-icon-zoom-in" @click="zoomIn" />
            </el-button-group>
            <el-button size="mini" @click="resetZoom">100%</el-button>
          </div>
          <el-button 
            class="create-canvas-btn" 
            size="mini" 
            type="primary" 
            icon="el-icon-plus" 
            @click.stop="showCanvasCreator"
            title="添加画布">
            添加画布
          </el-button>
        </div>
        <form-props 
          :activepropdataId = "activepropdataId"
          :propsdata="propsdata"
          :propList.sync="propList"
          @updatePropList="updatePropList"
          @updateComponentData="updateComponentData"/>
      </div>
      <div 
        ref="infiniteContent"
        class="infinite-content" 
        :style="{ transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasScale})`}"
      >
          <div v-for="(canvas, index) in canvasList"
            :key="canvas.id"
            class="canvas-wrapper"
            :class="{ 
              'is-active': index === activeCanvasIndex, 
              'has-active-component': index === activeCanvasIndex && 
              currentComponentIndex !== -1,}"
            :style="getCanvasPosition(canvas)"
            @mousedown.stop="handleCanvasItemMouseDown($event, index)"
          >
          <div class="canvas-drag-handle"><i class="el-icon-rank"></i></div>
          <!-- 优化顶部按钮组 -->
          <div class="canvas-buttons-group">
            <div class="canvas-generate-code" @click.stop="handleGenerateCode(index, canvas.id)">
              <i class="el-icon-document"></i>
              <span>生成代码</span>
            </div>
            <div class="canvas-props-handle" @click.stop="handleCanvasPropsClick(index, canvas.id)">
              <i class="el-icon-setting"></i>
              <span>画布属性</span>
            </div>
          </div>
          <form-canvas
            ref="formCanvas"
            v-model="canvas.components"
            :selected-canvas-id="canvasId"
            :current-index="index === activeCanvasIndex ? currentComponentIndex : -1"
            @component-click="(componentIndex, type, canvasId, itemIndex) =>handleComponentClick(index, componentIndex, type,canvasId,itemIndex)"
            @component-add="(componentData) => handleComponentAdd(index, componentData)"
            @form-select="data => handleFormSelect(data)" 
            @canvas-header-click="handleCanvasHeaderClick"
            :form-conf.sync="canvas.propList.form"
            :item-conf.sync="canvas.propList.component"
            :componentItem_default="componentItem_default"
            :canvasId="canvas.id"
            class="canvas-form-wrapper"
          />
          </div>
      </div>

      <!-- 修改小地图导航器位置和内容 -->
      <mini-map
          :canvas-list="canvasList"
          :active-canvas-index="activeCanvasIndex"
          :canvas-offset="canvasOffset"
          :canvas-scale="canvasScale"
          :container-ref="$refs.canvasContainer"
          @update:canvas-offset="(offset) => (canvasOffset = offset)"
          class="minimap-container"
          :style="{ right: isRightPanelCollapsed ? '20px' : '340px', display: isMiniMapVisible ? 'block' : 'none' }"
      />
      <el-button
          class="minimap-toggle-btn"
          :style="{ right: isRightPanelCollapsed ? '20px' : '340px', bottom: '20px' }"
          type="primary"
          size="mini"
          icon="el-icon-location"
          circle
          @click="isMiniMapVisible = !isMiniMapVisible"
      ></el-button>
    </designer-container>
    
    <!-- 添加画布创建器组件 -->
    <canvas-creator
      :visible.sync="canvasCreatorVisible"
      @confirm="handleCanvasCreatorConfirm"
      @cancel="handleCanvasCreatorCancel"
    />

    <!-- 添加代码生成弹出框组件 -->
    <code-generator-dialog
      :visible.sync="codeGeneratorVisible"
      :canvas-data="canvasData"
      @confirm="handleCodeGeneratorConfirm"
      @cancel="handleCodeGeneratorCancel"
    />
  </div>
</template>

<script>
import FormMaterial from "./form-material/index.vue";
import FormCanvas from "./form-canvas/index.vue";
import FormProps from "./form-props";
import MiniMap from "./components/MiniMap.vue";
import CanvasOperations from './components/CanvasOperations.js'; // 引入画布操作工具类
import CanvasCreator from './components/CanvasCreator.vue'; // 引入画布创建组件
import DesignerContainer from './components/DesignerContainer.vue'; // 引入设计器容器组件
import CodeGeneratorDialog from './components/CodeGeneratorDialog.vue'; // 引入代码生成弹出框组件
import {deepClone} from './utils/index'; // 引入代码生成弹出框组件

/**
 * 表单设计器主组件
 * 注意：拖拽和缩放功能已经提取到CanvasOperations.js工具类中
 * 这样分离后保持了原有DOM结构，同时增强了代码的可维护性
 */

export default {
  watch: {
  },
  components: { 
    FormMaterial,
    FormCanvas,
    FormProps,
    MiniMap,
    CanvasCreator, // 注册画布创建组件
    DesignerContainer, // 注册设计器容器组件
    CodeGeneratorDialog // 注册代码生成弹出框组件
  },
  data() {
    return {
      canvasId: 0,
      // renderData: renderData,
      currentComponentIndex: -1,
      // 添加画布缩放相关状态
      canvasScale: 1,
      minScale: 0.1,
      maxScale: 4,
      scaleStep: 0.1,
      position: { x: 0, y: 0 },
      activeCanvasIndex: 0,
      canvasOffset: { x: 0, y: 0 },
      isRightPanelCollapsed: false,
      propsdata:{},
      // 右边的属性栏位
      propList:{
        type: "form",
        form:{},
        canvas:{},
        component: {}
      },
      propList_default:{
        type: "form",
        form:{},
        canvas:{},
        component: {}
      },
      canvasList: [],
      componentItem_default: {},
      // 画布操作工具实例
      canvasOps: null,
      activepropdataId: "",
      itemIndex: "",
      canvasCreatorVisible: false,
      codeGeneratorVisible: false,
      isMiniMapVisible: true
    }
  },
  computed: {
    componentCounts() {
      // 计算各类组件数量
      const counts = {};
      this.canvasList.forEach(canvas => {
        if (canvas.components) {
          canvas.components.forEach(component => {
            const type = component.__config__.tag;
            counts[type] = (counts[type] || 0) + 1;
          })
        }
      });
      return counts;
    },
    
    canvasData() {
      return this.activeCanvasIndex >= 0 && this.activeCanvasIndex < this.canvasList.length 
        ? this.canvasList[this.activeCanvasIndex] 
        : null;
    }
  },
  methods: {
    handleComponentAdd(canvasIndex, componentData) {
      // 确保renderdata对象存在
      if (!componentData.renderdata) {
        componentData.renderdata = {};
      }
      
      // 使用generatePropMapping获取映射
      const propMapping = this.generatePropMapping(componentData);
      
      // 应用映射，将组件数据复制到renderdata
      Object.keys(propMapping).forEach(key => {
        const { target, prop } = propMapping[key];
        componentData.renderdata[key] = componentData[target][prop];
      });
      
      // 处理组件的slot配置
      if (componentData.__element__ && componentData.__element__.slot) {
        componentData.renderdata.slot = {};
        
        // 处理选项类组件的slot.options
        if (componentData.__element__.slot.options) {
          componentData.renderdata.slot.options = deepClone(componentData.__element__.slot.options);
        }
        
        // 处理折叠面板组件的slot.default
        if (componentData.__element__.slot.default) {
          componentData.renderdata.slot.default = deepClone(componentData.__element__.slot.default);
        }
      }
      
      this.propList.component[componentData.id] = deepClone(componentData);
      // 同步更新到当前画布的propList.component
      this.canvasList[canvasIndex].propList.component = {...this.propList.component};
    },
    
    /**
     * 生成组件属性到renderdata的映射
     * @param {Object} component - 组件实例
     * @return {Object} 映射对象 - 键为renderdata属性名，值为来源位置
     */
    generatePropMapping(component) {
      const mapping = {};
      
      // 定义要检查的组件部分
      const sections = ['__label__', '__regrule__', '__element__', '__config__'];
      // 遍历每个部分，提取所有属性
      sections.forEach(section => {
        if (component[section]) {
          Object.keys(component[section]).forEach(prop => {
            // 为每个属性创建一个映射项
            mapping[prop] = { target: section, prop };
          });
        }
      });
      
      return mapping;
    },

    updateComponentData(itemdata) {
      this.componentItem_default = itemdata
    },

    updatePropList(data, type) {
      const targetCanvas = this.canvasList.find(canvas => canvas.id === this.canvasId);

      // if (!this.propList_default[type].labelPosition) {
      //   this.propList_default[type] = deepClone(data)
      // }
      if (type === "component") {
        // 不修改 component 数组，只更新当前选中的组件
         
        if (targetCanvas && Array.isArray(targetCanvas.components)) {
          // 找到当前选中的组件并更新
          const selectedComponent_render = targetCanvas.propList.component[this.activepropdataId].renderdata;
          
          // 使用映射和循环优化属性更新
          const propMapping = this.generatePropMapping(targetCanvas.components[this.itemIndex]);

          // 遍历映射更新对应属性
          Object.keys(propMapping).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              const { target, prop } = propMapping[key];
              targetCanvas.components[this.itemIndex][target][prop] = data[key];
            }
          })
          
          // 同步slot配置，确保选项数据更新到实际组件
          if (this.propList.component && this.propList.component[this.activepropdataId] && 
              this.propList.component[this.activepropdataId].__element__ && 
              this.propList.component[this.activepropdataId].__element__.slot) {
            // 将slot配置从propList复制到实际组件
            if (data.slot) {
              targetCanvas.components[this.itemIndex].__element__.slot = deepClone(data.slot);
            }
          }
          
          Object.assign(selectedComponent_render, data);
          // 同步renderdata，防止修改了数据，导致表单初始化的问题
          Object.assign(this.propList.component[this.activepropdataId].renderdata, data);
        }
      } else {
        this.propList[type] = data
        // 直接复制propList对象，不需要额外同步
        targetCanvas.propList[type] = deepClone(this.propList[type])
      }
    },
        // 添加新建画布方法核心方法
    showCanvasCreator() {
      this.canvasCreatorVisible = true;
    },

    handleCanvasCreatorConfirm(formData) {
      // 获取容器的宽高
      const containerWidth = this.$refs.canvasContainer ? this.$refs.canvasContainer.clientWidth : window.innerWidth;
      const containerHeight = this.$refs.canvasContainer ? this.$refs.canvasContainer.clientHeight : window.innerHeight;
      
      // 获取画布的宽高
      const canvasWidth = parseInt(formData.canvasWidth) || 900;
      const canvasHeight = parseInt(formData.canvasHeight) || 600;
      
      // 计算中心位置
      // 需要考虑当前的画布偏移量和缩放因子
      const centerX = (containerWidth / 2 - this.canvasOffset.x) / this.canvasScale - canvasWidth / 2;
      const centerY = (containerHeight / 2 - this.canvasOffset.y) / this.canvasScale - canvasHeight / 2;
      
      // 构建新画布对象
      const newCanvas = {
        id: Date.now(),
        position: {
          x: centerX,
          y: centerY
        },
        // 画布属性 - 使用正确的属性名
        title: formData.canvasTitle,
        description: formData.canvasDescription,
        width: formData.canvasWidth,
        height: formData.canvasHeight, // 恢复原有拼写
        background: formData.background,
        borderStyle: formData.borderStyle,
        borderWidth: formData.borderWidth,
        borderColor: formData.borderColor,
        borderRadius: formData.borderRadius,
        // 左边组件的使用记录
        materialdata: {},
        // 中间画布的组件
        components: [],
        // 右边属性栏位的保存
        propList: {
          ...deepClone(this.propList_default),
          canvas: { ...formData }
        },
        componentrenderdata: []
      };
      
      // 添加到画布列表
      this.canvasList.push(newCanvas);
      
      // 激活新创建的画布
      this.activeCanvasIndex = this.canvasList.length - 1;
      this.currentComponentIndex = -1;
      this.canvasId = newCanvas.id;
      
      // 更新右侧属性面板
      this.propList = deepClone(newCanvas.propList);
    },

    handleCanvasCreatorCancel() {
      this.canvasCreatorVisible = false;
    },

    handleComponentClick(canvasIndex, targetComponent, type, canvasId, itemIndex) {

        this.itemIndex = itemIndex
        this.activepropdataId = targetComponent.id
        const selectedCanvasIndex = this.canvasList.findIndex(canvas => canvas.id === canvasId);
        let newPropList = deepClone(this.canvasList[selectedCanvasIndex].propList);
        newPropList.type = type
        this.propList = newPropList

        // 清除所有画布的选中状态
        this.$refs.formCanvas.forEach((canvas, index) => {
          if (index !== canvasIndex) canvas.clearAllSelection()
        })
    },

    handleFormSelect(data) {
      // 获取当前表单对应的画布索引
      const selectedCanvasIndex = this.canvasList.findIndex(canvas => canvas.id === data.id);

      if (selectedCanvasIndex !== -1) {
        // 激活选中的画布
        this.activeCanvasIndex = selectedCanvasIndex;
        this.canvasId = data.id;
        // 更新右侧属性面板
        let xxc = deepClone(this.canvasList[selectedCanvasIndex].propList);
        this.propList = deepClone(this.canvasList[selectedCanvasIndex].propList);
        // 清除所有画布上的选中状态
        this.$refs.formCanvas.forEach((canvas, index) => {
          if (index !== selectedCanvasIndex) canvas.clearAllSelection()
        })
      }
    },

    // 处理画布属性按钮点击
    handleCanvasPropsClick(index, canvasId) {
      this.activeCanvasIndex = index;
      this.canvasId = canvasId;
      
      // 设置属性类型为 canvas，并更新右侧属性面板
      const selectedCanvas = this.canvasList.find(canvas => canvas.id === canvasId);
      if (selectedCanvas) {
        let newPropList = deepClone(selectedCanvas.propList);
        newPropList.type = "canvas"; // 设置类型为canvas
        this.propList = newPropList;
        
        // 清除组件选中状态
        this.currentComponentIndex = -1;
        
        // 清除所有画布上的选中状态
        if (this.$refs.formCanvas) {
          this.$refs.formCanvas.forEach(canvas => {
            canvas.clearAllSelection();
          });
        }
      }},

    // 缩放相关方法 - 改为使用CanvasOperations
    zoomIn() {
      this.canvasScale = this.canvasOps.zoomIn();
    },

    zoomOut() {
      this.canvasScale = this.canvasOps.zoomOut();
    },

    resetZoom() {
      this.canvasOps.resetZoom();
    },

    // 画布拖拽相关方法 - 改为使用CanvasOperations
    handleCanvasMouseDown(event) {
      this.canvasOps.handleCanvasMouseDown(event);
    },

    handleCanvasMouseMove(event) {
      this.canvasOps.handleCanvasMouseMove(event);
    },

    handleCanvasMouseUp() {
      this.canvasOps.handleCanvasMouseUp();
    },

    handleWheel(event) {
      this.canvasOps.handleWheel(event);
    },

    handleCanvasItemMouseDown(event, index) {
      // 先激活当前画布
      if (this.activeCanvasIndex !== index) {
        this.activeCanvasIndex = index;
        this.currentComponentIndex = -1; // 重置组件选中状态
      }
      
      // 使用CanvasOperations处理拖拽
      this.canvasOps.handleCanvasItemMouseDown(event, index);
    },
    
    // 画布项位置更新处理函数
    handleCanvasItemDragUpdate(data) {
      const canvas = this.canvasList[data.index];
      if (canvas) {
        // 更新画布位置
        const newPosition = {
          x: (canvas.position?.x || 0) + data.deltaX,
          y: (canvas.position?.y || 0) + data.deltaY,
        };

        this.$set(canvas, "position", newPosition);
      }
    },

    handleCanvasClick(index) {
      // 激活当前画布
      if (this.activeCanvasIndex !== index) {
        this.activeCanvasIndex = index;
        this.currentComponentIndex = -1; // 重置组件选中状态
        this.canvasId = this.canvasList[index].id;
        
        // 更新右侧属性面板
        this.propList = this.canvasList[index].propList;
        
        // 清除所有画布上的选中状态
        if (this.$refs.formCanvas) {
          this.$refs.formCanvas.forEach((canvas, canvasIndex) => {
            if (canvasIndex !== index) {
              canvas.clearAllSelection();
            }
          });
        }
      }
    },

    getCanvasPosition(canvas) {
      return this.canvasOps.getCanvasPosition(canvas);
    },

    // 处理取消所有表单选中
    handleFormDeselectAll(currentUid) {
      // 遍历所有画布，取消除了当前画布外的所有选中状态
      if (this.$refs.formCanvas) {
        this.$refs.formCanvas.forEach((canvas) => {
          if (canvas._uid !== currentUid) {
            canvas.deselectForm();
          }
        });
      }
    },

    // 处理画布激活
    handleCanvasActivate(index) {
      
      if (this.activeCanvasIndex !== index) {
        this.activeCanvasIndex = index;
      }
    },

    handleCanvasHeaderClick() {
      // 处理表单头部点击事件
      this.currentComponentIndex = -1;
    },
    
    // 处理生成代码按钮点击
    handleGenerateCode(index, canvasId) {
      console.log('生成代码按钮点击', index, canvasId);
      // 激活当前画布
      this.activeCanvasIndex = index;
      this.canvasId = canvasId;
      
      // 找到当前画布数据
      const currentCanvas = this.canvasList.find(canvas => canvas.id === canvasId);
      if (currentCanvas) {
        // 更新右侧属性面板
        this.propList = currentCanvas.propList;
        // 打开代码生成弹窗
        this.$nextTick(() => {
          this.codeGeneratorVisible = true;
        });
      }
    },

    handleCodeGeneratorConfirm(generatedCode) {
      // 处理生成的代码
      console.log('生成的代码:', generatedCode);
      this.codeGeneratorVisible = false;
    },

    handleCodeGeneratorCancel() {
      this.codeGeneratorVisible = false;
    },
  },
  mounted() {
    // 创建画布
    this.showCanvasCreator();
    
    // 初始化画布操作工具
    this.canvasOps = new CanvasOperations({
      initialScale: this.canvasScale,
      minScale: this.minScale,
      maxScale: this.maxScale,
      scaleStep: this.scaleStep,
      onScaleChange: (scale) => {
        this.canvasScale = scale;
      },
      onOffsetChange: (offset) => {
        this.canvasOffset = offset;
      },
      onCanvasItemMouseDown: (event, index) => {
        // 已在handleCanvasItemMouseDown方法中处理激活画布逻辑
      },
      onCanvasItemDrag: (data) => {
        this.handleCanvasItemDragUpdate(data);
      },
      onCanvasItemDragEnd: () => {
        // 可以在这里添加拖拽结束后的逻辑
      }
    });
    
    // 设置引用 - 在下一个渲染周期确保引用可用
    this.$nextTick(() => {
      if (this.$refs.canvasContainer && this.$refs.infiniteContent) {
        this.canvasOps.setRefs(
          this.$refs.canvasContainer,
          this.$refs.infiniteContent,
          this.canvasList
        );
      } else {
        console.warn('Canvas container or infinite content ref not available');
      }
    });
  },
  updated() {
    // 更新工具类引用
    if (this.canvasOps && this.$refs.canvasContainer && this.$refs.infiniteContent) {
      this.canvasOps.setRefs(
        this.$refs.canvasContainer,
        this.$refs.infiniteContent,
        this.canvasList
      );
    }
  }
};
</script>

<style lang="scss" scoped>
/* 添加新的包装样式 */
.form-designer-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 保留原有样式，但去除已迁移到子组件的部分 */
.center-toolbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  padding: 8px 12px;
  pointer-events: auto;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 15px;

  &:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .zoom-controls {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-button-group {
      margin-right: 8px;

      .el-button {
        border-color: #dcdfe6;

        &:hover {
          background: #ecf5ff;
          color: #409eff;
        }
      }
    }
  }
  
  .create-canvas-btn {
    margin-left: 10px;
    background-color: #409EFF;
    border-color: #409EFF;
    color: white;
    transition: all 0.3s;
    
    &:hover {
      background-color: #66b1ff;
      border-color: #66b1ff;
      transform: translateY(-1px);
    }
  }
}

/* 保留其他原有样式 */
.floating-panels {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; // 允许点击穿透到底层画布
  z-index: 100;

  .right-panels {
    position: absolute;
    right: 20px;
    top: 20px;
    bottom: 20px;
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: auto; // 恢复面板的交互

    .floating-props {
      flex: 1;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s;

      &:hover {
        transform: translateX(-2px);
      }
    }
  }
}

/* 无限内容区样式 */
.infinite-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
  backface-visibility: hidden;
  // transform-style: preserve-3d; /* 提高渲染质量 */
  display: flex;
  gap: 20px;
  padding: 20px;
  transform-origin: 0 0;

  &:active {
    cursor: grabbing;
  }
}

/* 画布包装器样式 */
.canvas-wrapper {
  position: absolute;
  width: 800px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  will-change: transform; /* 提示浏览器优化渲染 */
  backface-visibility: hidden;
  transform-style: preserve-3d;
  -webkit-font-smoothing: antialiased; /* 提高文字渲染质量 */
  -moz-osx-font-smoothing: grayscale;

  &.is-active, &:hover {
    box-shadow: 0 0 0 2px #409eff, 0 4px 16px rgba(0, 0, 0, 0.15);
    z-index: 2;

    .canvas-drag-handle {
      opacity: 1;
    }
  }

  .canvas-drag-handle {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 20px;
    background: #409eff;
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    opacity: 0;
    transition: opacity 0.3s;

    i {
      color: #fff;
      font-size: 16px;
    }
  }
}

// 拖拽时的样式
.dragging {
  opacity: 0.5;
  background: #f0f9eb !important;
}

.canvas-wrapper {
  &.is-dragging {
    will-change: transform;
    transition: none !important;
  }

  position: relative;
  display: flex;
  flex-direction: column;

  // 当画布激活或鼠标悬停时显示属性按钮
  &.is-active, &:hover {
    .canvas-buttons-group {
      opacity: 1;
    }
  }

  // .resize-handlers {
  //   position: absolute;
  //   inset: 0;
  //   pointer-events: none;
    
  //   .resize-handle {
  //     position: absolute;
  //     background-color: #409EFF;
  //     pointer-events: auto;
  //     z-index: 100;
      
  //     &:hover {
  //       background-color: #66b1ff;
  //     }
      
  //     // 角落的调整点
  //     &.resize-handle-tl, &.resize-handle-tr, &.resize-handle-bl, &.resize-handle-br {
  //       width: 8px;
  //       height: 8px;
  //       border-radius: 50%;
  //     }
      
  //     &.resize-handle-tl {
  //       top: -4px;
  //       left: -4px;
  //       cursor: nwse-resize;
  //     }
      
  //     &.resize-handle-tr {
  //       top: -4px;
  //       right: -4px;
  //       cursor: nesw-resize;
  //     }
      
  //     &.resize-handle-bl {
  //       bottom: -4px;
  //       left: -4px;
  //       cursor: nesw-resize;
  //     }
      
  //     &.resize-handle-br {
  //       bottom: -4px;
  //       right: -4px;
  //       cursor: nwse-resize;
  //     }
      
  //     // 边的调整点
  //     &.resize-handle-t, &.resize-handle-b {
  //       left: 50%;
  //       transform: translateX(-50%);
  //       width: 20px;
  //       height: 4px;
  //     }
      
  //     &.resize-handle-l, &.resize-handle-r {
  //       top: 50%;
  //       transform: translateY(-50%);
  //       width: 4px;
  //       height: 20px;
  //     }
      
  //     &.resize-handle-t {
  //       top: -4px;
  //       cursor: ns-resize;
  //     }
      
  //     &.resize-handle-r {
  //       right: -4px;
  //       cursor: ew-resize;
  //     }
      
  //     &.resize-handle-b {
  //       bottom: -4px;
  //       cursor: ns-resize;
  //     }
      
  //     &.resize-handle-l {
  //       left: -4px;
  //       cursor: ew-resize;
  //     }
  //   }
  // }
  
  // .canvas-drag-handle {
  //   z-index: 101; // 确保拖拽手柄在调整大小控制点之上
  // }
  
  // 添加按钮组样式
  .canvas-buttons-group {
    position: absolute;
    top: -20px;
    right: 0;
    display: flex;
    flex-direction: row;
    z-index: 101;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &.is-active, &:hover {
    .canvas-buttons-group {
      opacity: 1;
    }
  }
  
  // 生成代码按钮样式
  .canvas-generate-code {
    height: 20px;
    background: #1a56a8; // 深蓝色
    border-radius: 4px 0 0 0; // 左上角圆角
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0 10px;
    color: white;
    font-size: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    margin-right: 1px; // 按钮之间的间距
    
    i {
      font-size: 14px;
      margin-right: 5px;
    }
    
    span {
      letter-spacing: normal;
      font-weight: 500;
    }
    
    &:hover {
      background: #2b6bc5; // 悬停时的颜色
      box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.15);
      transform: translateY(-3px);
    }
  }
  
  // 修改画布属性按钮样式
  .canvas-props-handle {
    position: relative; // 改为相对定位，作为按钮组的一部分
    top: unset; // 清除之前的绝对定位
    right: unset;
    height: 20px;
    background: #409EFF; // 保持原来的蓝色
    border-radius: 0 4px 0 0; // 右上角圆角
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0 10px;
    color: white;
    font-size: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    
    i {
      font-size: 14px;
      margin-right: 5px;
    }
    
    span {
      letter-spacing: normal;
      font-weight: 500;
    }
    
    &:hover {
      background: #66b1ff;
      box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.15);
      transform: translateY(-3px);
    }
  }


}

.minimap-container {
  position: fixed;
  right: 340px; // 调整位置到属性栏左侧
  bottom: 20px;
  width: 240px; // 稍微调小一点
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

  // .minimap-header {
  //   height: 24px;
  //   line-height: 24px;
  //   padding: 0 8px;
  //   background: #f5f7fa;
  //   border-bottom: 1px solid #ddd;
  //   font-size: 12px;
  //   color: #666;
  //   user-select: none;
  // }

  // .minimap-content {
  //   position: relative;
  //   height: calc(100% - 24px);
  //   background: #f5f7fa;
  //   overflow: hidden;

  //   .minimap-viewport {
  //     position: absolute;
  //     top: 0;
  //     left: 0;
  //     right: 0;
  //     bottom: 0;
  //     overflow: hidden;
  //   }

  //   // .minimap-infinite-content {
  //   //   position: absolute;
  //   //   transform-origin: 0 0;
  //   //   will-change: transform;
  //   //   transition: transform 0.15s;

  //   //   .minimap-canvas {
  //   //     position: absolute;
  //   //     background: #fff;
  //   //     box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  //   //     transition: transform 0.15s ease-out;

  //   //     &:hover {
  //   //       z-index: 2;
  //   //       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  //   //     }

  //   //     .minimap-canvas-content {
  //   //       position: relative;
  //   //       width: 100%;
  //   //       height: 100%;
  //   //       overflow: hidden;

  //   //       :deep(.form-canvas) {
  //   //         transform-origin: 0 0;
  //   //         pointer-events: none;

  //   //         .form-item-wrapper {
  //   //           margin: 1px;
  //   //           padding: 1px;
  //   //           min-height: auto;
  //   //           border: 1px solid rgba(0, 0, 0, 0.05);
  //   //         }
  //   //       }
  //   //     }
  //   //   }
  //   // }

  //   // .minimap-hover-indicator {
  //   //   position: absolute;
  //   //   border: 2px solid #409eff;
  //   //   background: rgba(64, 158, 255, 0.1);
  //   //   pointer-events: none;
  //   //   z-index: 12;
  //   //   transition: transform 0.1s ease-out;
  //   //   box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.3);
  //   // }

  //   // .minimap-viewport-indicator {
  //   //   position: absolute;
  //   //   border: 2px solid #409eff;
  //   //   background: rgba(64, 158, 255, 0.1);
  //   //   pointer-events: none;
  //   //   z-index: 11;
  //   //   transition: transform 0.15s ease-out;
  //   //   box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.3);
  //   // }
  // }
}

/* 添加右侧工具组收缩样式 */
.right-panels {
  position: relative;
  width: 300px;
  transition: all 0.3s ease;

  .right-collapse-btn {
    position: absolute;
    left: -16px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 40px;
    background-color: #409eff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px 0 0 4px;
    z-index: 100;
    transition: all 0.3s ease;

    &:hover {
      background-color: #66b1ff;
    }

    i {
      font-size: 12px;
    }
  }

  &.collapsed {
    width: 0 !important;
    overflow: hidden;

    .floating-props {
      display: none;
    }
  }
}

/* 添加画布属性面板样式 */
.canvas-props-panel {
  position: absolute;
  top: 0;
  right: -365px; /* 直接放置在画布右侧 */
  width: 360px;
  // background: #fff;
  border-radius: 0 8px 8px 0;
  box-shadow: 3px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 101; /* 要比画布高，但比其他浮动控件低 */
  pointer-events: auto;
  overflow: hidden;
  height: 100%; /* 与画布等高 */
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* 添加弹性动画效果 */
  border: 1px solid #e4e7ed;
  border-left: none;
  animation: slideInPanel 0.3s forwards;
  
  @keyframes slideInPanel {
    from { transform: translateX(-30px); opacity: 0.3; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(to right, #67C23A, #85ce61); /* 使用渐变背景 */
    border-bottom: 1px solid #e4e7ed;
    color: white;
    
    span {
      font-weight: bold;
      font-size: 14px;
    }
    
    i {
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
      
      &:hover {
        transform: rotate(90deg);
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
  
  .panel-content {
    // padding: 16px;
    overflow: hidden; /* 让form-props组件自己处理滚动 */
    flex: 1;
    display: flex;
    flex-direction: column;
    
    /* 设置form-props样式 */
    :deep(.form-props) {
      flex: 1;
      border: none !important;
      box-shadow: none !important;
      margin: 0 !important;
      display: flex;
      flex-direction: column;
      
      /* 调整其内部样式 */
      .form-props-header {
        display: none !important; /* 隐藏内部header */
      }
      
      .form-props-content {
        padding: 0;
        flex: 1;
        overflow-y: auto;
      }
      
      /* 优化内部表单项间距 */
      .form-item {
        margin-bottom: 8px !important;
        padding: 0 12px;
      }
    }
  }
  
  &:hover {
    box-shadow: 5px 0 20px rgba(0, 0, 0, 0.15);
  }
}

/* 添加左侧工具面板样式 */
.canvas-tools-panel {
  position: absolute;
  top: 0;
  left: -363px; /* 放置在画布左侧 */
  width: 360px;
  border-radius: 8px 0 0 8px;
  box-shadow: -3px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 101; /* 要比画布高，但比其他浮动控件低 */
  pointer-events: auto;
  overflow: hidden;
  height: 100%; /* 与画布等高 */
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* 添加弹性动画效果 */
  border: 1px solid #e4e7ed;
  border-right: none;
  animation: slideInPanelFromLeft 0.3s forwards;
  background: #fff;
  
  @keyframes slideInPanelFromLeft {
    from { transform: translateX(30px); opacity: 0.3; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(to right, #409EFF, #66b1ff); /* 使用蓝色渐变背景区分于右侧面板 */
    border-bottom: 1px solid #e4e7ed;
    color: white;
    
    span {
      font-weight: bold;
      font-size: 14px;
    }
    
    i {
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
      
      &:hover {
        transform: rotate(90deg);
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
  
  .panel-content {
    padding: 16px;
    overflow-y: auto;
    flex: 1;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: #dcdfe6;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
      background-color: #f5f7fa;
    }
  }
  
  &:hover {
    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.15);
  }
}

.minimap-toggle-btn {
  position: fixed;
  bottom: 20px;
  z-index: 1000;
}
</style>

