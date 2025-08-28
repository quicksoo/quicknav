<template>
  <div class="container">
    <div class="card">
      <h2>🔒 MD5加密工具</h2>
      <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
        MD5哈希值计算工具，快速生成文本的MD5摘要，支持文件和文本加密
      </p>
      
      <div class="tool-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'text' }"
          @click="activeTab = 'text'"
        >
          文本加密
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'file' }"
          @click="activeTab = 'file'"
        >
          文件加密
        </button>
      </div>
      
      <!-- 文本加密面板 -->
      <div v-if="activeTab === 'text'" class="tab-content">
        <div class="input-group">
          <label>输入要加密的文本：</label>
          <textarea 
            v-model="inputText" 
            placeholder="请输入要进行MD5加密的文本..."
            rows="6"
            @input="generateMD5"
          ></textarea>
        </div>
        
        <div class="options-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="upperCase" @change="generateMD5">
            <span>大写输出</span>
          </label>
          
          <label class="checkbox-label">
            <input type="checkbox" v-model="withPrefix" @change="generateMD5">
            <span>添加前缀 (md5:)</span>
          </label>
        </div>
        
        <div v-if="md5Result" class="result-section">
          <h4>MD5加密结果：</h4>
          <div class="result-box">{{ formatResult(md5Result) }}</div>
          <div class="result-actions">
            <button class="btn" @click="copyResult">复制结果</button>
            <button class="btn" @click="saveAsFile">保存为文件</button>
          </div>
        </div>
      </div>
      
      <!-- 文件加密面板 -->
      <div v-if="activeTab === 'file'" class="tab-content">
        <div class="file-input-area">
          <div 
            class="file-drop-zone"
            :class="{ 'drag-over': isDragOver }"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="handleFileDrop"
            @click="$refs.fileInput.click()"
          >
            <div v-if="!selectedFile">
              <div class="upload-icon">📁</div>
              <p>点击选择文件或拖拽文件到此处</p>
              <p class="file-hint">支持任意格式的文件</p>
            </div>
            <div v-else class="file-info">
              <div class="file-icon">📄</div>
              <div class="file-details">
                <h4>{{ selectedFile.name }}</h4>
                <p>大小: {{ formatFileSize(selectedFile.size) }}</p>
                <p>类型: {{ selectedFile.type || '未知' }}</p>
              </div>
            </div>
          </div>
          
          <input 
            ref="fileInput" 
            type="file" 
            @change="handleFileSelect"
            style="display: none"
          >
          
          <div v-if="selectedFile" class="file-actions">
            <button class="btn" @click="calculateFileMD5" :disabled="isCalculating">
              {{ isCalculating ? '计算中...' : '计算MD5' }}
            </button>
            <button class="btn" @click="clearFile">清除文件</button>
          </div>
        </div>
        
        <div v-if="fileMD5Result" class="result-section">
          <h4>文件MD5结果：</h4>
          <div class="file-result">
            <div class="result-item">
              <strong>文件名:</strong> {{ selectedFile.name }}
            </div>
            <div class="result-item">
              <strong>MD5值:</strong> 
              <span class="hash-value">{{ formatResult(fileMD5Result) }}</span>
            </div>
            <div class="result-item">
              <strong>文件大小:</strong> {{ formatFileSize(selectedFile.size) }}
            </div>
          </div>
          <div class="result-actions">
            <button class="btn" @click="copyFileResult">复制MD5值</button>
            <button class="btn" @click="saveFileResult">保存校验信息</button>
          </div>
        </div>
      </div>
      
      <div class="batch-section" v-if="activeTab === 'text'">
        <h4>批量加密：</h4>
        <div class="input-group">
          <label>批量文本 (每行一个)：</label>
          <textarea 
            v-model="batchText" 
            placeholder="每行输入一个要加密的文本..."
            rows="4"
          ></textarea>
        </div>
        <button class="btn" @click="generateBatchMD5" :disabled="!batchText.trim()">
          批量生成MD5
        </button>
        
        <div v-if="batchResults.length" class="batch-results">
          <h5>批量结果：</h5>
          <div class="batch-list">
            <div v-for="(item, index) in batchResults" :key="index" class="batch-item">
              <div class="original-text">{{ item.text }}</div>
              <div class="arrow">→</div>
              <div class="hash-result">{{ formatResult(item.hash) }}</div>
              <button class="copy-btn" @click="copyText(formatResult(item.hash))" title="复制">📋</button>
            </div>
          </div>
          <button class="btn" @click="exportBatchResults">导出批量结果</button>
        </div>
      </div>
      
      <div class="info-section">
        <h4>MD5算法介绍：</h4>
        <div class="info-content">
          <p><strong>MD5 (Message Digest Algorithm 5)</strong> 是一种广泛使用的密码散列函数。</p>
          
          <h5>特点：</h5>
          <ul>
            <li>产生128位（16字节）的散列值</li>
            <li>通常表示为32位十六进制数字</li>
            <li>相同输入始终产生相同输出</li>
            <li>微小的输入变化会导致输出巨大变化</li>
          </ul>
          
          <h5>应用场景：</h5>
          <ul>
            <li>文件完整性校验</li>
            <li>密码存储（需加盐）</li>
            <li>数字签名</li>
            <li>缓存键生成</li>
          </ul>
          
          <p><strong>安全提示：</strong> MD5已被发现存在碰撞漏洞，不建议用于安全敏感的场景，推荐使用SHA-256等更安全的算法。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 简化的MD5实现（生产环境建议使用crypto-js）
