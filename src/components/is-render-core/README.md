# isRender

一个基于 Vue 的高度可配置表单生成组件。

## 安装

```bash
npm install isrender element-ui --save
```

## 快速使用

### 正确的导入方式

```js
// 方式1：使用命名导入（推荐）
import { isRender } from 'isrender';

// 方式2：使用默认导入
import isRenderPlugin from 'isrender';
const { isRender } = isRenderPlugin;
```

### 组件注册

```js
// 局部注册
export default {
  components: {
    isRender
  }
}

// 全局注册
import Vue from 'vue';
import isRenderPlugin from 'isrender';
Vue.use(isRenderPlugin);
```

### 在模板中使用

```html
<template>
  <is-render 
    :renderdata="renderConfig" 
    v-model="formData">
  </is-render>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      renderConfig: {
        itemRenderList: [
          {
            __config__: { layout: 'colFormItem', span: 24 },
            __element__: { 
              tag: 'el-input', 
              key: 'username',
              value: ''
            },
            __label__: { 
              label: '用户名',
              showLabel: true
            }
          }
        ]
      }
    }
  }
}
</script>
```

## 本地开发迁移到npm包

如果你之前使用的是本地引入方式：

```js
// 旧的方式
import isRenderCore from '@/components/is-render-core/form-core.vue';
```

可以使用下面的方式替换：

```js
// 新的方式（与本地引用兼容）
import { isRender as isRenderCore } from 'isrender';

export default {
  components: {
    isRenderCore
  }
}
```

## 注意事项

1. 必须安装element-ui并在项目中引入
2. 组件名称固定为`isRender`，在模板中使用`<is-render>`
3. 必须传入`renderdata`属性和使用`v-model`双向绑定表单数据

## 版本说明

当前版本：v1.1.0

- 修复npm安装后无法使用的问题
- 优化打包配置
- 提供兼容本地引用的解决方案 