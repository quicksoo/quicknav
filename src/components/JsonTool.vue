<template>
  <div class="container">
    <div class="card">
      <h2>🔧 JSON工具</h2>
      <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
        JSON格式化、压缩、验证工具，支持JSON美化和压缩
      </p>
      
      <div class="input-group">
        <label>输入JSON数据：</label>
        <textarea 
          v-model="inputJson" 
          placeholder="请输入JSON数据..."
          rows="10"
          @input="validateJson"
        ></textarea>
        <div v-if="jsonError" class="error-message">
          ❌ JSON格式错误: {{ jsonError }}
        </div>
        <div v-else-if="inputJson" class="success-message">
          ✅ JSON格式正确
        </div>
      </div>
      
      <div class="tool-actions">
        <button class="btn" @click="formatJson" :disabled="!!jsonError">美化JSON</button>
        <button class="btn" @click="compressJson" :disabled="!!jsonError">压缩JSON</button>
        <button class="btn" @click="clearAll">清空</button>
        <button class="btn" @click="copyResult" v-if="result">复制结果</button>
      </div>
      
      <div v-if="result" class="result-section">
        <h4>处理结果：</h4>
        <div class="result-box">{{ result }}</div>
        <div class="result-stats">
          <span>原始长度: {{ inputJson.length }}</span>
          <span>结果长度: {{ result.length }}</span>
          <span>压缩率: {{ compressionRatio }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JsonTool',
  data() {
    return {
      inputJson: '',
      result: '',
      jsonError: '',
      parsedJson: null
    }
  },
  computed: {
    compressionRatio() {
      if (!this.inputJson || !this.result) return 0
      const ratio = ((this.inputJson.length - this.result.length) / this.inputJson.length * 100)
      return Math.round(ratio * 100) / 100
    }
  },
  methods: {
    validateJson() {
      if (!this.inputJson.trim()) {
        this.jsonError = ''
        this.parsedJson = null
        return
      }
      
      try {
        this.parsedJson = JSON.parse(this.inputJson)
        this.jsonError = ''
      } catch (error) {
        this.jsonError = error.message
        this.parsedJson = null
      }
    },
    
    formatJson() {
      if (this.parsedJson !== null) {
        this.result = JSON.stringify(this.parsedJson, null, 2)
      }
    },
    
    compressJson() {
      if (this.parsedJson !== null) {
        this.result = JSON.stringify(this.parsedJson)
      }
    },
    
    clearAll() {
      this.inputJson = ''
      this.result = ''
      this.jsonError = ''
      this.parsedJson = null
    },
    
    async copyResult() {
      try {
        await navigator.clipboard.writeText(this.result)
        this.showToast('复制成功！')
      } catch (error) {
        console.error('复制失败:', error)
        this.showToast('复制失败，请手动复制')
      }
    },
    
    showToast(message) {
      // 简单的提示实现
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
    // 示例JSON数据
    this.inputJson = `{
  "name": "编程工具导航",
  "version": "1.0.0",
  "tools": [
    {
      "name": "JSON工具",
      "description": "JSON格式化和压缩工具"
    },
    {
      "name": "Base64工具", 
      "description": "Base64编解码工具"
    }
  ],
  "author": "Developer"
}`
    this.validateJson()
  }
}
</script>

<style scoped>
.tool-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 20px 0;
}

.result-section {
  margin-top: 30px;
}

.result-section h4 {
  color: white;
  margin-bottom: 15px;
}

.result-stats {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  flex-wrap: wrap;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  border-left: 3px solid #ff6b6b;
}

.success-message {
  color: #51cf66;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px;
  background: rgba(81, 207, 102, 0.1);
  border-radius: 4px;
  border-left: 3px solid #51cf66;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .tool-actions {
    justify-content: center;
  }
  
  .result-stats {
    flex-direction: column;
    gap: 5px;
  }
}
</style>