export default {
        __config__: {
            changeTag: true,
            layout: 'colFormItem',
            span: 24,
            // 正则校验规则
        },
        // 表单label配置，
        __label__:{
            label: '散点图',
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
                xAxis: {},
                yAxis: {},
                series: [
                  {
                    symbolSize: 20,
                    data: [
                      [10.0, 8.04],
                      [8.07, 6.95],
                      [13.0, 7.58],
                      [9.05, 8.81],
                      [11.0, 8.33],
                      [14.0, 7.66],
                      [13.4, 6.81],
                      [10.0, 6.33],
                      [14.0, 8.96],
                      [12.5, 6.82],
                      [9.15, 7.2],
                      [11.5, 7.2],
                      [3.03, 4.23],
                      [12.2, 7.83],
                      [2.02, 4.47],
                      [1.05, 3.33],
                      [4.05, 4.96],
                      [6.03, 7.24],
                      [12.0, 6.26],
                      [12.0, 8.84],
                      [7.08, 5.82],
                      [5.02, 5.68]
                    ],
                    type: 'scatter'
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
        material:{
            icon: 'more'
        }
      }