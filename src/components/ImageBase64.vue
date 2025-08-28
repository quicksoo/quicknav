<template>
  <div class="container">
    <div class="card">
      <h2>🖼️ 图片Base64转换器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        在线图片与Base64编码互转工具，支持多种图片格式
      </p>
      
      <div class="converter-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'toBase64' }"
          @click="activeTab = 'toBase64'"
        >
          📷 图片转Base64
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'toImage' }"
          @click="activeTab = 'toImage'"
        >
          🔄 Base64转图片
        </button>
      </div>
      
      <!-- 图片转Base64 -->
      <div v-if="activeTab === 'toBase64'" class="tab-content">
        <div class="upload-section">
          <div class="upload-area" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileSelect" 
              accept="image/*"
              multiple
              class="file-input"
            >
            <div class="upload-content">
              <div class="upload-icon">📁</div>
              <h4>选择或拖拽图片文件</h4>
              <p>支持 JPG、PNG、GIF、WEBP、SVG 等格式</p>
              <button class="upload-btn" @click="$refs.fileInput.click()">选择文件</button>
            </div>
          </div>
          
          <div v-if="selectedFiles.length > 0" class="file-list">
            <h4>已选择的文件：</h4>
            <div class="file-items">
              <div 
                v-for="(file, index) in selectedFiles" 
                :key="index"
                class="file-item"
              >
                <div class="file-info">
                  <span class="file-name">{{ file.name }}</span>
                  <span class="file-size">{{ formatFileSize(file.size) }}</span>
                  <span class="file-type">{{ file.type }}</span>
                </div>
                <button class="remove-btn" @click="removeFile(index)">❌</button>
              </div>
            </div>
            <div class="batch-actions">
              <button class="btn" @click="convertAllToBase64">🔄 转换全部</button>
              <button class="btn" @click="clearFiles">🗑️ 清空</button>
            </div>
          </div>
        </div>
        
        <div v-if="base64Results.length > 0" class="results-section">
          <h4>转换结果：</h4>
          <div class="result-items">
            <div 
              v-for="(result, index) in base64Results" 
              :key="index"
              class="result-item"
            >
              <div class="result-header">
                <h5>{{ result.fileName }}</h5>
                <div class="result-actions">
                  <button class="action-btn" @click="copyBase64(result.base64)" title="复制">📋</button>
                  <button class="action-btn" @click="downloadBase64(result)" title="下载">💾</button>
                  <button class="action-btn" @click="removeResult(index)" title="删除">❌</button>
                </div>
              </div>
              
              <div class="result-content">
                <div class="image-preview">
                  <img :src="result.dataUrl" :alt="result.fileName" />
                  <div class="image-info">
                    <div class="info-item">尺寸: {{ result.dimensions }}</div>
                    <div class="info-item">大小: {{ result.fileSize }}</div>
                    <div class="info-item">Base64长度: {{ result.base64.length }} 字符</div>
                  </div>
                </div>
                
                <div class="base64-output">
                  <div class="output-header">
                    <span>Base64编码:</span>
                    <div class="format-options">
                      <label>
                        <input type="radio" :value="'raw'" v-model="result.format" @change="updateBase64Format(result)">
                        <span>纯编码</span>
                      </label>
                      <label>
                        <input type="radio" :value="'dataUrl'" v-model="result.format" @change="updateBase64Format(result)">
                        <span>Data URL</span>
                      </label>
                      <label>
                        <input type="radio" :value="'css'" v-model="result.format" @change="updateBase64Format(result)">
                        <span>CSS背景</span>
                      </label>
                      <label>
                        <input type="radio" :value="'html'" v-model="result.format" @change="updateBase64Format(result)">
                        <span>HTML标签</span>
                      </label>
                    </div>
                  </div>
                  <textarea 
                    :value="result.formattedOutput" 
                    readonly 
                    rows="6"
                    class="base64-textarea"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Base64转图片 -->
      <div v-if="activeTab === 'toImage'" class="tab-content">
        <div class="input-section">
          <label>Base64编码输入：</label>
          <textarea 
            v-model="base64Input" 
            @input="parseBase64"
            placeholder="请粘贴Base64编码或Data URL..."
            rows="8"
            class="base64-input"
          ></textarea>
          
          <div class="input-actions">
            <button class="btn" @click="parseBase64">🔄 解析</button>
            <button class="btn" @click="clearBase64Input">🗑️ 清空</button>
            <button class="btn" @click="loadBase64Sample">📋 加载示例</button>
          </div>
        </div>
        
        <div v-if="parsedImage" class="parsed-result">
          <h4>解析结果：</h4>
          <div class="parsed-content">
            <div class="parsed-preview">
              <img :src="parsedImage.dataUrl" :alt="'解析的图片'" />
              <div class="parsed-info">
                <div class="info-item">格式: {{ parsedImage.format }}</div>
                <div class="info-item">尺寸: {{ parsedImage.dimensions }}</div>
                <div class="info-item">大小: {{ parsedImage.size }}</div>
              </div>
            </div>
            
            <div class="parsed-actions">
              <button class="btn" @click="downloadParsedImage">💾 下载图片</button>
              <button class="btn" @click="copyParsedImage">📋 复制图片</button>
              <button class="btn" @click="saveParsedAsBase64">💾 保存为Base64</button>
            </div>
          </div>
        </div>
        
        <div v-if="base64Error" class="error-message">
          <p>{{ base64Error }}</p>
        </div>
      </div>
      
      <div class="info-section">
        <h4>使用说明：</h4>
        <div class="info-content">
          <div class="info-column">
            <h5>支持的格式：</h5>
            <ul>
              <li>JPEG / JPG - 常用照片格式</li>
              <li>PNG - 支持透明背景</li>
              <li>GIF - 支持动画</li>
              <li>WEBP - 现代压缩格式</li>
              <li>SVG - 矢量图形</li>
              <li>BMP - 位图格式</li>
            </ul>
          </div>
          
          <div class="info-column">
            <h5>应用场景：</h5>
            <ul>
              <li>Web开发中的图片内联</li>
              <li>移动应用的图片资源</li>
              <li>邮件HTML中的图片</li>
              <li>API数据传输</li>
              <li>离线应用的图片缓存</li>
              <li>小图标的CSS嵌入</li>
            </ul>
          </div>
          
          <div class="info-column">
            <h5>注意事项：</h5>
            <ul>
              <li>Base64编码后体积增加约33%</li>
              <li>大图片编码后数据量很大</li>
              <li>建议小图片(< 50KB)使用</li>
              <li>浏览器对Data URL长度有限制</li>
              <li>Base64不支持图片缓存</li>
              <li>动画GIF可能无法完整显示</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageBase64Converter',
  data() {
    return {
      activeTab: 'toBase64',
      selectedFiles: [],
      base64Results: [],
      base64Input: '',
      parsedImage: null,
      base64Error: ''
    }
  },
  methods: {
    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      this.selectedFiles = [...this.selectedFiles, ...files]
    },
    
    handleDrop(event) {
      event.preventDefault()
      const files = Array.from(event.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      )
      this.selectedFiles = [...this.selectedFiles, ...files]
    },
    
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
    },
    
    clearFiles() {
      this.selectedFiles = []
      this.$refs.fileInput.value = ''
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    async convertAllToBase64() {
      for (const file of this.selectedFiles) {
        await this.convertFileToBase64(file)
      }
      this.clearFiles()
    },
    
    async convertFileToBase64(file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target.result.split(',')[1]
          const dataUrl = e.target.result
          
          // 获取图片尺寸
          const img = new Image()
          img.onload = () => {
            const result = {
              fileName: file.name,
              fileSize: this.formatFileSize(file.size),
              dimensions: `${img.width} × ${img.height}`,
              base64: base64,
              dataUrl: dataUrl,
              mimeType: file.type,
              format: 'dataUrl',
              formattedOutput: dataUrl
            }
            
            this.base64Results.push(result)
            resolve(result)
          }
          img.src = dataUrl
        }
        reader.readAsDataURL(file)
      })
    },
    
    updateBase64Format(result) {
      switch (result.format) {
        case 'raw':
          result.formattedOutput = result.base64
          break
        case 'dataUrl':
          result.formattedOutput = result.dataUrl
          break
        case 'css':
          result.formattedOutput = `background-image: url('${result.dataUrl}');`
          break
        case 'html':
          result.formattedOutput = `<img src="${result.dataUrl}" alt="${result.fileName}" />`
          break
      }
    },
    
    async copyBase64(base64) {
      try {
        await navigator.clipboard.writeText(base64)
        this.showToast('Base64编码已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    downloadBase64(result) {
      const content = `文件名: ${result.fileName}
格式: ${result.mimeType}
尺寸: ${result.dimensions}
大小: ${result.fileSize}
Base64长度: ${result.base64.length} 字符

Base64编码:
${result.base64}

Data URL:
${result.dataUrl}
`
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${result.fileName}_base64.txt`
      link.click()
      URL.revokeObjectURL(url)
    },
    
    removeResult(index) {
      this.base64Results.splice(index, 1)
    },
    
    parseBase64() {
      this.base64Error = ''
      this.parsedImage = null
      
      if (!this.base64Input.trim()) {
        this.base64Error = '请输入Base64编码'
        return
      }
      
      try {
        let dataUrl = this.base64Input.trim()
        
        // 如果不是Data URL格式，尝试添加前缀
        if (!dataUrl.startsWith('data:')) {
          // 尝试检测图片格式
          const firstChars = dataUrl.substring(0, 10)
          let mimeType = 'image/png' // 默认
          
          if (firstChars.startsWith('/9j/')) {
            mimeType = 'image/jpeg'
          } else if (firstChars.startsWith('iVBORw0KGgo')) {
            mimeType = 'image/png'
          } else if (firstChars.startsWith('R0lGODlh') || firstChars.startsWith('R0lGODdh')) {
            mimeType = 'image/gif'
          } else if (firstChars.startsWith('UklGR')) {
            mimeType = 'image/webp'
          }
          
          dataUrl = `data:${mimeType};base64,${dataUrl}`
        }
        
        // 验证Base64编码
        const base64Part = dataUrl.split(',')[1]
        if (!base64Part) {
          throw new Error('无效的Base64格式')
        }
        
        // 创建图片元素测试
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          
          // 计算文件大小
          const sizeInBytes = Math.round((base64Part.length * 3) / 4)
          
          this.parsedImage = {
            dataUrl: dataUrl,
            format: dataUrl.match(/data:image\/([^;]+)/)?.[1] || 'unknown',
            dimensions: `${img.width} × ${img.height}`,
            size: this.formatFileSize(sizeInBytes),
            canvas: canvas
          }
        }
        
        img.onerror = () => {
          this.base64Error = '无法解析图片，请检查Base64编码是否正确'
        }
        
        img.src = dataUrl
        
      } catch (error) {
        this.base64Error = `解析失败: ${error.message}`
      }
    },
    
    downloadParsedImage() {
      if (!this.parsedImage) return
      
      const link = document.createElement('a')
      link.href = this.parsedImage.dataUrl
      link.download = `parsed_image_${Date.now()}.${this.parsedImage.format}`
      link.click()
    },
    
    async copyParsedImage() {
      if (!this.parsedImage || !this.parsedImage.canvas) return
      
      try {
        this.parsedImage.canvas.toBlob(async (blob) => {
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
          ])
          this.showToast('图片已复制到剪贴板！')
        })
      } catch (error) {
        this.showToast('复制失败，请使用下载功能')
      }
    },
    
    saveParsedAsBase64() {
      if (!this.parsedImage) return
      
      const base64Part = this.parsedImage.dataUrl.split(',')[1]
      const content = `解析的图片Base64编码
格式: ${this.parsedImage.format}
尺寸: ${this.parsedImage.dimensions}
大小: ${this.parsedImage.size}
生成时间: ${new Date().toLocaleString()}

Base64编码:
${base64Part}

Data URL:
${this.parsedImage.dataUrl}
`
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `parsed_image_base64_${Date.now()}.txt`
      link.click()
      URL.revokeObjectURL(url)
    },
    
    clearBase64Input() {
      this.base64Input = ''
      this.parsedImage = null
      this.base64Error = ''
    },
    
    loadBase64Sample() {
      // 一个小的示例PNG图片的Base64编码
      this.base64Input = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      this.parseBase64()
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
.converter-tabs {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #e8e8e8;
}

.tab-btn {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 14px;
  color: #78909c;
  transition: all 0.2s ease;
}

.tab-btn.active {
  color: #2196f3;
  border-bottom-color: #2196f3;
}

.tab-btn:hover:not(.active) {
  color: #37474f;
}

.tab-content {
  min-height: 400px;
}

.upload-section {
  margin-bottom: 30px;
}

.upload-area {
  border: 2px dashed #e8e8e8;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 20px;
}

.upload-area:hover {
  border-color: #2196f3;
  background: #f0f7ff;
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  font-size: 48px;
  color: #78909c;
}

.upload-content h4 {
  color: #37474f;
  margin: 0;
}

.upload-content p {
  color: #78909c;
  margin: 0;
  font-size: 14px;
}

.upload-btn {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.upload-btn:hover {
  background: #1976d2;
}

.file-list h4 {
  color: #37474f;
  margin-bottom: 12px;
}

.file-items {
  margin-bottom: 16px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 8px;
  background: #f8f9fa;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-weight: 500;
  color: #37474f;
}

.file-size, .file-type {
  font-size: 12px;
  color: #78909c;
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.remove-btn:hover {
  background: #ffebee;
}

.batch-actions {
  display: flex;
  gap: 8px;
}

.results-section, .parsed-result {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.results-section h4, .parsed-result h4 {
  color: #37474f;
  margin-bottom: 20px;
}

.result-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.result-header h5 {
  margin: 0;
  color: #37474f;
  font-size: 14px;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: transparent;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e8e8e8;
}

.result-content {
  padding: 16px;
}

.image-preview {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  object-fit: contain;
}

.image-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item {
  font-size: 14px;
  color: #78909c;
}

.base64-output {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
  flex-wrap: wrap;
  gap: 12px;
}

.format-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.format-options label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  cursor: pointer;
}

.base64-textarea {
  width: 100%;
  border: none;
  resize: vertical;
  padding: 12px;
  font-family: monospace;
  font-size: 12px;
  outline: none;
  background: white;
}

.input-section {
  margin-bottom: 20px;
}

.input-section label {
  display: block;
  margin-bottom: 8px;
  color: #37474f;
  font-weight: 500;
}

.base64-input {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  font-family: monospace;
  font-size: 13px;
  resize: vertical;
  margin-bottom: 12px;
}

.input-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.parsed-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.parsed-preview {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.parsed-preview img {
  max-width: 300px;
  max-height: 300px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  object-fit: contain;
}

.parsed-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.parsed-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.error-message {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
  padding: 12px;
  color: #c62828;
  margin-top: 12px;
}

.info-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.info-section h4 {
  color: #37474f;
  margin-bottom: 20px;
}

.info-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-column h5 {
  color: #37474f;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-column li {
  padding: 4px 0;
  color: #78909c;
  font-size: 13px;
  position: relative;
  padding-left: 16px;
}

.info-column li::before {
  content: '•';
  color: #2196f3;
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .image-preview, .parsed-preview {
    flex-direction: column;
  }
  
  .output-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .format-options {
    flex-direction: column;
    gap: 8px;
  }
  
  .info-content {
    grid-template-columns: 1fr;
  }
}
</style>