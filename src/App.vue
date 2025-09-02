<template>
  <Analytics />
  <div id="app">
    <!-- 左侧固定导航栏 -->
    <aside class="sidebar" aria-label="导航菜单">
      <!-- 固定头部 -->
      <div class="sidebar-header" @click="goToHome">
        <h1 class="logo clickable">⚡️ 快导航 QuickTools</h1>
      </div>

      <!-- 可滚动的菜单区域 -->
      <div class="nav-scroll-container">
        <nav class="nav-menu">
          <div
            v-for="category in categories"
            :key="category.name"
            class="nav-category"
            :class="{ active: selectedCategory === category.name }"
            @click="selectCategory(category.name)"
          >
            <div class="category-item">
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
            </div>
          </div>
        </nav>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 顶部栏 -->
      <header class="top-header" aria-label="页面顶部信息栏">
        <div class="header-content">
          <div class="breadcrumb">
            <span v-if="$route.path === '/' && !selectedCategory">工具分类</span>
            <span v-else-if="$route.path === '/' && selectedCategory">{{ getSelectedCategoryIcon() }} {{ selectedCategory }}</span>
            <span v-else>{{ getCurrentToolName() }}</span>
          </div>

          <div class="right-section">
            <!-- 广告展示区域 -->
            <div class="ad-section" v-if="enabledAds.length > 0">
              <div
                v-for="ad in enabledAds"
                :key="ad.id"
                class="ad-banner"
                :style="{ background: ad.bgColor, color: ad.textColor }"
                @click="openAdLink(ad.link)"
              >
                <div class="ad-content">
                  <div class="ad-title">{{ ad.title }}</div>
                  <div class="ad-subtitle">{{ ad.subtitle }}</div>
                </div>
                <div class="ad-action">
                  <span class="ad-btn">查看</span>
                </div>
              </div>
            </div>

            <!-- 主题切换按钮 -->
            <div class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
              <div class="theme-icon">
                <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd600" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <div class="content-wrapper">
        <div v-if="$route.path !== '/' || selectedCategory">
          <div v-if="selectedCategory" class="tools-page">
            <div class="page-title">
              <p>{{ getSelectedCategoryDescription() }}</p>
            </div>
            <div class="tools-grid">
              <router-link
                v-for="tool in getSelectedCategoryTools()"
                :key="tool.path"
                :to="tool.path"
                class="tool-card"
              >
                <div class="tool-icon">{{ tool.icon }}</div>
                <h3>{{ tool.name }}</h3>
                <p>{{ tool.description }}</p>
              </router-link>
            </div>
          </div>
          <div v-else>
            <router-view />
          </div>
        </div>
        <div v-else>
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import { Analytics } from '@vercel/analytics/vue';
</script>

