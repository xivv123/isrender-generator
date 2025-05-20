# ISRENDER-GENERATOR

<div align="center">

![Vue](https://img.shields.io/badge/Vue-2.6-4FC08D?style=flat-square&logo=vue.js)
![Element UI](https://img.shields.io/badge/Element_UI-2.15-409EFF?style=flat-square&logo=element)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-orange.svg?style=flat-square)

一个基于 Vue 2 和 Element UI 的表单设计和生成工具，支持可视化设计、动态渲染和图表集成。

[English](./README_EN.md) | 简体中文

</div>

> ⚠️ 注意：由于精力有限，目前项目仍存在一些未修复的 BUG，欢迎提交 Issue 或 Pull Request 来帮助改进。

## ✨ 特性

- 🎨 可视化表单设计器，支持拖拽操作
- 🚀 基于 Vue 2 和 Element UI 的表单渲染引擎
- 📊 内置 ECharts 图表支持，支持高度自定义
- 🎯 支持多种表单元素和复杂布局
- 🔧 可扩展的组件系统
- 📱 响应式设计，支持移动端

## 🚀 快速开始

### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/your-username/isrender-generator.git

# 进入项目目录
cd isrender-generator

# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产环境
npm run build
```

### 基础使用

```vue
<template>
  <isrender-form
    v-model="formData"
    :renderdata="renderConfig"
    @submit="handleSubmit"
    @reset="handleReset"
  />
</template>

<script>
import IsrenderForm from '@/components/isrender-form/core.vue'

export default {
  components: {
    IsrenderForm
  },
  data() {
    return {
      formData: {}, // 表单数据对象
      renderConfig: {
        // 表单配置对象
        size: 'medium',
        labelPosition: 'right',
        labelWidth: 100,
        // 其他配置...
        fields: []
      }
    }
  },
  methods: {
    handleSubmit(formData) {
      console.log('表单提交:', formData)
    },
    handleReset() {
      console.log('表单重置')
    }
  }
}
</script>
```

## 📚 组件说明

### FormDesigner 表单设计器

FormDesigner 是一个基于 Vue 2 和 Element UI 的可视化表单设计工具，提供直观的拖拽界面，让用户可以轻松创建复杂的表单。

#### 主要功能
- 拖拽式表单设计
- 实时预览
- 组件属性配置
- 布局调整
- 表单验证规则设置

### ISRENDER-FORM 表单渲染组件

ISRENDER-FORM 是一个基于 Vue 2 和 Element UI 的通用表单组件，支持动态渲染各种表单元素和图表。

#### 特性

- ✅ 支持多种表单元素类型
  - 输入框
  - 选择器
  - 单选框
  - 多选框
  - 日期选择器
  - 时间选择器
  - 文件上传
  - 富文本编辑器
- ✅ 表单验证
  - 内置验证规则
  - 自定义验证规则
  - 异步验证
- ✅ 布局系统
  - 栅格布局
  - 响应式布局
  - 自定义布局
- ✅ 主题定制
  - 支持表单尺寸（medium、small、mini）
  - 支持标签位置（top、left、right）
  - 支持自定义样式
- ✅ 高级功能
  - 表单数据双向绑定
  - 表单禁用状态
  - 自定义事件处理
  - 动态表单字段

### ECharts 图表组件

ISRENDER-FORM 内置支持多种 ECharts 图表渲染，通过自定义指令 `v-echart` 实现。支持高度自定义配置，包括添加/删除数据系列、自定义样式等。

#### 支持的图表类型

- 📊 饼图（Pie Chart）
- 📈 折线图（Line Chart）
- 🎯 仪表盘（Gauge Chart）
- 📊 散点图（Scatter Chart）
- 📊 柱状图（Bar Chart）
- 📊 雷达图（Radar Chart）
- 📊 热力图（Heatmap）
- 📊 树图（Tree Chart）

#### 图表使用示例

```vue
<template>
  <div>
    <isrender-form 
      v-model="propsdatalocal1" 
      :renderdata="renderDataGauge"
    >
      <!-- 自定义插槽内容 -->
      <div slot="defultValue" class="chart-editor">
        <!-- 图表配置界面 -->
      </div>
    </isrender-form>
  </div>
</template>

<script>
import renderDataGauge from '@/config/create-data/echarts/line-ele'

export default {
  data() {
    return {
      propsdatalocal1: {}, // 表单数据对象
      renderDataGauge, // 图表配置模板
      chartOptions: {
        title: {
          text: '销售数据分析'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['系列1', '系列2']
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '系列1',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210],
            itemStyle: {
              color: '#5470c6'
            }
          },
          {
            name: '系列2',
            type: 'line',
            data: [220, 182, 191, 234, 290, 330, 310],
            itemStyle: {
              color: '#91cc75'
            }
          }
        ]
      }
    }
  },
  methods: {
    // 添加新的数据系列
    addSeries() {
      const newSeries = {
        name: `系列${this.chartOptions.series.length + 1}`,
        type: 'line',
        data: Array(7).fill(0).map(() => Math.floor(Math.random() * 200) + 50),
        itemStyle: {
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        }
      }
      this.chartOptions.series.push(newSeries)
    },
    
    // 更新数据系列
    updateSeries(index, data) {
      if (this.chartOptions.series[index]) {
        this.chartOptions.series[index].data = data
      }
    },
    
    // 删除数据系列
    removeSeries(index) {
      this.chartOptions.series.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-editor {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
```

#### 图表配置功能

- ✅ 数据系列管理
  - 添加/删除数据系列
  - 自定义系列名称
  - 自定义系列颜色
  - 动态数据点编辑
- ✅ 坐标轴配置
  - X轴数据自定义
  - Y轴范围设置
  - 坐标轴样式设置
- ✅ 图表样式
  - 标题配置
  - 图例位置
  - 网格设置
  - 主题定制
- ✅ 交互功能
  - 数据提示框
  - 缩放功能
  - 数据视图
  - 保存图片

## 🛠️ 开发

### 项目设置

```bash
# 安装依赖
npm install

# 开发环境运行
npm run serve

# 构建生产环境
npm run build

# 构建组件库
npm run build-lib
```

### 目录结构

```
src/
  ├── components/
  │   ├── FormDesigner/           # 表单设计器组件
  │   └── isrender-form/          # 表单渲染组件
  ├── config/
  │   └── create-data/
  │       └── echarts/            # ECharts图表配置模板
  ├── utils/
  │   └── echarts-directive.js    # ECharts自定义指令
  ├── views/                      # 页面
  ├── App.vue                     # 应用入口
  └── main.js                     # 主入口文件
```
## 📄 开源协议

本项目基于 [MIT](./LICENSE) 协议开源。

## 🙏 致谢

感谢所有为本项目做出贡献的开发者！

## 📮 联系方式

- 项目维护者：烟西
- 邮箱：553979617@qq.com
---

如果这个项目对你有帮助，欢迎给一个 ⭐️ Star 支持一下！ 