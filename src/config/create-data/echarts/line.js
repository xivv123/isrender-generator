export default {
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
        material:{
            icon: 'data-line'
        }
      }