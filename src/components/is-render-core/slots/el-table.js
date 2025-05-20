export default {
  // 处理默认插槽（用于放置表格内容）
  default(h, conf, key) {
    // 检查配置中是否有自定义内容
    if (conf.__element__.slot[key] && typeof conf.__element__.slot[key] === 'string' && conf.__element__.slot[key].trim() !== '') {
      // 如果有自定义内容，则使用它
      return h('template', { slot: key }, conf.__element__.slot[key]);
    }
    
    // 创建表格的列
    const createColumns = () => {
      // 如果配置中有指定列，使用配置中的列
      if (conf.__element__.columns && Array.isArray(conf.__element__.columns)) {
        return conf.__element__.columns.map(col => {
          return h('el-table-column', {
            props: {
              prop: col.prop,
              label: col.label,
              width: col.width,
              ...col
            }
          });
        });
      }
      
      // 默认的表格列
      return [
        h('el-table-column', {
          props: {
            prop: 'date',
            label: '日期',
            width: '180'
          }
        }),
        h('el-table-column', {
          props: {
            prop: 'name',
            label: '姓名',
            width: '180'
          }
        }),
        h('el-table-column', {
          props: {
            prop: 'address',
            label: '地址'
          }
        })
      ];
    };

    // 创建默认表格数据
    // const tableData = [
    //   {
    //     date: '2023-01-01',
    //     name: '张三',
    //     address: '北京市朝阳区'
    //   },
    //   {
    //     date: '2023-01-02',
    //     name: '李四',
    //     address: '上海市浦东新区'
    //   }
    // ];
    
    // 返回默认的表格列
    return createColumns();
  }
} 