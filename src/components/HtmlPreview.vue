<template>
  <div class="container">
    <div class="card">
      <h2>🌐 HTML代码调试预览</h2>
      <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
        在线HTML代码编辑器和实时预览工具，支持HTML、CSS、JavaScript代码调试
      </p>
      
      <div class="editor-layout">
        <div class="editor-panel">
          <div class="editor-tabs">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'html' }"
              @click="activeTab = 'html'"
            >
              HTML
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'css' }"
              @click="activeTab = 'css'"
            >
              CSS
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'js' }"
              @click="activeTab = 'js'"
            >
              JavaScript
            </button>
          </div>
          
          <div class="editor-content">
            <textarea
              v-if="activeTab === 'html'"
              v-model="htmlCode"
              placeholder="在这里输入HTML代码..."
              @input="updatePreview"
              class="code-editor"
            ></textarea>
            
            <textarea
              v-if="activeTab === 'css'"
              v-model="cssCode"
              placeholder="在这里输入CSS样式..."
              @input="updatePreview"
              class="code-editor"
            ></textarea>
            
            <textarea
              v-if="activeTab === 'js'"
              v-model="jsCode"
              placeholder="在这里输入JavaScript代码..."
              @input="updatePreview"
              class="code-editor"
            ></textarea>
          </div>
          
          <div class="editor-actions">
            <button class="btn" @click="updatePreview">刷新预览</button>
            <button class="btn" @click="clearCode">清空代码</button>
            <button class="btn" @click="loadTemplate">加载模板</button>
            <button class="btn" @click="exportHtml">导出HTML</button>
          </div>
        </div>
        
        <div class="preview-panel">
          <div class="preview-header">
            <h4>实时预览</h4>
            <div class="preview-actions">
              <button class="btn-small" @click="toggleFullscreen">全屏</button>
              <button class="btn-small" @click="openInNewWindow">新窗口</button>
            </div>
          </div>
          
          <div class="preview-content" :class="{ fullscreen: isFullscreen }">
            <iframe
              ref="previewFrame"
              class="preview-iframe"
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
          </div>
        </div>
      </div>
      
      <div class="code-templates">
        <h3>代码模板</h3>
        <div class="template-grid">
          <div 
            v-for="template in templates" 
            :key="template.name"
            class="template-card"
            @click="loadTemplateCode(template)"
          >
            <h4>{{ template.name }}</h4>
            <p>{{ template.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HtmlPreview',
  data() {
    return {
      activeTab: 'html',
      isFullscreen: false,
      htmlCode: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML预览</title>
</head>
<body>
    <h1>欢迎使用HTML代码预览工具</h1>
    <p>在左侧编辑器中修改代码，右侧会实时显示预览效果。</p>
    <button onclick="alert('Hello World!')">点击我</button>
</body>
</html>`,
      cssCode: `body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

h1 {
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}`,
      jsCode: `// JavaScript 代码示例
console.log('页面已加载');

// 添加交互功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成');
    
    // 可以在这里添加你的JavaScript代码
    const button = document.querySelector('button');
    if (button) {
        button.addEventListener('click', function() {
            console.log('按钮被点击了');
        });
    }
});`,
      templates: [
        {
          name: '基础页面',
          description: '包含基本HTML结构的模板',
          html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>基础页面</title>
</head>
<body>
    <header>
        <h1>网站标题</h1>
        <nav>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section>
            <h2>主要内容</h2>
            <p>这里是主要内容区域。</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 我的网站</p>
    </footer>
</body>
</html>`,
          css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: #333;
    color: white;
    padding: 1rem;
}

nav ul {
    list-style: none;
    display: flex;
    gap: 20px;
}

nav a {
    color: white;
    text-decoration: none;
}

main {
    padding: 2rem;
    min-height: 60vh;
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 1rem;
}`,
          js: `console.log('基础页面模板加载完成');`
        },
        {
          name: 'CSS动画',
          description: '展示CSS动画效果的模板',
          html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS动画演示</title>
</head>
<body>
    <div class="container">
        <h1 class="animated-title">CSS 动画演示</h1>
        <div class="animated-box"></div>
        <button class="animated-button">悬停我</button>
    </div>
</body>
</html>`,
          css: `body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(45deg, #667eea, #764ba2);
    font-family: Arial, sans-serif;
}

.container {
    text-align: center;
    color: white;
}

.animated-title {
    animation: fadeInDown 1s ease-out;
    margin-bottom: 30px;
}

.animated-box {
    width: 100px;
    height: 100px;
    background: white;
    margin: 20px auto;
    border-radius: 10px;
    animation: rotate 2s linear infinite;
}

.animated-button {
    padding: 12px 24px;
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid white;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 20px;
}

.animated-button:hover {
    background: white;
    color: #667eea;
    transform: scale(1.1);
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}`,
          js: `console.log('CSS动画演示页面');`
        },
        {
          name: '表单样式',
          description: '美观的表单设计模板',
          html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>表单样式演示</title>
</head>
<body>
    <div class="form-container">
        <h2>联系我们</h2>
        <form class="contact-form">
            <div class="form-group">
                <label for="name">姓名</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">邮箱</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="message">消息</label>
                <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            
            <button type="submit">发送消息</button>
        </form>
    </div>
</body>
</html>`,
          css: `body {
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: Arial, sans-serif;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-container {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    padding: 40px;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 500px;
}

h2 {
    color: white;
    text-align: center;
    margin-bottom: 30px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    color: white;
    margin-bottom: 5px;
    font-weight: 500;
}

input, textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 8px;
    background: rgba(255,255,255,0.1);
    color: white;
    font-size: 16px;
}

input::placeholder, textarea::placeholder {
    color: rgba(255,255,255,0.6);
}

button {
    width: 100%;
    padding: 15px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}`,
          js: `document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('表单提交成功！（这只是演示）');
    });
});`
        }
      ]
    }
  },
  mounted() {
    this.updatePreview()
  },
  methods: {
    updatePreview() {
      const iframe = this.$refs.previewFrame
      if (!iframe) return
      
      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${this.cssCode}</style>
</head>
<body>
  ${this.htmlCode.replace(/<html.*?>.*?<body.*?>/is, '').replace(/<\/body>.*?<\/html>/is, '')}
  <script>
    try {
      ${this.jsCode}
    } catch(e) {
      console.error('JavaScript执行错误:', e);
    }
  <\/script>
</body>
</html>`
      
      const doc = iframe.contentDocument || iframe.contentWindow.document
      doc.open()
      doc.write(fullHtml)
      doc.close()
    },
    
    clearCode() {
      if (this.activeTab === 'html') {
        this.htmlCode = ''
      } else if (this.activeTab === 'css') {
        this.cssCode = ''
      } else if (this.activeTab === 'js') {
        this.jsCode = ''
      }
      this.updatePreview()
    },
    
    loadTemplate() {
      this.loadTemplateCode(this.templates[0])
    },
    
    loadTemplateCode(template) {
      this.htmlCode = template.html
      this.cssCode = template.css
      this.jsCode = template.js
      this.updatePreview()
      this.showToast(`${template.name} 模板已加载`)
    },
    
    exportHtml() {
      const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>导出的HTML页面</title>
    <style>
${this.cssCode}
    </style>
</head>
<body>
${this.htmlCode.replace(/<html.*?>.*?<body.*?>/is, '').replace(/<\/body>.*?<\/html>/is, '')}
    
    <script>
${this.jsCode}
    <\/script>
</body>
</html>`
      
      const blob = new Blob([fullHtml], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = 'preview.html'
      a.click()
      
      URL.revokeObjectURL(url)
    },
    
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen
    },
    
    openInNewWindow() {
      const newWindow = window.open('', '_blank', 'width=800,height=600')
      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${this.cssCode}</style>
</head>
<body>
  ${this.htmlCode.replace(/<html.*?>.*?<body.*?>/is, '').replace(/<\/body>.*?<\/html>/is, '')}
  <script>${this.jsCode}<\/script>
</body>
</html>`
      
      newWindow.document.write(fullHtml)
      newWindow.document.close()
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
  }
}
</script>

<style scoped>
.editor-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
  min-height: 500px;
}

.editor-panel,
.preview-panel {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.editor-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.tab-btn.active {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-bottom-color: #667eea;
}

.editor-content {
  height: 350px;
}

.code-editor {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  color: white;
  padding: 20px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
}

.code-editor::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.editor-actions {
  display: flex;
  gap: 10px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-header h4 {
  color: white;
  margin: 0;
}

.preview-actions {
  display: flex;
  gap: 10px;
}

.btn-small {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.btn-small:hover {
  background: rgba(255, 255, 255, 0.2);
}

.preview-content {
  height: 350px;
  position: relative;
}

.preview-content.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  height: 100vh;
  background: black;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.code-templates {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.code-templates h3 {
  color: white;
  margin-bottom: 20px;
  text-align: center;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.template-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.template-card h4 {
  color: white;
  margin-bottom: 10px;
}

.template-card p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
  
  .editor-actions {
    justify-content: center;
  }
  
  .preview-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .template-grid {
    grid-template-columns: 1fr;
  }
}
</style>