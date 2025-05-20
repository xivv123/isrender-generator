// 导入输入型组件
import inputConfig from './input/input'
import textareaConfig from './input/textarea'
import passwordConfig from './input/password'
import numberConfig from './input/number'
// import tinymceConfig from './input/tinymce'
import searchConfig from './input/search'
import numberInputConfig from './input/number-input'

// 导入选择型组件
import selectConfig from './select/select'
import cascaderConfig from './select/cascader'
import radioConfig from './select/radio'
import checkboxConfig from './select/checkbox'
import switchConfig from './select/switch'
import sliderConfig from './select/slider'
import datePickerConfig from './select/datePicker'
import timePickerConfig from './select/timePicker1'
import rateConfig from './select/rate'
import descriptionsConfig from './select/descriptions'
import tagConfig from './select/tag'
import collapse from './select/collapse'

// 导入布局型组件
import rowConfig from './layout/row'
import buttonConfig from './layout/button'
import tableConfig from './layout/table'
import collapseConfig from './layout/collapse'
import collapseItemConfig from './layout/collapse-item'
import dropdownConfig from './layout/dropdown'

// 图表组件
import lineConfig from './echarts/line'
import gaugeConfig from './echarts/gauge'
import scatterConfig from './echarts/scatter'
import pieConfig from './echarts/pie'

// 输入型组件 【左面板】
export const inputComponents = [
  inputConfig,
  textareaConfig,
  passwordConfig,
  numberConfig,
  searchConfig,
  numberInputConfig,
  lineConfig,
  gaugeConfig,
  scatterConfig,
  pieConfig
  // tinymceConfig
]

// 选择型组件 【左面板】
export const selectComponents = [
  selectConfig,
  timePickerConfig,
  descriptionsConfig,
  tagConfig,
  rateConfig,
  datePickerConfig,
  cascaderConfig,
  radioConfig,
  checkboxConfig,
  switchConfig,
  sliderConfig,
  // collapse
]

// 布局型组件 【左面板】
export const layoutComponents = [
  rowConfig,
  buttonConfig,
  tableConfig,
  collapseConfig,
  collapseItemConfig,
  dropdownConfig
]
