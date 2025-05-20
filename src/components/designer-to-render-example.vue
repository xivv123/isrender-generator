<template>
  <div class="form-container-wrapper">
    <div class="form-container">
      <h2 class="form-title">表单事件引用示例</h2>
      <p class="form-description">表单事件可以直接访问组件实例 - 无需复杂的绑定</p>
      <div class="test-value-display">
        <strong>测试数据 test 的值:</strong> {{ test }}
        <small>(在表单名称输入框中输入内容时会被修改)</small>
      </div>
      <div class="form-guide">
        <h3>使用说明</h3>
        <p>在form-data.js中定义的事件处理函数会自动接收组件实例作为第二个参数：</p>
        <pre>
          function handleInputChange(val, vm) {
            console.log("input事件", val);
            // 直接使用传入的vm访问组件实例
            if (vm) {
              vm.test = "被修改了！";
              console.log("新值:", vm.test);
            }
          }
      </pre>
      </div>
      <el-descriptions title="用户信息">
        <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
        <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
        <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
        <el-descriptions-item label="备注">
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
    </el-descriptions>
      <is-render-form
        ref="formCore"
        v-model="formData"
        :renderdata="renderData"
        :parentInstance="this"
      >

      <el-descriptions title="用户信息">
        <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
        <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
        <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
        <el-descriptions-item label="备注">
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
      </el-descriptions>

      <!-- 使用与配置中占位符相同的slot名称 -->
      <el-form-item slot="myField" label="自定义字段" prop="myField">
        <el-input v-model="formData.myField" style="width: 100%;"></el-input>
      </el-form-item>
      
      <!-- 可以添加多个具名插槽 -->
      <el-form-item slot="otherField" label="其他字段" prop="otherField">
        <el-select v-model="formData.otherField">
          <el-option value="1" label="选项1"></el-option>
          <el-option value="2" label="选项2"></el-option>
        </el-select>
      </el-form-item>
      
      <!-- 带验证规则的自定义字段 -->
      <el-form-item slot="customField" label="验证规则" prop="customField">
        <el-input  v-model="formData.customField" placeholder="请输入内容，至少3个字符"></el-input>
      </el-form-item>
      </is-render-form>
    </div>
    <el-button @click="handleClick">点击我</el-button>
    <el-button type="primary" @click="validateForm">验证表单</el-button>
  </div>
</template>

<script>
import isRenderForm from './is-render-core/form-core'
import renderData from './form-data' // 导入渲染数据

