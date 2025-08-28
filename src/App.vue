<template>
  <div id="app">
    <!-- 左侧固定导航栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="logo">🛠️ 编程工具</h1>
      </div>
      
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
    </aside>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 简洁的顶部栏 -->
      <header class="top-header">
        <div class="breadcrumb">
          <button 
            v-if="$route.path !== '/'"
            class="back-btn"
            @click="$router.push('/')"
          >
            ← 返回
          </button>
          <span v-if="$route.path === '/' && !selectedCategory">工具分类</span>
          <span v-else-if="$route.path === '/' && selectedCategory">{{ getSelectedCategoryIcon() }} {{ selectedCategory }}</span>
          <span v-else>{{ getCurrentToolName() }}</span>
        </div>
      </header>
      
      <!-- 页面内容 -->
      <div class="content-wrapper">
        <!-- 工具页面显示 -->
        <div v-if="$route.path !== '/'">
          <router-view />
        </div>
        
        <!-- 首页内容 -->
        <div v-else>
          <!-- 未选择分类时的欢迎页面 -->
          <div v-if="!selectedCategory" class="welcome-page">
            <div class="welcome-content">
              <h1>欢迎使用编程工具导航</h1>
              <p>选择左侧分类查看相关工具</p>
            </div>
          </div>
          
          <!-- 选中分类的工具列表 -->
          <div v-else class="tools-page">
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
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      selectedCategory: null,
      categories: [
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
            { path: '/hello-world', name: 'Hello World', icon: '👋', description: '各种编程语言的Hello World代码示例' }
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
  methods: {
    selectCategory(categoryName) {
      this.selectedCategory = categoryName
      // 如果不在首页，先跳转到首页
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
        '/text-diff': '文本差异对比',
        '/image-base64': '图片Base64转换',
        '/ip-query': 'IP地址查询',
        '/text-processor': '文本处理工具集',
        '/format-converter': '格式转换器',
        '/unit-converter': '单位转换器',
        '/calculator': '多功能计算器',
        '/timestamp-converter': '时间戳转换',
        '/base-converter': '进制转换器',
        '/cron-generator': 'Cron表达式生成器'
      }
      return toolNames[this.$route.path] || '未知工具'
    }
  },
  
  watch: {
    '$route'(to, from) {
      // 当路由变化时，如果不是首页，则重置分类选择
      if (to.path !== '/') {
        this.selectedCategory = null
      }
    }
  }
}
</script>

<style scoped>
/* 全局布局 */
#app {
  display: flex;
  height: 100vh;
  background: #fafafa;
}

/* 左侧固定导航栏 */
.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
}

/* 侧边栏头部 */
.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

/* 导航菜单 */
.nav-menu {
  flex: 1;
  padding: 16px 0;
}

.nav-category {
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
}

.nav-category:hover {
  background: #f8f9fa;
}

.nav-category.active {
  background: #e3f2fd;
  border-right: 3px solid #2196f3;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  gap: 12px;
}

.category-icon {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #37474f;
}

.nav-category.active .category-name {
  color: #1976d2;
  font-weight: 600;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

/* 顶部栏 */
.top-header {
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  padding: 24px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 500;
  color: #37474f;
}

.back-btn {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #eeeeee;
  color: #333;
}

/* 内容包装器 */
.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* 欢迎页面 */
.welcome-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.welcome-content h1 {
  font-size: 28px;
  color: #37474f;
  margin-bottom: 12px;
  font-weight: 300;
}

.welcome-content p {
  font-size: 16px;
  color: #78909c;
  margin: 0;
}

/* 工具页面 */
.tools-page {
  padding: 32px;
}

.page-title {
  margin-bottom: 32px;
}

.page-title h1 {
  font-size: 24px;
  color: #37474f;
  margin-bottom: 8px;
  font-weight: 500;
}

.page-title p {
  font-size: 15px;
  color: #78909c;
  margin: 0;
}

/* 工具网格 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.tool-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  display: block;
}

.tool-card:hover {
  border-color: #2196f3;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.1);
  transform: translateY(-2px);
}

.tool-icon {
  font-size: 32px;
  margin-bottom: 16px;
  display: block;
}

.tool-card h3 {
  font-size: 16px;
  color: #37474f;
  margin-bottom: 8px;
  font-weight: 600;
}

.tool-card p {
  font-size: 14px;
  color: #78909c;
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
    border-bottom: 1px solid #e8e8e8;
  }
  
  .nav-menu {
    display: flex;
    overflow-x: auto;
    padding: 8px 16px;
  }
  
  .nav-category {
    margin-bottom: 0;
    margin-right: 8px;
    flex-shrink: 0;
    border-radius: 20px;
  }
  
  .nav-category.active {
    border-right: none;
    background: #2196f3;
    color: white;
  }
  
  .nav-category.active .category-name {
    color: white;
  }
  
  .category-item {
    padding: 8px 16px;
    white-space: nowrap;
  }
  
  .tools-page {
    padding: 20px;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .welcome-content h1 {
    font-size: 24px;
  }
  
  .welcome-content p {
    font-size: 14px;
  }
}
</style>