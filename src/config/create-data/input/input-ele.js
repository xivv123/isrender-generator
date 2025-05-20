export default {
  size: 'small',
  labelPosition: 'left',
  labelWidth: 70,
  gutter: 15,
  disabled: false,
  validate: false,
  showSubmitBtn: false,
  showResetBtn: false,
  thisOn: true,
  itemSpacing: 15,
  itemPaddingLeft: 10,
  itemRenderList: [
    {
      slot: "prefix-icon"
    },
    {
      slot: "suffix-icon"
    },
    // placeholder 配置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '变量名称',
        labelWidth: 70,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "key",
        value: "",
        tag: 'el-input',
        placeholder: '请输入元素KEY值',
        clearable: true
      }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '占位提示',
        labelWidth: 70,
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
        span: 12,
      },
      __label__: {
        label: '是否禁用',
        labelWidth: 70,
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
        span: 12,
      },
      __label__: {
        label: '是否可清空',
        labelWidth: 90,
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
        span: 11,
      },
      __label__: {
        label: '是否只读',
        labelWidth: 70,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "readonly",
        value: false,
        tag: 'el-switch'
      }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 13,
      },
      __label__: {
        label: '显示字数限制',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "show-word-limit",
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
        labelWidth: 70,
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
        labelWidth: 70,
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
        labelWidth: 70,
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
