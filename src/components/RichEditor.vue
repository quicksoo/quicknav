<template>
  <div class="container">
    <div class="card">
      <h2>📝 富文本编辑器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        功能强大的在线富文本编辑器，支持文本格式化、插入链接、图片等操作
      </p>
      
      <div class="editor-container">
        <div id="editor" ref="editor"></div>
      </div>
      
      <div class="editor-actions">
        <button class="btn" @click="getContent">获取内容</button>
        <button class="btn" @click="clearEditor">清空编辑器</button>
        <button class="btn" @click="exportHtml">导出HTML</button>
        <button class="btn" @click="loadSample">加载示例</button>
      </div>
      
      <div v-if="content" class="result-box">
        <h4>编辑器内容：</h4>
        <div class="content-preview" v-html="content"></div>
        <button class="btn-small" @click="copyContent">复制HTML</button>
      </div>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.snow.css'

export default {
  name: 'RichEditor',
  data() {
    return {
      quill: null,
      content: '',
      isLoading: false
    }
  },
  mounted() {
    this.initEditor()
  },
  beforeUnmount() {
    if (this.quill) {
      this.quill = null
    }
  },
  methods: {
    async initEditor() {
      this.isLoading = true
      try {
        // 动态导入Quill
        const { default: Quill } = await import('quill')
        
        // 创建Quill实例
        this.quill = new Quill(this.$refs.editor, {
          theme: 'snow',
          placeholder: '开始编写您的内容...',
          modules: {
            toolbar: {
              container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['blockquote', 'code-block'],
                ['clean']
              ]
            }
          }
        })
        
        // 监听内容变化
        this.quill.on('text-change', () => {
          this.content = this.quill.root.innerHTML
        })
        
        console.log('富文本编辑器初始化成功')
        
      } catch (error) {
        console.error('Failed to load Quill:', error)
        this.showFallbackEditor()
      } finally {
        this.isLoading = false
      }
    },
    
    showFallbackEditor() {
      this.$refs.editor.innerHTML = `
        <div class="fallback-editor">
          <p style="color: #f44336; margin-bottom: 10px;">富文本编辑器加载失败，使用简单文本框：</p>
          <textarea 
            id="fallback-textarea"
            placeholder="开始编写您的内容..." 
            style="width: 100%; height: 300px; padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; resize: vertical; font-family: inherit;"
          ></textarea>
        </div>
      `
      
      const textarea = this.$refs.editor.querySelector('#fallback-textarea')
      if (textarea) {
        textarea.addEventListener('input', (e) => {
          this.content = e.target.value.replace(/\n/g, '<br>')
        })
      }
    },
    
    getContent() {
      if (this.quill) {
        this.content = this.quill.root.innerHTML
        this.showToast('内容获取成功！')
      } else {
        const textarea = this.$refs.editor.querySelector('#fallback-textarea')
        if (textarea) {
          this.content = textarea.value.replace(/\n/g, '<br>')
          this.showToast('内容获取成功！')
        } else {
          this.showToast('请先在编辑器中输入内容')
        }
      }
    },
    
    clearEditor() {
      if (this.quill) {
        this.quill.setText('')
        this.content = ''
      } else {
        const textarea = this.$refs.editor.querySelector('#fallback-textarea')
        if (textarea) {
          textarea.value = ''
          this.content = ''
        }
      }
      this.showToast('编辑器已清空')
    },
    
    loadSample() {
      const sampleContent = `
        <h1>欢迎使用富文本编辑器</h1>
        <p>这是一个<strong>功能强大</strong>的在线富文本编辑器。</p>
        <h2>主要功能：</h2>
        <ul>
          <li><em>文本格式化</em>：<strong>粗体</strong>、<em>斜体</em>、<u>下划线</u></li>
          <li><span style="color: rgb(230, 0, 0);">颜色</span>和<span style="background-color: rgb(255, 255, 0);">背景色</span></li>
          <li>有序列表和无序列表</li>
          <li>链接和图片插入</li>
        </ul>
        <blockquote>
          这是一个引用块示例。
        </blockquote>
        <p><a href="https://quilljs.com" target="_blank">了解更多关于Quill的信息</a></p>
      `
      
      if (this.quill) {
        this.quill.root.innerHTML = sampleContent
        this.content = sampleContent
      } else {
        const textarea = this.$refs.editor.querySelector('#fallback-textarea')
        if (textarea) {
          textarea.value = sampleContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
          this.content = sampleContent
        }
      }
      this.showToast('示例内容已加载')
    },
    
    exportHtml() {
      this.getContent()
      if (this.content) {
        const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>富文本内容</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; margin: 40px; }
        h1, h2, h3 { color: #333; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
        ul, ol { padding-left: 24px; }
    </style>
</head>
<body>
${this.content}
</body>
</html>`
        
        const blob = new Blob([fullHtml], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `rich-content-${Date.now()}.html`
        a.click()
        URL.revokeObjectURL(url)
        this.showToast('HTML文件已导出！')
      } else {
        this.showToast('没有内容可导出')
      }
    },
    
    async copyContent() {
      if (!this.content) {
        this.showToast('没有内容可复制')
        return
      }
      
      try {
        await navigator.clipboard.writeText(this.content)
        this.showToast('HTML内容已复制到剪贴板！')
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
.editor-container {
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.editor-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.result-box {
  margin-top: 24px;
  padding: 16px;
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.result-box h4 {
  color: #37474f;
  margin-bottom: 12px;
  font-size: 16px;
}

.content-preview {
  background: white;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 12px;
  min-height: 100px;
  max-height: 400px;
  overflow-y: auto;
}

.btn-small {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s ease;
}

.btn-small:hover {
  background: #1976d2;
}

.fallback-editor {
  padding: 16px;
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

/* Quill编辑器样式覆盖 */
:deep(.ql-container) {
  border: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

:deep(.ql-editor) {
  min-height: 300px;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px;
}

:deep(.ql-toolbar) {
  border: none;
  border-bottom: 1px solid #e8e8e8;
  background: #f8f9fa;
}

:deep(.ql-toolbar .ql-formats) {
  margin-right: 15px;
}

:deep(.ql-snow .ql-tooltip) {
  background: white;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

:deep(.ql-snow .ql-picker-options) {
  background: white;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-actions {
    justify-content: center;
  }
  
  .btn {
    font-size: 12px;
    padding: 8px 16px;
  }
  
  :deep(.ql-toolbar) {
    padding: 8px;
  }
  
  :deep(.ql-toolbar .ql-formats) {
    margin-right: 8px;
  }
  
  :deep(.ql-editor) {
    min-height: 250px;
    padding: 12px;
  }
}

/* 内容预览样式 */
.content-preview h1 {
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
}

.content-preview h2 {
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.content-preview h3 {
  color: #666;
}

.content-preview blockquote {
  border-left: 4px solid #ddd;
  margin: 16px 0;
  padding-left: 16px;
  color: #666;
  font-style: italic;
}

.content-preview ul,
.content-preview ol {
  padding-left: 24px;
  margin: 12px 0;
}

.content-preview li {
  margin: 4px 0;
}

.content-preview a {
  color: #2196f3;
  text-decoration: none;
}

.content-preview a:hover {
  text-decoration: underline;
}

.content-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 8px 0;
}
</style>