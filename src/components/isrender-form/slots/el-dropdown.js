export default {
  // 处理默认插槽（用于放置下拉菜单的触发元素）
  default(h, conf, key) {
    // 检查配置中是否有自定义内容
    if (conf.__element__.slot[key] && typeof conf.__element__.slot[key] === 'string' && conf.__element__.slot[key].trim() !== '') {
      // 如果有自定义内容，则使用它
      return h('template', { slot: key }, conf.__element__.slot[key]);
    }
    
    // 默认的触发元素
    return h('span', { class: 'el-dropdown-link' }, [
      conf.__element__.triggerText || '下拉菜单',
      h('i', { class: 'el-icon-arrow-down el-icon--right' })
    ]);
  },
  
  // 处理dropdown插槽（用于放置下拉菜单内容）
  dropdown(h, conf, key) {
    // 检查配置中是否有自定义内容
    if (conf.__element__.slot[key] && typeof conf.__element__.slot[key] === 'string' && conf.__element__.slot[key].trim() !== '') {
      // 如果有自定义内容，则使用它
      return h('template', { slot: key }, conf.__element__.slot[key]);
    }
    
    // 获取配置中的菜单项
    const menuItems = conf.__element__.menuItems || [];
    
    // 渲染菜单项
    const renderMenuItems = () => {
      if (menuItems.length > 0) {
        return menuItems.map(item => {
          return h('el-dropdown-item', {
            props: {
              disabled: item.disabled,
              divided: item.divided,
              icon: item.icon,
              command: item.command
            }
          }, item.text);
        });
      }
      
      // 默认菜单项
      return [
        h('el-dropdown-item', {}, '黄金糕'),
        h('el-dropdown-item', {}, '狮子头'),
        h('el-dropdown-item', {}, '螺蛳粉'),
        h('el-dropdown-item', { props: { disabled: true } }, '双皮奶'),
        h('el-dropdown-item', { props: { divided: true } }, '蚵仔煎')
      ];
    };
    
    // 创建下拉菜单
    return h('el-dropdown-menu', { slot: 'dropdown' }, renderMenuItems());
  }
} 