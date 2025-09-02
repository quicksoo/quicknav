<template>
  <div class="container">
    <div class="card">
      <h2>🏷️ Meta标签生成器</h2>
      <p class="subtitle">
        网页Meta标签在线生成工具，帮助您快速生成SEO友好的Meta标签
      </p>

      <div class="meta-form">
        <!-- 基本信息 -->
        <h3>基本信息</h3>
        <div class="form-grid">
          <div class="input-group">
            <label>网站标题 (Title)</label>
            <input type="text" v-model="meta.title" placeholder="请输入网站标题" />
            <span class="help-text">
              建议长度：50-60个字符
              <span :class="charCountClass('title')">{{ meta.title.length }}/60</span>
            </span>
          </div>

          <div class="input-group">
            <label>网站描述 (Description)</label>
            <textarea v-model="meta.description" placeholder="请输入网站描述" rows="3"></textarea>
            <span class="help-text">
              建议长度：150-160个字符
              <span :class="charCountClass('desc')">{{ meta.description.length }}/160</span>
            </span>
          </div>

          <div class="input-group">
            <label>关键词 (Keywords)</label>
            <input type="text" v-model="meta.keywords" placeholder="关键词1,关键词2,关键词3" />
            <span class="help-text">用逗号分隔多个关键词</span>
          </div>

          <div class="input-group">
            <label>网站作者 (Author)</label>
            <input type="text" v-model="meta.author" placeholder="请输入作者名称" />
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

        <!-- SEO 和 社交 -->
        <h3>SEO和社交媒体</h3>
        <div class="form-grid">
          <div class="input-group">
            <label>网站URL</label>
            <input type="url" v-model="meta.url" placeholder="https://example.com" />
          </div>

          <div class="input-group">
            <label>网站图片 (用于社交分享)</label>
            <input type="url" v-model="meta.image" placeholder="https://example.com/image.jpg" />
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
            <input type="text" v-model="meta.twitterSite" placeholder="@username" />
          </div>

          <div class="input-group">
            <label>网站分类</label>
            <input type="text" v-model="meta.category" placeholder="科技,教育,娱乐" />
          </div>
        </div>

        <!-- 其他设置 -->
        <h3>其他设置</h3>
        <div class="form-grid">
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="meta.viewport" />
              <span>响应式视口 (Viewport)</span>
            </label>
          </div>

          <div class="input-group">
            <label>搜索引擎索引</label>
            <select v-model="meta.robots">
              <option value="index,follow">允许索引和跟踪</option>
              <option value="noindex,nofollow">禁止索引和跟踪</option>
              <option value="index,nofollow">允许索引，禁止跟踪</option>
              <option value="noindex,follow">禁止索引，允许跟踪</option>
            </select>
          </div>

          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="meta.googleSiteVerification" />
              <span>Google站点验证</span>
            </label>
          </div>

          <div class="input-group" v-if="meta.googleSiteVerification">
            <label>Google验证码</label>
            <input type="text" v-model="meta.googleVerificationCode" placeholder="验证码" />
          </div>
        </div>
      </div>

      <!-- 生成结果 -->
      <div class="preview-section">
        <h3>生成的Meta标签</h3>
        <div class="code-output">
          <pre><code>{{ generatedMetaTags }}</code></pre>
        </div>

        <div class="actions">
          <button class="btn btn-primary" @click="copyMetaTags">📋 复制Meta标签</button>
          <button class="btn btn-secondary" @click="downloadHtml">⬇️ 下载HTML文件</button>
          <button class="btn btn-outline" @click="previewSeo">
            {{ showSeoPreview ? '隐藏预览' : '🔍 SEO预览' }}
          </button>
        </div>
      </div>

      <!-- SEO 预览 -->
      <div v-if="showSeoPreview" class="seo-preview">
        <h3>SEO预览效果</h3>

        <!-- 搜索引擎预览 -->
        <div class="search-result">
          <h4 class="search-title">{{ meta.title || '网站标题' }}</h4>
          <div class="search-url">{{ meta.url || 'https://example.com' }}</div>
          <p class="search-description">{{ meta.description || '网站描述将显示在这里...' }}</p>
        </div>

        <!-- 社交媒体预览 -->
        <div class="social-preview">
          <h4>社交媒体预览</h4>
          <div class="social-card">
            <div class="social-image" :style="{
              backgroundImage: meta.image ? `url(${meta.image})` : 'linear-gradient(45deg, #667eea, #764ba2)'
            }"></div>
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
        robots: 'index,follow',
        googleSiteVerification: false,
        googleVerificationCode: ''
      }
    }
  },
  computed: {
    generatedMetaTags() {
      const tags = []

      // 基础标签
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
        const keywords = this.meta.keywords
          .split(',')
          .map(k => k.trim())
          .filter(Boolean)
          .filter((k, i, arr) => arr.indexOf(k) === i)
          .join(', ')
        tags.push(`<meta name="keywords" content="${keywords}">`)
      }

      if (this.meta.author) {
        tags.push(`<meta name="author" content="${this.meta.author}">`)
      }

      if (this.meta.robots) {
        tags.push(`<meta name="robots" content="${this.meta.robots}">`)
      }

      // Open Graph
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

      // Twitter
      if (this.meta.twitterCard) {
        tags.push(`<meta name="twitter:card" content="${this.meta.twitterCard}">`)
      }
      if (this.meta.twitterSite) {
        const site = this.meta.twitterSite.startsWith('@') ? this.meta.twitterSite : `@${this.meta.twitterSite}`
        tags.push(`<meta name="twitter:site" content="${site}">`)
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

      // 其他
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
    charCountClass(type) {
      if (type === 'title') {
        const len = this.meta.title.length
        return len >= 50 && len <= 60 ? 'char-count' : 'char-count warn'
      } else if (type === 'desc') {
        const len = this.meta.description.length
        return len >= 150 && len <= 160 ? 'char-count' : 'char-count warn'
      }
    },
    async copyMetaTags() {
      try {
        await navigator.clipboard.writeText(this.generatedMetaTags)
        this.showToast('✅ Meta标签已复制到剪贴板！')
      } catch (err) {
        this.showToast('❌ 复制失败，请手动复制')
      }
    },
    downloadHtml() {
      const html = `<!DOCTYPE html>
<html lang="${this.meta.language}">
<head>
${this.generatedMetaTags}
</head>
<body>
  <h1>${this.meta.title}</h1>
  <p>${this.meta.description}</p>
</body>
</html>`

      const blob = new Blob([html], { type: 'text/html' })
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
        position: fixed; top: 20px; right: 20px; 
        background: rgba(0,0,0,0.85); color: white;
        padding: 12px 20px; border-radius: 6px;
        z-index: 9999; font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        animation: fadeIn 0.3s, fadeOut 0.3s 2.7s forwards;
      `
      document.body.appendChild(toast)
      setTimeout(() => document.body.removeChild(toast), 3000)
    }
  }
}
</script>

<style scoped>
/* ============= 全局容器 ============= */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* ============= 主卡片 ============= */
.card {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.subtitle {
  color: var(--color-text-secondary);
  margin-bottom: 24px;
  font-size: 15px;
  line-height: 1.6;
}

/* ============= 表单区域 ============= */
.meta-form h3 {
  color: var(--color-text-primary);
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
  font-size: 18px;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
}

.input-group input,
.input-group textarea,
.input-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-group input:focus,
.input-group textarea:focus,
.input-group select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-group input::placeholder,
.input-group textarea::placeholder {
  color: var(--color-text-muted);
}

.help-text {
  color: var(--color-text-muted);
  font-size: 13px;
  margin-top: 6px;
  display: block;
}

.char-count {
  float: right;
  color: var(--color-success);
  font-size: 12px;
}
.char-count.warn {
  color: var(--color-warning);
}

/* 复选框样式 */
.checkbox-label {
  display: flex;
  align-items: center;
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.1);
}

/* ============= 按钮样式 ============= */
.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
}

.btn-primary {
  background: var(--color-accent);
  color: white;
}

.btn-secondary {
  background: var(--color-success);
  color: white;
}

.btn-outline {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.btn:active {
  transform: translateY(0);
}

/* ============= 代码输出区域 ============= */
.code-output {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.code-output code {
  color: var(--color-text-primary);
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
}

/* ============= SEO 预览 ============= */
.seo-preview {
  margin-top: 24px;
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
}

.seo-preview h3 {
  color: var(--color-text-primary);
  margin-bottom: 16px;
  font-size: 18px;
}

/* 搜索结果预览 */
.search-result {
  background: white;
  padding: 12px;
  border: 1px solid #dadce0;
  border-radius: 8px;
  margin-bottom: 24px;
  font-family: Arial, sans-serif;
  max-width: 600px;
}

.search-title {
  color: #1a0dab;
  font-size: 16px;
  margin: 0 0 2px 0;
  cursor: pointer;
  text-decoration: none;
}

.search-title:hover {
  text-decoration: underline;
}

.search-url {
  color: #006621;
  font-size: 14px;
  margin: 0 0 2px 0;
}

.search-description {
  color: #545454;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

/* 社交媒体预览 */
.social-preview h4 {
  color: var(--color-text-primary);
  margin-bottom: 12px;
  font-size: 16px;
}

.social-card {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  max-width: 480px;
  margin: 0 auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.social-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  background-color: #f8fafc;
}

.social-content {
  padding: 16px;
}

.social-content h5 {
  color: #111;
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
}

.social-content p {
  color: #555;
  margin: 0 0 6px 0;
  font-size: 14px;
  line-height: 1.4;
}

.social-content span {
  color: #777;
  font-size: 12px;
}

/* ============= 响应式 ============= */
@media (max-width: 768px) {
  .card {
    padding: 20px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .actions {
    flex-direction: column;
  }
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>