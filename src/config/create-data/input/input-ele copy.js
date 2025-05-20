// 保存要修改的项目
let defaultValueInputConfig = null;

// 表单名称输入框事件处理
function handleInputFocus(parentInstance, event, formModel, fieldInfo) {
  // 获取选择的输入框类型
  const selectedType = event; // 事件参数就是选择的值
  
  // 根据选择的值确定type值
  let typeValue = '';
  if (selectedType === 'password') {
    typeValue = 'password';
  } else if (selectedType === 'number-input') {
    typeValue = 'number';
  }
  
  // 修改formModel中的type属性，这会通过双向绑定同步到画布上
  if (formModel) {
    // 设置type属性
    formModel.type = typeValue;
    // 如果想同时修改默认值输入框的表现形式，可以通过DOM操作
    setTimeout(() => {
      const itemList = document.getElementsByClassName('el-form-item');
      for (let i = 0; i < itemList.length; i++) {
        const labelEl = itemList[i].querySelector('.el-form-item__label');
        if (labelEl && labelEl.textContent && labelEl.textContent.includes('默认值')) {
          const inputEl = itemList[i].querySelector('input');
          if (inputEl) {
            // 设置输入框的type属性
            inputEl.type = typeValue || 'text';
            break;
          }
        }
      }
    }, 100); // 设置一个短暂延迟，确保DOM已更新
    
  }
}

// 将默认值输入框配置保存为变量，便于修改
const defaultValueInput = {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 24,
  },
  __label__: {
    label: '默认值',
    labelWidth: 100,
    showLabel: true,
  },
  __element__: {
    style: { width: '100%' },
    key: "value",
    value: "默认值",
    tag: 'el-input',
    placeholder: '可以输入默认值',
    clearable: true,
    type: '',
  }
};

export default {
  itemRenderList: [
    // 当前组件类型
    // {
    //   __config__: {
    //     changeTag: true,
    //     layout: 'colFormItem',
    //     span: 24,
    //   },
    //   __label__: {
    //     label: '当前元素类型',
    //     labelWidth: 120,
    //     showLabel: true,
    //   },
    //   __element__: {
    //     style: { width: '100%' },
    //     key: "eleType",
    //     value: "input",
    //     tag: 'el-select',
    //     slot: {
    //       options: [
    //         { label: '单行输入框', value: 'input' },
    //         { label: '密码输入框', value: 'password' },
    //         { label: '数字输入框', value: 'number-input' }
    //       ]
    //     },
    //     on: {
    //       change: handleInputFocus,
    //     }
    //   }
    // },
    {
      slot: "defultValue"
    },
    {
      slot: "slotConfig"
    },
    {
      slot: "chartConfig"
    },
    {
      slot: "lineConfig"
    },
    // 默认值配置
    // defaultValueInput,
    // placeholder 配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '占位提示',
        labelWidth: 90,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "placeholder",
        value: "请输入内容",
        tag: 'el-input',
        placeholder: '请输入占位提示文字',
        clearable: true
      }
    },
    // disabled 配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '是否禁用',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "disabled",
        value: false,
        tag: 'el-switch'
      }
    },
    // clearable 配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '是否可清空',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "clearable",
        value: false,
        tag: 'el-switch'
      }
    },
    // prefix-icon 配置
    // {
    //   __config__: {
    //     changeTag: true,
    //     layout: 'colFormItem',
    //     span: 24,
    //   },
    //   __label__: {
    //     label: '头部图标',
    //     labelWidth: 100,
    //     showLabel: true,
    //   },
    //   __element__: {
    //     style: { width: '100%' },
    //     key: "prefix-icon",
    //     value: "",
    //     tag: 'el-input',
    //     placeholder: '请输入Element UI图标名称'
    //   }
    // },
    // // suffix-icon 配置
    // {
    //   __config__: {
    //     changeTag: true,
    //     layout: 'colFormItem',
    //     span: 24,
    //   },
    //   __label__: {
    //     label: '尾部图标',
    //     labelWidth: 100,
    //     showLabel: true,
    //   },
    //   __element__: {
    //     style: { width: '100%' },
    //     key: "suffix-icon",
    //     value: "",
    //     tag: 'el-input',
    //     placeholder: '请输入Element UI图标名称',
    //     slot: {
    //       default: '发送短信'
    //     },
    //     on: {
    //       click: handleClick
    //     }
    //   }
    // },
    // readonly 配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '是否只读',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "readonly",
        value: false,
        tag: 'el-switch'
      }
    },
    // maxlength 配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '最大长度',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "maxlength",
        value: 50,
        tag: 'el-input-number',
        min: 0,
        placeholder: '请输入最大字符数'
      }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '元素前缀',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "prepend",
        value: "",
        tag: 'el-input',
        slot:{
          prepend: '前缀',
          append: ''
        }
      }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '元素后缀',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "append",
        value: "",
        tag: 'el-input',
        slot:{
          prepend: '',
          append: '后缀'
        }
      }
    },
  ]
}
