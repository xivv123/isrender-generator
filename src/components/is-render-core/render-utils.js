/**
 * render-utils.js
 * 提供表单渲染过程中的辅助工具函数
 */

/**
 * 处理表单组件options中label和value的映射关系
 * 主要用于解决radio/checkbox等组件中value不生效的问题
 * @param {Object} item 选项配置
 * @param {string} componentType 组件类型
 * @returns {Object} 处理后的渲染配置
 */
export function processOptionLabelValue(item, componentType) {
  // 创建通用的label/value处理函数
  const handleLabelValueMapping = (item) => {
    if (item.label === undefined || item.value === undefined) {
      return { props: item };
    }
    
    const displayText = item.label; // 保存显示文本
    const props = { ...item, label: item.value }; // 将value设为label值
    
    return { 
      props, 
      renderText: displayText // 返回需要显示的文本
    };
  };

  // 不同组件的处理逻辑映射
  const componentHandlers = {
    'el-radio': handleLabelValueMapping,
    'el-radio-button': handleLabelValueMapping,
    'el-checkbox': handleLabelValueMapping
    // 可以添加其他组件类型的处理器，共用相同的逻辑或添加特殊处理
  };
  
  // 获取组件对应的处理器，如果没有则返回默认处理
  const handler = componentHandlers[componentType];
  if (handler) {
    return handler(item);
  }
  
  // 默认处理
  return { props: item };
}

/**
 * 为表单组件添加双向绑定
 * @param {Object} dataObject 数据对象
 * @param {*} defaultValue 默认值
 */
export function vModel(dataObject, defaultValue) {
  // 设置 value 属性
  dataObject.props.value = defaultValue
  // 添加 input 事件处理函数
  dataObject.on.input = val => {
    this.$emit('input', val)
  }
}

/**
 * 处理组件的插槽内容
 * @param {Function} h 渲染函数
 * @param {Object} confClone 配置克隆对象
 * @param {Array} children 子元素数组
 * @param {Object} componentChild 组件插槽处理器集合
 */
export function mountSlotFiles(h, confClone, children, componentChild) {
  const tag = confClone.__element__.tag;
  
  // 处理基于__element__.slot的插槽内容
  if (confClone.__element__ && confClone.__element__.slot) {
    const slot = confClone.__element__.slot;
    
    // 获取对应组件的插槽处理器
    const childObjs = componentChild[tag];
    if (childObjs) {
      // 遍历插槽处理器中的每个方法
      Object.keys(childObjs).forEach(key => {
        // 如果配置中存在对应的插槽内容
        if (slot[key]) {
          const childFunc = childObjs[key];
          // 调用处理函数生成插槽内容
          children.push(childFunc(h, confClone, key));
        }
      });
    }
  }
  
  // 原有的子组件处理逻辑继续保留
  const slot = confClone.__element__.slot
  
  // 统一处理组件的选项配置  
  const componentsOptionsConfig = {
    // 通过子组件处理选项的组件
    'el-select': {
      type: 'children',
      childTag: 'el-option'
    },
    'el-radio-group': {
      type: 'children',
      childTag: 'el-radio'
    },
    'el-checkbox-group': {
      type: 'children',
      childTag: 'el-checkbox'
    },
    // 通过props处理选项的组件
    'el-cascader': {
      type: 'props'
    },
    // 如果有其他需要特殊处理的组件，可以在这里添加
    'el-tree': {
      type: 'props'
    },
    'el-transfer': {
      type: 'props'
    }
  };
  
  // 获取当前组件的配置
  const componentConfig = tag && componentsOptionsConfig[tag];
  
  // 如果有配置且有选项数据
  if (componentConfig && slot && slot.options) {
    // 如果是通过props处理选项的组件
    if (componentConfig.type === 'props') {
      // 确保 element 对象存在
      confClone.__element__ = confClone.__element__ || {};
      confClone.__element__.options = slot.options;
      // 已经处理过了，不需要继续处理
      return;
    }
    // 其他处理方式可以在这里添加
  }
  
  // 处理所有插槽内容
  if (slot) {
    Object.keys(slot).forEach(slotName => {
      // 跳过已处理的插槽
      if (componentChild[tag] && componentChild[tag][slotName]) {
        return;
      }
      
      const slotContent = slot[slotName];
      
      // 处理数组类型的插槽内容（如options）
      if (Array.isArray(slotContent)) {
        // 确定正确的子组件名称
        let childComponentName;
        // 检查是否有特定组件的映射
        if (slot.tag) {
          childComponentName = slot.tag;
        } else if (tag && componentConfig && componentConfig.type === 'children' && slotName === 'options') {
          childComponentName = componentConfig.childTag;
        } else {
          // 使用默认命名规则
          childComponentName = `${slotName.replace(/s$/, '')}-item`;
        }
        
        // 为每个数组项创建子组件
        slotContent.forEach(item => {
          // 使用通用处理函数处理组件配置
          const result = processOptionLabelValue(item, childComponentName);
          
          if (item.value !== undefined) {
            result.props.key = item.value;
          }
          
          // 如果有需要渲染的文本，作为子元素传入
          if (result.renderText !== undefined) {
            children.push(h(childComponentName, result, result.renderText));
          } else {
            // 否则正常渲染
            children.push(h(childComponentName, result));
          }
        });
      } 
      // 处理字符串类型的插槽内容
      else if (typeof slotContent === 'string') {
        // 如果是字符串且不是由组件插槽处理器处理的，则直接添加到children
        children.push(h('template', { slot: slotName }, slotContent));
      }
    })
  }
}

