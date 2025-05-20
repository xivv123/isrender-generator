# isrender Form

一个基于 Vue 2 和 Element UI 的高度可配置表单生成组件。

## 安装

```bash
# 安装组件
npm install isrender-form --save

# 安装必要的peer dependencies
npm install element-ui@^2.15.0 --save
```

## 引入

### 全局引入

```javascript
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import isrenderForm from 'isrender-form';

// 先安装Element UI
Vue.use(ElementUI);
// 再安装isrenderForm
Vue.use(isrenderForm);
```

### 局部引入

```javascript
import { isrenderForm } from 'isrender-form';

export default {
  components: {
    isrenderForm
  }
}
```

## 基本用法

```vue
<template>
  <div>
    <isrender-form 
      :renderdata="formConfig" 
      v-model="formData"
      ref="formRef"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      formConfig: {
        // 表单配置
        formProps: {
          labelWidth: '120px',
          size: 'medium'
        },
        // 表单项配置列表
        itemRenderList: [
          {
            // 元素配置
            __element__: {
              tag: 'el-input',
              key: 'name',
              value: '',
              attrs: {
                placeholder: '请输入姓名'
              }
            },
            // 标签配置
            __label__: {
              label: '姓名'
            },
            // 验证规则
            __regrule__: {
              required: true,
              regList: []
            }
          }
          // 更多表单项...
        ]
      }
    };
  },
  methods: {
    // 表单验证
    validateForm() {
      this.$refs.formRef.validate((valid, invalidFields) => {
        if (valid) {
          console.log('表单验证通过', this.formData);
        } else {
          console.log('表单验证失败', invalidFields);
        }
      });
    }
  }
}
</script>
```

## 组件属性

| 属性名 | 说明 | 类型 | 默认值 |
|------|------|------|------|
| renderdata | 表单渲染配置对象 | Object | {} |
| value | 表单数据对象 (v-model) | Object | {} |
| parentInstance | 父组件实例 | Object | null |

## 组件方法

| 方法名 | 说明 | 参数 |
|------|------|------|
| validate | 表单验证 | callback(Function) - 验证完成后的回调函数 |

## 配置说明

### renderdata 对象结构

```javascript
{
  // 表单属性配置
  formProps: {
    labelWidth: '120px',  // 标签宽度
    size: 'medium'        // 尺寸大小，可选值：medium / small / mini
    // 其他 el-form 支持的属性...
  },
  
  // 表单项列表
  itemRenderList: [
    {
      // 元素配置
      __element__: {
        tag: 'el-input',     // 使用的 Element UI 组件名称
        key: 'fieldName',    // 字段名，对应 formData 中的属性
        value: '',           // 默认值
        attrs: {             // 传递给组件的属性
          placeholder: '请输入'
          // 其他组件属性...
        }
      },
      
      // 标签配置
      __label__: {
        label: '字段名称'  // 表单项标签文本
      },
      
      // 验证规则
      __regrule__: {
        required: true,     // 是否必填
        regList: [          // 验证规则列表
          {
            pattern: '/^\\w+$/',  // 正则表达式
            message: '格式不正确'  // 错误提示
          }
          // 更多规则...
        ]
      },
      
      // 插槽占位符配置（可选）
      slot: 'slotName',
      __slotRules__: {
        prop: 'slotFieldName',  // 插槽字段名
        rules: [                // 验证规则
          { required: true, message: '不能为空' }
        ]
      }
    }
    // 更多表单项...
  ]
}
```

## 常见问题

1. **组件无法显示或报错**
   - 确保已安装 Element UI 并正确导入（包括样式文件）
   - 确保组件名使用的是 `isrender-form`（带连字符的kebab-case形式）

2. **样式问题**
   - 组件使用了scoped SCSS样式，确保你的项目支持SCSS编译
   - 如果使用的是Vue CLI项目，一般已包含SCSS支持

3. **找不到模块**
   - 如果报错找不到某个模块，请确保使用的是最新版本的组件
   - 检查是否存在版本兼容性问题

## 注意事项

1. 组件依赖 Vue 2.6+ 和 Element UI 2.15+
2. 请确保 Element UI 已正确安装并注册
3. 表单验证规则遵循 Element UI 的表单验证规则格式 