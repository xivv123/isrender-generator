// 表单名称输入框事件处理
function handleInputFocus(parentInstance, event, obj) {
  // 检查parentInstance是否正确传递
  console.log("parentInstance类型:", Object.prototype.toString.call(parentInstance));
  console.log("parentInstance属性:", Object.keys(parentInstance));
  
  // 检查是否包含test属性
  console.log("test属性存在:", 'test' in parentInstance);
  console.log("test属性值:", parentInstance.test);
  
  // 尝试修改
  const oldValue = parentInstance.test;
  parentInstance.test = "被修改了：" + new Date().toLocaleTimeString();
  console.log("修改后值:", parentInstance.test);
  
  // 检查方法
  console.log("方法列表:", 
    Object.keys(parentInstance).filter(key => typeof parentInstance[key] === 'function')
  );
}

// 处理仪表盘数据更新
function updateGaugeValue(parentInstance, newValue) {
  console.log("更新仪表盘值:", newValue);
  
  // 获取formData中的仪表盘数据
  if (parentInstance && parentInstance.formData && parentInstance.formData.echarts_gauge_chart) {
    const gaugeChart = parentInstance.formData.echarts_gauge_chart;
    
    // 更新仪表盘数据
    if (gaugeChart.chartOptions && gaugeChart.chartOptions.series) {
      // 确保数据在0-100范围内
      const value = Math.min(100, Math.max(0, newValue));
      
      // 修改仪表盘数据值
      gaugeChart.chartOptions.series[0].data[0].value = value;
      
      // 如果有div元素引用，可以触发图表更新
      if (parentInstance.$refs && parentInstance.$refs.echarts_gauge_chart) {
        const chartInstance = parentInstance.$refs.echarts_gauge_chart;
        if (chartInstance && chartInstance.setOption) {
          chartInstance.setOption({
            series: [
              {
                data: [{ value: value, name: '完成率' }]
              }
            ]
          });
        }
      }
      
      console.log("仪表盘数据已更新:", value);
      return true;
    }
  }
  
  console.warn("未找到仪表盘数据或无法更新");
  return false;
}

// 处理饼图数据视图切换
function updatePieChartView(parentInstance, viewType) {
  console.log("切换饼图数据视图:", viewType);
  
  // 不同视图的数据集合
  const dataViews = {
    sales: {
      title: '销售区域分布',
      legend: ['华东区域', '华南区域', '华北区域', '西北区域', '东北区域'],
      data: [
        { value: 1048, name: '华东区域' },
        { value: 735, name: '华南区域' },
        { value: 580, name: '华北区域' },
        { value: 484, name: '西北区域' },
        { value: 300, name: '东北区域' }
      ]
    },
    customer: {
      title: '客户类型分布',
      legend: ['政府机构', '大型企业', '中小企业', '个体商户', '其他'],
      data: [
        { value: 835, name: '政府机构' },
        { value: 1048, name: '大型企业' },
        { value: 642, name: '中小企业' },
        { value: 480, name: '个体商户' },
        { value: 360, name: '其他' }
      ]
    },
    product: {
      title: '产品类别分布',
      legend: ['基础产品', '高级产品', '定制产品', '增值服务', '配套设备'],
      data: [
        { value: 920, name: '基础产品' },
        { value: 688, name: '高级产品' },
        { value: 512, name: '定制产品' },
        { value: 382, name: '增值服务' },
        { value: 310, name: '配套设备' }
      ]
    }
  };
  
  // 获取选择的数据视图
  const selectedView = dataViews[viewType] || dataViews.sales;
  
  // 获取formData中的饼图数据
  if (parentInstance && parentInstance.formData && parentInstance.formData.echarts_pie_chart) {
    const pieChart = parentInstance.formData.echarts_pie_chart;
    
    // 更新饼图数据
    if (pieChart.chartOptions) {
      // 更新标题
      if (pieChart.chartOptions.title) {
        pieChart.chartOptions.title.text = selectedView.title;
      }
      
      // 更新图例
      if (pieChart.chartOptions.legend) {
        pieChart.chartOptions.legend.data = selectedView.legend;
      }
      
      // 更新数据系列
      if (pieChart.chartOptions.series && pieChart.chartOptions.series.length > 0) {
        pieChart.chartOptions.series[0].data = selectedView.data;
      }
      
      // 如果有图表元素引用，直接更新图表
      if (parentInstance.$refs && parentInstance.$refs.echarts_pie_chart) {
        const chartInstance = parentInstance.$refs.echarts_pie_chart;
        if (chartInstance && chartInstance.setOption) {
          chartInstance.setOption({
            title: { text: selectedView.title },
            legend: { data: selectedView.legend },
            series: [{ data: selectedView.data }]
          });
        }
      }
      
      console.log("饼图数据已更新为:", selectedView.title);
      return true;
    }
  }
  
  console.warn("未找到饼图数据或无法更新");
  return false;
}

