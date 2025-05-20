export const basicComponents = [
  {
    type: 'el-input',
    label: '输入框1',
    icon: 'el-icon-edit',
    // 右侧属性栏
    props: {
      placeholder: '请输入2',
      label: '输入框2',
      name: '',
      type: 'text',
      required: false,
      col: 24,
      defaultValue: ''
    },
    // 添加属性配置
    propConfig: {
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
    }
  },
  {
    type: 'el-select',
    label: '下拉选择',
    icon: 'el-icon-arrow-down',
    props: {
      placeholder: '请选择',
      label: '下拉选择',
      name: '',
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' }
      ],
      required: false,
      col: 24
    },
    propConfig: {
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
    }
  },
  {
    type: 'el-radio-group',
    label: '单选框组',
    icon: 'el-icon-circle-check',
    props: {
      label: '单选框组',
      name: '',
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' }
      ],
      required: false,
      col: 24
    },
    propConfig: {
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
    }
  },
  {
    type: 'el-checkbox-group',
    label: '多选框组',
    icon: 'el-icon-check',
    props: {
      label: '多选框组',
      name: '',
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' }
      ],
      required: false,
      col: 24
    },
    propConfig: {
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
    }
  },
  {
    type: 'el-date-picker',
    label: '日期选择器',
    icon: 'el-icon-date',
    props: {
      label: '日期选择器',
      name: '',
      type: 'date',
      placeholder: '请选择日期',
      format: 'yyyy-MM-dd',
      required: false,
      col: 24
    },
    propConfig: {
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
    }
  },
  {
    type: 'el-time-picker',
    label: '时间选择器',
    icon: 'el-icon-time',
    props: {
      label: '时间选择器',
      name: '',
      placeholder: '请选择时间',
      format: 'HH:mm:ss',
      required: false,
      col: 24
    },
    propConfig: {
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
    }
  },
  {
    type: 'el-switch',
    label: '开关',
    icon: 'el-icon-turn-off',
    props: {
      label: '开关',
      name: '',
      'active-text': '开启',
      'inactive-text': '关闭',
      required: false,
      col: 24
    },
    propConfig: {
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
    }
  },
  {
    type: 'el-slider',
    label: '滑块',
    icon: 'el-icon-s-operation',
    props: {
      label: '滑块',
      name: '',
      min: 0,
      max: 100,
      step: 1,
      required: false,
      col: 24
    },
    propConfig: {
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
    }
  },
  {
    type: 'el-rate',
    label: '评分',
    icon: 'el-icon-star-off',
    props: {
      label: '评分',
      name: '',
      max: 5,
      'allow-half': true,
      required: false,
      col: 24
    },
    propConfig: {
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
    }
  },
  {
    type: 'el-color-picker',
    label: '颜色选择器',
    icon: 'el-icon-picture',
    props: {
      label: '颜色选择器',
      name: '',
      'show-alpha': true,
      required: false,
      col: 24
    },
    propConfig: {
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
    }
  },
  {
    type: 'el-cascader',
    label: '级联选择器',
    icon: 'el-icon-share',
    props: {
      label: '级联选择器',
      name: '',
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [{ value: 'yizhi', label: '一致' }]
            }
          ]
        }
      ],
      props: { expandTrigger: 'hover' },
      required: false,
      col: 24
    },
    propConfig: {
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
    }
  },
  {
    type: 'el-button',
    label: '按钮',
    icon: 'el-icon-thumb',
    props: {
      buttonText: '按钮',  // 修改默认显示文本
      name: '按钮',        // 属性面板显示用
      type: 'primary',
      size: 'small',
      plain: false,
      round: false,
      circle: false,
      disabled: false,
      col: 24
    },
    // 添加属性配置
    propConfig: {
      name: {
        label: '按钮名称',    // 属性面板中显示的标签
        type: 'input',
        bindProps: 'buttonText' // 绑定到实际显示的文本属性
      },
      col: {
        label: '栅格宽度',
        type: 'slider',
        min: 1,
        max: 24,
        step: 1
      }
      // ...其他属性配置
    }
  }
]

