<template>
  <div class="home-container">
    <div class="welcome-section">
      <div class="hero">
        <h2>欢迎使用编程工具导航</h2>
        <p>一站式编程开发工具集合，提供常用的在线工具，提升您的开发效率</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3>高效便捷</h3>
          <p>无需安装，在线即用，节省本地存储空间</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>界面美观</h3>
          <p>现代化设计，支持深色主题，视觉体验佳</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>响应式设计</h3>
          <p>完美适配桌面端和移动端，随时随地使用</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>安全可靠</h3>
          <p>本地处理，数据不上传服务器，保护隐私</p>
        </div>
      </div>
    </div>
    
    <div class="tools-overview">
      <h3>工具概览</h3>
      <div class="tools-stats">
        <div class="stat-item">
          <div class="stat-number">5</div>
          <div class="stat-label">实用工具</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">3</div>
          <div class="stat-label">工具分类</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">100%</div>
          <div class="stat-label">免费使用</div>
        </div>
      </div>
      
      <div class="quick-start">
        <h4>快速开始</h4>
        <p>选择左侧工具分类，开始使用各种编程工具：</p>
        <ul>
          <li><strong>文本处理工具</strong> - 富文本编辑、JSON处理、Base64编解码</li>
          <li><strong>生成器工具</strong> - UUID生成器，支持批量生成</li>
          <li><strong>加密解密</strong> - MD5加密，支持文本和文件</li>
        </ul>
      </div>
    </div>
    
    <div class="usage-tips">
      <h3>使用技巧</h3>
      <div class="tips-list">
        <div class="tip-item">
          <div class="tip-icon">💡</div>
          <div class="tip-content">
            <h4>批量处理</h4>
            <p>大部分工具支持批量处理，提高工作效率</p>
          </div>
        </div>
        
        <div class="tip-item">
          <div class="tip-icon">📋</div>
          <div class="tip-content">
            <h4>一键复制</h4>
            <p>处理结果支持一键复制到剪贴板</p>
          </div>
        </div>
        
        <div class="tip-item">
          <div class="tip-icon">💾</div>
          <div class="tip-content">
            <h4>导出文件</h4>
            <p>支持将处理结果导出为文件保存</p>
          </div>
        </div>
        
        <div class="tip-item">
          <div class="tip-icon">🔄</div>
          <div class="tip-content">
            <h4>实时处理</h4>
            <p>输入内容实时处理，即时查看结果</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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
  background: white;
  border-radius: 12px;
  padding: 30px 24px;
  text-align: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.feature-card h3 {
  color: #1e293b;
  margin-bottom: 12px;
  font-size: 1.2rem;
  font-weight: 600;
}

.feature-card p {
  color: #64748b;
  line-height: 1.5;
  font-size: 14px;
}

.tools-overview,
.usage-tips {
  background: white;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.tools-overview h3,
.usage-tips h3 {
  color: #1e293b;
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
  color: #3b82f6;
  margin-bottom: 8px;
}

.stat-label {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.quick-start {
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.quick-start h4 {
  color: #1e293b;
  margin-bottom: 16px;
  font-size: 1.2rem;
  font-weight: 600;
}

.quick-start p {
  color: #475569;
  margin-bottom: 16px;
  line-height: 1.6;
}

.quick-start ul {
  color: #475569;
  padding-left: 20px;
  line-height: 1.8;
}

.quick-start li {
  margin-bottom: 8px;
}

.quick-start strong {
  color: #1e293b;
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
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.tip-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.tip-content h4 {
  color: #1e293b;
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600;
}

.tip-content p {
  color: #64748b;
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
}
</style>