<script>
export default {
  name: 'App',
  data() {
    return {
      selectedCategory: null,
      isDark: false, // 添加主题状态
      // 广告位配置（最多启用2个）
      advertisements: [
        {
          id: 1,
          title: '免费大流量卡',
          subtitle: '运营商正规流量王卡，快递包邮到家',
          link: 'https://index.feihuang.vip/hk/short?v=36ff05f528',
          bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          textColor: '#ffffff',
          enabled: true
        },
        {
          id: 2,
          title: '阿里云服务器特惠',
          subtitle: '新用户首年优惠85折',
          link: 'https://www.aliyun.com/minisite/goods?userCode=knnrc7rb',
          bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          textColor: '#ffffff',
          enabled: true
        }
      ],
      categories: [
        {
          name: '每日热点',
          icon: '🔥',
          description: '汇聚各大平台热点资讯，一键获取今日热门话题',
          tools: [
            { path: '/daily-hotspot', name: '每日热点', icon: '🔥', description: '汇聚微博、知乎、头条等平台热点，实时更新热门资讯' }
          ]
        },
        {
          name: '文本处理',
          icon: '📝',
          description: '处理文本内容的各类工具，包括编辑、转换、编码等功能',
          tools: [
            { path: '/rich-editor', name: '富文本编辑器', icon: '📝', description: '功能强大的在线富文本编辑器，支持文本格式化、插入链接、图片等操作' },
            { path: '/json-tool', name: 'JSON工具', icon: '🔧', description: 'JSON格式化、压缩、验证和转换工具' },
            { path: '/base64-tool', name: 'Base64编解码', icon: '🔐', description: 'Base64编码和解码工具，支持文本和文件处理' },
            { path: '/email-encoder', name: '邮箱地址加密', icon: '📧', description: '邮箱地址编码工具，防止网页爬虫收集邮箱地址' },
            { path: '/url-encoder', name: 'URL编解码', icon: '🔗', description: 'URL编码解码工具，处理特殊字符和中文URL' },
            { path: '/regex-tester', name: '正则表达式测试', icon: '🔍', description: '在线正则表达式测试器，实时验证匹配结果' },
            { path: '/text-diff', name: '文本差异对比', icon: '📊', description: '在线文本差异对比工具，快速找出两段文本的差异' },
            { path: '/text-processor', name: '文本处理工具集', icon: '📝', description: '多功能文本处理，包含大小写转换、去重排序、统计分析等' }
          ]
        },
        {
          name: '生成器',
          icon: '🎲',
          description: '各种数据和代码生成工具，快速生成所需内容',
          tools: [
            { path: '/uuid-tool', name: 'UUID生成器', icon: '🆔', description: '在线UUID/GUID生成工具，支持多种版本和批量生成' },
            { path: '/snowflake-id', name: '雪花ID生成器', icon: '❄️', description: '基于Twitter Snowflake算法的分布式ID生成器' },
            { path: '/password-generator', name: '密码生成器', icon: '🔐', description: '生成安全可靠的随机密码，支持多种字符集和规则' },
            { path: '/qr-generator', name: '二维码生成器', icon: '📱', description: '在线生成二维码，支持文本、链接、WiFi配置等多种类型' },
            { path: '/meta-generator', name: 'Meta标签生成', icon: '🏷️', description: 'HTML Meta标签生成器，优化SEO和社交媒体分享' },
            { path: '/robots-txt', name: 'Robots.txt生成', icon: '🤖', description: 'Robots.txt文件生成器，控制搜索引擎爬虫访问' }
          ]
        },
        {
          name: '加密解密',
          icon: '🔒',
          description: '数据加密、解密和哈希计算工具',
          tools: [
            { path: '/md5-tool', name: 'MD5加密', icon: '🔒', description: 'MD5哈希值计算工具，支持文本和文件加密' }
          ]
        },
        {
          name: '设计工具',
          icon: '🎨',
          description: '设计和视觉相关的实用工具，包括颜色、图像处理等',
          tools: [
            { path: '/color-converter', name: '颜色转换器', icon: '🎨', description: 'HEX、RGB、HSL颜色格式转换和调色板工具' }
          ]
        },
        {
          name: '图像工具',
          icon: '🖼️',
          description: '图像处理和转换相关的实用工具',
          tools: [
            { path: '/image-base64', name: '图片Base64转换', icon: '🖼️', description: '图片与Base64编码互转工具，支持多种图片格式' }
          ]
        },
        {
          name: '实用工具',
          icon: '🧰',
          description: '日常使用的各种实用小工具',
          tools: [
            { path: '/calculator', name: '多功能计算器', icon: '🧮', description: '支持基本运算、科学计算、程序员计算等多种模式' }
          ]
        },
        {
          name: '数据转换',
          icon: '🔄',
          description: '各种数据格式转换和编码工具',
          tools: [
            { path: '/base-converter', name: '进制转换器', icon: '🔢', description: '二进制、八进制、十进制、十六进制互转工具' },
            { path: '/format-converter', name: '格式转换器', icon: '🔄', description: 'JSON、CSV、XML等数据格式互转工具' },
            { path: '/unit-converter', name: '单位转换器', icon: '📐', description: '长度、重量、温度、面积、体积等各种单位转换' }
          ]
        },
        {
          name: '时间工具',
          icon: '⏰',
          description: '时间和日期相关的转换和计算工具',
          tools: [
            { path: '/timestamp-converter', name: '时间戳转换', icon: '⏰', description: 'Unix时间戳与日期时间互转工具' },
            { path: '/cron-generator', name: 'Cron表达式生成器', icon: '⏱️', description: '可视化生成和解析Cron表达式，支持多种预设模板' }
          ]
        },
        {
          name: '网络工具',
          icon: '🌐',
          description: '网络相关的实用工具和信息查询',
          tools: [
            { path: '/ip-query', name: 'IP地址查询', icon: '🌐', description: '查询IP地址的地理位置、运营商等详细信息' }
          ]
        },
        {
          name: 'Web开发',
          icon: '🌐',
          description: 'Web开发相关的实用工具和代码生成器',
          tools: [
            { path: '/html-preview', name: 'HTML代码预览', icon: '🌐', description: 'HTML代码在线预览和调试工具' },
            { path: '/css-generator', name: 'CSS样式生成器', icon: '🎨', description: 'CSS样式代码生成器，支持各种视觉效果' },
            { path: '/hello-world', name: 'Hello World', icon: '👋', description: '各种编程语言的Hello World代码示例' },
            { path: '/css-formatter', name: 'CSS格式化工具', icon: '🎨', description: 'CSS代码美化、压缩、验证和分析工具' },
            { path: '/json-formatter', name: 'JSON格式化工具', icon: '🔧', description: 'JSON格式化、压缩、验证和生成工具' },
            { path: '/sql-formatter', name: 'SQL格式化工具', icon: '🗃️', description: 'SQL代码格式化、压缩、验证和美化工具' },
            { path: '/markdown-editor', name: 'Markdown编辑器', icon: '📝', description: '在线Markdown编辑器，支持实时预览、语法高亮和常用工具' },
            { path: '/api-tester', name: 'API测试工具', icon: '🌐', description: 'HTTP API接口测试工具，支持GET、POST等方法' },
            { path: '/extension-icon-generator', name: '扩展图标生成器', icon: '🔌', description: '一键生成Chrome浏览器扩展所需的多种尺寸图标' }
          ]
        },
        {
          name: '系统信息',
          icon: '💻',
          description: '获取和显示系统、浏览器相关信息的工具',
          tools: [
            { path: '/browser-info', name: '浏览器信息', icon: '🔍', description: '详细的浏览器和系统信息查看器' }
          ]
        }
      ]
    }
  },

  computed: {
    // 获取启用的广告（最多2个）
    enabledAds() {
      return this.advertisements.filter(ad => ad.enabled).slice(0, 2)
    }
  },

  methods: {
    goToHome() {
      this.selectedCategory = null
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    },

    openAdLink(link) {
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer')
        console.log('广告点击:', link)
      }
    },

    selectCategory(categoryName) {
      this.selectedCategory = categoryName
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    },

    getSelectedCategoryIcon() {
      const category = this.categories.find(cat => cat.name === this.selectedCategory)
      return category ? category.icon : ''
    },

    getSelectedCategoryDescription() {
      const category = this.categories.find(cat => cat.name === this.selectedCategory)
      return category ? category.description : ''
    },

    getSelectedCategoryTools() {
      const category = this.categories.find(cat => cat.name === this.selectedCategory)
      return category ? category.tools : []
    },

    getCurrentToolName() {
      const toolNames = {
        '/daily-hotspot': '每日热点',
        '/rich-editor': '富文本编辑器',
        '/json-tool': 'JSON工具',
        '/base64-tool': 'Base64编解码',
        '/uuid-tool': 'UUID生成器',
        '/md5-tool': 'MD5加密',
        '/hello-world': 'Hello World',
        '/html-preview': 'HTML代码预览',
        '/css-generator': 'CSS样式生成器',
        '/meta-generator': 'Meta标签生成',
        '/robots-txt': 'Robots.txt生成',
        '/browser-info': '浏览器信息',
        '/regex-tester': '正则表达式测试',
        '/url-encoder': 'URL编解码',
        '/color-converter': '颜色转换器',
        '/password-generator': '密码生成器',
        '/qr-generator': '二维码生成器',
        '/snowflake-id': '雪花ID生成器',
        '/text-diff': '文本差异对比',
        '/image-base64': '图片Base64转换',
        '/ip-query': 'IP地址查询',
        '/text-processor': '文本处理工具集',
        '/format-converter': '格式转换器',
        '/unit-converter': '单位转换器',
        '/calculator': '多功能计算器',
        '/timestamp-converter': '时间戳转换',
        '/base-converter': '进制转换器',
        '/cron-generator': 'Cron表达式生成器',
        '/json-formatter': 'JSON格式化工具',
        '/css-formatter': 'CSS格式化工具',
        '/sql-formatter': 'SQL格式化工具',
        '/markdown-editor': 'Markdown编辑器',
        '/api-tester': 'API测试工具',
        '/extension-icon-generator': '扩展图标生成器'
      }
      return toolNames[this.$route.path] || '未知工具'
    },

    // 切换主题
    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
      // 保存用户偏好到localStorage
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },

    // 应用主题
    applyTheme() {
      if (this.isDark) {
        document.documentElement.setAttribute('data-theme', 'dark')
        document.documentElement.classList.add('dark-theme')
      } else {
        document.documentElement.removeAttribute('data-theme')
        document.documentElement.classList.remove('dark-theme')
      }
    },

    // 初始化主题
    initTheme() {
      // 从localStorage获取用户偏好，如果没有则根据系统偏好设置
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.isDark = savedTheme === 'dark'
      } else {
        // 检查系统主题偏好
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        this.isDark = prefersDark
      }
      this.applyTheme()
    }
  },

  watch: {
    '$route'(to, from) {
      if (to.path !== '/') {
        this.selectedCategory = null
      }
    }
  },

  // 在组件挂载时初始化主题
  mounted() {
    this.initTheme()
  }
}
</script>
<style scoped>
/* 全局布局 */
#app {
  display: flex;
  height: 100vh;
  background: var(--color-bg-secondary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow: hidden;
}

