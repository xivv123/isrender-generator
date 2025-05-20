<template>
  <div class="event-config-content">
    <!-- 事件配置 -->
    <template v-if="isSupportsEvents">
      <el-divider>配置事件</el-divider>
      <draggable
        :list="eventList"
        :animation="340"
        group="eventItem"
        handle=".event-drag"
        @change="handleEventsChange"
      >
        <div v-for="(item, index) in eventList" :key="index" class="event-item">
          <div class="event-line-icon event-drag">
            <i class="el-icon-s-operation" />
          </div>
          
          <div class="event-content">
            <div class="event-header">
              <span class="event-name">{{item.name}}</span>
              <div class="close-btn event-line-icon" @click="removeEvent(index)">
                <i class="el-icon-remove-outline" />
              </div>
            </div>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="输入事件处理代码"
              v-model="item.handler"
              @input="handleEventsChange"
            />
          </div>
        </div>
      </draggable>
      
      <!-- 添加事件区域 -->
      <div class="add-event-section">
        <div class="add-event-form">
          <el-select 
            v-model="selectedEvent" 
            placeholder="选择要添加的事件" 
            size="small"
            class="event-select"
          >
            <el-option
              v-for="event in availableEvents"
              :key="event.value"
              :label="event.label"
              :value="event.value"
              :disabled="isEventAdded(event.value)"
            />
          </el-select>
          
          <el-button
            icon="el-icon-circle-plus-outline"
            type="primary"
            size="small"
            :disabled="!selectedEvent || isEventAdded(selectedEvent)"
            @click="addEvent"
          >
            添加事件
          </el-button>
        </div>
        
        <div class="event-description" v-if="selectedEvent && getSelectedEventDescription()">
          <el-alert
            :title="getSelectedEventDescription()"
            type="info"
            :closable="false"
            show-icon
          />
        </div>
      </div>
      
      <el-divider />
    </template>
    
    <!-- 不支持事件的组件 -->
    <template v-else>
      <div class="no-config">
        <el-alert
          title="当前组件不支持事件配置或没有识别到可配置项"
          type="info"
          :closable="false"
          show-icon
        />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'EventConfigDialog',
  components: {
    draggable: () => import('vuedraggable')
  },
  props: {
    componentData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      eventList: [],
      selectedEvent: '',
      // 可配置的事件列表，按组件类型分组
      allEventOptions: {
        // 通用事件
        common: [
          { value: 'click', label: '点击事件(click)', description: '元素被点击时触发' },
          { value: 'focus', label: '获得焦点(focus)', description: '元素获得焦点时触发' },
          { value: 'blur', label: '失去焦点(blur)', description: '元素失去焦点时触发' },
          { value: 'change', label: '值变化(change)', description: '元素值变化时触发' }
        ],
        // 输入框特有事件
        'el-input': [
          { value: 'input', label: '输入(input)', description: '输入值时实时触发' },
          { value: 'clear', label: '清空(clear)', description: '点击清空按钮时触发' }
        ],
        // 选择框特有事件
        'el-select': [
          { value: 'visible-change', label: '下拉框显示变化(visible-change)', description: '下拉框出现/隐藏时触发' },
          { value: 'remove-tag', label: '移除标签(remove-tag)', description: '多选模式下移除tag时触发' }
        ],
        // 单选框组特有事件
        'el-radio-group': [
          { value: 'change', label: '选择变化(change)', description: '绑定值变化时触发' }
        ],
        // 复选框组特有事件
        'el-checkbox-group': [
          { value: 'change', label: '选择变化(change)', description: '绑定值变化时触发' }
        ],
        // 日期选择器特有事件
        'el-date-picker': [
          { value: 'change', label: '日期变化(change)', description: '用户确认选定的值时触发' },
          { value: 'blur', label: '日期失焦(blur)', description: '当 input 失去焦点时触发' },
          { value: 'focus', label: '日期获焦(focus)', description: '当 input 获得焦点时触发' }
        ],
        // 上传组件特有事件
        'el-upload': [
          { value: 'success', label: '上传成功(success)', description: '文件上传成功时触发' },
          { value: 'error', label: '上传失败(error)', description: '文件上传失败时触发' },
          { value: 'progress', label: '上传进度(progress)', description: '文件上传时的钩子' },
          { value: 'change', label: '文件列表变化(change)', description: '文件列表变化时触发' },
          { value: 'remove', label: '文件移除(remove)', description: '文件列表移除文件时触发' }
        ],
        // 按钮特有事件
        'el-button': [
          { value: 'click', label: '点击(click)', description: '按钮被点击时触发' }
        ]
      }
    };
  },
  computed: {
    isSupportsEvents() {
      // 检查组件是否支持事件配置
      const tag = this.componentData?.__element__?.tag || '';
      // 所有Element UI组件都支持事件
      return tag.startsWith('el-');
    },
    activeData() {
      return this.componentData;
    },
    // 根据当前组件类型获取可用的事件选项
    availableEvents() {
      const tag = this.componentData?.__element__?.tag || '';
      let events = [...this.allEventOptions.common];
      
      // 如果有特定组件的事件，添加到选项中
      if (this.allEventOptions[tag]) {
        // 过滤掉已存在于通用事件中的事件
        const specificEvents = this.allEventOptions[tag].filter(e => 
          !events.some(commonEvent => commonEvent.value === e.value)
        );
        events = [...events, ...specificEvents];
      }
      
      return events;
    }
  },
  watch: {
    componentData: {
      handler(val) {
        this.initializeData();
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.initializeData();
  },
  methods: {
    // 初始化数据
    initializeData() {
      try {
        // 确保组件有必要的属性结构
        if (!this.activeData.__element__) {
          this.$set(this.activeData, '__element__', {});
        }
        if (!this.activeData.__element__.on) {
          this.$set(this.activeData.__element__, 'on', {});
        }
        
        // 确保renderdata中也有on配置
        if (!this.activeData.renderdata) {
          this.$set(this.activeData, 'renderdata', {});
        }
        if (!this.activeData.renderdata.on) {
          this.$set(this.activeData.renderdata, 'on', {});
        }
        
        // 如果renderdata.on中有数据，但是__element__.on没有，
        // 则将renderdata.on中的数据复制到__element__.on
        const renderdataOnKeys = Object.keys(this.activeData.renderdata.on || {});
        const elementOnKeys = Object.keys(this.activeData.__element__.on || {});
        
        if (renderdataOnKeys.length > 0 && elementOnKeys.length === 0) {
          // 将renderdata.on复制到__element__.on
          renderdataOnKeys.forEach(key => {
            this.$set(this.activeData.__element__.on, key, this.activeData.renderdata.on[key]);
          });
        }
        
        // 将现有事件转换为列表形式
        const on = this.activeData.__element__.on;
        this.eventList = Object.keys(on).map(eventName => ({
          name: eventName,
          handler: on[eventName]
        }));
      } catch (error) {
        console.error('初始化事件配置数据失败:', error);
        this.$message.error('初始化数据失败');
      }
    },
    
    // 添加事件
    addEvent() {
      if (!this.selectedEvent) {
        this.$message.warning('请先选择要添加的事件');
        return;
      }
      
      if (this.isEventAdded(this.selectedEvent)) {
        this.$message.warning('该事件已添加');
        return;
      }
      
      // 创建事件对象
      const newEvent = {
        name: this.selectedEvent,
        handler: `function(${this.getEventParams(this.selectedEvent)}) {\n  // 在此处理${this.selectedEvent}事件\n  console.log('${this.selectedEvent}事件被触发', ${this.getEventParams(this.selectedEvent)});\n}`
      };
      
      // 添加到事件列表
      this.eventList.push(newEvent);
      
      // 更新到组件数据
      this.updateComponentEvents();
      
      // 清空选择
      this.selectedEvent = '';
      
      // 提示添加成功
      this.$message.success('事件添加成功');
    },
    
    // 移除事件
    removeEvent(index) {
      this.$confirm('确认删除该事件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.eventList.splice(index, 1);
        this.updateComponentEvents();
        this.$message.success('删除成功');
      }).catch(() => {
        // 取消删除
      });
    },
    
    // 检查事件是否已添加
    isEventAdded(eventName) {
      return this.eventList.some(event => event.name === eventName);
    },
    
    // 获取事件描述
    getSelectedEventDescription() {
      if (!this.selectedEvent) return '';
      
      // 在所有事件中查找
      for (const category in this.allEventOptions) {
        const found = this.allEventOptions[category].find(e => e.value === this.selectedEvent);
        if (found) return found.description;
      }
      
      return '';
    },
    
    // 根据事件类型获取参数
    getEventParams(eventType) {
      switch (eventType) {
        case 'click':
          return 'event';
        case 'change':
          return 'value, oldValue';
        case 'input':
          return 'value';
        case 'blur':
        case 'focus':
          return 'event';
        case 'success':
          return 'response, file, fileList';
        case 'error':
          return 'error, file, fileList';
        case 'remove':
        case 'remove-tag':
          return 'value';
        case 'visible-change':
          return 'visible';
        case 'progress':
          return 'event, file, fileList';
        default:
          return 'event';
      }
    },
    
    // 处理事件变化
    handleEventsChange() {
      this.updateComponentEvents();
    },
    
    // 更新组件事件
    updateComponentEvents() {
      // 确保__element__.on存在
      if (!this.activeData.__element__.on) {
        this.$set(this.activeData.__element__, 'on', {});
      }
      
      // 清空现有事件
      const on = this.activeData.__element__.on;
      Object.keys(on).forEach(key => {
        this.$delete(on, key);
      });
      
      // 添加更新后的事件
      this.eventList.forEach(event => {
        this.$set(on, event.name, event.handler);
      });
      
      // 确保renderdata中也有on配置
      if (!this.activeData.renderdata) {
        this.$set(this.activeData, 'renderdata', {});
      }
      if (!this.activeData.renderdata.on) {
        this.$set(this.activeData.renderdata, 'on', {});
      }
      
      // 清空renderdata中的事件
      const renderdataOn = this.activeData.renderdata.on;
      Object.keys(renderdataOn).forEach(key => {
        this.$delete(renderdataOn, key);
      });
      
      // 将__element__.on同步到renderdata.on
      this.eventList.forEach(event => {
        this.$set(renderdataOn, event.name, event.handler);
      });
      
      // 通知父组件事件已更新
      const updatedComponentData = JSON.parse(JSON.stringify(this.activeData));
      this.$emit('events-change', updatedComponentData);
    }
  }
}
</script>

<style lang="scss" scoped>
.event-config-content {
  padding: 10px 0;
  
  .event-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    
    .event-drag {
      cursor: move;
      padding: 0 5px;
      margin-top: 8px;
    }
    
    .event-content {
      flex: 1;
      
      .event-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .event-name {
          font-weight: bold;
          color: #409EFF;
        }
      }
    }
    
    .event-line-icon {
      font-size: 16px;
      color: #909399;
      margin: 0 5px;
      
      i {
        display: inline-block;
        vertical-align: middle;
      }
    }
    
    .close-btn {
      cursor: pointer;
      
      &:hover {
        color: #F56C6C;
      }
    }
  }
  
  .add-event-section {
    margin: 15px 0;
    
    .add-event-form {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      
      .event-select {
        flex: 1;
        margin-right: 10px;
      }
    }
    
    .event-description {
      margin-top: 10px;
    }
  }
  
  .no-config {
    margin: 20px 0;
  }
}
</style> 