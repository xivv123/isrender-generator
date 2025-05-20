export default {
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
                text: '业务完成率10',
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
                            value: 72,
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
    material:{
        icon: 'odometer'
    }
  }