export const layoutComponents = [
  {
    type: 'el-row',
    label: '行容器',
    icon: 'el-icon-s-grid',
    props: {
      gutter: 20,
      type: 'flex',
      justify: 'start',
      align: 'top'
    },
    children: [
      // 默认包含两列
      {
        type: 'el-col',
        label: '左侧列',
        props: {
          span: 12,
          offset: 0,
          push: 0,
          pull: 0
        },
        xs: 24,  // 小屏幕占满
        sm: 12,  // 中等屏幕占一半
        md: 12,
        lg: 12,
        xl: 12,
        __config__: {
          layout: 'colFormItem',
          label: '左侧列',
          layoutTree: true
        },
        children: []
      },
      {
        type: 'el-col',
        label: '右侧列',
        props: {
          span: 12,
          offset: 0,
          push: 0,
          pull: 0
        },
        xs: 24,  // 小屏幕占满
        sm: 12,  // 中等屏幕占一半
        md: 12,
        lg: 12,
        xl: 12,
        __config__: {
          layout: 'colFormItem',
          label: '右侧列',
          layoutTree: true
        },
        children: []
      }
    ]
  },
  {
    type: 'el-col',
    label: '列容器',
    icon: 'el-icon-menu',
    props: {
      span: 12,
      offset: 0,
      push: 0,
      pull: 0
    },
    children: [] // 使其成为容器组件
  },
  {
    type: 'el-tabs',
    label: '标签页',
    icon: 'el-icon-document',
    props: {
      type: 'border-card',
      tabPosition: 'top'
    },
    children: [
      {
        type: 'el-tab-pane',
        label: '标签页1',
        id: `tab_${Date.now()}_1`,
        props: {
          label: '标签页1',
          name: 'tab1'
        },
        children: []
      },
      {
        type: 'el-tab-pane',
        label: '标签页2',
        id: `tab_${Date.now()}_2`,
        props: {
          label: '标签页2',
          name: 'tab2'
        },
        children: []
      }
    ]
  },
  {
    type: 'el-divider',
    label: '分割线',
    icon: 'el-icon-minus',
    props: {
      contentPosition: 'center'
    }
  },
  {
    type: 'el-card',
    label: '卡片',
    icon: 'el-icon-postcard',
    props: {
      header: '卡片标题',
      shadow: 'always'
    },
    children: [] // 使其成为容器组件
  }
]

// 导出组合组件配置
export const combinationComponents = [
  {
    type: 'combo-input-button',
    label: '输入框+按钮',
    icon: 'el-icon-s-operation',
    children: [
      {
        type: 'el-input',
        label: '输入框',
        icon: 'el-icon-edit',
        props: {
          placeholder: '请输入内容',
          clearable: true,
          label: '输入框',
          col: 18
        }
      },
      {
        type: 'el-button',
        label: '按钮',
        icon: 'el-icon-s-promotion',
        props: {
          type: 'primary',
          text: '确定',
          col: 6
        }
      }
    ]
  },
  {
    type: 'combo-select-button',
    label: '选择框+按钮',
    icon: 'el-icon-s-grid',
    children: [
      {
        type: 'el-select',
        label: '选择框',
        icon: 'el-icon-arrow-down',
        props: {
          placeholder: '请选择',
          label: '选择框',
          options: [
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' },
            { label: '选项3', value: '3' }
          ],
          col: 18
        }
      },
      {
        type: 'el-button',
        label: '按钮',
        icon: 'el-icon-search',
        props: {
          type: 'primary',
          text: '查询',
          col: 6
        }
      }
    ]
  },
  {
    type: 'combo-date-button',
    label: '日期+按钮',
    icon: 'el-icon-date',
    children: [
      {
        type: 'el-date-picker',
        label: '日期选择',
        icon: 'el-icon-date',
        props: {
          placeholder: '请选择日期',
          clearable: true,
          type: 'date',
          format: 'yyyy-MM-dd',
          col: 18
        }
      },
      {
        type: 'el-button',
        label: '按钮',
        icon: 'el-icon-check',
        props: {
          type: 'success',
          text: '确认',
          col: 6
        }
      }
    ]
  },
  {
    type: 'combo-search',
    label: '搜索组合',
    icon: 'el-icon-search',
    children: [
      {
        type: 'el-input',
        label: '关键词',
        icon: 'el-icon-search',
        props: {
          placeholder: '请输入关键词',
          clearable: true,
          prefixIcon: 'el-icon-search',
          label: '关键词',
          col: 8
        }
      },
      {
        type: 'el-select',
        label: '分类',
        icon: 'el-icon-s-grid',
        props: {
          placeholder: '请选择分类',
          label: '分类',
          options: [
            { label: '全部', value: 'all' },
            { label: '分类1', value: 'cat1' },
            { label: '分类2', value: 'cat2' }
          ],
          col: 8
        }
      },
      {
        type: 'el-button',
        label: '搜索',
        icon: 'el-icon-search',
        props: {
          type: 'primary',
          text: '搜索',
          col: 4
        }
      },
      {
        type: 'el-button',
        label: '重置',
        icon: 'el-icon-refresh',
        props: {
          type: 'info',
          text: '重置',
          col: 4
        }
      }
    ]
  }
]