export default {
  components: {
    isRenderForm
  },
  data() {
    return {
      formData: { caonima: "1"},
      test:"xxx",
      renderData // 先使用原始渲染数据
    }
  },
  mounted() {
    // 在组件挂载后处理事件代理
    if (this.renderData.thisOn) {
      // 应用事件代理
      console.log('[示例] 检测到thisOn=true，应用事件代理...');
      console.log('[示例] 事件代理已完成，表单事件将调用父组件的同名方法');
    }
    
    console.log('[示例] 表单已加载 - 事件处理函数现在可以直接访问组件实例');
    console.log('[示例] 提示：操作表单元素，查看控制台输出和test值变化');
  },
  methods: {
     handleClick(event, data) {
       // 此方法与form-data.js中的同名函数相对应，会被代理调用
       console.log('[示例-父组件] handleClick被调用:', event, data);
      
       let a = this.formData
       // 直接修改formData，通过v-model双向绑定更新表单
       this.formData.formname = "通过父组件handleClick修改 - " + new Date().toLocaleTimeString();
       // alert("ss")
     },
    // 表单名称输入框事件处理
    handleInputFocus(event, data) {
      // 此方法与form-data.js中的同名函数相对应，会被代理调用
      console.log('[示例-父组件] handleInputFocus被调用:', event, data);
      
      console.log('[示例-父组件] 修改前的formData:', JSON.stringify(this.formData));
      
      // 修改test属性展示代理成功
      this.test = "被父组件handleInputFocus修改: " + new Date().toLocaleTimeString();
      
      // 直接修改formData，通过v-model双向绑定更新表单
      this.formData.formname = "通过父组件handleInputFocus修改";
      
      console.log('[示例-父组件] 修改后的formData:', JSON.stringify(this.formData));
    },
    handleInputChange(val) {
      // 此方法可以被代理调用
      console.log("[示例-父组件] 输入框内容变化:", val);
      // 可以根据输入内容执行其他操作
      if (val && val.length > 10) {
        console.log("[示例-父组件] 输入内容过长，建议精简!");
      }
    },
    handleInputBlur(val) {
      console.log("输入框内容已改变:", val);
      console.log('+++++++++++++++++++++++++++++');
      // 可以在这里执行数据校验或格式化
      localStorage.setItem('lastInput', val); // 示例：保存到本地存储
    },

    // 标签位置选择器事件处理
    handleSelectFocus() {
      console.log("选择器获得焦点");
    },
    handlePositionChange(val) {
      console.log("标签位置被更改为:", val);
      // 这里可以执行其他操作，如改变其他元素的样式
      document.querySelectorAll('.el-form-item__label').forEach(label => {
        label.style.transition = 'all 0.3s';
      });
    },

    // 显示标签开关事件处理
    handleShowLabelChange(val) {
      console.log("显示标签状态已更改为:", val ? "显示" : "隐藏");
    },

    // 标签宽度滑块事件处理
    handleLabelWidthChange(val) {
      console.log("标签宽度已调整为:", val);
    },

    // 表单尺寸单选按钮事件处理
    handleSizeChange(val) {
      console.log("表单尺寸已更改为:", val);
      // 根据不同的尺寸可以执行不同的操作
      const sizeMap = {
        'medium': '适合普通屏幕',
        'small': '适合中小屏幕',
        'mini': '适合小屏幕'
      };
      console.log(`当前尺寸${sizeMap[val] || '未知尺寸'}`);
    },

    // 禁用表单开关事件处理
    handleFormDisableChange(val) {
      console.log("表单禁用状态已更改为:", val ? "已禁用" : "已启用");
      if (val) {
        // 如果表单被禁用，可以显示提示信息
        setTimeout(() => {
          alert("注意：表单已被禁用，请先启用后再操作！");
        }, 100);
      }
    },

    // 禁用表单提示信息事件处理
    handleDisabledMessageInput(val) {
      console.log("禁用提示信息已更新:", val);
      // 可以将提示信息存储到localStorage
      localStorage.setItem('disabledMessage', val);
    },
    handleDisabledMessageFocus() {
      console.log("正在编辑禁用提示信息");
    },

    // 栅格间隔事件处理
    handleGutterChange(val) {
      console.log("栅格间隔已调整为:", val);
      // 可以根据栅格间隔调整样式
      document.querySelectorAll('.el-row').forEach(row => {
        row.style.marginLeft = `-${val/2}px`;
        row.style.marginRight = `-${val/2}px`;
      });
    },

    // 表单项间距事件处理
    handleItemSpacingChange(val) {
      console.log("表单项间距已调整为:", val);
      // 实时应用间距变化
      document.querySelectorAll('.el-form-item').forEach(item => {
        item.style.marginBottom = `${val}px`;
      });
    },

    // 表单项左边距事件处理
    handleItemPaddingLeftChange(val) {
      console.log("表单项左边距已调整为:", val);
      // 实时应用左边距变化
      document.querySelectorAll('.el-form-item').forEach(item => {
        item.style.paddingLeft = `${val}px`;
      });
    },

    // 表单验证事件处理
    handleValidateChange(val) {
      console.log("表单验证状态已更改为:", val ? "启用" : "禁用");
      // 可以在这里添加验证相关的逻辑
      if (val) {
        // 如果启用了验证，可以检查所有必填字段
        console.log("开始检查表单必填字段...");
      }
    },

    // 提交按钮事件处理
    handleSubmitBtnChange(val) {
      console.log("提交按钮显示状态:", val ? "显示" : "隐藏");
      // 可以在这里执行与提交按钮相关的逻辑
      if (val) {
        console.log("已添加提交按钮，可以提交表单数据");
      }
    },

    // 重置按钮事件处理
    handleResetBtnChange(val) {
      console.log("重置按钮显示状态:", val ? "显示" : "隐藏");
      // 可以在这里执行与重置按钮相关的逻辑
      if (val) {
        console.log("已添加重置按钮，可以重置表单数据");
      }
    },

    // 字段变更事件处理
    handleFieldChange(field) {
      debugger
      console.log('监听到表单字段变更:', field)
    },
    
    // 表单提交事件处理
    handleSubmit() {
      console.log('提交表单', this.formData)
    },
    
    // 表单重置事件处理
    handleReset() {
      console.log('重置表单')
      this.formData = {}
    },

    // 表单验证事件处理
    validateForm() {
      console.log('开始验证表单')
      
      // 确保formCore组件存在
      if (!this.$refs.formCore) {
        console.error('找不到formCore组件引用');
        return;
      }
      
      // 确保validate方法存在
      if (typeof this.$refs.formCore.validate !== 'function') {
        console.error('formCore组件没有validate方法');
        return;
      }
      
      // 调用表单验证方法
      this.$refs.formCore.validate((valid, invalidFields) => {
      debugger
      
        console.log('验证结果:', valid, invalidFields);
        if (valid) {
          alert('验证通过！可以提交表单');
          console.log('表单数据:', this.formData);
        } else {
          alert('验证失败，请检查输入内容');
          console.error('验证失败字段:', invalidFields);
        }
      }).catch(err => {
        console.error('表单验证发生错误:', err);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
// 外层容器，设置高度和滚动
.form-container-wrapper {
  height: 100vh; // 使用视口高度
  overflow: auto; // 添加滚动条
  background-color: #f5f7fa; // 浅灰色背景
  padding: 20px 0;
  box-sizing: border-box;
}

// 内层表单容器
.form-container {
  padding: 25px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden; // 确保内容不溢出
}

// 表单标题
.form-title {
  margin-top: 0;
  margin-bottom: 10px;
  color: #303133;
  font-size: 22px;
  text-align: center;
}

// 表单描述
.form-description {
  text-align: center;
  color: #606266;
  margin-bottom: 15px;
  font-size: 14px;
}

/* 添加test值显示区域的样式 */
.test-value-display {
  margin: 15px 0;
  padding: 10px;
  background-color: #e6f7ff;
  border-left: 4px solid #1890ff;
  border-radius: 4px;
  
  strong {
    color: #1890ff;
  }
  
  small {
    display: block;
    margin-top: 5px;
    color: #888;
    font-style: italic;
  }
}

// 表单使用说明样式
.form-guide {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #f8f9fa;
  border-left: 4px solid #409EFF;
  border-radius: 4px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
    color: #303133;
  }
  
  p {
    margin-bottom: 10px;
    font-size: 14px;
    color: #606266;
  }
  
  pre {
    background-color: #f0f9ff;
    padding: 10px;
    border-radius: 4px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 13px;
    color: #007acc;
    overflow-x: auto;
    border: 1px solid #e0e0e0;
  }
}

// 每个表单项的样式
// :deep(.el-form-item) {
//   margin-bottom: 18px;
//   transition: all 0.3s;
  
//   &:hover {
//     background-color: #f9fafc;
//     border-radius: 4px;
//     padding: 8px;
//   }
// }

// 标签样式
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

// 输入框样式
:deep(.el-input__inner) {
  border-radius: 4px;
  
  &:focus {
    border-color: #409EFF;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
}

// 表单按钮区域
.form-buttons {
  margin-top: 25px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

// 响应式调整
@media screen and (max-width: 768px) {
  .form-container {
    max-width: 95%;
    padding: 15px;
  }
  
  .form-title {
    font-size: 18px;
  }
  
  .form-description {
    font-size: 12px;
    margin-bottom: 15px;
  }
  
  .form-guide {
    padding: 10px;
    
    h3 {
      font-size: 14px;
    }
    
    p, pre {
      font-size: 12px;
    }
  }
}
</style>
