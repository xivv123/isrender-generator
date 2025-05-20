export default {
        __config__: {
            changeTag: true,
            layout: 'colFormItem',
            span: 24,
            // 正则校验规则
        },
        // 表单label配置，
        __label__:{
            label: '饼状图',
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
                    text: 'Referer of a Website',
                    subtext: 'Fake Data',
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'item'
                  },
                  legend: {
                    orient: 'vertical',
                    left: 'left'
                  },
                  series: [
                    {
                      name: 'Access From',
                      type: 'pie',
                      radius: '50%',
                      // radius: ['40%', '70%'],  // 内半径40%，外半径70%
                      data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                      ],
                      emphasis: {
                        itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      }
                    }
                  ]
            },
            // 引用自定义指令（需要定义）
            directives: [
                {
                    name: 'echart',
                    value: 'echarts_pie_chart' // 对应实例中的key
                }
            ]
        },
        material:{
            icon: 'pie-chart'
        }
      }