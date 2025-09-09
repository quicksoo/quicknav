<template>
  <div class="home-container">
    <div class="welcome-section">
      <div class="hero">
        <h2>欢迎使用快导航 QuickTools</h2>
        <p>一站式在线工具集合平台，提供高效的工具导航服务</p>
      </div>
    </div>
    
    <!-- 热门工具快速访问 -->
    <div class="popular-tools">
      <h3>🔥 热门工具</h3>
      <p class="section-subtitle">一键快速访问最常用的工具</p>
      <div class="popular-tools-grid">
        <router-link 
          v-for="tool in popularTools" 
          :key="tool.path"
          :to="tool.path" 
          class="popular-tool-card"
        >
          <div class="tool-icon-large">{{ tool.icon }}</div>
          <div class="tool-info">
            <h4>{{ tool.name }}</h4>
            <p>{{ tool.description }}</p>
          </div>
          <div class="tool-arrow">→</div>
        </router-link>
      </div>
    </div>
    
    <!-- 友情链接 -->
    <div class="friendly-links">
      <h3>🔗 友情链接</h3>
      <p class="section-subtitle">精选的高质量技术博客和资源网站</p>
      <div class="links-grid">
        <a 
          v-for="link in friendlyLinks" 
          :key="link.url"
          :href="link.url" 
          target="_blank"
          class="link-card"
        >
          <div class="link-content">
            <div class="link-header">
              <h4>{{ link.name }}</h4>
              <span class="link-category">{{ link.category }}</span>
            </div>
            <p class="link-description">{{ link.description }}</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 热门工具数据
      popularTools: [
        {
          path: '/daily-hotspot',
          name: '每日热点',
          icon: '🔥',
          description: '汇聚各大平台热点资讯'
        },
        {
          path: '/json-tool',
          name: 'JSON工具',
          icon: '🔧',
          description: 'JSON格式化、压缩、验证'
        },
        {
          path: '/base64-tool',
          name: 'Base64编解码',
          icon: '🔐',
          description: 'Base64编码和解码工具'
        },
        {
          path: '/qr-generator',
          name: '二维码生成器',
          icon: '📱',
          description: '在线生成二维码'
        },
        {
          path: '/password-generator',
          name: '密码生成器',
          icon: '🔐',
          description: '生成安全随机密码'
        },
        {
          path: '/color-converter',
          name: '颜色转换器',
          icon: '🎨',
          description: '颜色格式转换工具'
        }
      ],
      
      // 新增功能数据
      newFeatures: [
        {
          id: 1,
          badge: '新增',
          date: '2024-01-15',
          title: '每日热点聚合',
          description: '汇聚微博、知乎、头条等平台热点，实时更新热门资讯'
        },
        {
          id: 2,
          badge: '优化',
          date: '2024-01-10',
          title: '界面体验升级',
          description: '全新设计的响应式界面，更加美观和易用'
        },
        {
          id: 3,
          badge: '功能',
          date: '2024-01-05',
          title: '多个新工具上线',
          description: '新增正则表达式测试、文本对比等实用工具'
        }
      ],
    
      
      // 友情链接数据
      friendlyLinks: [
        {
          name: 'Vue.js官方文档',
          url: 'https://vuejs.org/',
          description: '渐进式JavaScript框架官方文档',
          category: '技术文档'
        },
        {
          name: '阮一峰的网络日志',
          url: 'https://www.ruanyifeng.com/blog/',
          description: '高质量的技术博客和教程',
          category: '技术博客'
        },
        {
          name: '掘金',
          url: 'https://juejin.cn/',
          description: '开发者技术分享社区',
          category: '技术社区'
        },
        {
          name: 'GitHub',
          url: 'https://github.com/',
          description: '全球最大的代码托管平台',
          category: '开发工具'
        },
        {
          name: 'Stack Overflow',
          url: 'https://stackoverflow.com/',
          description: '程序员问答社区',
          category: '技术社区'
        },
        {
          name: '天空之城',
          url: 'https://lzmhc.top/',
          description: '个人开发者',
          category: '技术博客'
        }
      ]
    }
  },
  
  computed: {
    // 计算工具总数
    totalTools() {
      // 这里可以根据实际情况计算，暂时使用固定值
      return 35
    },
    
    // 计算分类总数
    totalCategories() {
      return 12
    }
  }
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.welcome-section {
  margin-bottom: 60px;
}