// 表单按钮点击事件处理
function handleClick(parentInstance, event, formvalue, obj) {
  console.log("点击按钮", parentInstance);
  
  // 检查父组件是否存在并且有methods
  if (parentInstance && parentInstance.$options && parentInstance.$options.methods) {
    // 获取父组件的methods列表
    const methodsList = Object.keys(parentInstance.$options.methods);
    console.log("父组件可用方法:", methodsList);
    
    // 如果父组件有sendSms方法，调用它
    if (typeof parentInstance.sendSms === 'function') {
      console.log("调用父组件的sendSms方法");
      parentInstance.sendSms(formvalue);
      return;
    }
    
    // 如果有自定义的handleSendSms方法，调用它
    if (typeof parentInstance.handleSendSms === 'function') {
      console.log("调用父组件的handleSendSms方法");
      parentInstance.handleSendSms(formvalue);
      return;
    }
    
    // 尝试查找名称中包含sms或send的方法
    const smsMethod = methodsList.find(method => 
      method.toLowerCase().includes('sms') || 
      method.toLowerCase().includes('send')
    );
    
    if (smsMethod && typeof parentInstance[smsMethod] === 'function') {
      console.log(`调用父组件的${smsMethod}方法`);
      parentInstance[smsMethod](formvalue);
      return;
    }
  }
  
  // 如果没有找到适合的方法，则保留原来的行为
  console.warn("未找到父组件中的发送短信方法，使用默认行为");
  parentInstance.formData.formname = "哈哈是";
}

function handleInputChange(val, vm) {
  console.log("input事件", val);
  
  // 通过传入的组件实例修改test属性
  if (vm) {
    vm.test = "被form-data.js中的函数修改了！- " + val;
    console.log("已修改组件中的test属性，新值:", vm.test);
  }
}

// 处理上传成功事件
function handleUploadSuccess(parentInstance, file, fileList) {
  console.log('上传成功', file, fileList);
  // 可以在这里更新表单数据
  if (parentInstance && parentInstance.formData) {
    // 示例：将文件URL存入表单数据
    parentInstance.formData.formupload = file.response?.url || '';
  }
}

// 处理上传失败事件
function handleUploadError(parentInstance, err, file, fileList) {
  console.error('上传失败', err);
}

// 处理上传前的检查
function handleBeforeUpload(parentInstance, file) {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    console.warn('上传文件只能是图片格式!');
  }
  if (!isLt2M) {
    console.warn('上传图片大小不能超过 2MB!');
  }
  
  return isImage && isLt2M;
}

