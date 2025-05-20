import { deepClone } from './utils/index'
// 深拷贝对象
import ElInput from './slots/el-input'
// 导入el-collapse处理器
import ElCollapse from './slots/el-collapse'
// 导入el-table处理器
import ElTable from './slots/el-table'
// 导入el-dropdown处理器
import ElDropdown from './slots/el-dropdown'
// 导入JSX解析器
import { parseJSXString } from './jsx-parser'
// 导入工具函数
import { 
  processOptionLabelValue, 
  mountSlotFiles as mountSlots, 
  emitEvents as emitEvts, 
  buildDataObject as buildData, 
  clearAttrs, 
  makeDataObject,
  renderTemplate
} from './render-utils'

// 收集组件插槽处理器
const componentChild = {
  'el-input': ElInput,
  'el-collapse': ElCollapse,
  'el-table': ElTable,
  'el-dropdown': ElDropdown
  // 可以在这里添加更多组件的插槽处理器
}

/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__element__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
// const slotsFiles = require.context('./slots', false, /\.js$/)
// const keys = slotsFiles.keys() || []
// keys.forEach(key => {
//   const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = slotsFiles(key).default
//   componentChild[tag] = value
// })

function vModel(dataObject, defaultValue) {
  // 设置 value 属性
  dataObject.props.value = defaultValue
  // 添加 input 事件处理函数
  dataObject.on.input = val => {
    this.$emit('input', val)
  }
  // dataObject.nativeOn.click = val => {
  //   this.$emit('click', val)
  // }
}

export default {
  props: {
    // 每个表单的配置项
    conf: {
      type: Object,
      required: true
    },
    // 格式化后的表单数据
    formModel: {
      type: Object,
      required: true
    },
    // 格式化后的表单数据
    value: {
      type: Object,
      required: true
    },
    // 父组件vue实例
    parentInstance: {
      type: Object,
      default: () => null
    }
  },
  render(h) {
    const confClone = deepClone(this.conf)
    const valueClone = deepClone(this.value)
    const formModelClone = deepClone(this.formModel)
    
    // 使用renderTemplate函数处理模板渲染
    const templateResult = renderTemplate.call(this, h, confClone, parseJSXString)
    if (templateResult) {
      return templateResult
    }
    
    // 如果没有模板，则按照原来的逻辑渲染
    const dataObject = makeDataObject()
    const children = this.$slots.default || []

    // 检测是否有绑定的关系 - 仅当valueClone中有对应值时才覆盖默认值
    if (confClone.__element__ && confClone.__element__.key && valueClone[confClone.__element__.key] !== undefined) {
      confClone.__element__.value = valueClone[confClone.__element__.key]
    }

    // 如果slots文件夹存在与当前tag同名的文件，则执行文件中的代码
    mountSlots.call(this, h, confClone, children, componentChild)

    // 将字符串类型的事件，发送为消息
    emitEvts.call(this, confClone)

    // 将json表单配置转化为vue render可以识别的 "数据对象（dataObject）"
    buildData.call(this, confClone, dataObject, this.formModel)

    return h(this.conf.__element__.tag, dataObject, children)
  }
}
