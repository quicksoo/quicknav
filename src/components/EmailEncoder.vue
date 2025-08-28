<template>
  <div class="container">
    <div class="card">
      <h2>📧 邮箱地址加密工具</h2>
      <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
        将邮箱地址转换成Unicode编码格式，防止被恶意爬虫采集，保护您的邮箱隐私
      </p>
      
      <div class="encoding-modes">
        <h3>编码模式</h3>
        <div class="mode-selector">
          <button 
            v-for="mode in encodingModes" 
            :key="mode.id"
            class="mode-btn"
            :class="{ active: selectedMode === mode.id }"
            @click="selectedMode = mode.id"
          >
            {{ mode.name }}
          </button>
        </div>
        <p class="mode-description">{{ getCurrentMode().description }}</p>
      </div>
      
      <div class="email-input-section">
        <h3>邮箱地址输入</h3>
        <div class="input-methods">
          <div class="input-tab">
            <button 
              class="tab-btn"
              :class="{ active: inputMode === 'single' }"
              @click="inputMode = 'single'"
            >
              单个邮箱
            </button>
            <button 
              class="tab-btn"
              :class="{ active: inputMode === 'batch' }"
              @click="inputMode = 'batch'"
            >
              批量处理
            </button>
          </div>
          
          <!-- 单个邮箱输入 -->
          <div v-if="inputMode === 'single'" class="single-input">
            <div class="input-group">
              <label>邮箱地址</label>
              <input 
                type="email" 
                v-model="singleEmail" 
                placeholder="请输入邮箱地址，如：example@domain.com"
                @input="validateEmail"
              >
              <div v-if="emailValidation.message" :class="['validation-message', emailValidation.isValid ? 'valid' : 'invalid']">
                {{ emailValidation.message }}
              </div>
            </div>
            
            <div class="preview-section" v-if="singleEmail">
              <h4>编码预览</h4>
              <div class="encoded-result">
                <div class="result-item">
                  <label>编码结果:</label>
                  <div class="result-text">{{ encodeSingleEmail() }}</div>
                </div>
                
                <div class="result-item">
                  <label>HTML代码:</label>
                  <div class="result-text html-code">{{ generateHtmlCode() }}</div>
                </div>
              </div>
              
              <div class="action-buttons">
                <button class="btn" @click="copySingleResult">复制编码结果</button>
                <button class="btn" @click="copyHtmlCode">复制HTML代码</button>
              </div>
            </div>
          </div>
          
          <!-- 批量邮箱输入 -->
          <div v-if="inputMode === 'batch'" class="batch-input">
            <div class="input-group">
              <label>批量邮箱地址 (每行一个)</label>
              <textarea 
                v-model="batchEmails" 
                placeholder="请输入多个邮箱地址，每行一个&#10;example1@domain.com&#10;example2@domain.com&#10;example3@domain.com"
                rows="6"
                @input="processBatchEmails"
              ></textarea>
              <div class="batch-stats" v-if="batchResults.length">
                共处理 {{ batchResults.length }} 个邮箱地址
              </div>
            </div>
            
            <div class="batch-results" v-if="batchResults.length">
              <h4>批量处理结果</h4>
              <div class="results-table">
                <div class="table-header">
                  <span>原始邮箱</span>
                  <span>编码结果</span>
                  <span>操作</span>
                </div>
                <div 
                  v-for="(result, index) in batchResults" 
                  :key="index"
                  class="table-row"
                >
                  <span class="original-email">{{ result.original }}</span>
                  <span class="encoded-email">{{ result.encoded }}</span>
                  <button class="copy-btn" @click="copyText(result.encoded)" title="复制">📋</button>
                </div>
              </div>
              
              <div class="batch-actions">
                <button class="btn" @click="copyAllResults">复制所有结果</button>
                <button class="btn" @click="exportBatchResults">导出为文件</button>
                <button class="btn" @click="generateBatchHtml">生成HTML文件</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="decoding-section">
        <h3>解码工具</h3>
        <div class="input-group">
          <label>编码后的邮箱地址</label>
          <textarea 
            v-model="encodedInput" 
            placeholder="请输入Unicode编码的邮箱地址..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="decode-actions">
          <button class="btn" @click="decodeEmail">解码邮箱</button>
          <button class="btn" @click="clearDecodeInput">清空</button>
        </div>
        
        <div v-if="decodedResult" class="decode-result">
          <h4>解码结果</h4>
          <div class="result-text">{{ decodedResult }}</div>
          <button class="btn" @click="copyText(decodedResult)">复制解码结果</button>
        </div>
      </div>
      
      <div class="info-section">
        <h3>使用说明</h3>
        <div class="info-content">
          <h4>为什么要加密邮箱地址？</h4>
          <ul>
            <li>防止邮箱地址被网络爬虫自动采集</li>
            <li>减少垃圾邮件和恶意邮件</li>
            <li>保护个人隐私信息</li>
            <li>在网页上显示邮箱时提供额外保护</li>
          </ul>
          
          <h4>编码方式说明：</h4>
          <ul>
            <li><strong>HTML实体编码：</strong> 将字符转换为HTML实体，如 &amp;#64; 代表 @</li>
            <li><strong>Unicode十六进制：</strong> 将字符转换为Unicode十六进制表示</li>
            <li><strong>Unicode十进制：</strong> 将字符转换为Unicode十进制表示</li>
            <li><strong>混合编码：</strong> 随机使用多种编码方式，提供更强保护</li>
          </ul>
          
          <h4>使用方法：</h4>
          <ol>
            <li>选择合适的编码模式</li>
            <li>输入要加密的邮箱地址</li>
            <li>复制生成的编码结果</li>
            <li>在网页HTML中使用编码后的邮箱地址</li>
          </ol>
          
          <h4>HTML使用示例：</h4>
          <pre><code>&lt;a href="mailto:&amp;#101;&amp;#120;&amp;#97;&amp;#109;&amp;#112;&amp;#108;&amp;#101;&amp;#64;&amp;#100;&amp;#111;&amp;#109;&amp;#97;&amp;#105;&amp;#110;&amp;#46;&amp;#99;&amp;#111;&amp;#109;"&gt;联系我们&lt;/a&gt;</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailEncoder',
  data() {
    return {
      selectedMode: 'html-entity',
      inputMode: 'single',
      singleEmail: '',
      batchEmails: '',
      encodedInput: '',
      decodedResult: '',
      batchResults: [],
      emailValidation: { isValid: false, message: '' },
      encodingModes: [
        {
          id: 'html-entity',
          name: 'HTML实体编码',
          description: '将所有字符转换为HTML实体编码，兼容性好，推荐使用'
        },
        {
          id: 'unicode-hex',
          name: 'Unicode十六进制',
          description: '将字符转换为Unicode十六进制表示，如 \\u0040'
        },
        {
          id: 'unicode-decimal',
          name: 'Unicode十进制',
          description: '将字符转换为Unicode十进制实体，如 &#64;'
        },
        {
          id: 'mixed',
          name: '混合编码',
          description: '随机使用多种编码方式，提供最强的保护效果'
        }
      ]
    }
  },
  methods: {
    getCurrentMode() {
      return this.encodingModes.find(mode => mode.id === this.selectedMode) || this.encodingModes[0]
    },
    
    validateEmail() {
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
      if (!this.singleEmail) {
        this.emailValidation = { isValid: false, message: '' }
      } else if (emailRegex.test(this.singleEmail)) {
        this.emailValidation = { isValid: true, message: '✅ 邮箱格式正确' }
      } else {
        this.emailValidation = { isValid: false, message: '❌ 邮箱格式不正确' }
      }
    },
    
    encodeEmail(email, mode = this.selectedMode) {
      if (!email) return ''
      
      switch (mode) {
        case 'html-entity':
          return this.encodeHtmlEntity(email)
        case 'unicode-hex':
          return this.encodeUnicodeHex(email)
        case 'unicode-decimal':
          return this.encodeUnicodeDecimal(email)
        case 'mixed':
          return this.encodeMixed(email)
        default:
          return this.encodeHtmlEntity(email)
      }
    },
    
    encodeHtmlEntity(text) {
      return text.split('').map(char => `&#${char.charCodeAt(0)};`).join('')
    },
    
    encodeUnicodeHex(text) {
      return text.split('').map(char => {
        const code = char.charCodeAt(0).toString(16).toUpperCase()
        return `\\u${code.padStart(4, '0')}`
      }).join('')
    },
    
    encodeUnicodeDecimal(text) {
      return text.split('').map(char => `&#${char.charCodeAt(0)};`).join('')
    },
    
    encodeMixed(text) {
      const methods = ['html-entity', 'unicode-decimal']
      return text.split('').map(char => {
        const randomMethod = methods[Math.floor(Math.random() * methods.length)]
        if (randomMethod === 'html-entity') {
          return `&#${char.charCodeAt(0)};`
        } else {
          return `&#${char.charCodeAt(0)};`
        }
      }).join('')
    },
    
    encodeSingleEmail() {
      return this.encodeEmail(this.singleEmail)
    },
    
    generateHtmlCode() {
      if (!this.singleEmail) return ''
      const encoded = this.encodeSingleEmail()
      return `<a href="mailto:${encoded}">${encoded}</a>`
    },
    
    processBatchEmails() {
      const emails = this.batchEmails.split('\\n')
        .map(email => email.trim())
        .filter(email => email && this.isValidEmail(email))
      
      this.batchResults = emails.map(email => ({
        original: email,
        encoded: this.encodeEmail(email)
      }))
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
      return emailRegex.test(email)
    },
    
    decodeEmail() {
      if (!this.encodedInput.trim()) {
        this.decodedResult = ''
        return
      }
      
      let decoded = this.encodedInput
      
      // 解码HTML实体
      decoded = decoded.replace(/&#(\\d+);/g, (match, dec) => {
        return String.fromCharCode(parseInt(dec, 10))
      })
      
      // 解码Unicode十六进制
      decoded = decoded.replace(/\\\\u([0-9A-Fa-f]{4})/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16))
      })
      
      this.decodedResult = decoded
    },
    
    clearDecodeInput() {
      this.encodedInput = ''
      this.decodedResult = ''
    },
    
    async copySingleResult() {
      await this.copyText(this.encodeSingleEmail())
    },
    
    async copyHtmlCode() {
      await this.copyText(this.generateHtmlCode())
    },
    
    async copyAllResults() {
      const results = this.batchResults.map(result => 
        `${result.original} -> ${result.encoded}`
      ).join('\\n')
      await this.copyText(results)
    },
    
    exportBatchResults() {
      const results = this.batchResults.map(result => 
        `原始邮箱: ${result.original}\\n编码结果: ${result.encoded}\\n`
      ).join('\\n')
      
      const content = `邮箱地址编码结果\\n生成时间: ${new Date().toLocaleString()}\\n编码模式: ${this.getCurrentMode().name}\\n\\n${results}`
      
      const blob = new Blob([content], { type: 'text/plain; charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = 'encoded-emails.txt'
      a.click()
      
      URL.revokeObjectURL(url)
    },
    
    generateBatchHtml() {
      const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>编码后的邮箱地址</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .email-item { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .original { color: #666; font-size: 14px; }
        .encoded { color: #333; font-weight: bold; }
    </style>
</head>
<body>
    <h1>编码后的邮箱地址</h1>
    <p>生成时间: ${new Date().toLocaleString()}</p>
    <p>编码模式: ${this.getCurrentMode().name}</p>
    
    ${this.batchResults.map(result => `
    <div class="email-item">
        <div class="original">原始: ${result.original}</div>
        <div class="encoded">编码: <a href="mailto:${result.encoded}">${result.encoded}</a></div>
    </div>
    `).join('')}
</body>
</html>`
      
      const blob = new Blob([htmlContent], { type: 'text/html; charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = 'encoded-emails.html'
      a.click()
      
      URL.revokeObjectURL(url)
    },
    
    async copyText(text) {
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
    // 示例邮箱
    this.singleEmail = 'example@domain.com'
    this.validateEmail()
  }
}
</script>

<style scoped>
.encoding-modes {
  margin-bottom: 30px;
}

.encoding-modes h3 {
  color: white;
  margin-bottom: 15px;
}

.mode-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.mode-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.mode-btn.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
}

.mode-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.email-input-section {
  margin-bottom: 40px;
}

.email-input-section h3 {
  color: white;
  margin-bottom: 20px;
}

.input-tab {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
}

.tab-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.tab-btn:first-child {
  border-radius: 6px 0 0 6px;
}

.tab-btn:last-child {
  border-radius: 0 6px 6px 0;
  border-left: none;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.tab-btn.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
}

.validation-message {
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
}

.validation-message.valid {
  background: rgba(81, 207, 102, 0.2);
  border: 1px solid rgba(81, 207, 102, 0.5);
  color: #51cf66;
}

.validation-message.invalid {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.5);
  color: #ff6b6b;
}

.preview-section {
  margin-top: 30px;
}

.preview-section h4 {
  color: white;
  margin-bottom: 15px;
}

.encoded-result {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.result-item {
  margin-bottom: 15px;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-item label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  font-weight: 500;
}

.result-text {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 6px;
  color: #51cf66;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  word-break: break-all;
  line-height: 1.4;
}

.html-code {
  color: #74c0fc;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.batch-stats {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-top: 8px;
}

.batch-results {
  margin-top: 30px;
}

.batch-results h4 {
  color: white;
  margin-bottom: 20px;
}

.results-table {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 2fr 60px;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 2fr 60px;
  gap: 15px;
  padding: 12px 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;
}

.original-email {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  word-break: break-all;
}

.encoded-email {
  color: #51cf66;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  word-break: break-all;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  cursor: pointer;
  padding: 6px;
  font-size: 12px;
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.batch-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.decoding-section {
  margin-bottom: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.decoding-section h3 {
  color: white;
  margin-bottom: 20px;
}

.decode-actions {
  display: flex;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
  justify-content: center;
}

.decode-result {
  margin-top: 20px;
  text-align: center;
}

.decode-result h4 {
  color: white;
  margin-bottom: 15px;
}

.info-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.info-section h3 {
  color: white;
  margin-bottom: 20px;
  text-align: center;
}

.info-content {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.info-content h4 {
  color: white;
  margin: 20px 0 10px 0;
}

.info-content ul,
.info-content ol {
  padding-left: 20px;
  margin-bottom: 20px;
}

.info-content li {
  margin-bottom: 8px;
}

.info-content pre {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 15px 0;
}

.info-content code {
  color: #74c0fc;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
}

@media (max-width: 768px) {
  .mode-selector {
    flex-direction: column;
  }
  
  .mode-btn {
    text-align: center;
  }
  
  .input-tab {
    flex-direction: column;
  }
  
  .tab-btn {
    border-radius: 6px !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    margin-bottom: 8px;
  }
  
  .action-buttons,
  .batch-actions,
  .decode-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons .btn,
  .batch-actions .btn,
  .decode-actions .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-header {
    text-align: center;
  }
  
  .table-row {
    text-align: center;
  }
  
  .copy-btn {
    justify-self: center;
  }
}
</style>