export default {
  size: 'small',
  labelPosition: 'left',
  labelWidth: 100,
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
      slot: "myField"
    },
    // 单行文本组件配置
    {
      __config__: {
          changeTag: true,
          layout: 'colFormItem',
          span: 24,
          // 正则校验规则
      },
      // 表单label配置，
      __label__:{
          label: '折线图',
          labelWidth: 100,
          showLabel: true,
      },
      __element__:{
          tag: 'div', // 使用div作为容器
          style: { 
              width: '100%', 
              height: '300px'  // 指定图表高度
          },
          key: "echarts_line_chart",
          // 图表配置
          chartOptions: {
              title: {
                  text: '月度销售数据',
                  left: 'center'
              },
              tooltip: {
                  trigger: 'axis'
              },
              legend: {
                  data: ['销售额', '订单数'],
                  bottom: 10
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '15%',
                  top: '15%',
                  containLabel: true
              },
              xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
              },
              yAxis: {
                  type: 'value'
              },
              series: [
                  {
                      name: '销售额',
                      type: 'line',
                      stack: '总量',
                      data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
                      smooth: true,
                      lineStyle: {
                          width: 3,
                          color: '#409EFF'
                      },
                      itemStyle: {
                          color: '#409EFF'
                      }
                  },
                  {
                      name: '订单数',
                      type: 'line',
                      stack: '总量',
                      data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149],
                      smooth: true,
                      lineStyle: {
                          width: 3,
                          color: '#67C23A'
                      },
                      itemStyle: {
                          color: '#67C23A'
                      }
                  }
              ]
          },
          // 引用自定义指令（需要定义）
          directives: [
              {
                  name: 'echart',
                  value: 'echarts_line_chart' // 对应实例中的key
              }
          ]
      },
      // 正则验证规则
      __regrule__:{
          // 小标识
          // 是否必填
          required: true,
          regList: []
          // 验证规则
      },
      material:{
          icon: 'edit'
      }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __jsxTemplate__: `
<el-descriptions title="用户信息">
          <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
          <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
          <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
          <el-descriptions-item label="备注">
            <el-tag size="small">学校</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
        </el-descriptions>
      `
    },
    {
      slot: "customField",
      __slotRules__: {
        prop: "customField",
        rules: [
          { required: true, message: '自定义字段不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    },
    // 表单名称
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 12,
      },
      __label__: {
        label: '表单名称',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "formname",
        value: "我是默认数据",
        tag: 'el-input',
        tagIcon: 'input',
        placeholder: '请输入表单名称',
        clearable: true,
        disabled: false,
        readonly: false,
        maxlength: null,
        on: {
          focus: handleInputFocus,
        },
        slot: {
          prepend: 'aaa',
          append: '22'
        },
      },
      __regrule__: {
        required: true,
        regList: []
      },
    },
    
    // 操作按钮
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 5,
      },
      __label__: {
        labelWidth: 0,
        showLabel: false,
      },
      __element__: {
        style: { width: '100%' },
        type: 'primary',
        key: "button_submit1",
        value: "ssss",
        tag: 'el-button',
        disabled: false,
        slot: {
          default: '发送短信'
        },
        on: {
          click: handleClick
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      // __slot__: {
      //   default: '发送短信'
      // }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '联级选择器',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "labelPosition",
        value: " ",
        tag: 'el-cascader',
        clearable: true,
        disabled: false,
        slot: {
          options: [{
            id: 1,
            value: 1,
            label: '选项1',
            children: [{
              id: 2,
              value: 2,
              label: '选项1-1'
            }]
          }],
        }
      },
      __regrule__: {
        required: false,
        regList: []
      }
    },
    // 标签位置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '标签位置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "labelPosition",
        value: "left",
        tag: 'el-select',
        placeholder: '请选择标签位置',
        clearable: true,
        disabled: false,
        slot: {
          options: [
            { label: '左对齐', value: 'left' },
            { label: '右对齐', value: 'right' },
            { label: '顶部对齐', value: 'top' }
          ]
        },
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      // __slot__: {
      //   options: [
      //     { label: '左对齐', value: 'left' },
      //     { label: '右对齐', value: 'right' },
      //     { label: '顶部对齐', value: 'top' }
      //   ]
      // }
    },
    // 显示标签
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '显示标签',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "form_all_showLabel",
        value: true,
        tag: 'el-switch',
        disabled: false,
        // on: {
        //   change: handleInputFocus,
        // }
      },
      __regrule__: {
        required: false,
        regList: []
      },
    },
    // 标签宽度
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '标签宽度',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "form_all_labelWidth",
        value: 100,
        tag: 'el-slider',
        min: 0,
        max: 200,
        'show-input': true,
        display: 'form_all_showLabel',
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      }
    },
    // 表单尺寸
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单尺寸',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%', "fill": "#409EFF","text-color": "#FFFFFF"},
        key: "formSize",
        value: "small",
        tag: 'el-radio-group',
        disabled: false,
        size:"small",
        slot: {
          tag: 'el-radio', //设置子组件的样式
          // 子组件数据
          options: [
            { label: '中等', value: 'medium', border: true},
            { label: '小型', value: 'small', border: true },
            { label: '迷你', value: 'mini', border: true }
          ]
        },
        // on: {
        //   change: handleInputFocus,
        // }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      // __slot__: {
      //   options: [
      //     { label: '中等', value: 'medium' },
      //     { label: '小型', value: 'small' },
      //     { label: '迷你', value: 'mini' }
      //   ]
      // }
    },
    // 禁用表单
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '禁用表单',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "form_all_disabled",
        value: false,
        tag: 'el-switch',
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 禁用表单提示信息
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '禁用表单提示信息',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "disabled_form_message",
        value: "表单已禁用，请注意！",
        tag: 'el-input',
        type: 'textarea',
        rows: 2,
        placeholder: '请输入禁用表单时显示的提示信息',
        clearable: true,
        disabled: false,
        display: 'form_all_disabled',
        on: {
          focus: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 栅格间隔
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '栅格间隔',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "gutter",
        value: 15,
        tag: 'el-input-number',
        min: 0,
        max: 50,
        step: 2,
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 表单项间距
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单项间距',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "itemSpacing",
        value: 15,
        tag: 'el-slider',
        min: 0,
        max: 40,
        step: 1,
        'show-stops': true,
        'show-input': true,
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 表单项左边距
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单项左边距',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "itemPaddingLeft",
        value: 10,
        tag: 'el-slider',
        min: 0,
        max: 40,
        step: 1,
        'show-stops': true,
        'show-input': true,
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 表单验证
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单验证',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        // style: { width: '50%' },
        key: "validate",
        value: false,
        tag: 'el-switch',
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 提交按钮
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '提交按钮',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "showSubmitBtn",
        value: false,
        tag: 'el-switch',
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 重置按钮
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '重置按钮',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "showResetBtn",
        value: false,
        tag: 'el-switch',
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 仪表盘组件配置
    {
      __config__: {
          changeTag: true,
          layout: 'colFormItem',
          span: 24,
      },
      // 表单label配置
      __label__:{
          label: '仪表盘',
          labelWidth: 100,
          showLabel: true,
      },
      __element__:{
          tag: 'div', // 使用div作为容器
          style: { 
              width: '100%', 
              height: '300px'  // 指定图表高度
          },
          key: "echarts_gauge_chart",
          // 图表配置
          chartOptions: {
              title: {
                  text: '业务完成率',
                  left: 'center'
              },
              tooltip: {
                  formatter: '{a} <br/>{b} : {c}%'
              },
              series: [
                  {
                      name: '完成情况',
                      type: 'gauge',
                      radius: '80%',
                      progress: {
                          show: true,
                          width: 18
                      },
                      axisLine: {
                          lineStyle: {
                              width: 18,
                              color: [
                                  [0.3, '#FF6E76'],
                                  [0.7, '#FDDD60'],
                                  [1, '#7CFFB2']
                              ]
                          }
                      },
                      axisTick: {
                          show: false
                      },
                      splitLine: {
                          length: 15,
                          lineStyle: {
                              width: 2,
                              color: '#999'
                          }
                      },
                      axisLabel: {
                          distance: 25,
                          color: '#999',
                          fontSize: 12
                      },
                      anchor: {
                          show: true,
                          showAbove: true,
                          size: 20,
                          itemStyle: {
                              borderWidth: 8
                          }
                      },
                      detail: {
                          valueAnimation: true,
                          formatter: '{value}%',
                          fontSize: 30,
                          offsetCenter: [0, '70%']
                      },
                      data: [
                          {
                              value: 70,
                              name: '完成率'
                          }
                      ],
                      title: {
                          fontSize: 14
                      },
                      pointer: {
                          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                          length: '12%',
                          width: 20,
                          offsetCenter: [0, '-60%'],
                          itemStyle: {
                              color: 'auto'
                          }
                      }
                  }
              ]
          },
          // 引用自定义指令
          directives: [
              {
                  name: 'echart',
                  value: 'echarts_gauge_chart' // 对应实例中的key
              }
          ]
      },
      // 正则验证规则
      __regrule__:{
          required: false,
          regList: []
      },
      material:{
          icon: 'dashboard'
      }
    },
    // 饼图组件配置
    {
      __config__: {
          changeTag: true,
          layout: 'colFormItem',
          span: 24,
      },
      // 表单label配置
      __label__:{
          label: '销售分布饼图',
          labelWidth: 100,
          showLabel: true,
      },
      __element__:{
          tag: 'div', // 使用div作为容器
          style: { 
              width: '100%', 
              height: '300px'  // 指定图表高度
          },
          key: "echarts_pie_chart",
          // 图表配置
          chartOptions: {
              title: {
                  text: '销售区域分布',
                  left: 'center'
              },
              tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b}: {c} ({d}%)'
              },
              legend: {
                  orient: 'horizontal',
                  bottom: 10,
                  data: ['华东区域', '华南区域', '华北区域', '西北区域', '东北区域']
              },
              series: [
                  {
                      name: '销售分布',
                      type: 'pie',
                      radius: ['40%', '70%'], // 设置为环形图
                      avoidLabelOverlap: false,
                      itemStyle: {
                          borderRadius: 10,
                          borderColor: '#fff',
                          borderWidth: 2
                      },
                      label: {
                          show: false,
                          position: 'center'
                      },
                      emphasis: {
                          label: {
                              show: true,
                              fontSize: '18',
                              fontWeight: 'bold'
                          }
                      },
                      labelLine: {
                          show: false
                      },
                      data: [
                          { value: 1048, name: '华东区域' },
                          { value: 735, name: '华南区域' },
                          { value: 580, name: '华北区域' },
                          { value: 484, name: '西北区域' },
                          { value: 300, name: '东北区域' }
                      ]
                  }
              ]
          },
          // 引用自定义指令
          directives: [
              {
                  name: 'echart',
                  value: 'echarts_pie_chart' // 对应实例中的key
              }
          ]
      },
      // 正则验证规则
      __regrule__:{
          required: false,
          regList: []
      },
      material:{
          icon: 'pie-chart'
      }
    },
    // 饼图数据视图切换
    {
      __config__: {
          changeTag: true,
          layout: 'colFormItem',
          span: 24,
      },
      // 表单label配置
      __label__:{
          label: '数据视图切换',
          labelWidth: 100,
          showLabel: true,
      },
      __element__:{
          style: { width: '100%' },
          key: "pie_chart_view",
          value: "sales",
          tag: 'el-radio-group',
          disabled: false,
          size: "small",
          slot: {
              tag: 'el-radio-button',
              options: [
                  { label: '销售区域', value: 'sales' },
                  { label: '客户类型', value: 'customer' },
                  { label: '产品类别', value: 'product' }
              ]
          },
          on: {
              change: function(parentInstance, newValue) {
                  // 根据选择更新饼图数据
                  updatePieChartView(parentInstance, newValue);
              }
          }
      },
      __regrule__:{
          required: false,
          regList: []
      }
    },
    // 仪表盘数值控制滑块
    {
      __config__: {
          changeTag: true,
          layout: 'colFormItem',
          span: 24,
      },
      // 表单label配置
      __label__:{
          label: '仪表盘数值',
          labelWidth: 100,
          showLabel: true,
      },
      __element__:{
          style: { width: '100%' },
          key: "gauge_value_control",
          value: 70,
          tag: 'el-slider',
          min: 0,
          max: 100,
          step: 1,
          'show-input': true,
          'show-stops': false,
          'show-tooltip': true,
          disabled: false,
          on: {
              change: function(parentInstance, newValue) {
                  // 调用仪表盘更新函数
                  updateGaugeValue(parentInstance, newValue);
              }
          }
      },
      __regrule__:{
          required: false,
          regList: []
      }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __jsxTemplate__: `
<el-descriptions title="用户信息">
          <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
          <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
          <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
          <el-descriptions-item label="备注">
            <el-tag size="small">学校</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
        </el-descriptions>
      `
    },
    {
      slot: "customField",
      __slotRules__: {
        prop: "customField",
        rules: [
          { required: true, message: '自定义字段不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    },
    // 表单名称
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 12,
      },
      __label__: {
        label: '表单名称',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "formname",
        value: "我是默认数据",
        tag: 'el-input',
        tagIcon: 'input',
        placeholder: '请输入表单名称',
        clearable: true,
        disabled: false,
        readonly: false,
        maxlength: null,
        on: {
          focus: handleInputFocus,
        },
        slot: {
          prepend: 'aaa',
          append: '22'
        },
      },
      __regrule__: {
        required: true,
        regList: []
      },
    },
    
    // 操作按钮
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 5,
      },
      __label__: {
        labelWidth: 0,
        showLabel: false,
      },
      __element__: {
        style: { width: '100%' },
        type: 'primary',
        key: "button_submit1",
        value: "ssss",
        tag: 'el-button',
        disabled: false,
        slot: {
          default: '发送短信'
        },
        on: {
          click: handleClick
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      // __slot__: {
      //   default: '发送短信'
      // }
    },
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '联级选择器',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "labelPosition",
        value: " ",
        tag: 'el-cascader',
        clearable: true,
        disabled: false,
        slot: {
          options: [{
            id: 1,
            value: 1,
            label: '选项1',
            children: [{
              id: 2,
              value: 2,
              label: '选项1-1'
            }]
          }],
        }
      },
      __regrule__: {
        required: false,
        regList: []
      }
    },
    // 标签位置
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '标签位置',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "labelPosition",
        value: "left",
        tag: 'el-select',
        placeholder: '请选择标签位置',
        clearable: true,
        disabled: false,
        slot: {
          options: [
            { label: '左对齐', value: 'left' },
            { label: '右对齐', value: 'right' },
            { label: '顶部对齐', value: 'top' }
          ]
        },
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      // __slot__: {
      //   options: [
      //     { label: '左对齐', value: 'left' },
      //     { label: '右对齐', value: 'right' },
      //     { label: '顶部对齐', value: 'top' }
      //   ]
      // }
    },
    // 显示标签
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '显示标签',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "form_all_showLabel",
        value: true,
        tag: 'el-switch',
        disabled: false,
        // on: {
        //   change: handleInputFocus,
        // }
      },
      __regrule__: {
        required: false,
        regList: []
      },
    },
    // 标签宽度
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '标签宽度',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "form_all_labelWidth",
        value: 100,
        tag: 'el-slider',
        min: 0,
        max: 200,
        'show-input': true,
        display: 'form_all_showLabel',
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      }
    },
    // 表单尺寸
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单尺寸',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%', "fill": "#409EFF","text-color": "#FFFFFF"},
        key: "formSize",
        value: "small",
        tag: 'el-radio-group',
        disabled: false,
        size:"small",
        slot: {
          tag: 'el-radio', //设置子组件的样式
          // 子组件数据
          options: [
            { label: '中等', value: 'medium', border: true},
            { label: '小型', value: 'small', border: true },
            { label: '迷你', value: 'mini', border: true }
          ]
        },
        // on: {
        //   change: handleInputFocus,
        // }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      // __slot__: {
      //   options: [
      //     { label: '中等', value: 'medium' },
      //     { label: '小型', value: 'small' },
      //     { label: '迷你', value: 'mini' }
      //   ]
      // }
    },
    // 禁用表单
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '禁用表单',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "form_all_disabled",
        value: false,
        tag: 'el-switch',
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 禁用表单提示信息
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '禁用表单提示信息',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "disabled_form_message",
        value: "表单已禁用，请注意！",
        tag: 'el-input',
        type: 'textarea',
        rows: 2,
        placeholder: '请输入禁用表单时显示的提示信息',
        clearable: true,
        disabled: false,
        display: 'form_all_disabled',
        on: {
          focus: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 栅格间隔
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '栅格间隔',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "gutter",
        value: 15,
        tag: 'el-input-number',
        min: 0,
        max: 50,
        step: 2,
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 表单项间距
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单项间距',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "itemSpacing",
        value: 15,
        tag: 'el-slider',
        min: 0,
        max: 40,
        step: 1,
        'show-stops': true,
        'show-input': true,
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 表单项左边距
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单项左边距',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "itemPaddingLeft",
        value: 10,
        tag: 'el-slider',
        min: 0,
        max: 40,
        step: 1,
        'show-stops': true,
        'show-input': true,
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 表单验证
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '表单验证',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        // style: { width: '50%' },
        key: "validate",
        value: false,
        tag: 'el-switch',
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 提交按钮
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '提交按钮',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "showSubmitBtn",
        value: false,
        tag: 'el-switch',
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    },
    // 重置按钮
    {
      __config__: {
        changeTag: true,
        layout: 'colFormItem',
        span: 24,
      },
      __label__: {
        label: '重置按钮',
        labelWidth: 100,
        showLabel: true,
      },
      __element__: {
        style: { width: '100%' },
        key: "showResetBtn",
        value: false,
        tag: 'el-switch',
        disabled: false,
        on: {
          change: handleInputFocus,
        }
      },
      __regrule__: {
        required: false,
        regList: []
      },
      
    }
  ]
}