/* 左侧固定导航栏 */
.sidebar {
  width: 240px;
  background: var(--color-bg-primary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
  overflow: hidden; /* 禁止整体滚动，防止 header 被影响 */
}

/* 固定头部 - 不随菜单滚动 */
.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0; /* 关键：禁止压缩 */
  background: var(--color-bg-primary);
  z-index: 10;
}

.sidebar-header:hover {
  background: var(--color-bg-tertiary);
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  transition: all 0.2s ease;
}

.logo.clickable:hover {
  color: var(--color-accent);
  transform: scale(1.02);
}

/* 可滚动的菜单容器 - 滚动条只出现在这里 */
.nav-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
  /* 自定义细滚动条 */
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}

.nav-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.nav-scroll-container::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
  border-radius: 3px;
}

.nav-scroll-container::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 3px;
}

.nav-scroll-container::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}

/* 导航菜单 */
.nav-menu {
  display: block;
}

.nav-category {
  height: 48px;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
}

.nav-category:hover {
  background: var(--color-bg-tertiary);
}

.nav-category.active {
  background: var(--color-accent-light);
  border-right: 3px solid var(--color-accent);
}

.category-item {
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 12px;
  color: inherit;
  width: 100%;
  height: 100%;
}

.category-icon {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.nav-category.active .category-name {
  color: var(--color-accent);
  font-weight: 600;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-secondary);
  overflow: hidden;
}

