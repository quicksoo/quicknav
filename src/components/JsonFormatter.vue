<template>
  <div class="container">
    <div class="card">
      <h2>🔧 JSON 处理工具</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        JSON格式化、压缩、验证和生成工具
      </p>
      
      <div class="mode-tabs">
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'format' }"
          @click="mode = 'format'"
        >
          🎨 格式化
        </button>
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'minify' }"
          @click="mode = 'minify'"
        >
          📦 压缩
        </button>
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'validate' }"
          @click="mode = 'validate'"
        >
          ✅ 验证
        </button>
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'generate' }"
          @click="mode = 'generate'"
        >
          🎲 生成
        </button>
      </div>
      
      <div v-if="mode !== 'generate'" class="json-panels">
        <div class="input-panel">
          <div class="panel-header">
            <h4>输入JSON</h4>
            <button class="action-btn" @click="loadSample">📋 示例</button>
          </div>
          <textarea 
            v-model="inputJson" 
            placeholder="请输入JSON数据..."
            rows="15"
            class="json-input"
          ></textarea>
        </div>
        
        <div class="process-panel">
          <button class="process-btn" @click="processJson">
            {{ getProcessButtonText() }}
          </button>
        </div>
        
        <div class="output-panel">
          <div class="panel-header">
            <h4>处理结果</h4>
            <button class="action-btn" @click="copyOutput">📋 复制</button>
          </div>
          <textarea 
            v-model="outputJson" 
            readonly 
            rows="15"
            class="json-output"
            placeholder="处理结果将显示在这里..."
          ></textarea>
        </div>
      </div>
      
      <div v-if="mode === 'generate'" class="generate-section">
        <div class="generate-controls">
          <select v-model="generateType">
            <option value="user">用户信息</option>
            <option value="product">商品信息</option>
            <option value="api">API响应</option>
          </select>
          <input type="number" v-model="generateCount" min="1" max="10" style="width: 80px;">
          <button class="btn" @click="generateJson">🎲 生成数据</button>
        </div>
        
        <div class="generate-result">
          <textarea 
            v-model="generatedJson" 
            readonly 
            rows="20"
            class="json-output"
            placeholder="点击生成按钮创建JSON数据..."
          ></textarea>
          <button class="btn" @click="copyGenerated">📋 复制结果</button>
        </div>
      </div>
      
      <div v-if="validationErrors.length > 0" class="error-section">
        <h4>验证错误：</h4>
        <div class="error-list">
          <div v-for="(error, index) in validationErrors" :key="index" class="error-item">
            {{ error }}
          </div>
        </div>
      </div>
      
      <div class="tools-section">
        <h4>实用功能：</h4>
        <div class="tool-buttons">
          <button class="tool-btn" @click="extractKeys">🔑 提取键名</button>
          <button class="tool-btn" @click="sortKeys">🔤 键名排序</button>
          <button class="tool-btn" @click="removeEmpty">🧹 清理空值</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JsonFormatter',
  data() {
    return {
      mode: 'format',
      inputJson: '',
      outputJson: '',
      validationErrors: [],
      generateType: 'user',
      generateCount: 3,
      generatedJson: ''
    }
  },
  methods: {
    getProcessButtonText() {
      const texts = {
        format: '🎨 格式化',
        minify: '📦 压缩',
        validate: '✅ 验证'
      }
      return texts[this.mode]
    },
    
    processJson() {
      if (!this.inputJson.trim()) {
        this.showToast('请输入JSON数据')
        return
      }
      
      this.validationErrors = []
      
      try {
        const parsed = JSON.parse(this.inputJson)
        
        switch (this.mode) {
          case 'format':
            this.outputJson = JSON.stringify(parsed, null, 2)
            break
          case 'minify':
            this.outputJson = JSON.stringify(parsed)
            break
          case 'validate':
            this.outputJson = '✅ JSON格式验证通过！'
            break
        }
      } catch (error) {
        this.outputJson = '❌ JSON格式错误'
        this.validationErrors = [error.message]
      }
    },
    
    generateJson() {
      let data
      
      switch (this.generateType) {
        case 'user':
          data = Array.from({ length: this.generateCount }, () => this.generateUser())
          break
        case 'product':
          data = Array.from({ length: this.generateCount }, () => this.generateProduct())
          break
        case 'api':
          data = {
            code: 200,
            message: 'success',
            data: Array.from({ length: this.generateCount }, () => this.generateUser()),
            timestamp: new Date().toISOString()
          }
          break
      }
      
      this.generatedJson = JSON.stringify(data, null, 2)
    },
    
    generateUser() {
      const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八']
      const cities = ['北京', '上海', '广州', '深圳', '杭州']
      
      return {
        id: Math.floor(Math.random() * 10000),
        name: names[Math.floor(Math.random() * names.length)],
        email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        age: Math.floor(Math.random() * 50) + 18,
        city: cities[Math.floor(Math.random() * cities.length)],
        active: Math.random() > 0.5
      }
    },
    
    generateProduct() {
      const products = ['手机', '电脑', '平板', '耳机', '键盘', '鼠标']
      const brands = ['苹果', '华为', '小米', '三星', '戴尔']
      
      return {
        id: Math.floor(Math.random() * 10000),
        name: `${brands[Math.floor(Math.random() * brands.length)]} ${products[Math.floor(Math.random() * products.length)]}`,
        price: Math.floor(Math.random() * 5000) + 100,
        stock: Math.floor(Math.random() * 100),
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10
      }
    },
    
    extractKeys() {
      try {
        const data = JSON.parse(this.inputJson)
        const keys = this.getAllKeys(data)
        this.outputJson = [...new Set(keys)].join('\n')
      } catch (error) {
        this.showToast('请输入有效的JSON数据')
      }
    },
    
    getAllKeys(obj, keys = []) {
      if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
          obj.forEach(item => this.getAllKeys(item, keys))
        } else {
          Object.keys(obj).forEach(key => {
            keys.push(key)
            this.getAllKeys(obj[key], keys)
          })
        }
      }
      return keys
    },
    
    sortKeys() {
      try {
        const data = JSON.parse(this.inputJson)
        const sorted = this.sortObjectKeys(data)
        this.outputJson = JSON.stringify(sorted, null, 2)
      } catch (error) {
        this.showToast('请输入有效的JSON数据')
      }
    },
    
    sortObjectKeys(obj) {
      if (typeof obj !== 'object' || obj === null) return obj
      
      if (Array.isArray(obj)) {
        return obj.map(item => this.sortObjectKeys(item))
      }
      
      const sorted = {}
      Object.keys(obj).sort().forEach(key => {
        sorted[key] = this.sortObjectKeys(obj[key])
      })
      
      return sorted
    },
    
    removeEmpty() {
      try {
        const data = JSON.parse(this.inputJson)
        const cleaned = this.removeEmptyValues(data)
        this.outputJson = JSON.stringify(cleaned, null, 2)
      } catch (error) {
        this.showToast('请输入有效的JSON数据')
      }
    },
    
    removeEmptyValues(obj) {
      if (typeof obj !== 'object' || obj === null) return obj
      
      if (Array.isArray(obj)) {
        return obj.map(item => this.removeEmptyValues(item)).filter(item => 
          item !== null && item !== undefined && item !== ''
        )
      }
      
      const cleaned = {}
      Object.keys(obj).forEach(key => {
        const value = obj[key]
        if (value !== null && value !== undefined && value !== '') {
          cleaned[key] = this.removeEmptyValues(value)
        }
      })
      
      return cleaned
    },
    
    loadSample() {
      this.inputJson = `{
  "users": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com",
      "age": 25,
      "address": {
        "city": "北京",
        "district": "朝阳区"
      },
      "hobbies": ["reading", "swimming"],
      "active": true
    }
  ],
  "total": 1
}`
    },
    
    async copyOutput() {
      if (!this.outputJson) {
        this.showToast('没有结果可复制')
        return
      }
      
      try {
        await navigator.clipboard.writeText(this.outputJson)
        this.showToast('已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    async copyGenerated() {
      if (!this.generatedJson) {
        this.showToast('没有结果可复制')
        return
      }
      
      try {
        await navigator.clipboard.writeText(this.generatedJson)
        this.showToast('已复制到剪贴板！')
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
  margin-bottom: 20px;
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

.json-panels {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.input-panel, .output-panel {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.panel-header h4 {
  margin: 0;
  color: #37474f;
  font-size: 14px;
}

.action-btn {
  background: transparent;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e8e8e8;
}

.json-input, .json-output {
  width: 100%;
  border: none;
  resize: vertical;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  outline: none;
}

.json-output {
  background: #f8f9fa;
}

.process-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 120px;
}

.process-btn {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.process-btn:hover {
  background: #1976d2;
}

.generate-section {
  margin-bottom: 30px;
}

.generate-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.generate-controls select,
.generate-controls input {
  padding: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.generate-result {
  margin-top: 16px;
}

.error-section {
  margin-bottom: 20px;
}

.error-section h4 {
  color: #f44336;
  margin-bottom: 8px;
}

.error-list {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
  padding: 12px;
}

.error-item {
  color: #d32f2f;
  font-size: 14px;
}

.tools-section {
  margin-bottom: 20px;
}

.tools-section h4 {
  color: #37474f;
  margin-bottom: 12px;
}

.tool-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tool-btn {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  background: #e8e8e8;
}

@media (max-width: 768px) {
  .json-panels {
    grid-template-columns: 1fr;
  }
  
  .process-panel {
    order: 2;
  }
}
</style>