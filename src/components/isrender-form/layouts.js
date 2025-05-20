// 导入渲染组件
import render from './render.js'

// 处理表单元素数据
function initFormItem(item, formModel, formConf) {
  // 解构所需配置
  const { 
      __config__: config = {},
      __element__: element = {}, 
      __label__: label = {},
      __regrule__: regrule = {} 
  } = item;

  const key = element.key;
  
  // 判断显示条件
  const shouldDisplay = !element.display || formModel[element.display];
  
  // 返回处理结果
  return {
    // 组件基础信息
    config,
    element,
    key,
    
    // 显示控制
    shouldDisplay,
    
    // 标签相关
    showLabel: label.showLabel !== false,
    labelWidth: (label.showLabel !== false) ? (label.labelWidth || formConf.labelWidth) + 'px' : '0px',
    labelText: label.label || '',
    labelPositionClass: label.labelPosition ? `label-position-${label.labelPosition}` : '',
    
    // 样式相关
    itemStyle: {
      marginBottom: `${formConf.itemSpacing || 15}px`,
      paddingLeft: `${formConf.itemPaddingLeft || 10}px`,
      ...(element.style || {})
    },
    
    // 验证相关
    isRequired: regrule && regrule.required === true,
    errorMessage: formModel[`${key}_error`]
  }
}

// 构建事件监听器
function buildListeners(context, field, key, formModel) {
  const element = field.__element__;
  const eventList = {};
  
  // 处理自定义事件
  if (element && element.on) {
    Object.keys(element.on).forEach(eventName => {
      const handler = element.on[eventName];
      if (typeof handler === 'function') {
        eventList[eventName] = event => handler.call(
          context,
          context.parentInstance || context, // 传递父组件实例或表单实例
          event, 
          {key, value: formModel[key]}
        );
      }
    });
  }
  eventList.input = event => {
    // 更新表单值
    context.$set(formModel, key, event);
    // 更新元素的默认值
    if (element) {
      context.$set(element, 'value', event);
    }
  };
  return eventList;
}

// 渲染表单项列表
function renderFormItems(h, itemList, formModel, formConf, context) {
  if (!Array.isArray(itemList)) return null
  
  return itemList.map(item => {
    // 处理具名插槽占位
    if (item.slot && typeof item.slot === 'string') {
      // 查找对应名称的具名插槽内容
      const slotContent = context.$slots[item.slot];
      if (slotContent && slotContent.length > 0) {
        // 将插槽内容包装在el-col中，保持与配置渲染项相同的结构
        const config = item.__config__ || {};
        return h('el-col', {
          props: {
            span: config.span || 24,
            offset: config.offset || 0
          }
        }, slotContent);
      }
      // 如果没有找到对应的插槽内容，可以返回一个空的占位符或者null
      return null;
    }
    
    // 处理常规表单项
    const layout = item.__config__ && item.__config__.layout ? layouts[item.__config__.layout] : null;
    
    if (layout) {
      return layout.call(context, h, item, formModel, formConf)
    }
    return null
  })
}

// 表单布局组件集合
const layouts = {
  // 列表单项布局
  colFormItem(h, renderitem, formModel, formConf, options = {}) {
    const { 
      key, 
      config, 
      showLabel, 
      labelText, 
      itemStyle,
      labelWidth,
      errorMessage,
      shouldDisplay,
      labelPositionClass,
      isRequired
    } = initFormItem(renderitem, formModel, formConf)
    if (!shouldDisplay) return null;
    
    // 获取可能的设计时操作按钮
    const { actionButtons } = options;
    
    return (
      <el-col span={config.span || 24} offset={config.offset || 0}>
        <el-form-item
          label-width={labelWidth}
          label={showLabel ? labelText : ''}
          prop={key}
          size={formConf.size}
          style={itemStyle}
          class={labelPositionClass}
          show-message={true}
          error={errorMessage}
          required={isRequired}
        >
          <render 
            conf={renderitem}
            formModel={formModel}
            value={this.value}
            on={buildListeners.call(this, this, renderitem, key, formModel)}
            parentInstance={this.parentInstance}
          />
        </el-form-item>
        {/* 如果有操作按钮，则渲染 */}
        {actionButtons && actionButtons}
      </el-col>
    )
  },
  
  // 行表单项布局
  rowFormItem(h, renderitem, formModel, formConf) {
    const { 
      config, 
      itemStyle,
      shouldDisplay
    } = initFormItem(renderitem, formModel, formConf)
    
    if (!shouldDisplay) return null;
    
    // 获取子项内容
    const children = renderFormItems.call(this, h, config.children || [], formModel, formConf, this);
    
    return (
      <el-col span={config.span || 24} offset={config.offset || 0}>
        <el-row 
          gutter={config.gutter || 0}
          type={config.type}
          justify={config.justify}
          align={config.align}
          style={itemStyle}
        >
          {children}
        </el-row>
      </el-col>
    )
  },
  
  // 原始组件布局
  raw(h, renderitem, formModel, formConf) {
    const { key } = initFormItem(renderitem, formModel, formConf)
    const config = renderitem.__config__
    
    return (
      <render
        key={config.renderKey || key}
        conf={renderitem}
        formModel={formModel}
        value={this.value}
        on={buildListeners.call(this, this, renderitem, key, formModel)}
        parentInstance={this.parentInstance}
      />
    )
  }
};

// 根表单布局
function form(h, formConfig, formModel, formRules, context) {
  // 配置props对象，总是包含rules属性
  const formProps = {
    model: formModel,
    size: formConfig.size,
    labelPosition: formConfig.labelPosition,
    labelWidth: formConfig.labelWidth + 'px',
    disabled: formConfig.disabled,
    validateOnRuleChange: false,
    rules: formRules
  };
  
  // 获取默认插槽内容
  const slotContent = context.$slots.default || [];
  
  // 判断是否有默认插槽内容
  const hasDefaultSlotContent = slotContent.length > 0;
  
  // 生成配置内容
  const configContent = formContent.call(context, h, formConfig, formModel);
  
  // 跟踪已经通过占位符渲染的具名插槽
  const renderedNamedSlots = [];
  if (Array.isArray(formConfig.itemRenderList)) {
    formConfig.itemRenderList.forEach(item => {
      if (item.slot && typeof item.slot === 'string' && context.$slots[item.slot]) {
        renderedNamedSlots.push(item.slot);
      }
    });
  }
  
  // 过滤掉已经通过占位符渲染的具名插槽内容
  const remainingSlotContent = hasDefaultSlotContent 
    ? slotContent.filter(vnode => {
        // 这里假设具名插槽在VNode中有特定标记，实际情况可能需要调整
        const slotName = vnode.data && vnode.data.attrs && vnode.data.attrs.slot;
        return !slotName || !renderedNamedSlots.includes(slotName);
      })
    : [];
  
  // 渲染表单
  console.log('渲染表单，已处理具名插槽:', renderedNamedSlots);
  return h('el-form', {
    class: ['magicbox-form-container', formConfig.size],
    props: formProps,
    ref: 'elForm'
  }, [
    // 渲染配置内容（已包含具名插槽占位符渲染的内容）
    configContent,
    // 渲染剩余的默认插槽内容
    ...remainingSlotContent
  ]);
}

// 表单内容区域布局
function formContent(h, formConfig, formModel) {
  return h('el-row', {
    props: { gutter: formConfig.gutter || 0 }
  }, renderFormItems.call(this, h, formConfig.itemRenderList, formModel, formConfig, this))
}

// 导出所有布局函数和辅助函数
export {
  layouts,
  form,
  formContent,
  initFormItem,
  buildListeners,
  renderFormItems
}; 