export default {
  options(h, conf, key) {
    const list = []
    const defaultValues = Array.isArray(conf.__config__.defaultValue) ? conf.__config__.defaultValue : []
    
    conf.__slot__.options.forEach(item => {
      // 检查当前选项是否为默认选中
      const isChecked = defaultValues.includes(item.value)
      
      if (conf.__config__.optionType === 'button') {
        list.push(<el-checkbox-button label={item.value}>{item.label}</el-checkbox-button>)
      } else {
        // 添加自定义类名来标识选中状态
        const itemClass = isChecked 
          ? 'checkbox-item form-designer-checkbox custom-checked' 
          : 'checkbox-item form-designer-checkbox'
        
        // 添加直接的点击处理函数
        const handleItemClick = (e) => {
          // 阻止事件冒泡，确保不会触发外层元素的点击事件
          e.stopPropagation();
          
          // 获取当前项的复选框DOM元素
          const checkbox = e.currentTarget.querySelector('.el-checkbox');
          const checkboxInput = checkbox.querySelector('.el-checkbox__input');
          
          // 切换选中状态
          if (checkbox.classList.contains('custom-checked')) {
            // 当前是选中状态，取消选中
            checkbox.classList.remove('custom-checked');
            e.currentTarget.classList.remove('checked-item');
            
            // 更新模型数据
            if (Array.isArray(conf.__config__.defaultValue)) {
              const index = conf.__config__.defaultValue.indexOf(item.value);
              if (index > -1) {
                conf.__config__.defaultValue.splice(index, 1);
              }
            }
          } else {
            // 当前是未选中状态，设为选中
            checkbox.classList.add('custom-checked');
            e.currentTarget.classList.add('checked-item');
            
            // 更新模型数据
            if (!Array.isArray(conf.__config__.defaultValue)) {
              conf.__config__.defaultValue = [];
            }
            if (!conf.__config__.defaultValue.includes(item.value)) {
              conf.__config__.defaultValue.push(item.value);
            }
          }
          
          // 手动触发原生复选框的点击事件
          if (checkboxInput) {
            const inputEl = checkboxInput.querySelector('input[type="checkbox"]');
            if (inputEl) {
              inputEl.click();
            }
          }
        };
          
        list.push(
          <div 
            class={isChecked ? 'checkbox-wrapper checked-item' : 'checkbox-wrapper'}
            onClick={handleItemClick}
          >
            <el-checkbox 
              label={item.value} 
              border={conf.border}
              disabled={item.disabled}
              class={itemClass}
            >
              {item.label}
            </el-checkbox>
          </div>
        )
      }
    })
    return list
  }
}