.hero {
  text-align: center;
  margin-bottom: 50px;
  padding: 60px 20px;
  background: linear-gradient(135deg, var(--color-accent) 0%, #1d4ed8 100%);
  border-radius: 16px;
  color: white;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.feature-card {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 30px 24px;
  text-align: center;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  border-color: var(--color-accent);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.feature-card h3 {
  color: var(--color-text-primary);
  margin-bottom: 12px;
  font-size: 1.2rem;
  font-weight: 600;
}

.feature-card p {
  color: var(--color-text-muted);
  line-height: 1.5;
  font-size: 14px;
}

/* 热门工具区域 */
.popular-tools {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.popular-tools h3 {
  color: var(--color-text-primary);
  margin-bottom: 8px;
  font-size: 1.5rem;
  font-weight: 600;
}

.section-subtitle {
  color: var(--color-text-muted);
  margin-bottom: 24px;
  font-size: 14px;
  text-align: center;
}

.popular-tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 16px;
}

.popular-tool-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  background: var(--color-bg-secondary);
}

.popular-tool-card:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.tool-icon-large {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  color: white;
  flex-shrink: 0;
}

.tool-info {
  flex: 1;
}

.tool-info h4 {
  color: var(--color-text-primary);
  margin-bottom: 4px;
  font-size: 1rem;
  font-weight: 600;
}

.tool-info p {
  color: var(--color-text-muted);
  font-size: 14px;
  margin: 0;
}

.tool-arrow {
  color: var(--color-text-muted);
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.popular-tool-card:hover .tool-arrow {
  color: var(--color-accent);
  transform: translateX(4px);
}

/* 新增功能区域 */
.new-features {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.new-features h3 {
  color: var(--color-text-primary);
  margin-bottom: 24px;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.features-timeline {
  position: relative;
  padding-left: 24px;
}

.features-timeline:before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--color-accent), #10b981);
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
  padding-bottom: 24px;
}

.timeline-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -20px;
  top: 4px;
  width: 16px;
  height: 16px;
  background: var(--color-accent);
  border-radius: 50%;
  border: 3px solid var(--color-bg-primary);
  box-shadow: 0 0 0 2px var(--color-accent);
}

.timeline-content {
  background: var(--color-bg-secondary);
  padding: 16px;
  border-radius: 8px;
  border-left: 3px solid var(--color-accent);
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.feature-badge {
  background: linear-gradient(135deg, var(--color-accent), #10b981);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.feature-date {
  color: var(--color-text-muted);
  font-size: 12px;
}

.timeline-content h4 {
  color: var(--color-text-primary);
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600;
}

.timeline-content p {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

/* 网站导航区域 */
.website-navigation {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.website-navigation h3 {
  color: var(--color-text-primary);
  margin-bottom: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.website-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.website-category {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.category-icon {
  font-size: 1.2rem;
}

.category-header h4 {
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.website-list {
  display: grid;
  gap: 8px;
}

.website-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--color-bg-primary);
  border-radius: 6px;
  font-size: 14px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.website-item:hover {
  background: var(--color-border-light);
  color: var(--color-text-primary);
}

.site-favicon {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

/* 数据看板 */
.dashboard {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.dashboard h3 {
  color: var(--color-text-primary);
  margin-bottom: 24px;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  color: white;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
}

.tools-overview,
.usage-tips {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.tools-overview h3,
.usage-tips h3 {
  color: var(--color-text-primary);
  margin-bottom: 24px;
  font-size: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.tools-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 8px;
}

.stat-label {
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 500;
}

.quick-start {
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.quick-start h4 {
  color: var(--color-text-primary);
  margin-bottom: 16px;
  font-size: 1.2rem;
  font-weight: 600;
}

.quick-start p {
  color: var(--color-text-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
}

.quick-start ul {
  color: var(--color-text-secondary);
  padding-left: 20px;
  line-height: 1.8;
}

.quick-start li {
  margin-bottom: 8px;
}

.quick-start strong {
  color: var(--color-text-primary);
}

.tips-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.tip-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.tip-content h4 {
  color: var(--color-text-primary);
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600;
}

.tip-content p {
  color: var(--color-text-muted);
  line-height: 1.5;
  font-size: 14px;
  margin: 0;
}

@media (max-width: 768px) {
  .home-container {
    padding: 20px 16px;
  }
  
  .hero {
    padding: 40px 20px;
  }
  
  .hero h2 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .tools-stats {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .tips-list {
    grid-template-columns: 1fr;
  }
  
  .tip-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .tools-overview,
  .usage-tips {
    padding: 24px 20px;
  }
  
  /* 新增内容移动端适配 */
  .popular-tools,
  .new-features,
  .website-navigation,
  .dashboard {
    padding: 24px 20px;
  }
  
  .popular-tools-grid {
    grid-template-columns: 1fr;
  }
  
  .popular-tool-card {
    min-width: auto;
  }
  
  .website-categories {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-timeline {
    padding-left: 20px;
  }
  
  .timeline-dot {
    left: -16px;
  }
  
  .friendly-links {
    padding: 24px 20px;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
}

/* 友情链接样式 */
.friendly-links {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.friendly-links h3 {
  color: var(--color-text-primary);
  margin-bottom: 8px;
  font-size: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.link-card {
  text-decoration: none;
  display: block;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  background: var(--color-bg-secondary);
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--color-accent);
}

.link-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.link-header h4 {
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.link-category {
  background: linear-gradient(135deg, var(--color-accent), #10b981);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.link-description {
  color: var(--color-text-muted);
  line-height: 1.5;
  font-size: 14px;
  margin: 0;
}

@media (max-width: 768px) {
  .friendly-links {
    padding: 24px 20px;
  }
}

/* 备案信息样式 */
.footer {
  text-align: center;
  padding: 20px 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

.beian a {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.beian a:hover {
  color: #ffd600; /* quickYellow color */
}

@media (max-width: 768px) {
  .footer {
    padding: 16px 0;
    font-size: 12px;
  }
}
</style>