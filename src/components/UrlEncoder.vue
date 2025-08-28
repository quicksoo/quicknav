<template>
  <div class="container">
    <div class="card">
      <h2>🔗 URL编解码工具</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        URL编码和解码工具，处理URL中的特殊字符
      </p>
      
      <div class="tool-section">
        <div class="input-group">
          <label>输入文本：</label>
          <textarea 
            v-model="inputText" 
            placeholder="请输入要编码或解码的文本..."
            rows="4"
            @input="autoProcess"
          ></textarea>
        </div>
        
        <div class="buttons-group">
          <button class="btn" @click="encodeURL">URL编码</button>
          <button class="btn" @click="decodeURL">URL解码</button>
          <button class="btn" @click="clearAll">清空</button>
        </div>
        
        <div v-if="outputText" class="result-section">
          <h4>处理结果：</h4>
          <div class="result-box">{{ outputText }}</div>
          <div class="result-actions">
            <button class="btn" @click="copyResult">复制结果</button>
            <button class="btn" @click="swapContent">交换内容</button>
          </div>
        </div>
      </div>
      
      <div class="examples-section">
        <h4>常用示例：</h4>
        <div class="example-grid">
          <div class="example-item" @click="loadExample(example)" v-for="example in examples" :key="example.name">
            <h5>{{ example.name }}</h5>
            <p>{{ example.original }}</p>
            <small>→ {{ example.encoded }}</small>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <h4>URL编码说明：</h4>
        <div class="info-content">
          <p><strong>URL编码</strong>（百分号编码）是一种编码机制，用于在URL中安全地传输数据。</p>
          
          <h5>需要编码的字符：</h5>
          <ul>
            <li>空格 → %20</li>
            <li>中文字符 → %E4%B8%AD%E6%96%87</li>
            <li>特殊符号：# → %23, & → %26, = → %3D</li>
            <li>保留字符：/ → %2F, ? → %3F, : → %3A</li>
          </ul>
          
          <h5>应用场景：</h5>
          <ul>
            <li>URL参数传递</li>
            <li>表单数据提交</li>
            <li>API接口调用</li>
            <li>搜索引擎查询</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UrlEncoder',
  data() {
    return {
      inputText: '',
      outputText: '',
      examples: [
        {
          name: '中文文本',
          original: '你好世界',
          encoded: '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'
        },
        {
          name: 'URL参数',
          original: 'name=张三&age=25',
          encoded: 'name%3D%E5%BC%A0%E4%B8%89%26age%3D25'
        },
        {
          name: '邮箱地址',
          original: 'user@example.com',
          encoded: 'user%40example.com'
        },
        {
          name: '特殊字符',
          original: 'hello world!@#$%',
          encoded: 'hello%20world!%40%23%24%25'
        }
      ]
    }
  },
  methods: {
    encodeURL() {
      if (!this.inputText.trim()) {
        this.showToast('请输入要编码的文本')
        return
      }
      try {
        this.outputText = encodeURIComponent(this.inputText)
      } catch (error) {
        this.showToast('编码失败，请检查输入内容')
      }
    },
    
    decodeURL() {
      if (!this.inputText.trim()) {
        this.showToast('请输入要解码的文本')
        return
      }
      try {
        this.outputText = decodeURIComponent(this.inputText)
      } catch (error) {
        this.showToast('解码失败，请检查输入格式')
      }
    },
    
    autoProcess() {
      // 自动检测是否为编码后的URL
      if (this.inputText.includes('%')) {
        this.decodeURL()
      }
    },
    
    clearAll() {
      this.inputText = ''
      this.outputText = ''
    },
    
    swapContent() {
      if (this.outputText) {
        const temp = this.inputText
        this.inputText = this.outputText
        this.outputText = temp
      }
    },
    
    loadExample(example) {
      this.inputText = example.original
      this.outputText = example.encoded
    },
    
    async copyResult() {
      if (!this.outputText) {
        this.showToast('没有可复制的内容')
        return
      }
      try {
        await navigator.clipboard.writeText(this.outputText)
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
  }
}
</script>

<style scoped>
.tool-section {
  margin-bottom: 40px;
}

.buttons-group {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
  justify-content: center;
}

.result-section {
  margin-top: 20px;
}

.result-section h4 {
  color: #37474f;
  margin-bottom: 10px;
}

.result-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.examples-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.examples-section h4 {
  color: #37474f;
  margin-bottom: 20px;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.example-item {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.example-item:hover {
  border-color: #2196f3;
  background: #f0f7ff;
}

.example-item h5 {
  color: #37474f;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}

.example-item p {
  color: #37474f;
  margin-bottom: 6px;
  font-family: monospace;
  font-size: 13px;
  word-break: break-all;
}

.example-item small {
  color: #78909c;
  font-family: monospace;
  font-size: 12px;
  word-break: break-all;
}

.info-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.info-section h4 {
  color: #37474f;
  margin-bottom: 15px;
}

.info-content {
  color: #78909c;
  line-height: 1.6;
}

.info-content h5 {
  color: #37474f;
  margin: 15px 0 10px 0;
  font-size: 14px;
}

.info-content ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

.info-content li {
  margin-bottom: 5px;
  font-family: monospace;
  font-size: 13px;
}

@media (max-width: 768px) {
  .buttons-group {
    flex-direction: column;
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .example-grid {
    grid-template-columns: 1fr;
  }
}
</style>