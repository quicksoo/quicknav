<template>
  <div class="container">
    <div class="card">
      <h2>🤖 Robots.txt文件生成器</h2>
      <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
        在线生成robots.txt文件，用于控制搜索引擎爬虫对网站的访问规则
      </p>
      
      <div class="robots-builder">
        <div class="builder-section">
          <h3>基本设置</h3>
          <div class="form-grid">
            <div class="input-group">
              <label>网站地址</label>
              <input type="url" v-model="config.siteUrl" placeholder="https://example.com">
            </div>
            
            <div class="input-group">
              <label>Sitemap地址</label>
              <input type="url" v-model="config.sitemapUrl" placeholder="https://example.com/sitemap.xml">
            </div>
            
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.allowAllBots">
                <span>允许所有搜索引擎</span>
              </label>
            </div>
            
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.disallowAll">
                <span>禁止所有搜索引擎</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="builder-section">
          <h3>自定义规则</h3>
          <div class="rules-container">
            <div v-for="(rule, index) in config.customRules" :key="index" class="rule-item">
              <div class="rule-fields">
                <div class="input-group">
                  <label>User-agent</label>
                  <select v-model="rule.userAgent">
                    <option value="*">所有爬虫 (*)</option>
                    <option value="Googlebot">Google (Googlebot)</option>
                    <option value="Bingbot">Bing (Bingbot)</option>
                    <option value="Slurp">Yahoo (Slurp)</option>
                    <option value="DuckDuckBot">DuckDuckGo (DuckDuckBot)</option>
                    <option value="Baiduspider">百度 (Baiduspider)</option>
                    <option value="Sogou">搜狗 (Sogou)</option>
                    <option value="custom">自定义</option>
                  </select>
                </div>
                
                <div class="input-group" v-if="rule.userAgent === 'custom'">
                  <label>自定义User-agent</label>
                  <input type="text" v-model="rule.customUserAgent" placeholder="输入自定义User-agent">
                </div>
                
                <div class="input-group">
                  <label>规则类型</label>
                  <select v-model="rule.type">
                    <option value="allow">Allow (允许)</option>
                    <option value="disallow">Disallow (禁止)</option>
                  </select>
                </div>
                
                <div class="input-group">
                  <label>路径</label>
                  <input type="text" v-model="rule.path" placeholder="例如: /admin/ 或 *.pdf">
                </div>
                
                <div class="input-group">
                  <label>爬取延迟 (秒)</label>
                  <input type="number" v-model="rule.crawlDelay" min="0" max="3600" placeholder="可选">
                </div>
              </div>
              
              <button class="remove-btn" @click="removeRule(index)">删除</button>
            </div>
            
            <button class="btn" @click="addRule">添加规则</button>
          </div>
        </div>
        
        <div class="builder-section">
          <h3>预设模板</h3>
          <div class="template-grid">
            <div 
              v-for="template in templates" 
              :key="template.name"
              class="template-card"
              @click="loadTemplate(template)"
            >
              <h4>{{ template.name }}</h4>
              <p>{{ template.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="preview-section">
        <h3>生成的robots.txt文件</h3>
        <div class="robots-preview">
          <pre><code>{{ generatedRobotsTxt }}</code></pre>
        </div>
        
        <div class="file-actions">
          <button class="btn" @click="copyRobotsTxt">复制内容</button>
          <button class="btn" @click="downloadRobotsTxt">下载文件</button>
          <button class="btn" @click="validateRobots">验证语法</button>
        </div>
        
        <div v-if="validationResult" class="validation-result">
          <h4>验证结果</h4>
          <div :class="['validation-message', validationResult.isValid ? 'success' : 'error']">
            {{ validationResult.message }}
          </div>
          <ul v-if="validationResult.issues && validationResult.issues.length">
            <li v-for="issue in validationResult.issues" :key="issue" class="issue-item">
              {{ issue }}
            </li>
          </ul>
        </div>
      </div>
      
      <div class="info-section">
        <h3>Robots.txt使用说明</h3>
        <div class="info-content">
          <h4>基本语法：</h4>
          <ul>
            <li><strong>User-agent:</strong> 指定适用的爬虫类型</li>
            <li><strong>Disallow:</strong> 禁止访问的路径</li>
            <li><strong>Allow:</strong> 明确允许访问的路径</li>
            <li><strong>Crawl-delay:</strong> 爬取延迟时间（秒）</li>
            <li><strong>Sitemap:</strong> 网站地图文件位置</li>
          </ul>
          
          <h4>路径通配符：</h4>
          <ul>
            <li><strong>*</strong> - 匹配任意字符序列</li>
            <li><strong>$</strong> - 匹配URL结尾</li>
            <li><strong>/</strong> - 根目录</li>
          </ul>
          
          <h4>示例：</h4>
          <ul>
            <li><code>Disallow: /admin/</code> - 禁止访问admin目录</li>
            <li><code>Disallow: *.pdf$</code> - 禁止访问PDF文件</li>
            <li><code>Allow: /public/</code> - 允许访问public目录</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RobotsTxt',
  data() {
    return {
      validationResult: null,
      config: {
        siteUrl: 'https://example.com',
        sitemapUrl: 'https://example.com/sitemap.xml',
        allowAllBots: false,
        disallowAll: false,
        customRules: [
          {
            userAgent: '*',
            type: 'disallow',
            path: '/admin/',
            crawlDelay: '',
            customUserAgent: ''
          }
        ]
      },
      templates: [
        {
          name: '默认模板',
          description: '适用于大多数网站的基本设置',
          config: {
            siteUrl: 'https://example.com',
            sitemapUrl: 'https://example.com/sitemap.xml',
            allowAllBots: false,
            disallowAll: false,
            customRules: [
              {
                userAgent: '*',
                type: 'disallow',
                path: '/admin/',
                crawlDelay: '',
                customUserAgent: ''
              },
              {
                userAgent: '*',
                type: 'disallow',
                path: '/private/',
                crawlDelay: '',
                customUserAgent: ''
              }
            ]
          }
        },
        {
          name: '电商网站',
          description: '适用于电商网站的配置',
          config: {
            siteUrl: 'https://shop.example.com',
            sitemapUrl: 'https://shop.example.com/sitemap.xml',
            allowAllBots: false,
            disallowAll: false,
            customRules: [
              {
                userAgent: '*',
                type: 'disallow',
                path: '/cart/',
                crawlDelay: '',
                customUserAgent: ''
              },
              {
                userAgent: '*',
                type: 'disallow',
                path: '/checkout/',
                crawlDelay: '',
                customUserAgent: ''
              },
              {
                userAgent: '*',
                type: 'disallow',
                path: '/account/',
                crawlDelay: '',
                customUserAgent: ''
              },
              {
                userAgent: '*',
                type: 'allow',
                path: '/products/',
                crawlDelay: '1',
                customUserAgent: ''
              }
            ]
          }
        },
        {
          name: '博客网站',
          description: '适用于博客和内容网站',
          config: {
            siteUrl: 'https://blog.example.com',
            sitemapUrl: 'https://blog.example.com/sitemap.xml',
            allowAllBots: false,
            disallowAll: false,
            customRules: [
              {
                userAgent: '*',
                type: 'disallow',
                path: '/wp-admin/',
                crawlDelay: '',
                customUserAgent: ''
              },
              {
                userAgent: '*',
                type: 'disallow',
                path: '/wp-includes/',
                crawlDelay: '',
                customUserAgent: ''
              },
              {
                userAgent: '*',
                type: 'allow',
                path: '/wp-content/uploads/',
                crawlDelay: '',
                customUserAgent: ''
              }
            ]
          }
        },
        {
          name: '严格限制',
          description: '禁止所有爬虫访问',
          config: {
            siteUrl: 'https://private.example.com',
            sitemapUrl: '',
            allowAllBots: false,
            disallowAll: true,
            customRules: []
          }
        },
        {
          name: '完全开放',
          description: '允许所有爬虫访问所有内容',
          config: {
            siteUrl: 'https://open.example.com',
            sitemapUrl: 'https://open.example.com/sitemap.xml',
            allowAllBots: true,
            disallowAll: false,
            customRules: []
          }
        }
      ]
    }
  },
  computed: {
    generatedRobotsTxt() {
      let content = []
      
      if (this.config.disallowAll) {
        content.push('User-agent: *')
        content.push('Disallow: /')
      } else if (this.config.allowAllBots) {
        content.push('User-agent: *')
        content.push('Disallow:')
      } else {
        // 按User-agent分组规则
        const groupedRules = {}
        
        this.config.customRules.forEach(rule => {
          const agent = rule.userAgent === 'custom' ? rule.customUserAgent : rule.userAgent
          if (!agent) return
          
          if (!groupedRules[agent]) {
            groupedRules[agent] = []
          }
          groupedRules[agent].push(rule)
        })
        
        // 生成每个User-agent的规则
        Object.keys(groupedRules).forEach(agent => {
          content.push(`User-agent: ${agent}`)
          
          const rules = groupedRules[agent]
          let hasDelay = false
          
          rules.forEach(rule => {
            if (rule.path) {
              const action = rule.type === 'allow' ? 'Allow' : 'Disallow'
              content.push(`${action}: ${rule.path}`)
            }
            
            if (rule.crawlDelay && !hasDelay) {
              content.push(`Crawl-delay: ${rule.crawlDelay}`)
              hasDelay = true
            }
          })
          
          content.push('') // 空行分隔
        })
      }
      
      // 添加Sitemap
      if (this.config.sitemapUrl) {
        content.push(`Sitemap: ${this.config.sitemapUrl}`)
      }
      
      return content.join('\n').trim()
    }
  },
  methods: {
    addRule() {
      this.config.customRules.push({
        userAgent: '*',
        type: 'disallow',
        path: '',
        crawlDelay: '',
        customUserAgent: ''
      })
    },
    
    removeRule(index) {
      this.config.customRules.splice(index, 1)
    },
    
    loadTemplate(template) {
      this.config = JSON.parse(JSON.stringify(template.config))
      this.showToast(`${template.name} 模板已加载`)
    },
    
    async copyRobotsTxt() {
      try {
        await navigator.clipboard.writeText(this.generatedRobotsTxt)
        this.showToast('robots.txt内容已复制到剪贴板！')
      } catch (error) {
        console.error('复制失败:', error)
        this.showToast('复制失败，请手动复制')
      }
    },
    
    downloadRobotsTxt() {
      const blob = new Blob([this.generatedRobotsTxt], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = 'robots.txt'
      a.click()
      
      URL.revokeObjectURL(url)
    },
    
    validateRobots() {
      const content = this.generatedRobotsTxt
      const issues = []
      let isValid = true
      
      // 基本验证
      if (!content.trim()) {
        isValid = false
        issues.push('robots.txt文件不能为空')
      }
      
      const lines = content.split('\n')
      let hasUserAgent = false
      
      lines.forEach((line, index) => {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) return
        
        if (trimmed.toLowerCase().startsWith('user-agent:')) {
          hasUserAgent = true
          const agent = trimmed.substring(11).trim()
          if (!agent) {
            isValid = false
            issues.push(`第${index + 1}行: User-agent值不能为空`)
          }
        } else if (trimmed.toLowerCase().startsWith('disallow:') || trimmed.toLowerCase().startsWith('allow:')) {
          if (!hasUserAgent) {
            isValid = false
            issues.push(`第${index + 1}行: Allow/Disallow指令必须在User-agent之后`)
          }
        } else if (trimmed.toLowerCase().startsWith('crawl-delay:')) {
          const delay = trimmed.substring(12).trim()
          if (isNaN(delay) || delay < 0) {
            isValid = false
            issues.push(`第${index + 1}行: Crawl-delay必须是非负数`)
          }
        } else if (trimmed.toLowerCase().startsWith('sitemap:')) {
          const sitemap = trimmed.substring(8).trim()
          if (!this.isValidUrl(sitemap)) {
            isValid = false
            issues.push(`第${index + 1}行: Sitemap必须是有效的URL`)
          }
        }
      })
      
      this.validationResult = {
        isValid,
        message: isValid ? '✅ robots.txt文件语法正确' : '❌ 发现语法错误',
        issues: issues.length ? issues : null
      }
    },
    
    isValidUrl(string) {
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
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
  }
}
</script>

<style scoped>
.robots-builder {
  margin-bottom: 40px;
}

.builder-section {
  margin-bottom: 40px;
}

.builder-section h3 {
  color: white;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.5);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.rules-container {
  space-y: 20px;
}

.rule-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
}

.rule-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.remove-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.5);
  color: #ff6b6b;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: rgba(255, 107, 107, 0.3);
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
  font-size: 16px;
}

