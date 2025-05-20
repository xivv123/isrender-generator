<template>
  <el-dialog
    title="添加新画布"
    :visible.sync="dialogVisible"
    width="500px"
    @close="handleClose"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    append-to-body
    custom-class="canvas-creator-dialog"
  >
    <div class="canvas-creator-content">
      <magicbox-form-core
        v-if="dialogVisible"
        v-model="formData"
        :renderdata="renderData"
        ref="formCore"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MagicboxFormCore from '@/components/is-render-core/form-core.vue'
import canvasAttributesData from '@/config/create-data/canvas-attributes-data'
import { deepClone } from '@/components/is-render-core/utils/index'

export default {
  name: 'CanvasCreator',
  components: {
    MagicboxFormCore
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {},
      renderData: canvasAttributesData
      // renderData: {
      //   size: 'small',
      //   labelPosition: 'left',
      //   labelWidth: 100,
      //   itemRenderList: [
      //     // 画布标题
      //     {
      //       type: 'el-input',
      //       __config__: {
      //         layout: 'colFormItem',
      //         span: 24,
      //         formId: 'canvas_title_field'
      //       },
      //       __label__: {
      //         label: '标题',
      //         showLabel: true
      //       },
      //       __element__: {
      //         key: 'title',
      //         tag: 'el-input',
      //         placeholder: '请输入画布标题',
      //         clearable: true,
      //         value: '新画布'
      //       },
      //       __regrule__: {
      //         required: true
      //       }
      //     },
      //     // 画布描述
      //     {
      //       type: 'el-input',
      //       __config__: {
      //         layout: 'colFormItem',
      //         span: 24,
      //         formId: 'canvas_description_field'
      //       },
      //       __label__: {
      //         label: '描述',
      //         showLabel: true
      //       },
      //       __element__: {
      //         key: 'description',
      //         tag: 'el-input',
      //         type: 'textarea',
      //         rows: 2,
      //         placeholder: '请输入画布描述',
      //         value: ''
      //       }
      //     },
      //     // 画布尺寸，放在一行
      //     {
      //       type: 'el-row',
      //       __config__: {
      //         layout: 'rowFormItem',
      //         gutter: 15
      //       },
      //       __slot__: {
      //         slots: [
      //           // 宽度
      //           {
      //             type: 'el-input-number',
      //             __config__: {
      //               layout: 'colFormItem',
      //               span: 12,
      //               formId: 'canvas_width_field'
      //             },
      //             __label__: {
      //               label: '宽度',
      //               showLabel: true
      //             },
      //             __element__: {
      //               key: 'width',
      //               tag: 'el-input-number',
      //               min: 400,
      //               max: 2000,
      //               step: 10,
      //               value: 900,
      //               style: { width: '100%' }
      //             }
      //           },
      //           // 高度
      //           {
      //             type: 'el-input-number',
      //             __config__: {
      //               layout: 'colFormItem',
      //               span: 12,
      //               formId: 'canvas_height_field'
      //             },
      //             __label__: {
      //               label: '高度',
      //               showLabel: true
      //             },
      //             __element__: {
      //               key: 'height',
      //               tag: 'el-input-number',
      //               min: 200,
      //               max: 3000,
      //               step: 10,
      //               value: 600,
      //               style: { width: '100%' }
      //             }
      //           }
      //         ]
      //       }
      //     },
      //     // 画布背景色
      //     {
      //       type: 'el-color-picker',
      //       __config__: {
      //         layout: 'colFormItem',
      //         span: 24,
      //         formId: 'canvas_background_field'
      //       },
      //       __label__: {
      //         label: '背景色',
      //         showLabel: true
      //       },
      //       __element__: {
      //         key: 'background',
      //         tag: 'el-color-picker',
      //         'show-alpha': true,
      //         value: '#ffffff'
      //       }
      //     },
      //     // 边框样式
      //     {
      //       type: 'el-select',
      //       __config__: {
      //         layout: 'colFormItem',
      //         span: 24,
      //         formId: 'canvas_border_style_field'
      //       },
      //       __label__: {
      //         label: '边框样式',
      //         showLabel: true
      //       },
      //       __element__: {
      //         key: 'borderStyle',
      //         tag: 'el-select',
      //         placeholder: '请选择边框样式',
      //         value: 'none',
      //         style: { width: '100%' },
      //         slot: {
      //           options: [
      //             { label: '无', value: 'none' },
      //             { label: '实线', value: 'solid' },
      //             { label: '虚线', value: 'dashed' },
      //             { label: '点线', value: 'dotted' }
      //           ]
      //         }
      //       }
      //     },
      //     // 边框颜色 - 条件显示
      //     {
      //       type: 'el-color-picker',
      //       __config__: {
      //         layout: 'colFormItem',
      //         span: 24,
      //         formId: 'canvas_border_color_field',
      //         display: 'formData.borderStyle !== "none"'
      //       },
      //       __label__: {
      //         label: '边框颜色',
      //         showLabel: true
      //       },
      //       __element__: {
      //         key: 'borderColor',
      //         tag: 'el-color-picker',
      //         value: '#dddddd'
      //       }
      //     },
      //     // 边框宽度 - 条件显示
      //     {
      //       type: 'el-input-number',
      //       __config__: {
      //         layout: 'colFormItem',
      //         span: 24,
      //         formId: 'canvas_border_width_field',
      //         display: 'formData.borderStyle !== "none"'
      //       },
      //       __label__: {
      //         label: '边框宽度',
      //         showLabel: true
      //       },
      //       __element__: {
      //         key: 'borderWidth',
      //         tag: 'el-input-number',
      //         min: 1,
      //         max: 10,
      //         step: 1,
      //         value: 1,
      //         style: { width: '100%' }
      //       }
      //     },
      //     // 圆角大小
      //     {
      //       type: 'el-input-number',
      //       __config__: {
      //         layout: 'colFormItem',
      //         span: 24,
      //         formId: 'canvas_border_radius_field'
      //       },
      //       __label__: {
      //         label: '圆角大小',
      //         showLabel: true
      //       },
      //       __element__: {
      //         key: 'borderRadius',
      //         tag: 'el-input-number',
      //         min: 0,
      //         max: 30,
      //         step: 1,
      //         value: 4,
      //         style: { width: '100%' }
      //       }
      //     }
      //   ]
      // }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
        // 如果关闭对话框，确保下次打开时表单是新的
        if (!val) {
          // 延迟清空数据，避免视觉上的闪烁
          setTimeout(() => {
            Object.keys(this.formData).forEach(key => {
              this.$delete(this.formData, key);
            });
          }, 200);
        }
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        // 重置表单
        this.$nextTick(() => {
          this.resetForm();
        });
      }
    }
  },
  methods: {
    resetForm() {
      // 重置表单数据 - 使用$set确保响应式更新
      const defaultValues = {
        canvasTitle: '新画布',
        description: '',
        canvasWidth: 900,
        canvasHeight: 600,
        background: '#ffffff',
        borderStyle: 'none',
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 4
      };
      
      // 先清空对象，再设置新值，确保响应式系统能够捕获变化
      Object.keys(this.formData).forEach(key => {
        this.$delete(this.formData, key);
      });
      
      // 使用$set添加新的属性，确保响应式
      Object.keys(defaultValues).forEach(key => {
        this.$set(this.formData, key, defaultValues[key]);
      });
      
      // 通知magicbox-form-core组件刷新
      this.$nextTick(() => {
        // 使用组件ref
        if (this.$refs.formCore) {
          if (typeof this.$refs.formCore.refreshForm === 'function') {
            this.$refs.formCore.refreshForm();
          }
        }
        // 使用this.refreshForm来刷新表单
        this.refreshForm();
      });
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleCancel() {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    handleConfirm() {
      // 验证表单
      if (!this.formData.canvasTitle) {
        this.$message.warning('请输入画布标题')
        return
      }
      
      // 确保所有数据都已经正确收集
      this.$nextTick(() => {
        // 发送表单数据
        this.$emit('confirm', deepClone(this.formData))
        this.dialogVisible = false
      });
    },
    
    // 强制刷新表单
    refreshForm() {
      if (this.$refs.formCore) {
        // 如果组件有刷新方法则调用
        if (typeof this.$refs.formCore.refreshForm === 'function') {
          this.$refs.formCore.refreshForm();
        }
        // 否则尝试通过重新渲染来刷新
        else {
          const currentFormData = deepClone(this.formData);
          // 先清空再设置，强制刷新
          Object.keys(this.formData).forEach(key => {
            this.$delete(this.formData, key);
          });
          this.$nextTick(() => {
            Object.keys(currentFormData).forEach(key => {
              this.$set(this.formData, key, currentFormData[key]);
            });
          });
        }
      }
    }
  },
  created() {
    // 初始化空对象，避免未定义错误
    this.formData = {};
  },
  mounted() {
    // 组件挂载后初始化表单数据
    this.resetForm();
  }
}
</script>

<style lang="scss" scoped>
.canvas-creator-dialog {
  .el-dialog__body {
    padding: 20px 20px 10px;
  }

  .canvas-creator-content {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 5px;
    
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
}
</style> 