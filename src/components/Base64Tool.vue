<template>
  <div class="container">
    <div class="card">
      <h2>🔐 Base64编解码工具</h2>
      <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
        Base64编码和解码工具，支持文本的Base64转换
      </p>
      
      <div class="tool-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'encode' }"
          @click="activeTab = 'encode'"
        >
          编码
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'decode' }"
          @click="activeTab = 'decode'"
        >
          解码
        </button>
      </div>
      
      <!-- 编码面板 -->
      <div v-if="activeTab === 'encode'" class="tab-content">
        <div class="input-group">
          <label>输入要编码的文本：</label>
          <textarea 
            v-model="inputText" 
            placeholder="请输入要进行Base64编码的文本..."
            rows="6"
            @input="encodeText"
          ></textarea>
        </div>
        
        <div v-if="encodedResult" class="result-section">
          <h4>Base64编码结果：</h4>
          <div class="result-box">{{ encodedResult }}</div>
          <button class="btn" @click="copyToClipboard(encodedResult)">复制结果</button>
        </div>
      </div>
      
      <!-- 解码面板 -->
      <div v-if="activeTab === 'decode'" class="tab-content">
        <div class="input-group">
          <label>输入Base64编码：</label>
          <textarea 
            v-model="inputBase64" 
            placeholder="请输入Base64编码字符串..."
            rows="6"
            @input="decodeText"
          ></textarea>
          <div v-if="decodeError" class="error-message">
            ❌ Base64格式错误: {{ decodeError }}
          </div>
        </div>
        
        <div v-if="decodedResult && !decodeError" class="result-section">
          <h4>解码结果：</h4>
          <div class="result-box">{{ decodedResult }}</div>
          <button class="btn" @click="copyToClipboard(decodedResult)">复制结果</button>
        </div>
      </div>
      
      <div class="tool-actions">
        <button class="btn" @click="clearAll">清空所有</button>
        <button class="btn" @click="swapContent" v-if="encodedResult || decodedResult">
          交换内容
        </button>
      </div>
      
      <div class="info-section">
        <h4>Base64使用说明：</h4>
        <ul>
          <li>Base64是一种基于64个可打印字符来表示二进制数据的编码方式</li>
          <li>常用于在HTTP环境下传递较长的标识信息</li>
          <li>编码后的字符串长度通常比原始数据增加约33%</li>
          <li>只能包含A-Z、a-z、0-9、+、/和=（填充字符）</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Base64Tool',
  data() {
    return {
      activeTab: 'encode',
      inputText: '',
      inputBase64: '',
      encodedResult: '',
      decodedResult: '',
      decodeError: ''
    }
  },
  methods: {
    encodeText() {
      if (!this.inputText) {
        this.encodedResult = ''
        return
      }
      
      try {
        this.encodedResult = btoa(unescape(encodeURIComponent(this.inputText)))
      } catch (error) {
        console.error('编码失败:', error)
        this.encodedResult = ''
      }
    },
    
    decodeText() {
      if (!this.inputBase64) {
        this.decodedResult = ''
        this.decodeError = ''
        return
      }
      
      try {
        // 清理输入，移除空白字符
        const cleanBase64 = this.inputBase64.replace(/\s/g, '')
        
        // 验证Base64格式
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
          throw new Error('包含无效字符')
        }
        
        if (cleanBase64.length % 4 !== 0) {
          throw new Error('长度不是4的倍数')
        }
        
        this.decodedResult = decodeURIComponent(escape(atob(cleanBase64)))
        this.decodeError = ''
      } catch (error) {
        this.decodeError = error.message || '解码失败'
        this.decodedResult = ''
      }
    },
    
    clearAll() {
      this.inputText = ''
      this.inputBase64 = ''
      this.encodedResult = ''
      this.decodedResult = ''
      this.decodeError = ''
    },
    
    swapContent() {
      if (this.activeTab === 'encode' && this.encodedResult) {
        this.activeTab = 'decode'
        this.inputBase64 = this.encodedResult
        this.decodeText()
      } else if (this.activeTab === 'decode' && this.decodedResult) {
        this.activeTab = 'encode'
        this.inputText = this.decodedResult
        this.encodeText()
      }
    },
    
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        this.showToast('复制成功！')
      } catch (error) {
        console.error('复制失败:', error)
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
          document.body.removeChild(toast)
        }, 300)
      }, 2000)
    }
  },
  mounted() {
    // 示例文本
    this.inputText = '这是一个Base64编码示例文本。\nHello World! 你好世界！'
    this.encodeText()
  }
}
</script>

<style scoped>
.tool-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 12px 24px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  font-size: 16px;
}

.tab-btn:hover {
  color: white;
}

.tab-btn.active {
  color: white;
  border-bottom-color: #667eea;
}

.tab-content {
  min-height: 400px;
}

.result-section {
  margin-top: 20px;
}

.result-section h4 {
  color: white;
  margin-bottom: 15px;
}

.tool-actions {
  display: flex;
  gap: 10px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.info-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.info-section h4 {
  color: white;
  margin-bottom: 15px;
}

.info-section ul {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  padding-left: 20px;
}

.info-section li {
  margin-bottom: 8px;
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

@media (max-width: 768px) {
  .tab-btn {
    flex: 1;
    font-size: 14px;
    padding: 10px 16px;
  }
  
  .tool-actions {
    justify-content: center;
  }
}
</style>