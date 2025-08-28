<template>
  <div class="container">
    <div class="card">
      <h2>🌐 API 测试工具</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        HTTP API接口测试工具，支持GET、POST等方法
      </p>
      
      <div class="request-section">
        <div class="request-line">
          <select v-model="method" class="method-select">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          
          <input 
            v-model="url" 
            type="text" 
            placeholder="输入API地址，如: https://jsonplaceholder.typicode.com/posts/1"
            class="url-input"
          >
          
          <button 
            class="send-btn" 
            @click="sendRequest"
            :disabled="loading"
          >
            {{ loading ? '发送中...' : '🚀 发送' }}
          </button>
        </div>
        
        <div class="quick-tests">
          <button class="quick-btn" @click="loadExample('get')">GET示例</button>
          <button class="quick-btn" @click="loadExample('post')">POST示例</button>
        </div>
      </div>
      
      <div class="config-section">
        <div class="config-tabs">
          <button 
            class="config-tab" 
            :class="{ active: activeTab === 'headers' }"
            @click="activeTab = 'headers'"
          >
            请求头
          </button>
          <button 
            class="config-tab" 
            :class="{ active: activeTab === 'body' }"
            @click="activeTab = 'body'"
          >
            请求体
          </button>
        </div>
        
        <div class="config-content">
          <div v-if="activeTab === 'headers'" class="headers-config">
            <textarea 
              v-model="headersText" 
              placeholder="Content-Type: application/json&#10;Authorization: Bearer token"
              rows="4"
              class="config-textarea"
            ></textarea>
          </div>
          
          <div v-if="activeTab === 'body'" class="body-config">
            <textarea 
              v-model="requestBody" 
              placeholder='{"key": "value"}'
              rows="6"
              class="config-textarea"
            ></textarea>
            <button class="format-btn" @click="formatJson">格式化JSON</button>
          </div>
        </div>
      </div>
      
      <div v-if="response" class="response-section">
        <div class="response-header">
          <h4>响应结果</h4>
          <div class="response-actions">
            <span class="status-code" :class="getStatusClass(response.status)">
              {{ response.status }}
            </span>
            <span class="response-time">{{ response.time }}ms</span>
            <button class="action-btn" @click="copyResponse">复制</button>
          </div>
        </div>
        
        <div class="response-content">
          <pre class="response-text">{{ formatResponse(response.data) }}</pre>
        </div>
      </div>
      
      <div v-if="error" class="error-section">
        <h4>请求错误：</h4>
        <div class="error-content">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApiTester',
  data() {
    return {
      method: 'GET',
      url: '',
      headersText: 'Content-Type: application/json',
      requestBody: '',
      activeTab: 'headers',
      response: null,
      error: null,
      loading: false
    }
  },
  methods: {
    async sendRequest() {
      if (!this.url.trim()) {
        this.showToast('请输入API地址')
        return
      }
      
      this.loading = true
      this.error = null
      this.response = null
      
      const startTime = Date.now()
      
      try {
        // 解析headers
        const headers = {}
        this.headersText.split('\n').forEach(line => {
          const [key, value] = line.split(':').map(s => s.trim())
          if (key && value) {
            headers[key] = value
          }
        })
        
        // 构建请求配置
        const config = {
          method: this.method,
          headers,
          mode: 'cors'
        }
        
        // 添加请求体
        if (['POST', 'PUT', 'PATCH'].includes(this.method) && this.requestBody) {
          config.body = this.requestBody
        }
        
        // 发送请求
        const response = await fetch(this.url, config)
        const endTime = Date.now()
        const responseText = await response.text()
        
        this.response = {
          status: response.status,
          statusText: response.statusText,
          data: responseText,
          time: endTime - startTime
        }
        
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    
    loadExample(type) {
      if (type === 'get') {
        this.method = 'GET'
        this.url = 'https://jsonplaceholder.typicode.com/posts/1'
        this.headersText = 'Content-Type: application/json'
        this.requestBody = ''
      } else if (type === 'post') {
        this.method = 'POST'
        this.url = 'https://jsonplaceholder.typicode.com/posts'
        this.headersText = 'Content-Type: application/json'
        this.requestBody = JSON.stringify({
          title: 'foo',
          body: 'bar',
          userId: 1
        }, null, 2)
      }
    },
    
    formatJson() {
      try {
        const parsed = JSON.parse(this.requestBody)
        this.requestBody = JSON.stringify(parsed, null, 2)
      } catch (error) {
        this.showToast('JSON格式错误')
      }
    },
    
    formatResponse(data) {
      try {
        const parsed = JSON.parse(data)
        return JSON.stringify(parsed, null, 2)
      } catch {
        return data
      }
    },
    
    getStatusClass(status) {
      if (status >= 200 && status < 300) return 'success'
      if (status >= 400) return 'error'
      return ''
    },
    
    async copyResponse() {
      if (!this.response) return
      
      try {
        await navigator.clipboard.writeText(this.response.data)
        this.showToast('响应已复制！')
      } catch (error) {
        this.showToast('复制失败')
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
.request-section {
  margin-bottom: 24px;
}

.request-line {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.method-select {
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  min-width: 100px;
}

.url-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: monospace;
}

.send-btn {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: #1976d2;
}

.send-btn:disabled {
  opacity: 0.6;
}

.quick-tests {
  display: flex;
  gap: 8px;
}

.quick-btn {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}

.config-section {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 24px;
  overflow: hidden;
}

.config-tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.config-tab {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #78909c;
}

.config-tab.active {
  color: #2196f3;
  border-bottom-color: #2196f3;
  background: white;
}

.config-content {
  padding: 16px;
}

.config-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: monospace;
  resize: vertical;
}

.format-btn {
  margin-top: 8px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
}

.response-section {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 24px;
  overflow: hidden;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.response-header h4 {
  margin: 0;
  color: #37474f;
}

.response-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.status-code {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.status-code.success {
  background: #c8e6c9;
  color: #2e7d32;
}

.status-code.error {
  background: #ffcdd2;
  color: #c62828;
}

.response-time {
  color: #78909c;
  font-size: 14px;
}

.action-btn {
  background: transparent;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}

.response-content {
  padding: 16px;
}

.response-text {
  background: #f8f8f8;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 16px;
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
  margin: 0;
}

.error-section {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.error-section h4 {
  color: #c62828;
  margin-bottom: 8px;
}

.error-content {
  color: #d32f2f;
  font-family: monospace;
}

@media (max-width: 768px) {
  .request-line {
    flex-direction: column;
  }
  
  .response-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .response-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>