.template-card p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.preview-section {
  margin-bottom: 40px;
}

.preview-section h3 {
  color: white;
  margin-bottom: 20px;
}

.robots-preview {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.robots-preview pre {
  margin: 0;
}

.robots-preview code {
  color: #51cf66;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre;
}

.file-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 30px;
}

.validation-result {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
}

.validation-result h4 {
  color: white;
  margin-bottom: 15px;
}

.validation-message {
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.validation-message.success {
  background: rgba(81, 207, 102, 0.2);
  border: 1px solid rgba(81, 207, 102, 0.5);
  color: #51cf66;
}

.validation-message.error {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.5);
  color: #ff6b6b;
}

.validation-result ul {
  color: rgba(255, 255, 255, 0.8);
  padding-left: 20px;
}

.issue-item {
  margin-bottom: 8px;
  line-height: 1.5;
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

.info-content ul {
  padding-left: 20px;
  margin-bottom: 20px;
}

.info-content li {
  margin-bottom: 8px;
}

.info-content code {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  color: #51cf66;
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

@media (max-width: 768px) {
  .form-grid,
  .rule-fields {
    grid-template-columns: 1fr;
  }
  
  .template-grid {
    grid-template-columns: 1fr;
  }
  
  .file-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .file-actions .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .remove-btn {
    position: static;
    margin-top: 15px;
    width: 100%;
  }
}
</style>