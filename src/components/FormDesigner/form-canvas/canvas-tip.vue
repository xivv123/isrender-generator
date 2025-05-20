<template>
  <div class="canvas-tip">
    <p class="guide-text">
      <span class="drag-hint">从左侧拖拽组件到此处</span>
      <span>进行表单设计</span>
    </p>
    <div class="drag-demo">
      <div class="demo-items">
        <div class="demo-item"></div>
        <div class="demo-item"></div>
        <div class="demo-item"></div>
        <div class="demo-item"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CanvasTip'
}
</script>

<style lang="scss" scoped>
.canvas-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #909399;

  .guide-text {
    font-size: 14px;
    margin: 0;

    .drag-hint {
      color: #409EFF;
      font-weight: 500;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #409EFF;
        animation: underline 1.5s infinite ease-in-out;
        opacity: 0;
      }
    }
  }

  .drag-demo {
    margin-top: 20px;
    height: 160px;
    width: 260px;
    margin: 20px auto 0;
    position: relative;
    overflow: hidden;

    .demo-items {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      animation: demoReset 5s infinite;
    }

    .demo-item {
      width: 120px;
      height: 28px;
      background: #409EFF;
      border-radius: 4px;
      opacity: 0;
      transform: translateX(-100px);
      position: relative;

      &:nth-child(1) {
        animation: dropInAndOut 5s infinite;
      }

      &:nth-child(2) {
        animation: dropInAndOut 5s 0.6s infinite;
      }

      &:nth-child(3) {
        animation: dropInAndOut 5s 1.2s infinite;
      }

      &:nth-child(4) {
        animation: dropInAndOut 5s 1.8s infinite;
      }
    }
  }
}

@keyframes dropInAndOut {

  0%,
  100% {
    opacity: 0;
    transform: translateX(-100px);
  }

  10% {
    opacity: 0.8;
    transform: translateX(0);
  }

  40% {
    opacity: 0.8;
    transform: translateX(0);
  }

  50% {
    opacity: 0;
    transform: translateX(260px);
  }

  51%,
  99% {
    opacity: 0;
    transform: translateX(-100px);
  }
}

@keyframes demoReset {

  0%,
  90% {
    opacity: 1;
  }

  95%,
  100% {
    opacity: 0;
  }
}

@keyframes underline {

  0%,
  100% {
    opacity: 0;
    transform: translateX(-10px);
  }

  50% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
