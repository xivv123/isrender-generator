<template>
  <el-dialog
    title="生成代码"
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="handleClose"
    class="code-generator-dialog"
  >
    <div class="code-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="组件代码" name="component">
          <div class="code-content">
            <div class="code-header">
              <span>组件代码</span>
              <el-button 
                type="primary" 
                size="mini" 
                icon="el-icon-document-copy" 
                @click="copyCode('component')"
              >
                复制代码
              </el-button>
            </div>
            <pre class="code-display">{{ getComponentCode() }}</pre>
          </div>
        </el-tab-pane>
        <el-tab-pane label="渲染数据" name="data">
          <div class="code-content">
            <div class="code-header">
              <span>数据对象</span>
              <el-button 
                type="primary" 
                size="mini" 
                icon="el-icon-document-copy" 
                @click="copyCode('data')"
              >
                复制代码
              </el-button>
            </div>
            <pre class="code-display">{{ getDataCode() }}</pre>
          </div>
        </el-tab-pane>
        <el-tab-pane label="完整示例" name="full">
          <div class="code-content">
            <div class="code-header">
              <span>完整示例</span>
              <el-button 
                type="primary" 
                size="mini" 
                icon="el-icon-document-copy" 
                @click="copyCode('full')"
              >
                复制代码
              </el-button>
            </div>
            <pre class="code-display">{{ getFullCode() }}</pre>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleDownload">下载代码</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'CodeGeneratorDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    canvasData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      activeTab: 'component',
      copySuccess: false
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    // 生成渲染数据
    generateRenderData() {
      if (!this.canvasData || !this.canvasData.components) {
        return {};
      }
      
      // 提取表单配置
      const formConfig = this.canvasData.propList?.form || {};
      
      // 构建渲染数据对象
      const renderData = {
        size: formConfig.size || 'small',
        labelPosition: formConfig.labelPosition || 'left',
        labelWidth: formConfig.form_all_labelWidth || 100,
        gutter: formConfig.gutter || 15,
        disabled: formConfig.disabled || false,
        validate: formConfig.validate || false,
        showSubmitBtn: formConfig.showSubmitBtn || false,
        showResetBtn: formConfig.showResetBtn || false,
        thisOn: true,
        itemSpacing: formConfig.itemSpacing || 15,
        itemPaddingLeft: formConfig.itemPaddingLeft || 10,
        itemRenderList: this.generateItemRenderList()
      };
      
      return renderData;
    },
    
    // 生成表单项配置列表
    generateItemRenderList() {
      if (!this.canvasData || !this.canvasData.components) {
        return [];
      }
      
      // 处理每个组件，转换为渲染项
      return this.canvasData.components.map(component => {
        // 使用深拷贝防止影响原始数据
        const item = JSON.parse(JSON.stringify(component));
        
        // 确保组件配置按照预期的格式
        return {
          __config__: item.__config__ || {
            changeTag: true,
            layout: 'colFormItem',
            span: item.__config__?.span || 24,
          },
          __label__: item.__label__ || {
            label: item.renderdata?.label || '表单项',
            labelWidth: item.renderdata?.labelWidth || 100,
            showLabel: item.renderdata?.showLabel !== false,
          },
          __element__: {
            style: item.__element__?.style || { width: '100%' },
            key: item.__element__?.key || `field_${Date.now()}`,
            value: item.__element__?.value || item.renderdata?.value || '',
            tag: item.__element__?.tag || 'el-input',
            placeholder: item.__element__?.placeholder || item.renderdata?.placeholder || `请输入${item.__label__?.label || ''}`,
            clearable: item.__element__?.clearable !== false,
            disabled: item.__element__?.disabled || false,
            readonly: item.__element__?.readonly || false,
            maxlength: item.__element__?.maxlength || item.renderdata?.maxlength || null,
            'suffix-icon': item.__element__?.['suffix-icon'] || item.renderdata?.['suffix-icon'] || '',
            'prefix-icon': item.__element__?.['prefix-icon'] || item.renderdata?.['prefix-icon'] || '',
            ...(item.__element__?.slot ? { slot: item.__element__.slot } : {})
          },
          __regrule__: item.__regrule__ || {
            required: item.__regrule__?.required || item.renderdata?.required || false,
            regList: item.__regrule__?.regList || []
          }
        };
      });
    },
    
    // 复制代码到剪贴板
    copyCode(type) {
      let codeToCopy = '';
      
      switch(type) {
        case 'component':
          codeToCopy = this.getComponentCode();
          break;
        case 'data':
          codeToCopy = this.getDataCode();
          break;
        case 'full':
          codeToCopy = this.getFullCode();
          break;
        default:
          codeToCopy = this.getComponentCode();
      }
      
      // 使用 navigator.clipboard API 复制到剪贴板
      if (navigator.clipboard) {
        navigator.clipboard.writeText(codeToCopy)
          .then(() => {
            this.$message.success('复制成功！');
          })
          .catch(() => {
            this.fallbackCopyTextToClipboard(codeToCopy);
          });
      } else {
        this.fallbackCopyTextToClipboard(codeToCopy);
      }
    },
    
    // 获取组件代码
    getComponentCode() {
      return '<template>\n  <magicbox-form-core \n    v-model="formData" \n    :renderdata="renderData" \n  />\n</template>';
    },
    
    // 获取数据代码
    getDataCode() {
      const renderData = this.generateRenderData();
      const renderDataStr = JSON.stringify(renderData, null, 2);
      
      let code = '<script>\n';
      code += 'export default {\n';
      code += '  data() {\n';
      code += '    return {\n';
      code += '      formData: {},\n';
      code += '      renderData: ' + renderDataStr + '\n';
      code += '    }\n';
      code += '  }\n';
      code += '}\n';
      code += '</' + 'script>';
      
      return code;
    },
    
    // 获取完整代码
    getFullCode() {
      const renderData = this.generateRenderData();
      const renderDataStr = JSON.stringify(renderData, null, 2);
      
      // 获取画布标题
      const canvasTitle = this.canvasData.title || this.canvasData.propList?.canvas?.canvasTitle || '表单';
      const canvasDesc = this.canvasData.description || this.canvasData.propList?.canvas?.canvasDescription || '由Magic Box表单设计器生成';
      
      let code = '<!--\n';
      code += ` * ${canvasTitle}\n`;
      code += ` * ${canvasDesc}\n`;
      code += ' * 由Magic Box表单设计器生成\n';
      code += ' * 生成时间: ' + new Date().toLocaleString() + '\n';
      code += ' * 使用说明:\n';
      code += ' * 1. 确保已安装magicbox-form-core组件\n';
      code += ' * 2. 通过formData获取表单数据\n';
      code += ' * 3. 可以通过submitForm方法处理表单提交\n';
      code += ' -->\n\n';
      
      code += '<template>\n';
      code += '  <div class="form-container">\n';
      code += '    <magicbox-form-core \n';
      code += '      v-model="formData" \n';
      code += '      :renderdata="renderData" \n';
      code += '    />\n';
      code += '  </div>\n';
      code += '</template>\n\n';
      
      code += '<script>\n';
      code += '/**\n';
      code += ' * ' + canvasTitle + '\n';
      code += ' * @description ' + canvasDesc + '\n';
      code += ' */\n';
      code += 'export default {\n';
      code += '  name: "MagicBoxGeneratedForm",\n';
      code += '  data() {\n';
      code += '    return {\n';
      code += '      // 表单数据对象，用于存储表单输入值\n';
      code += '      formData: {},\n';
      code += '      // 表单渲染配置\n';
      code += '      renderData: ' + renderDataStr + '\n';
      code += '    }\n';
      code += '  },\n';
      code += '  methods: {\n';
      code += '    /**\n';
      code += '     * 表单提交方法\n';
      code += '     * 在这里处理表单提交逻辑\n';
      code += '     */\n';
      code += '    submitForm() {\n';
      code += '      console.log("表单数据:", this.formData);\n';
      code += '      // 表单验证\n';
      code += '      if (this.validateForm()) {\n';
      code += '        // 这里添加您的提交逻辑\n';
      code += '        // 例如: this.$emit("submit", this.formData);\n';
      code += '        // 或者: this.$http.post("/api/submit", this.formData);\n';
      code += '      }\n';
      code += '    },\n';
      code += '    \n';
      code += '    /**\n';
      code += '     * 表单验证方法\n';
      code += '     * @return {Boolean} 验证结果\n';
      code += '     */\n';
      code += '    validateForm() {\n';
      code += '      // 这里可以添加自定义验证逻辑\n';
      code += '      return true;\n';
      code += '    },\n';
      code += '    \n';
      code += '    /**\n';
      code += '     * 表单重置方法\n';
      code += '     */\n';
      code += '    resetForm() {\n';
      code += '      this.formData = {};\n';
      code += '    }\n';
      code += '  }\n';
      code += '}\n';
      code += '</' + 'script>\n\n';
      
      code += '<style scoped>\n';
      code += '/* 表单容器样式 */\n';
      code += '.form-container {\n';
      code += '  padding: 20px;\n';
      code += '  background: #fff;\n';
      code += '  border-radius: 4px;\n';
      code += '  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);\n';
      code += '}\n';
      code += '\n';
      code += '/* 您可以添加更多自定义样式 */\n';
      code += '</style>';
      
      return code;
    },
    
    // 复制到剪贴板的兼容方案
    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // 将textArea设为不可见
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          this.$message.success('复制成功！');
        } else {
          this.$message.error('复制失败，请手动复制');
        }
      } catch (err) {
        this.$message.error('复制失败，请手动复制');
      }
      
      document.body.removeChild(textArea);
    },
    
    // 下载代码
    handleDownload() {
      const fullCode = this.getFullCode();
      
      // 获取画布标题
      const canvasTitle = this.canvasData.title || this.canvasData.propList?.canvas?.canvasTitle || 'form';
      
      // 创建 Blob 对象
      const blob = new Blob([fullCode], { type: 'text/plain' });
      
      // 创建临时下载链接
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `magicbox-form-${canvasTitle}.vue`;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      
      // 清理
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      this.$message.success('代码下载成功！');
    },
    
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.code-generator-dialog {
  .code-tabs {
    margin-bottom: 15px;
  }
  
  .code-content {
    position: relative;
    margin-bottom: 15px;
    
    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      
      span {
        font-size: 14px;
        font-weight: bold;
      }
    }
    
    .code-display {
      padding: 16px;
      background-color: #f5f7fa;
      border-radius: 4px;
      border: 1px solid #e4e7ed;
      font-family: "Courier New", monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #303133;
      max-height: 400px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
}

/* 深度选择器修复 */
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