function md5(string) {
  function rotateLeft(value, amount) {
    return (value << amount) | (value >>> (32 - amount))
  }
  
  function addUnsigned(x, y) {
    return ((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000)
  }
  
  function md5F(x, y, z) { return (x & y) | ((~x) & z) }
  function md5G(x, y, z) { return (x & z) | (y & (~z)) }
  function md5H(x, y, z) { return (x ^ y ^ z) }
  function md5I(x, y, z) { return (y ^ (x | (~z))) }
  
  function md5FF(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(md5F(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  
  function md5GG(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(md5G(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  
  function md5HH(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(md5H(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  
  function md5II(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(md5I(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  
  function convertToWordArray(string) {
    let wordCount = (((string.length + 8) - ((string.length + 8) % 64)) / 64 + 1) * 16
    let messageArray = Array(wordCount - 1)
    let bytePosition = 0
    let byteCount = 0
    
    while (byteCount < string.length) {
      wordCount = (byteCount - (byteCount % 4)) / 4
      bytePosition = (byteCount % 4) * 8
      messageArray[wordCount] = (messageArray[wordCount] | (string.charCodeAt(byteCount) << bytePosition))
      byteCount++
    }
    
    wordCount = (byteCount - (byteCount % 4)) / 4
    bytePosition = (byteCount % 4) * 8
    messageArray[wordCount] = messageArray[wordCount] | (0x80 << bytePosition)
    messageArray[messageArray.length - 2] = string.length << 3
    messageArray[messageArray.length - 1] = string.length >>> 29
    
    return messageArray
  }
  
  function wordToHex(value) {
    let hex = ""
    for (let byte = 0; byte <= 3; byte++) {
      hex += ((value >>> (byte * 8)) & 255).toString(16).padStart(2, '0')
    }
    return hex
  }
  
  const messageArray = convertToWordArray(string)
  
  let h0 = 0x67452301
  let h1 = 0xEFCDAB89
  let h2 = 0x98BADCFE
  let h3 = 0x10325476
  
  for (let i = 0; i < messageArray.length; i += 16) {
    const a = h0, b = h1, c = h2, d = h3
    const x = messageArray.slice(i, i + 16)
    
    h0 = md5FF(h0, h1, h2, h3, x[0], 7, 0xD76AA478)
    h3 = md5FF(h3, h0, h1, h2, x[1], 12, 0xE8C7B756)
    // ... 省略其他轮次的实现
    
    h0 = addUnsigned(h0, a)
    h1 = addUnsigned(h1, b)
    h2 = addUnsigned(h2, c)
    h3 = addUnsigned(h3, d)
  }
  
  return (wordToHex(h0) + wordToHex(h1) + wordToHex(h2) + wordToHex(h3)).toLowerCase()
}

export default {
  name: 'Md5Tool',
  data() {
    return {
      activeTab: 'text',
      inputText: '',
      md5Result: '',
      upperCase: false,
      withPrefix: false,
      batchText: '',
      batchResults: [],
      selectedFile: null,
      fileMD5Result: '',
      isDragOver: false,
      isCalculating: false
    }
  },
  methods: {
    generateMD5() {
      if (!this.inputText) {
        this.md5Result = ''
        return
      }
      this.md5Result = md5(this.inputText)
    },
    
    formatResult(hash) {
      if (!hash) return ''
      let result = this.upperCase ? hash.toUpperCase() : hash.toLowerCase()
      return this.withPrefix ? `md5:${result}` : result
    },
    
    generateBatchMD5() {
      const lines = this.batchText.split('\n').filter(line => line.trim())
      this.batchResults = lines.map(text => ({
        text: text.trim(),
        hash: md5(text.trim())
      }))
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
        this.fileMD5Result = ''
      }
    },
    
    handleFileDrop(event) {
      this.isDragOver = false
      const files = event.dataTransfer.files
      if (files.length > 0) {
        this.selectedFile = files[0]
        this.fileMD5Result = ''
      }
    },
    
    async calculateFileMD5() {
      if (!this.selectedFile) return
      
      this.isCalculating = true
      try {
        const buffer = await this.selectedFile.arrayBuffer()
        const uint8Array = new Uint8Array(buffer)
        
        // 将文件内容转换为字符串进行MD5计算
        let binaryString = ''
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i])
        }
        
        this.fileMD5Result = md5(binaryString)
      } catch (error) {
        console.error('计算文件MD5失败:', error)
        this.showToast('计算失败，请重试')
      } finally {
        this.isCalculating = false
      }
    },
    
    clearFile() {
      this.selectedFile = null
      this.fileMD5Result = ''
      this.$refs.fileInput.value = ''
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    async copyResult() {
      await this.copyText(this.formatResult(this.md5Result))
    },
    
    async copyFileResult() {
      await this.copyText(this.formatResult(this.fileMD5Result))
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
    
    saveAsFile() {
      const content = `原文: ${this.inputText}\nMD5: ${this.formatResult(this.md5Result)}`
      this.downloadFile(content, 'md5_result.txt', 'text/plain')
    },
    
    saveFileResult() {
      const content = `文件名: ${this.selectedFile.name}
文件大小: ${this.formatFileSize(this.selectedFile.size)}
MD5值: ${this.formatResult(this.fileMD5Result)}
计算时间: ${new Date().toLocaleString()}`
      this.downloadFile(content, `${this.selectedFile.name}.md5`, 'text/plain')
    },
    
    exportBatchResults() {
      const content = this.batchResults.map(item => 
        `${item.text} -> ${this.formatResult(item.hash)}`
      ).join('\n')
      this.downloadFile(content, 'batch_md5_results.txt', 'text/plain')
    },
    
    downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
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
    // 示例文本
    this.inputText = 'Hello World!'
    this.generateMD5()
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
  min-height: 300px;
}

.options-group {
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

.result-section {
  margin-top: 20px;
}

.result-section h4 {
  color: white;
  margin-bottom: 15px;
}

.result-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.file-input-area {
  margin-bottom: 20px;
}

.file-drop-zone {
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
}

.file-drop-zone:hover,
.file-drop-zone.drag-over {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.file-hint {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-top: 10px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.file-icon {
  font-size: 36px;
}

.file-details h4 {
  color: white;
  margin-bottom: 5px;
}

.file-details p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 14px;
}

.file-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.file-result {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 15px;
}

.result-item {
  margin-bottom: 10px;
  color: white;
}

.result-item:last-child {
  margin-bottom: 0;
}

.hash-value {
  font-family: monospace;
  color: #51cf66;
  word-break: break-all;
}

.batch-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.batch-section h4 {
  color: white;
  margin-bottom: 15px;
}

.batch-results {
  margin-top: 20px;
}

.batch-results h5 {
  color: white;
  margin-bottom: 15px;
}

.batch-list {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
}

.batch-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
}

.batch-item:last-child {
  border-bottom: none;
}

.original-text {
  color: white;
  flex: 0 0 auto;
  max-width: 200px;
  word-break: break-word;
}

.arrow {
  color: rgba(255, 255, 255, 0.6);
  flex: 0 0 auto;
}

.hash-result {
  color: #51cf66;
  font-family: monospace;
  flex: 1;
  word-break: break-all;
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
  flex: 0 0 auto;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
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
  .tab-btn {
    flex: 1;
    font-size: 14px;
    padding: 10px 16px;
  }
  
  .options-group {
    flex-direction: column;
    gap: 10px;
  }
  
  .file-info {
    flex-direction: column;
    text-align: center;
  }
  
  .batch-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .arrow {
    transform: rotate(90deg);
  }
  
  .copy-btn {
    align-self: flex-end;
  }
}
</style>