/* 顶部栏 - 与左侧 header 对齐 */
.top-header {
  height: 64px;
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 两端对齐 */
  width: 100%;
}

.breadcrumb {
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-primary);
}

/* 右侧区域 */
.right-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto; /* 将整个右侧区域推到最右边 */
}

/* 广告区域样式 */
.ad-section {
  display: flex;
  justify-content: flex-end; /* 靠右对齐 */
  gap: 12px;
}

.ad-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  max-width: 280px;
  position: relative;
  overflow: hidden;
}

.ad-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.ad-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  opacity: 0.9;
  z-index: 1;
}

.ad-content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.ad-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
  line-height: 1.2;
}

.ad-subtitle {
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.2;
}

.ad-action {
  position: relative;
  z-index: 2;
}

.ad-btn {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.ad-banner:hover .ad-btn {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 主题切换按钮 */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  background: var(--color-bg-tertiary);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.theme-toggle:hover {
  background: var(--color-accent);
  transform: scale(1.1);
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-icon svg {
  color: var(--theme-icon-color);
  transition: all 0.3s ease;
}

/* 内容包装器 */
.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* 工具页面 */
.tools-page {
  padding: 32px;
}

.page-title p {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: 0;
}

/* 工具网格 */
.tools-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.tool-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  display: block;
}

.tool-card:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.tool-icon {
  font-size: 32px;
  margin-bottom: 16px;
  display: block;
}

.tool-card h3 {
  font-size: 16px;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  font-weight: 600;
}

.tool-card p {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  #app {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }

  .sidebar-header,
  .top-header {
    height: 56px;
    padding: 0 16px;
    align-items: center;
  }

  .logo {
    font-size: 16px;
  }

  .breadcrumb {
    font-size: 16px;
  }

  .nav-scroll-container {
    display: flex;
    overflow-x: auto;
    padding: 8px 16px;
  }

  .nav-menu {
    display: flex;
    flex-direction: row;
  }

  .nav-category {
    height: 40px;
    min-width: 120px;
    margin-right: 8px;
    margin-bottom: 0;
    flex-shrink: 0;
    border-radius: 20px;
  }

  .nav-category.active {
    background: var(--color-accent);
    border-right: none;
  }

  .nav-category.active .category-name,
  .nav-category.active .category-icon {
    color: white;
  }

  .category-item {
    padding: 0 16px;
    white-space: nowrap;
  }

  .category-icon {
    font-size: 16px;
    width: 18px;
  }

  /* 顶部栏适配 */
  .header-content {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .right-section {
    gap: 8px;
  }

  .ad-section {
    flex-direction: row;
    gap: 8px;
    align-items: center;
    overflow-x: auto;
    max-width: 70%;
  }

  .ad-banner {
    min-width: auto;
    max-width: 220px;
    width: 100%;
    justify-content: space-between;
  }

  /* 主题切换按钮在移动端的样式 */
  .theme-toggle {
    width: 36px;
    height: 36px;
  }

  /* 内容适配 */
  .tools-page {
    padding: 20px;
  }

  .tools-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>