<template>
  <div class="container">
    <div class="card">
      <h2>⏰ 时间戳转换工具</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        Unix时间戳与日期时间互相转换，支持多种时间格式
      </p>
      
      <div class="current-time-section">
        <div class="current-time">
          <h4>当前时间</h4>
          <div class="time-display">
            <div class="time-item">
              <label>当前日期时间：</label>
              <span class="time-value">{{ currentDateTime }}</span>
            </div>
            <div class="time-item">
              <label>当前时间戳（秒）：</label>
              <span class="time-value timestamp">{{ currentTimestamp }}</span>
              <button class="copy-btn" @click="copyValue(currentTimestamp)" title="复制">📋</button>
            </div>
            <div class="time-item">
              <label>当前时间戳（毫秒）：</label>
              <span class="time-value timestamp">{{ currentTimestampMs }}</span>
              <button class="copy-btn" @click="copyValue(currentTimestampMs)" title="复制">📋</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="conversion-section">
        <div class="converter-panel">
          <h4>时间戳转日期</h4>
          <div class="input-group">
            <label>输入时间戳：</label>
            <div class="timestamp-input">
              <input 
                v-model="inputTimestamp" 
                @input="convertTimestampToDate"
                placeholder="请输入时间戳..."
                type="number"
                class="timestamp-field"
              >
              <select v-model="timestampUnit" @change="convertTimestampToDate" class="unit-select">
                <option value="seconds">秒</option>
                <option value="milliseconds">毫秒</option>
              </select>
            </div>
          </div>
          
          <div v-if="convertedDate" class="result-section">
            <h5>转换结果：</h5>
            <div class="result-list">
              <div class="result-item">
                <label>标准格式：</label>
                <span>{{ convertedDate.standard }}</span>
                <button class="copy-btn" @click="copyValue(convertedDate.standard)">📋</button>
              </div>
              <div class="result-item">
                <label>ISO 8601：</label>
                <span>{{ convertedDate.iso }}</span>
                <button class="copy-btn" @click="copyValue(convertedDate.iso)">📋</button>
              </div>
              <div class="result-item">
                <label>中文格式：</label>
                <span>{{ convertedDate.chinese }}</span>
                <button class="copy-btn" @click="copyValue(convertedDate.chinese)">📋</button>
              </div>
              <div class="result-item">
                <label>UTC 时间：</label>
                <span>{{ convertedDate.utc }}</span>
                <button class="copy-btn" @click="copyValue(convertedDate.utc)">📋</button>
              </div>
              <div class="result-item">
                <label>相对时间：</label>
                <span>{{ convertedDate.relative }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="converter-panel">
          <h4>日期转时间戳</h4>
          <div class="input-group">
            <label>选择日期时间：</label>
            <input 
              v-model="inputDateTime" 
              @input="convertDateToTimestamp"
              type="datetime-local"
              class="datetime-field"
            >
          </div>
          
          <div class="quick-buttons">
            <button class="btn" @click="setCurrentTime">当前时间</button>
            <button class="btn" @click="setTomorrow">明天此刻</button>
            <button class="btn" @click="setNextWeek">下周此刻</button>
          </div>
          
          <div v-if="convertedTimestamp" class="result-section">
            <h5>转换结果：</h5>
            <div class="result-list">
              <div class="result-item">
                <label>时间戳（秒）：</label>
                <span class="timestamp">{{ convertedTimestamp.seconds }}</span>
                <button class="copy-btn" @click="copyValue(convertedTimestamp.seconds)">📋</button>
              </div>
              <div class="result-item">
                <label>时间戳（毫秒）：</label>
                <span class="timestamp">{{ convertedTimestamp.milliseconds }}</span>
                <button class="copy-btn" @click="copyValue(convertedTimestamp.milliseconds)">📋</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="batch-section">
        <h4>批量转换：</h4>
        <div class="batch-input">
          <label>批量时间戳（每行一个）：</label>
          <textarea 
            v-model="batchTimestamps" 
            placeholder="请输入多个时间戳，每行一个..."
            rows="4"
          ></textarea>
          <button class="btn" @click="batchConvert">批量转换</button>
        </div>
        
        <div v-if="batchResults.length > 0" class="batch-results">
          <h5>批量转换结果：</h5>
          <div class="batch-list">
            <div v-for="(result, index) in batchResults" :key="index" class="batch-item">
              <div class="batch-timestamp">{{ result.timestamp }}</div>
              <div class="batch-arrow">→</div>
              <div class="batch-date">{{ result.date }}</div>
              <button class="copy-btn" @click="copyValue(result.date)">📋</button>
            </div>
          </div>
          <button class="btn" @click="exportBatchResults">导出结果</button>
        </div>
      </div>
      
      <div class="timezone-section">
        <h4>时区转换：</h4>
        <div class="timezone-converter">
          <div class="timezone-input">
            <label>基准时间：</label>
            <input 
              v-model="timezoneBaseTime" 
              type="datetime-local"
              @input="convertTimezones"
            >
          </div>
          <div class="timezone-results">
            <div v-for="tz in timezones" :key="tz.name" class="timezone-item">
              <label>{{ tz.name }}：</label>
              <span>{{ tz.time }}</span>
              <button class="copy-btn" @click="copyValue(tz.time)">📋</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <h4>时间戳说明：</h4>
        <div class="info-content">
          <p><strong>Unix时间戳</strong>是从1970年1月1日00:00:00 UTC起至现在的总秒数。</p>
          
          <h5>常用时间格式：</h5>
          <ul>
            <li><strong>秒级时间戳：</strong>10位数字，如 1609459200</li>
            <li><strong>毫秒级时间戳：</strong>13位数字，如 1609459200000</li>
            <li><strong>ISO 8601：</strong>国际标准时间格式，如 2021-01-01T00:00:00.000Z</li>
            <li><strong>RFC 2822：</strong>邮件时间格式，如 Fri, 01 Jan 2021 00:00:00 GMT</li>
          </ul>
          
          <h5>应用场景：</h5>
          <ul>
            <li>数据库时间存储</li>
            <li>API接口时间传递</li>
            <li>日志时间记录</li>
            <li>缓存过期时间设置</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimestampConverter',
  data() {
    return {
      currentDateTime: '',
      currentTimestamp: 0,
      currentTimestampMs: 0,
      inputTimestamp: '',
      timestampUnit: 'seconds',
      convertedDate: null,
      inputDateTime: '',
      convertedTimestamp: null,
      batchTimestamps: '',
      batchResults: [],
      timezoneBaseTime: '',
      timezones: [
        { name: 'UTC (世界协调时)', time: '', offset: 0 },
        { name: 'Beijing (北京时间)', time: '', offset: 8 },
        { name: 'Tokyo (东京时间)', time: '', offset: 9 },
        { name: 'New York (纽约时间)', time: '', offset: -5 },
        { name: 'London (伦敦时间)', time: '', offset: 0 },
        { name: 'Paris (巴黎时间)', time: '', offset: 1 }
      ],
      timer: null
    }
  },
  methods: {
    updateCurrentTime() {
      const now = new Date()
      this.currentDateTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      this.currentTimestamp = Math.floor(now.getTime() / 1000)
      this.currentTimestampMs = now.getTime()
    },
    
    convertTimestampToDate() {
      if (!this.inputTimestamp) {
        this.convertedDate = null
        return
      }
      
      try {
        let timestamp = parseInt(this.inputTimestamp)
        if (this.timestampUnit === 'seconds') {
          timestamp *= 1000
        }
        
        const date = new Date(timestamp)
        
        if (isNaN(date.getTime())) {
          this.convertedDate = null
          return
        }
        
        this.convertedDate = {
          standard: date.toLocaleString('zh-CN'),
          iso: date.toISOString(),
          chinese: date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            weekday: 'long'
          }),
          utc: date.toUTCString(),
          relative: this.getRelativeTime(date)
        }
      } catch (error) {
        this.convertedDate = null
      }
    },
    
    convertDateToTimestamp() {
      if (!this.inputDateTime) {
        this.convertedTimestamp = null
        return
      }
      
      try {
        const date = new Date(this.inputDateTime)
        const timestamp = date.getTime()
        
        this.convertedTimestamp = {
          seconds: Math.floor(timestamp / 1000),
          milliseconds: timestamp
        }
      } catch (error) {
        this.convertedTimestamp = null
      }
    },
    
    convertTimezones() {
      if (!this.timezoneBaseTime) return
      
      try {
        const baseDate = new Date(this.timezoneBaseTime)
        
        this.timezones.forEach(tz => {
          const offsetDate = new Date(baseDate.getTime() + (tz.offset * 60 * 60 * 1000))
          tz.time = offsetDate.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        })
      } catch (error) {
        console.error('时区转换失败:', error)
      }
    },
    
    getRelativeTime(date) {
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const seconds = Math.floor(Math.abs(diff) / 1000)
      
      if (seconds < 60) {
        return diff > 0 ? `${seconds}秒前` : `${seconds}秒后`
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60)
        return diff > 0 ? `${minutes}分钟前` : `${minutes}分钟后`
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600)
        return diff > 0 ? `${hours}小时前` : `${hours}小时后`
      } else {
        const days = Math.floor(seconds / 86400)
        return diff > 0 ? `${days}天前` : `${days}天后`
      }
    },
    
    setCurrentTime() {
      const now = new Date()
      this.inputDateTime = now.toISOString().slice(0, 16)
      this.convertDateToTimestamp()
    },
    
    setTomorrow() {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      this.inputDateTime = tomorrow.toISOString().slice(0, 16)
      this.convertDateToTimestamp()
    },
    
    setNextWeek() {
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      this.inputDateTime = nextWeek.toISOString().slice(0, 16)
      this.convertDateToTimestamp()
    },
    
    batchConvert() {
      if (!this.batchTimestamps.trim()) return
      
      const timestamps = this.batchTimestamps
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !isNaN(line))
      
      this.batchResults = timestamps.map(ts => {
        try {
          let timestamp = parseInt(ts)
          if (ts.length === 10) {
            timestamp *= 1000
          }
          const date = new Date(timestamp)
          return {
            timestamp: ts,
            date: date.toLocaleString('zh-CN')
          }
        } catch (error) {
          return {
            timestamp: ts,
            date: '转换失败'
          }
        }
      })
    },
    
    exportBatchResults() {
      const content = this.batchResults
        .map(result => `${result.timestamp}\t${result.date}`)
        .join('\n')
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'timestamp_batch_results.txt'
      a.click()
      URL.revokeObjectURL(url)
    },
    
    async copyValue(value) {
      try {
        await navigator.clipboard.writeText(value.toString())
        this.showToast('复制成功！')
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
  },
  
  mounted() {
    this.updateCurrentTime()
    this.timer = setInterval(this.updateCurrentTime, 1000)
    
    // 设置默认的基准时间
    const now = new Date()
    this.timezoneBaseTime = now.toISOString().slice(0, 16)
    this.convertTimezones()
  },
  
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>
.current-time-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.current-time h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.time-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.time-item label {
  color: #37474f;
  font-weight: 500;
  min-width: 120px;
}

.time-value {
  color: #1976d2;
  font-family: monospace;
  font-weight: 600;
}

.time-value.timestamp {
  background: #e3f2fd;
  padding: 4px 8px;
  border-radius: 4px;
}

.conversion-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.converter-panel {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
}

.converter-panel h4 {
  color: #37474f;
  margin-bottom: 16px;
  text-align: center;
}

.timestamp-input {
  display: flex;
  gap: 8px;
}

.timestamp-field {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: monospace;
}

.unit-select {
  padding: 10px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  background: white;
}

.datetime-field {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: monospace;
}

.quick-buttons {
  display: flex;
  gap: 8px;
  margin: 16px 0;
  flex-wrap: wrap;
}

.quick-buttons .btn {
  font-size: 12px;
  padding: 6px 12px;
}

.result-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.result-section h5 {
  color: #37474f;
  margin-bottom: 12px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  flex-wrap: wrap;
}

.result-item label {
  color: #666;
  min-width: 80px;
  font-size: 12px;
}

.result-item span {
  flex: 1;
  font-family: monospace;
  font-size: 13px;
  color: #37474f;
}

.result-item span.timestamp {
  background: #e3f2fd;
  padding: 2px 6px;
  border-radius: 3px;
}

.copy-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.copy-btn:hover {
  background: #e2e8f0;
}

.batch-section {
  margin-bottom: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.batch-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.batch-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.batch-input label {
  color: #37474f;
  font-weight: 500;
}

.batch-input textarea {
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: monospace;
  resize: vertical;
}

.batch-results {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  background: #f8f9fa;
}

.batch-results h5 {
  color: #37474f;
  margin-bottom: 12px;
}

.batch-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.batch-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  margin-bottom: 4px;
  background: white;
  border-radius: 4px;
  font-size: 14px;
}

.batch-timestamp {
  font-family: monospace;
  color: #1976d2;
  min-width: 120px;
}

.batch-arrow {
  color: #666;
}

.batch-date {
  flex: 1;
  font-family: monospace;
  color: #37474f;
}

.timezone-section {
  margin-bottom: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.timezone-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.timezone-converter {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.timezone-input {
  margin-bottom: 16px;
}

.timezone-input label {
  display: block;
  margin-bottom: 8px;
  color: #37474f;
  font-weight: 500;
}

.timezone-input input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: monospace;
}

.timezone-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.timezone-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.timezone-item label {
  color: #37474f;
  font-size: 12px;
  min-width: 120px;
}

.timezone-item span {
  flex: 1;
  font-family: monospace;
  font-size: 13px;
  color: #1976d2;
}

.info-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.info-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.info-content {
  color: #78909c;
  line-height: 1.6;
}

.info-content h5 {
  color: #37474f;
  margin: 16px 0 8px 0;
  font-size: 14px;
}

.info-content ul {
  padding-left: 20px;
  margin-bottom: 16px;
}

.info-content li {
  margin-bottom: 6px;
  font-size: 14px;
}

.info-content code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}

@media (max-width: 768px) {
  .conversion-section {
    grid-template-columns: 1fr;
  }
  
  .time-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .result-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .batch-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .timezone-results {
    grid-template-columns: 1fr;
  }
  
  .timezone-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>