/**
 * 将字符串类型的事件，发送为消息
 * @param {Object} confClone 配置克隆对象
 */
export function emitEvents(confClone) {
  ['on', 'nativeOn'].forEach(attr => {
    const eventKeyList = Object.keys(confClone[attr] || {})
    eventKeyList.forEach(key => {
      const val = confClone[attr][key]
      if (typeof val === 'string') {
        confClone[attr][key] = event => this.$emit(val, event)
      }
    })
  })
}

/**
 * 将json表单配置转化为vue render可以识别的 "数据对象（dataObject）"
 * @param {Object} confClone 配置克隆对象
 * @param {Object} dataObject 数据对象
 * @param {Object} formModelClone 表单模型克隆对象
 */
export function buildDataObject(confClone, dataObject, formModelClone) {
  // 处理双向绑定
  if (confClone.__element__ && confClone.__element__.key) {
    vModel.call(this, dataObject, confClone.__element__.value);
  }
  // 处理__element__对象中的所有属性
  if (confClone.__element__) {
    // 获取element对象内的所有属性
    Object.keys(confClone.__element__).forEach(key => {
      // 跳过特殊属性
      if (['key', 'tag', 'on', 'events', 'directives'].includes(key)) {
        return;
      }
      const val = confClone.__element__[key]
      // 处理样式
      if (key === 'style') {
        dataObject.style = { ...dataObject.style, ...val };
      }else {
        // 同时添加到props和attrs，让组件自己决定使用哪个
        dataObject.props[key] = val;
        dataObject.attrs[key] = val;
      }
    });
    
    // 处理事件
    if (confClone.__element__.on) {
      Object.entries(confClone.__element__.on).forEach(([eventName, handler]) => {
        if (typeof handler === 'function') {
          dataObject.on[eventName] = (event) => {
            // 确保parentInstance不为undefined
            const instance = this.parentInstance || this;
            return handler.call(null, instance, event, formModelClone,{
              key: confClone.__element__.key,
              value: confClone.__element__.value
            });
          };
        }
      });
    }
    
    // 处理指令
    if (confClone.__element__.directives && Array.isArray(confClone.__element__.directives)) {
      dataObject.directives = confClone.__element__.directives.map(dir => {
        if (dir.name === 'echart') {
          return {
            name: dir.name,
            value: confClone.__element__.chartOptions || dir.value,
            // 为ECharts指令添加额外参数
            modifiers: dir.modifiers || {}
          };
        }
        return dir;
      });
    }
  }
  
  // 处理其他顶层属性，跳过已处理的特殊属性
  Object.keys(confClone).forEach(key => {
    if (['__element__', '__slot__', '__label__', '__regrule__', '__config__', '__template__', '__jsxTemplate__'].includes(key)) {
      return;
    }
    
    const val = confClone[key];
    if (dataObject[key] !== undefined) {
      if (dataObject[key] === null
        || dataObject[key] instanceof RegExp
        || ['boolean', 'string', 'number', 'function'].includes(typeof dataObject[key])) {
        dataObject[key] = val
      } else if (Array.isArray(dataObject[key])) {
        dataObject[key] = [...dataObject[key], ...val]
      } else {
        dataObject[key] = { ...dataObject[key], ...val }
      }
    } else {
      dataObject.attrs[key] = val;
    }
  });
  
  // 清理特殊属性
  clearAttrs(dataObject);
}

