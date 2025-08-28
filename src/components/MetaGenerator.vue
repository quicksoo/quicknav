<template>
  <div class="container">
    <div class="card">
      <h2>🏷️ Meta标签生成器</h2>
      <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
        网页Meta标签在线生成工具，帮助您快速生成SEO友好的Meta标签
      </p>
      
      <div class="meta-form">
        <h3>基本信息</h3>
        <div class="form-grid">
          <div class="input-group">
            <label>网站标题 (Title)</label>
            <input type="text" v-model="meta.title" placeholder="请输入网站标题">
            <span class="help-text">建议长度：50-60个字符</span>
          </div>
          
          <div class="input-group">
            <label>网站描述 (Description)</label>
            <textarea v-model="meta.description" placeholder="请输入网站描述" rows="3"></textarea>
            <span class="help-text">建议长度：150-160个字符</span>
          </div>
          
          <div class="input-group">
            <label>关键词 (Keywords)</label>
            <input type="text" v-model="meta.keywords" placeholder="关键词1,关键词2,关键词3">
            <span class="help-text">用逗号分隔多个关键词</span>
          </div>
          
          <div class="input-group">
            <label>网站作者 (Author)</label>
            <input type="text" v-model="meta.author" placeholder="请输入作者名称">
          </div>
          
          <div class="input-group">
            <label>网站语言 (Language)</label>
            <select v-model="meta.language">
              <option value="zh-CN">中文(简体)</option>
              <option value="zh-TW">中文(繁体)</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
            </select>
          </div>
          
          <div class="input-group">
            <label>字符编码 (Charset)</label>
            <select v-model="meta.charset">
              <option value="UTF-8">UTF-8</option>
              <option value="ISO-8859-1">ISO-8859-1</option>
              <option value="GB2312">GB2312</option>
            </select>
          </div>
        </div>
        
        <h3>SEO和社交媒体</h3>
        <div class="form-grid">
          <div class="input-group">
            <label>网站URL</label>
            <input type="url" v-model="meta.url" placeholder="https://example.com">
          </div>
          
          <div class="input-group">
            <label>网站图片 (用于社交分享)</label>
            <input type="url" v-model="meta.image" placeholder="https://example.com/image.jpg">
          </div>
          
          <div class="input-group">
            <label>网站类型</label>
            <select v-model="meta.type">
              <option value="website">网站</option>
              <option value="article">文章</option>
              <option value="blog">博客</option>
              <option value="product">产品</option>
              <option value="profile">个人资料</option>
            </select>
          </div>
          
          <div class="input-group">
            <label>Twitter卡片类型</label>
            <select v-model="meta.twitterCard">
              <option value="summary">摘要</option>
              <option value="summary_large_image">大图摘要</option>
              <option value="app">应用</option>
              <option value="player">播放器</option>
            </select>
          </div>
          
          <div class="input-group">
            <label>Twitter用户名</label>
            <input type="text" v-model="meta.twitterSite" placeholder="@username">
          </div>
          
          <div class="input-group">
            <label>网站分类</label>
            <input type="text" v-model="meta.category" placeholder="科技,教育,娱乐">
          </div>
        </div>
        
        <h3>其他设置</h3>
        <div class="form-grid">
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="meta.viewport">
              <span>响应式视口 (Viewport)</span>
            </label>
          </div>
          
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="meta.robots">
              <span>搜索引擎索引 (Robots)</span>
            </label>
          </div>
          
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="meta.googleSiteVerification">
              <span>Google站点验证</span>
            </label>
          </div>
          
          <div class="input-group" v-if="meta.googleSiteVerification">
            <label>Google验证码</label>
            <input type="text" v-model="meta.googleVerificationCode" placeholder="验证码">
          </div>
        </div>
      </div>
      
      <div class="preview-section">
        <h3>生成的Meta标签</h3>
        <div class="code-output">
          <pre><code>{{ generatedMetaTags }}</code></pre>
        </div>
        
        <div class="actions">
          <button class="btn" @click="copyMetaTags">复制Meta标签</button>
          <button class="btn" @click="downloadHtml">下载HTML文件</button>
          <button class="btn" @click="previewSeo">SEO预览</button>
        </div>
      </div>
      
      <div v-if="showSeoPreview" class="seo-preview">
        <h3>SEO预览效果</h3>
        <div class="search-result">
          <h4 class="search-title">{{ meta.title || '网站标题' }}</h4>
          <div class="search-url">{{ meta.url || 'https://example.com' }}</div>
          <p class="search-description">{{ meta.description || '网站描述将显示在这里...' }}</p>
        </div>
        
        <div class="social-preview">
          <h4>社交媒体预览</h4>
          <div class="social-card">
            <div class="social-image" :style="{ backgroundImage: meta.image ? `url(${meta.image})` : 'linear-gradient(45deg, #667eea, #764ba2)' }"></div>
            <div class="social-content">
              <h5>{{ meta.title || '网站标题' }}</h5>
              <p>{{ meta.description || '网站描述' }}</p>
              <span>{{ meta.url || 'example.com' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetaGenerator',
  data() {
    return {
      showSeoPreview: false,
      meta: {
        title: '编程工具导航 - 开发者必备在线工具集',
        description: '一站式编程开发工具集合，提供富文本编辑、JSON处理、Base64编解码、UUID生成、MD5加密等实用工具',
        keywords: '编程工具,在线工具,JSON工具,Base64,UUID生成器,MD5加密',
        author: '开发者',
        language: 'zh-CN',
        charset: 'UTF-8',
        url: 'https://tools.example.com',
        image: '',
        type: 'website',
        twitterCard: 'summary_large_image',
        twitterSite: '@tools',
        category: '工具,编程,开发',
        viewport: true,
        robots: true,
        googleSiteVerification: false,
        googleVerificationCode: ''
      }
    }
  },
  computed: {
    generatedMetaTags() {
      let tags = []
      
      // 基本标签
      if (this.meta.charset) {
        tags.push(`<meta charset="${this.meta.charset}">`)
      }
      
      if (this.meta.viewport) {
        tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`)
      }
      
      if (this.meta.title) {
        tags.push(`<title>${this.meta.title}</title>`)
      }
      
      if (this.meta.description) {
        tags.push(`<meta name="description" content="${this.meta.description}">`)
      }
      
      if (this.meta.keywords) {
        tags.push(`<meta name="keywords" content="${this.meta.keywords}">`)
      }
      
      if (this.meta.author) {
        tags.push(`<meta name="author" content="${this.meta.author}">`)
      }
      
      if (this.meta.language) {
        tags.push(`<meta name="language" content="${this.meta.language}">`)
        tags.push(`<html lang="${this.meta.language}">`)
      }
      
      if (this.meta.robots) {
        tags.push(`<meta name="robots" content="index, follow">`)
      }
      
      // Open Graph 标签
      if (this.meta.title) {
        tags.push(`<meta property="og:title" content="${this.meta.title}">`)
      }
      
      if (this.meta.description) {
        tags.push(`<meta property="og:description" content="${this.meta.description}">`)
      }
      
      if (this.meta.type) {
        tags.push(`<meta property="og:type" content="${this.meta.type}">`)
      }
      
      if (this.meta.url) {
        tags.push(`<meta property="og:url" content="${this.meta.url}">`)
      }
      
      if (this.meta.image) {
        tags.push(`<meta property="og:image" content="${this.meta.image}">`)
      }
      
      // Twitter 标签
      if (this.meta.twitterCard) {
        tags.push(`<meta name="twitter:card" content="${this.meta.twitterCard}">`)
      }
      
      if (this.meta.twitterSite) {
        tags.push(`<meta name="twitter:site" content="${this.meta.twitterSite}">`)
      }
      
      if (this.meta.title) {
        tags.push(`<meta name="twitter:title" content="${this.meta.title}">`)
      }
      
      if (this.meta.description) {
        tags.push(`<meta name="twitter:description" content="${this.meta.description}">`)
      }
      
      if (this.meta.image) {
        tags.push(`<meta name="twitter:image" content="${this.meta.image}">`)
      }
      
      // 其他标签
      if (this.meta.category) {
        tags.push(`<meta name="category" content="${this.meta.category}">`)
      }
      
      if (this.meta.googleSiteVerification && this.meta.googleVerificationCode) {
        tags.push(`<meta name="google-site-verification" content="${this.meta.googleVerificationCode}">`)
      }
      
      return tags.join('\n')
    }
  },
  methods: {
    async copyMetaTags() {
      try {
        await navigator.clipboard.writeText(this.generatedMetaTags)
        this.showToast('Meta标签已复制到剪贴板！')
      } catch (error) {
        console.error('复制失败:', error)
        this.showToast('复制失败，请手动复制')
      }
    },
    
    downloadHtml() {
      const htmlTemplate = `<!DOCTYPE html>
<html lang="${this.meta.language}">
<head>
    ${this.generatedMetaTags}
</head>
<body>
    <h1>${this.meta.title}</h1>
    <p>${this.meta.description}</p>
</body>
</html>`
      
      const blob = new Blob([htmlTemplate], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = 'index.html'
      a.click()
      
      URL.revokeObjectURL(url)
    },
    
    previewSeo() {
      this.showSeoPreview = !this.showSeoPreview
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
.meta-form {
  margin-bottom: 40px;
}

.meta-form h3 {
  color: white;
  margin: 30px 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.5);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 0;
}

.input-group label {
  display: block;
  color: white;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
}

.input-group input,
.input-group textarea,
.input-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
}

.input-group input::placeholder,
.input-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.help-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
  transform: scale(1.2);
}

.preview-section {
  margin-bottom: 40px;
}

.preview-section h3 {
  color: white;
  margin-bottom: 20px;
}

.code-output {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.code-output pre {
  margin: 0;
}

.code-output code {
  color: #51cf66;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre;
}

.actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.seo-preview {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.seo-preview h3 {
  color: white;
  margin-bottom: 25px;
  text-align: center;
}

.search-result {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  font-family: Arial, sans-serif;
}

.search-title {
  color: #1a0dab;
  font-size: 20px;
  margin-bottom: 5px;
  text-decoration: underline;
  cursor: pointer;
}

.search-url {
  color: #006621;
  font-size: 14px;
  margin-bottom: 5px;
}

.search-description {
  color: #545454;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.social-preview h4 {
  color: white;
  margin-bottom: 15px;
  text-align: center;
}

.social-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  background-color: #f0f0f0;
}

.social-content {
  padding: 16px;
}

.social-content h5 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.social-content p {
  color: #666;
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.4;
}

.social-content span {
  color: #999;
  font-size: 12px;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
  
  .actions .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>