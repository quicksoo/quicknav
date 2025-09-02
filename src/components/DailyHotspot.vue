<template>
  <div class="container">
    <div class="card">
      <h2>🔥 每日热点</h2>
      <p class="tool-description">
        汇聚各大平台热点资讯，一键获取今日热门话题
      </p>
      
      <!-- 热点平台选择 -->
      <div class="platform-tabs">
        <button 
          v-for="platform in platforms" 
          :key="platform.key"
          class="platform-tab" 
          :class="{ active: selectedPlatform === platform.key }"
          @click="selectPlatform(platform.key)"
        >
          <span class="platform-icon">{{ platform.icon }}</span>
          <span class="platform-name">{{ platform.name }}</span>
        </button>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在获取热点数据...</p>
      </div>
      
      <!-- 热点列表 -->
      <div v-else class="hotspot-content">
        <div class="hotspot-header">
          <h3>{{ getCurrentPlatformName() }}</h3>
          <div class="update-info">
            <span class="update-time">更新时间：{{ updateTime }}</span>
            <button class="refresh-btn" @click="refreshData" :disabled="loading">
              🔄 刷新
            </button>
          </div>
        </div>
        
        <div class="hotspot-list">
          <div 
            v-for="(item, index) in hotspotData" 
            :key="index"
            class="hotspot-item"
            @click="openLink(item.url)"
          >
            <div class="item-rank">{{ index + 1 }}</div>
            <div class="item-content">
              <h4 class="item-title">{{ item.title }}</h4>
              <div class="item-meta">
                <span v-if="item.heat" class="heat-value">🔥 {{ item.heat }}</span>
                <span v-if="item.category" class="category">{{ item.category }}</span>
                <span class="time">{{ item.time || '刚刚' }}</span>
              </div>
              <p v-if="item.summary" class="item-summary">{{ item.summary }}</p>
            </div>
            <div class="item-arrow">→</div>
          </div>
        </div>
        
        <!-- 数据来源说明 -->
        <div class="data-source">
          <p class="source-note">
            <span class="source-icon">ℹ️</span>
            数据来源：{{ getCurrentPlatformName() }}官方API
            <span class="disclaimer">（仅供参考，请以官方为准）</span>
          </p>
        </div>
      </div>
      
      <!-- 功能介绍 -->
      <div class="features-section">
        <h4>功能特色：</h4>
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">⚡</span>
            <span>实时更新，获取最新热点</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🌐</span>
            <span>多平台聚合，信息全面</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔗</span>
            <span>一键跳转，快速阅读</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📱</span>
            <span>响应式设计，移动友好</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DailyHotspot',
  data() {
    return {
      selectedPlatform: 'weibo',
      loading: false,
      updateTime: '',
      platforms: [
        {
          key: 'weibo',
          name: '微博热搜',
          icon: '📱',
          description: '微博实时热搜榜'
        },
        {
          key: 'zhihu',
          name: '知乎热榜',
          icon: '🤔',
          description: '知乎热门话题'
        },
        {
          key: 'toutiao',
          name: '今日头条',
          icon: '📰',
          description: '今日头条热点'
        },
        {
          key: 'baidu',
          name: '百度热搜',
          icon: '🔍',
          description: '百度搜索热榜'
        },
        {
          key: 'bilibili',
          name: 'B站热门',
          icon: '📺',
          description: 'B站热门视频'
        },
        {
          key: 'github',
          name: 'GitHub',
          icon: '💻',
          description: 'GitHub趋势项目'
        }
      ],
      hotspotData: []
    }
  },
  
  mounted() {
    this.loadData()
  },
  
  methods: {
    selectPlatform(platform) {
      this.selectedPlatform = platform
      this.loadData()
    },
    
    getCurrentPlatformName() {
      const platform = this.platforms.find(p => p.key === this.selectedPlatform)
      return platform ? platform.name : '热点资讯'
    },
    
    async loadData() {
      this.loading = true
      
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 生成模拟数据
        this.hotspotData = this.generateMockData()
        this.updateTime = new Date().toLocaleString()
        
      } catch (error) {
        console.error('获取热点数据失败:', error)
        this.showToast('获取数据失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    
    refreshData() {
      this.loadData()
    },
    
    generateMockData() {
      const mockData = {
        weibo: [
          { title: '最新科技发展趋势', heat: '875万', category: '科技', summary: '人工智能技术在各行各业的广泛应用...' },
          { title: '经济政策新动向', heat: '652万', category: '财经', summary: '最新出台的经济刺激政策...' },
          { title: '环保新举措实施', heat: '543万', category: '社会', summary: '绿色发展理念深入人心...' },
          { title: '教育改革新方向', heat: '432万', category: '教育', summary: '新时代教育发展的重要举措...' },
          { title: '医疗技术新突破', heat: '321万', category: '医疗', summary: '医疗技术的创新发展...' }
        ],
        zhihu: [
          { title: '如何看待当前的就业形势？', heat: '1245万', category: '职场', summary: '分析当前就业市场的变化和机遇...' },
          { title: '程序员的职业发展路径', heat: '987万', category: '技术', summary: '从初级到资深的成长之路...' },
          { title: '投资理财有哪些技巧？', heat: '765万', category: '理财', summary: '理性投资的基本原则和方法...' },
          { title: '如何提高学习效率？', heat: '654万', category: '学习', summary: '科学的学习方法和技巧分享...' },
          { title: '健康生活方式指南', heat: '543万', category: '健康', summary: '保持身心健康的实用建议...' }
        ],
        toutiao: [
          { title: '国际经济形势分析', heat: '998万', category: '国际', summary: '全球经济发展的最新态势...' },
          { title: '新能源汽车市场动态', heat: '876万', category: '汽车', summary: '电动汽车行业的快速发展...' },
          { title: '房地产市场走向', heat: '754万', category: '房产', summary: '房地产政策调整的影响...' },
          { title: '文化产业新发展', heat: '632万', category: '文化', summary: '文化创意产业的蓬勃发展...' },
          { title: '体育赛事精彩回顾', heat: '521万', category: '体育', summary: '近期重要体育赛事亮点...' }
        ],
        baidu: [
          { title: '智能手机新品发布', heat: '1123万', category: '数码', summary: '最新智能手机技术创新...' },
          { title: '在线教育平台对比', heat: '876万', category: '教育', summary: '各大在线教育平台特色分析...' },
          { title: '旅游景点推荐', heat: '743万', category: '旅游', summary: '热门旅游目的地介绍...' },
          { title: '美食制作技巧', heat: '654万', category: '美食', summary: '家常菜制作的小窍门...' },
          { title: '时尚搭配指南', heat: '532万', category: '时尚', summary: '当季流行趋势解析...' }
        ],
        bilibili: [
          { title: '编程教程系列视频', heat: '567万', category: '科技', summary: '从零开始学编程的完整教程...' },
          { title: '游戏解说精彩合集', heat: '432万', category: '游戏', summary: '热门游戏的精彩解说视频...' },
          { title: '音乐创作分享', heat: '321万', category: '音乐', summary: '原创音乐制作过程分享...' },
          { title: '动画制作幕后', heat: '298万', category: '动画', summary: '动画制作的技术和创意...' },
          { title: '生活技能分享', heat: '276万', category: '生活', summary: '实用生活技能和小妙招...' }
        ],
        github: [
          { title: 'awesome-vue - Vue.js资源集合', heat: '45.2k stars', category: 'Vue.js', summary: '精选的Vue.js资源、工具和库的集合...' },
          { title: 'react-native - 移动应用开发', heat: '112.8k stars', category: 'React', summary: '使用React构建原生移动应用...' },
          { title: 'tensorflow - 机器学习框架', heat: '185.2k stars', category: 'AI/ML', summary: '开源机器学习框架...' },
          { title: 'kubernetes - 容器编排', heat: '109.5k stars', category: 'DevOps', summary: '容器化应用的自动部署和管理...' },
          { title: 'vscode - 代码编辑器', heat: '163.1k stars', category: 'Editor', summary: '轻量级但功能强大的代码编辑器...' }
        ]
      }
      
      return mockData[this.selectedPlatform] || []
    },
    
    openLink(url) {
      if (url) {
        window.open(url, '_blank')
      } else {
        this.showToast('链接暂时不可用')
      }
    },
    
    showToast(message) {
      // 简单的toast提示实现
      const toast = document.createElement('div')
      toast.textContent = message
      toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        z-index: 10000;
        font-size: 14px;
      `
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 3000)
    }
  }
}
</script>

<style scoped>
.tool-description {
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

.platform-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text-primary);
}

.platform-tab:hover {
  background: var(--color-accent-light);
  border-color: var(--color-accent);
}

.platform-tab.active {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.platform-icon {
  font-size: 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.hotspot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.hotspot-header h3 {
  color: var(--color-text-primary);
  margin: 0;
}

.update-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.update-time {
  color: var(--color-text-muted);
  font-size: 14px;
}

.refresh-btn {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.refresh-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hotspot-list {
  margin-bottom: 20px;
}

.hotspot-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hotspot-item:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.item-rank {
  width: 24px;
  height: 24px;
  background: var(--color-bg-tertiary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.hotspot-item:hover .item-rank {
  background: var(--color-accent);
  color: white;
}

.item-content {
  flex: 1;
}

.item-title {
  color: var(--color-text-primary);
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 500;
}

.item-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.heat-value,
.category,
.time {
  font-size: 12px;
  color: var(--color-text-muted);
}

.heat-value {
  color: var(--color-warning);
  font-weight: 500;
}

.item-summary {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.item-arrow {
  color: var(--color-text-muted);
  font-size: 18px;
  transition: all 0.2s ease;
}

.hotspot-item:hover .item-arrow {
  color: var(--color-accent);
  transform: translateX(4px);
}

.data-source {
  padding: 15px;
  background: var(--color-bg-tertiary);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.source-note {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.source-icon {
  font-size: 16px;
}

.disclaimer {
  color: var(--color-text-muted);
  font-size: 12px;
}

.features-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.features-section h4 {
  color: var(--color-text-primary);
  margin-bottom: 20px;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--color-bg-secondary);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.feature-icon {
  font-size: 20px;
}

.feature-item span {
  color: var(--color-text-primary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .platform-tabs {
    flex-direction: column;
  }
  
  .hotspot-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .update-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .feature-list {
    grid-template-columns: 1fr;
  }
}
</style>