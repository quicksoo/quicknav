<template>
  <div class="container">
    <div class="card">
      <h2>🆔 UUID生成器</h2>
      <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
        在线UUID生成工具，支持UUID v4版本，可批量生成唯一标识符
      </p>
      
      <div class="generator-controls">
        <div class="input-group">
          <label>生成数量：</label>
          <input 
            type="number" 
            v-model.number="generateCount" 
            min="1" 
            max="1000"
            placeholder="输入要生成的UUID数量"
          >
        </div>
        
        <div class="control-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="withHyphens">
            <span>包含连字符 (-)</span>
          </label>
          
          <label class="checkbox-label">
            <input type="checkbox" v-model="upperCase">
            <span>大写字母</span>
          </label>
        </div>
        
        <div class="action-buttons">
          <button class="btn" @click="generateUUIDs">生成UUID</button>
          <button class="btn" @click="clearResults" v-if="generatedUUIDs.length">清空结果</button>
          <button class="btn" @click="copyAllUUIDs" v-if="generatedUUIDs.length">复制全部</button>
        </div>
      </div>
      
      <div v-if="generatedUUIDs.length" class="results-section">
        <h4>生成结果 (共{{ generatedUUIDs.length }}个)：</h4>
        
        <div class="uuid-list">
          <div 
            v-for="(uuid, index) in generatedUUIDs" 
            :key="index"
            class="uuid-item"
          >
            <span class="uuid-text">{{ formatUUID(uuid) }}</span>
            <button class="copy-btn" @click="copyUUID(uuid)" title="复制">📋</button>
          </div>
        </div>
        
        <div class="bulk-actions">
          <button class="btn" @click="downloadAsFile">下载为文件</button>
          <button class="btn" @click="exportAsJson">导出为JSON</button>
        </div>
      </div>
      
      <div class="info-section">
        <h4>UUID介绍：</h4>
        <div class="info-content">
          <p><strong>UUID (Universally Unique Identifier)</strong> 是一种标准化的128位唯一标识符。</p>
          
          <h5>特点：</h5>
          <ul>
            <li>全球唯一性：在空间和时间上都是唯一的</li>
            <li>无需中央管理：可以在分布式系统中独立生成</li>
            <li>标准格式：8-4-4-4-12的十六进制数字格式</li>
            <li>广泛应用：数据库主键、API标识、文件名等</li>
          </ul>
          
          <h5>UUID v4：</h5>
          <p>基于随机数生成，具有极低的重复概率（约1/5.3x10³⁶）</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UuidTool',
  data() {
    return {
      generateCount: 5,
      withHyphens: true,
      upperCase: false,
      generatedUUIDs: []
    }
  },
  methods: {
    generateUUID() {
      // UUID v4 生成算法
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    
    generateUUIDs() {
      this.generatedUUIDs = []
      const count = Math.min(Math.max(1, this.generateCount), 1000) // 限制在1-1000之间
      
      for (let i = 0; i < count; i++) {
        this.generatedUUIDs.push(this.generateUUID())
      }
    },
    
    formatUUID(uuid) {
      let formatted = this.withHyphens ? uuid : uuid.replace(/-/g, '')
      return this.upperCase ? formatted.toUpperCase() : formatted.toLowerCase()
    },
    
    async copyUUID(uuid) {
      try {
        await navigator.clipboard.writeText(this.formatUUID(uuid))
        this.showToast('UUID已复制！')
      } catch (error) {
        console.error('复制失败:', error)
        this.showToast('复制失败，请手动复制')
      }
    },
    
    async copyAllUUIDs() {
      try {
        const allUUIDs = this.generatedUUIDs.map(uuid => this.formatUUID(uuid)).join('\n')
        await navigator.clipboard.writeText(allUUIDs)
        this.showToast(`已复制${this.generatedUUIDs.length}个UUID！`)
      } catch (error) {
        console.error('复制失败:', error)
        this.showToast('复制失败，请手动复制')
      }
    },
    
    clearResults() {
      this.generatedUUIDs = []
    },
    
    downloadAsFile() {
      const content = this.generatedUUIDs.map(uuid => this.formatUUID(uuid)).join('\n')
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `uuids_${new Date().toISOString().slice(0, 10)}.txt`
      a.click()
      
      URL.revokeObjectURL(url)
    },
    
    exportAsJson() {
      const data = {
        generated_at: new Date().toISOString(),
        count: this.generatedUUIDs.length,
        format: {
          with_hyphens: this.withHyphens,
          upper_case: this.upperCase
        },
        uuids: this.generatedUUIDs.map(uuid => this.formatUUID(uuid))
      }
      
      const content = JSON.stringify(data, null, 2)
      const blob = new Blob([content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `uuids_${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      
      URL.revokeObjectURL(url)
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
          document.body.removeChild(toast)
        }, 300)
      }, 2000)
    }
  },
  mounted() {
    // 自动生成一些示例UUID
    this.generateUUIDs()
  }
}
</script>

<style scoped>
.generator-controls {
  margin-bottom: 30px;
}

.control-options {
  display: flex;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.2);
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.results-section {
  margin-top: 30px;
}

.results-section h4 {
  color: white;
  margin-bottom: 20px;
}

.uuid-list {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.uuid-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: monospace;
}

.uuid-item:last-child {
  border-bottom: none;
}

.uuid-text {
  color: #51cf66;
  font-size: 14px;
  word-break: break-all;
  margin-right: 10px;
  flex: 1;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.bulk-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.info-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.info-section h4 {
  color: white;
  margin-bottom: 15px;
}

.info-content {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.info-content h5 {
  color: white;
  margin: 15px 0 10px 0;
}

.info-content ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

.info-content li {
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .control-options {
    flex-direction: column;
    gap: 10px;
  }
  
  .action-buttons,
  .bulk-actions {
    justify-content: center;
  }
  
  .uuid-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .copy-btn {
    align-self: flex-end;
  }
}
</style>