/**
 * 清理特殊属性
 * @param {Object} dataObject 数据对象
 */
export function clearAttrs(dataObject) {
  // 删除所有特殊属性
  ['__element__', '__slot__', '__methods__', '__label__', '__regrule__', '__config__', '__template__', '__jsxTemplate__'].forEach(prop => {
    delete dataObject.attrs[prop];
  });
}

/**
 * 创建数据对象
 * @returns {Object} 初始化的数据对象
 */
export function makeDataObject() {
  return {
    class: {},
    attrs: {},
    props: {},
    domProps: {},
    nativeOn: {},
    on: {},
    style: {},
    directives: [],
    scopedSlots: {},
    slot: null,
    key: null,
    ref: null,
    refInFor: true
  }
}

/**
 * 渲染模板
 * 处理JSX模板和函数模板的渲染逻辑
 * @param {Function} h 渲染函数
 * @param {Object} confClone 配置克隆对象
 * @param {Function} parseJSXString JSX解析函数
 * @returns {VNode|null} 渲染结果
 */
export function renderTemplate(h, confClone, parseJSXString) {
  // 处理新的__jsxTemplate__属性
  if (confClone.__jsxTemplate__ && typeof confClone.__jsxTemplate__ === 'string') {
    try {
      // 使用从jsx-parser.js导入的函数解析JSX模板
      return parseJSXString(h, confClone.__jsxTemplate__);
    } catch (error) {
      console.error('解析__jsxTemplate__时出错:', error);
      return h('div', {
        style: {
          color: 'red',
          padding: '10px',
          border: '1px solid red',
          borderRadius: '4px',
          backgroundColor: '#fff5f5'
        }
      }, [`JSX模板渲染错误: ${error.message}`]);
    }
  }
  
  // 如果存在__template__属性，则直接执行该方法并渲染其返回的模板
  if (confClone.__template__ && typeof confClone.__template__ === 'function') {
    try {
      // 执行__template__方法获取模板内容
      const templateResult = confClone.__template__.call(this, h);
      
      // 如果函数返回值已经是VNode或VNode数组，则直接返回
      if (templateResult) {
        if (templateResult.tag || Array.isArray(templateResult)) {
          return templateResult;
        }
        
        // 处理JSX返回的情况
        if (templateResult.render || (templateResult.$options && templateResult.$options.render)) {
          return templateResult;
        }
      }
      
      // 否则尝试使用渲染函数包装模板内容
      return h('div', {
        class: {
          'template-container': true
        },
        style: {
          width: '100%'
        }
      }, [templateResult || '']);
    } catch (error) {
      console.error('渲染__template__时出错:', error);
      // 渲染错误提示
      return h('div', {
        style: {
          color: 'red',
          padding: '10px',
          border: '1px solid red',
          borderRadius: '4px',
          backgroundColor: '#fff5f5'
        }
      }, [`模板渲染错误: ${error.message}`]);
    }
  }
  
  // 如果没有模板，返回null表示需要继续使用默认渲染逻辑
  return null;
} 