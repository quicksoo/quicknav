<template>
  <div class="container">
    <div class="card">
      <h2>🔥 每日热点</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card h2 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

/* 平台选择标签 */
.platform-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #495057;
}

.platform-tab:hover {
  border-color: #007bff;
  transform: translateY(-1px);
}

.platform-tab.active {
  border-color: #007bff;
  background: #007bff;
  color: white;
}

.platform-icon {
  font-size: 16px;
}

.platform-name {
  font-weight: 500;
}

/* 加载状态 */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 热点内容 */
.hotspot-content {
  margin-top: 20px;
}

.hotspot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e9ecef;
}

.hotspot-header h3 {
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.update-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.update-time {
  color: #6c757d;
  font-size: 14px;
}

.refresh-btn {
  padding: 6px 12px;
  border: 1px solid #007bff;
  border-radius: 6px;
  background: white;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: #007bff;
  color: white;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 热点列表 */
.hotspot-list {
  space-y: 12px;
}

.hotspot-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

.hotspot-item:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
  transform: translateY(-1px);
}

.item-rank {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.item-content {
  flex: 1;
}

.item-title {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.4;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.heat-value {
  color: #dc3545;
  font-size: 12px;
  font-weight: 500;
}

.category {
  color: #007bff;
  font-size: 12px;
  background: #e7f3ff;
  padding: 2px 8px;
  border-radius: 12px;
}

.time {
  color: #6c757d;
  font-size: 12px;
}

.item-summary {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.item-arrow {
  flex-shrink: 0;
  color: #6c757d;
  font-size: 18px;
  align-self: center;
}

/* 数据来源 */
.data-source {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.source-note {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 12px;
  margin: 0;
}

.source-icon {
  color: #007bff;
}

.disclaimer {
  color: #adb5bd;
}

/* 功能介绍 */
.features-section {
  margin-top: 32px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
}

.features-section h4 {
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #495057;
  font-size: 14px;
}

.feature-icon {
  color: #007bff;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
  
  .card {
    padding: 20px;
  }
  
  .platform-tabs {
    flex-direction: column;
    gap: 8px;
  }
  
  .platform-tab {
    justify-content: center;
  }
  
  .hotspot-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .update-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .hotspot-item {
    gap: 12px;
  }
  
  .item-rank {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .item-title {
    font-size: 15px;
  }
  
  .feature-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .item-meta {
    flex-direction: column;
    gap: 6px;
  }
  
  .platform-tab {
    font-size: 13px;
    padding: 8px 12px;
  }
}
</style>