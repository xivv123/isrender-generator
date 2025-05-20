<template>
  <el-container class="main-container">
    <el-header class="main-header">
      <div class="header-left">
        <!-- 使用public目录下的图片 -->
        <div class="logo"></div>
        <!-- <div>|</div>
        <div>一个符合直觉的UI低代码平台</div> -->
      </div>
      <div class="header-right">
        <a href="https://github.com/your-repository" target="_blank" class="github-link">
          <i class="github-icon"></i>
        </a>
      </div>
    </el-header>
    <!-- 生成器组件 -->
    <div class="page-content">
      <form-designer></form-designer>
    </div>
  </el-container>
</template>

<script>
import FormDesigner from '../components/FormDesigner/index.vue'

export default {
  name: 'home',
  components: {
    FormDesigner
  },
  data () {
    return {
      activeMenu: '1'
    }
  }
}
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  overflow: hidden;
}

.main-header {
  height: 60px !important;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 200px;
  /* 增加最小宽度 */

  .logo {
    width: 220px;
    height: 50px;
    background-image: url('/images/magicboxLog.png');
    background-size: 100% auto;
    background-position: left center;
    background-repeat: no-repeat;
    margin-right: 16px;
    /* 添加右侧间距 */
  }

  /* 分隔符样式 */
  div:nth-child(2) {
    color: #dcdfe6;
    font-size: 20px;
    margin: 0 16px;
    /* 增加两边间距 */
    font-weight: 200;
    /* 让分隔符更细 */
  }

  /* 标语样式 */
  div:nth-child(3) {
    color: #606266;
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
    /* 防止文字换行 */
    opacity: 0.8;
    /* 略微降低不透明度 */
  }
}

.header-nav {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding-left: 20px;
}

.nav-menu {
  width: 100%;
  display: flex;
  border: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  /* 增加间距 */

  .github-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #333;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }

  .github-icon {
    width: 24px;
    height: 24px;
    background-image: url('data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="%23333" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>');
    background-repeat: no-repeat;
    background-size: contain;
  }
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  padding: 0 20px;
  position: relative;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom: 2px solid #409EFF;
  color: #409EFF;
}

.page-content {
  height: calc(100vh - 60px);
  /* 60px header + 50px nav */
  overflow: hidden;
  background: #fff;
}
</style>
