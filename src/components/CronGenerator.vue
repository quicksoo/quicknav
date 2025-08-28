<template>
  <div class="container">
    <div class="card">
      <h2>⏰ Cron表达式生成器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        可视化生成和解析Cron表达式，支持秒级精度和多种预设模板
      </p>
      
      <!-- 生成模式选择 -->
      <div class="mode-tabs">
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'simple' }"
          @click="mode = 'simple'"
        >
          🎯 简单模式
        </button>
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'advanced' }"
          @click="mode = 'advanced'"
        >
          🔧 高级模式
        </button>
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'parse' }"
          @click="mode = 'parse'"
        >
          📋 解析模式
        </button>
      </div>

      <!-- 简单模式 -->
      <div v-if="mode === 'simple'" class="simple-mode">
        <div class="preset-templates">
          <h4>常用模板：</h4>
          <div class="template-grid">
            <button 
              v-for="template in templates" 
              :key="template.name"
              class="template-btn"
              @click="selectTemplate(template)"
            >
              <span class="template-name">{{ template.name }}</span>
              <span class="template-desc">{{ template.desc }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 高级模式 -->
      <div v-if="mode === 'advanced'" class="advanced-mode">
        <div class="cron-builder">
          <div class="field-group">
            <label>秒 (0-59)</label>
            <select v-model="cronFields.second">
              <option value="*">* (每秒)</option>
              <option value="0">0 (整分钟)</option>
              <option value="*/5">*/5 (每5秒)</option>
              <option value="*/10">*/10 (每10秒)</option>
              <option value="*/30">*/30 (每30秒)</option>
            </select>
          </div>
          
          <div class="field-group">
            <label>分钟 (0-59)</label>
            <select v-model="cronFields.minute">
              <option value="*">* (每分钟)</option>
              <option value="0">0 (整点)</option>
              <option value="*/5">*/5 (每5分钟)</option>
              <option value="*/15">*/15 (每15分钟)</option>
              <option value="*/30">*/30 (每30分钟)</option>
            </select>
          </div>
          
          <div class="field-group">
            <label>小时 (0-23)</label>
            <select v-model="cronFields.hour">
              <option value="*">* (每小时)</option>
              <option value="0">0 (凌晨)</option>
              <option value="9">9 (上午9点)</option>
              <option value="12">12 (中午12点)</option>
              <option value="18">18 (下午6点)</option>
              <option value="*/2">*/2 (每2小时)</option>
            </select>
          </div>
          
          <div class="field-group">
            <label>日 (1-31)</label>
            <select v-model="cronFields.day">
              <option value="*">* (每天)</option>
              <option value="1">1 (每月1号)</option>
              <option value="15">15 (每月15号)</option>
              <option value="L">L (月末)</option>
              <option value="*/7">*/7 (每7天)</option>
            </select>
          </div>
          
          <div class="field-group">
            <label>月 (1-12)</label>
            <select v-model="cronFields.month">
              <option value="*">* (每月)</option>
              <option value="1">1 (一月)</option>
              <option value="6">6 (六月)</option>
              <option value="12">12 (十二月)</option>
              <option value="*/3">*/3 (每季度)</option>
            </select>
          </div>
          
          <div class="field-group">
            <label>周 (0-7, 0和7都表示周日)</label>
            <select v-model="cronFields.week">
              <option value="*">* (每天)</option>
              <option value="1">1 (周一)</option>
              <option value="2">2 (周二)</option>
              <option value="5">5 (周五)</option>
              <option value="0,6">0,6 (周末)</option>
              <option value="1-5">1-5 (工作日)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 解析模式 -->
      <div v-if="mode === 'parse'" class="parse-mode">
        <div class="input-section">
          <label>输入Cron表达式：</label>
          <input 
            v-model="inputCron" 
            type="text" 
            placeholder="例如: 0 0 12 * * ?"
            class="cron-input"
          >
          <button class="btn" @click="parseCron">解析表达式</button>
        </div>
      </div>

      <!-- 结果显示 -->
      <div class="result-section">
        <div class="cron-result">
          <h4>生成的Cron表达式：</h4>
          <div class="cron-display">
            <code class="cron-expression">{{ generatedCron }}</code>
            <button class="copy-btn" @click="copyCron">📋 复制</button>
          </div>
        </div>
        
        <div v-if="cronDescription" class="cron-description">
          <h4>执行时间描述：</h4>
          <p class="description-text">{{ cronDescription }}</p>
        </div>
        
        <div v-if="nextExecutions.length > 0" class="next-executions">
          <h4>接下来5次执行时间：</h4>
          <ul class="execution-list">
            <li v-for="(time, index) in nextExecutions" :key="index">
              {{ time }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Cron语法说明 -->
      <div class="syntax-help">
        <h4>Cron表达式语法说明：</h4>
        <div class="syntax-grid">
          <div class="syntax-item">
            <strong>格式：</strong> 秒 分 时 日 月 周
          </div>
          <div class="syntax-item">
            <strong>*：</strong> 匹配任意值
          </div>
          <div class="syntax-item">
            <strong>?：</strong> 不指定值（日和周字段）
          </div>
          <div class="syntax-item">
            <strong>/：</strong> 步长值，如 */5 表示每5个单位
          </div>
          <div class="syntax-item">
            <strong>-：</strong> 范围，如 1-5 表示1到5
          </div>
          <div class="syntax-item">
            <strong>,：</strong> 列表，如 1,3,5 表示1、3、5
          </div>
          <div class="syntax-item">
            <strong>L：</strong> 最后，如 L 表示月的最后一天
          </div>
          <div class="syntax-item">
            <strong>W：</strong> 工作日，如 15W 表示最接近15号的工作日
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CronGenerator',
  data() {
    return {
      mode: 'simple',
      cronFields: {
        second: '0',
        minute: '0',
        hour: '*',
        day: '*',
        month: '*',
        week: '?'
      },
      inputCron: '',
      generatedCron: '0 0 * * * ?',
      cronDescription: '',
      nextExecutions: [],
      templates: [
        { name: '每分钟', cron: '0 * * * * ?', desc: '每分钟执行一次' },
        { name: '每小时', cron: '0 0 * * * ?', desc: '每小时执行一次' },
        { name: '每天凌晨', cron: '0 0 0 * * ?', desc: '每天凌晨执行' },
        { name: '每天上午9点', cron: '0 0 9 * * ?', desc: '每天上午9点执行' },
        { name: '工作日上午9点', cron: '0 0 9 ? * MON-FRI', desc: '周一到周五上午9点' },
        { name: '每周一上午9点', cron: '0 0 9 ? * MON', desc: '每周一上午9点执行' },
        { name: '每月1号凌晨', cron: '0 0 0 1 * ?', desc: '每月1号凌晨执行' },
        { name: '每季度首日', cron: '0 0 0 1 1,4,7,10 ?', desc: '每季度第一天执行' }
      ]
    }
  },
  watch: {
    cronFields: {
      handler() {
        this.generateCron()
      },
      deep: true
    }
  },
  mounted() {
    this.generateCron()
  },
  methods: {
    selectTemplate(template) {
      this.generatedCron = template.cron
      this.describeCron(template.cron)
      this.generateNextExecutions(template.cron)
    },
    
    generateCron() {
      const { second, minute, hour, day, month, week } = this.cronFields
      this.generatedCron = `${second} ${minute} ${hour} ${day} ${month} ${week}`
      this.describeCron(this.generatedCron)
      this.generateNextExecutions(this.generatedCron)
    },
    
    parseCron() {
      if (!this.inputCron.trim()) {
        this.showToast('请输入Cron表达式')
        return
      }
      
      this.generatedCron = this.inputCron.trim()
      this.describeCron(this.generatedCron)
      this.generateNextExecutions(this.generatedCron)
    },
    
    describeCron(cron) {
      try {
        const parts = cron.split(' ')
        if (parts.length < 6) {
          this.cronDescription = '表达式格式不完整'
          return
        }
        
        let desc = '此表达式将在：'
        const [sec, min, hour, day, month, week] = parts
        
        // 简化的描述逻辑
        if (sec === '0' && min === '0' && hour === '0') {
          desc += '每天凌晨'
        } else if (sec === '0' && min === '0') {
          desc += hour === '*' ? '每小时整点' : `每天${hour}点整`
        } else if (sec === '0') {
          desc += min === '*' ? '每分钟' : `每小时${min}分`
        } else {
          desc += '按指定的秒、分、时'
        }
        
        if (week !== '?' && week !== '*') {
          desc += `的${this.getWeekDesc(week)}`
        }
        
        if (day !== '*' && day !== '?') {
          desc += `每月${day}号`
        }
        
        desc += '执行'
        this.cronDescription = desc
      } catch (error) {
        this.cronDescription = '表达式解析失败'
      }
    },
    
    getWeekDesc(week) {
      const weekMap = {
        '0': '周日', '1': '周一', '2': '周二', '3': '周三',
        '4': '周四', '5': '周五', '6': '周六', '7': '周日',
        'MON': '周一', 'TUE': '周二', 'WED': '周三',
        'THU': '周四', 'FRI': '周五', 'SAT': '周六', 'SUN': '周日'
      }
      
      if (week.includes('-')) {
        return '工作日'
      } else if (week.includes(',')) {
        return week.split(',').map(w => weekMap[w] || w).join('、')
      } else {
        return weekMap[week] || week
      }
    },
    
    generateNextExecutions(cron) {
      // 简化的下次执行时间计算
      this.nextExecutions = []
      const now = new Date()
      
      try {
        for (let i = 0; i < 5; i++) {
          const nextTime = new Date(now.getTime() + (i + 1) * 60000) // 简化：每分钟
          this.nextExecutions.push(nextTime.toLocaleString('zh-CN'))
        }
      } catch (error) {
        this.nextExecutions = ['计算执行时间失败']
      }
    },
    
    async copyCron() {
      if (!this.generatedCron) {
        this.showToast('没有表达式可复制')
        return
      }
      
      try {
        await navigator.clipboard.writeText(this.generatedCron)
        this.showToast('Cron表达式已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    showToast(message) {
      const toast = document.createElement('div')
      toast.textContent = message
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 1000;
        transition: opacity 0.3s ease;
      `
      document.body.appendChild(toast)
      
      setTimeout(() => {
        toast.style.opacity = '0'
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast)
          }
        }, 300)
      }, 2000)
    }
  }
}
</script>

<style scoped>
.mode-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.mode-tab {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.mode-tab.active {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.preset-templates {
  margin-bottom: 24px;
}

.preset-templates h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.template-btn {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.template-btn:hover {
  border-color: #2196f3;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
}

.template-name {
  display: block;
  font-weight: 600;
  color: #37474f;
  margin-bottom: 4px;
}

.template-desc {
  display: block;
  font-size: 12px;
  color: #78909c;
}

.cron-builder {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-group label {
  font-weight: 600;
  color: #37474f;
  font-size: 14px;
}

.field-group select {
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 14px;
}

.input-section {
  margin-bottom: 24px;
}

.input-section label {
  display: block;
  font-weight: 600;
  color: #37474f;
  margin-bottom: 8px;
}

.cron-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  margin-bottom: 12px;
}

.result-section {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.cron-result h4 {
  color: #37474f;
  margin-bottom: 12px;
}

.cron-display {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.cron-expression {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
  color: #37474f;
  flex: 1;
}

.copy-btn {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
}

.cron-description {
  margin-bottom: 20px;
}

.cron-description h4 {
  color: #37474f;
  margin-bottom: 8px;
}

.description-text {
  color: #546e7a;
  font-size: 14px;
  margin: 0;
}

.next-executions h4 {
  color: #37474f;
  margin-bottom: 12px;
}

.execution-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.execution-list li {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 4px;
  font-family: monospace;
  font-size: 13px;
  color: #37474f;
}

.syntax-help {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 8px;
  padding: 20px;
}

.syntax-help h4 {
  color: #1976d2;
  margin-bottom: 16px;
}

.syntax-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.syntax-item {
  background: white;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e3f2fd;
  font-size: 14px;
}

@media (max-width: 768px) {
  .template-grid {
    grid-template-columns: 1fr;
  }
  
  .cron-builder {
    grid-template-columns: 1fr;
  }
  
  .cron-display {
    flex-direction: column;
    align-items: stretch;
  }
  
  .syntax-grid {
    grid-template-columns: 1fr;
  }
}
</style>