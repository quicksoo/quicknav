<template>
  <div class="extension-icon-generator">
    <h2>🔌 扩展图标生成器</h2>
    <p class="tool-description">一键生成Chrome浏览器扩展所需的多种尺寸图标</p>
    
    <div class="generator-container">
      <div class="upload-section">
        <div class="upload-area" @dragover="handleDragOver" @drop="handleDrop" @click="triggerFileInput">
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelect" 
            accept="image/*" 
            style="display: none;"
          >
          <div class="upload-content">
            <div class="upload-icon">📁</div>
            <p>点击选择图片或拖拽图片到此处</p>
            <p class="upload-hint">支持 JPG、PNG、GIF 格式，建议尺寸 512x512 或更大</p>
          </div>
        </div>
      </div>
      
      <div v-if="originalImage" class="preview-section">
        <h3>原始图片预览</h3>
        <div class="original-preview">
          <img :src="originalImage" alt="原始图片" class="preview-image">
        </div>
      </div>
      
      <div v-if="generatedIcons.length > 0" class="results-section">
        <h3>生成结果</h3>
        <div class="icons-grid">
          <div 
            v-for="icon in generatedIcons" 
            :key="icon.size" 
            class="icon-item"
          >
            <div class="icon-preview">
              <img :src="icon.dataUrl" :alt="`${icon.size}x${icon.size}`" class="generated-icon">
            </div>
            <div class="icon-info">
              <span class="icon-size">{{ icon.size }}x{{ icon.size }}</span>
              <button @click="downloadIcon(icon)" class="download-btn">📥 下载</button>
            </div>
          </div>
        </div>
        <div class="download-all-section">
          <button @click="downloadAllIcons" class="download-all-btn">📦 全部下载 (ZIP)</button>
        </div>
      </div>
      
      <div v-if="originalImage && generatedIcons.length === 0" class="generate-section">
        <button @click="generateIcons" class="generate-btn">✨ 生成图标</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExtensionIconGenerator',
  data() {
    return {
      originalImage: null,
      generatedIcons: [],
      isGenerating: false
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    
    handleDragOver(event) {
      event.preventDefault()
      event.stopPropagation()
    },
    
    handleDrop(event) {
      event.preventDefault()
      event.stopPropagation()
      
      const files = event.dataTransfer.files
      if (files.length > 0) {
        this.processFile(files[0])
      }
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.processFile(file)
      }
    },
    
    processFile(file) {
      // 检查文件类型
      if (!file.type.match('image.*')) {
        alert('请选择图片文件')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        this.originalImage = e.target.result
        this.generatedIcons = []
      }
      reader.readAsDataURL(file)
    },
    
    generateIcons() {
      if (!this.originalImage) {
        alert('请先上传图片')
        return
      }
      
      this.isGenerating = true
      this.generatedIcons = []
      
      // 需要生成的图标尺寸
      const sizes = [16, 32, 48, 128, 256, 512]
      
      // 创建一个临时的canvas用于生成图标
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // 创建图片对象
      const img = new Image()
      img.onload = () => {
        // 为每个尺寸生成图标
        sizes.forEach(size => {
          canvas.width = size
          canvas.height = size
          
          // 清除画布
          ctx.clearRect(0, 0, size, size)
          
          // 绘制图片（保持比例并居中）
          const scale = Math.min(size / img.width, size / img.height)
          const scaledWidth = img.width * scale
          const scaledHeight = img.height * scale
          const x = (size - scaledWidth) / 2
          const y = (size - scaledHeight) / 2
          
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
          
          // 转换为数据URL
          const dataUrl = canvas.toDataURL('image/png')
          
          this.generatedIcons.push({
            size: size,
            dataUrl: dataUrl
          })
        })
        
        this.isGenerating = false
      }
      
      img.src = this.originalImage
    },
    
    downloadIcon(icon) {
      const link = document.createElement('a')
      link.href = icon.dataUrl
      link.download = `icon-${icon.size}x${icon.size}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    
    async downloadAllIcons() {
      try {
        // 动态导入JSZip库
        const JSZip = (await import('jszip')).default
        const zip = new JSZip()
        
        // 添加所有图标到ZIP文件
        this.generatedIcons.forEach(icon => {
          // 从data URL提取base64数据
          const base64Data = icon.dataUrl.split(',')[1]
          zip.file(`icon-${icon.size}x${icon.size}.png`, base64Data, {base64: true})
        })
        
        // 生成ZIP文件并下载
        const content = await zip.generateAsync({type: 'blob'})
        const link = document.createElement('a')
        link.href = URL.createObjectURL(content)
        link.download = 'extension-icons.zip'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error('下载ZIP文件失败:', error)
        alert('下载ZIP文件失败，请单独下载每个图标')
      }
    }
  }
}
</script>

<style scoped>
.extension-icon-generator {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tool-description {
  color: #666;
  font-size: 16px;
  margin-bottom: 30px;
  text-align: center;
}

.generator-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.upload-section {
  display: flex;
  justify-content: center;
}

.upload-area {
  width: 100%;
  max-width: 500px;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.upload-area:hover {
  border-color: #2196f3;
  background: #e3f2fd;
}

.upload-content {
  text-align: center;
  padding: 20px;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-content p {
  margin: 10px 0;
  color: #555;
}

.upload-hint {
  font-size: 14px;
  color: #888;
}

.preview-section h3,
.results-section h3,
.generate-section {
  text-align: center;
  color: #333;
}

.original-preview {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.preview-image {
  max-width: 300px;
  max-height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.icon-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.icon-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-preview {
  margin-bottom: 10px;
}

.generated-icon {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.icon-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.icon-size {
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.download-btn {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s ease;
}

.download-btn:hover {
  background: #45a049;
}

.download-all-section {
  text-align: center;
  margin: 20px 0;
}

.download-all-btn {
  background: linear-gradient(135deg, #2196f3, #21cbf3);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-all-btn:hover {
  background: linear-gradient(135deg, #1976d2, #0ba4d9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.generate-section {
  text-align: center;
}

.generate-btn {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 15px 30px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn:hover {
  background: linear-gradient(135deg, #f57c00, #e64a19);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

@media (max-width: 768px) {
  .extension-icon-generator {
    padding: 15px;
  }
  
  .icons-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
  }
  
  .upload-area {
    height: 150px;
  }
  
  .preview-image {
    max-width: 200px;
    max-height: 200px;
  }
}
</style>