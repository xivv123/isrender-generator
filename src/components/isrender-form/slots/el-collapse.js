export default {
  // 处理默认插槽（用于放置el-collapse-item组件）
  options(h, conf, key) {
    return conf.__element__.slot[key].map((item, index) => {
      const props = item.props || {};
      return h('el-collapse-item', {
        props: {
          title: item.label || `${index + 1}`,
          name: item.value || `${index + 1}`,
          disabled: props.disabled || false
        },
        key: `collapse-item-${index}`
      }, [item.content || '暂无内容']);
    })
  }
} 