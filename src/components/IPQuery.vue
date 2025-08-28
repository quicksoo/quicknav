<template>
  <div class="container">
    <div class="card">
      <h2>🌐 IP地址查询</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        查询IP地址的地理位置、运营商等详细信息
      </p>
      
      <div class="query-section">
        <div class="input-group">
          <label>IP地址：</label>
          <div class="input-with-btn">
            <input 
              v-model="ipAddress" 
              @keyup.enter="queryIP"
              placeholder="请输入IP地址，如：8.8.8.8"
              class="ip-input"
            >
            <button class="btn" @click="queryIP">🔍 查询</button>
            <button class="btn" @click="getMyIP">📍 查询本机IP</button>
          </div>
        </div>
        
        <div class="quick-ips">
          <h4>常用IP地址：</h4>
          <div class="ip-buttons">
            <button class="ip-btn" @click="setIP('8.8.8.8')">Google DNS</button>
            <button class="ip-btn" @click="setIP('114.114.114.114')">114 DNS</button>
            <button class="ip-btn" @click="setIP('1.1.1.1')">Cloudflare</button>
            <button class="ip-btn" @click="setIP('223.5.5.5')">阿里DNS</button>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="loading">
        <p>🔄 查询中...</p>
      </div>
      
      <div v-if="ipInfo" class="result-section">
        <h4>查询结果：</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">IP地址：</span>
            <span class="info-value">{{ ipInfo.ip }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">国家：</span>
            <span class="info-value">{{ ipInfo.country || '未知' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">省份：</span>
            <span class="info-value">{{ ipInfo.region || '未知' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">城市：</span>
            <span class="info-value">{{ ipInfo.city || '未知' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">运营商：</span>
            <span class="info-value">{{ ipInfo.isp || '未知' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">组织：</span>
            <span class="info-value">{{ ipInfo.org || '未知' }}</span>
          </div>
        </div>
        
        <div class="actions">
          <button class="btn" @click="copyIPInfo">📋 复制信息</button>
          <button class="btn" @click="exportIPInfo">💾 导出结果</button>
        </div>
      </div>
      
      <div v-if="error" class="error-message">
        <p>❌ {{ error }}</p>
      </div>
      
      <div class="info-section">
        <h4>使用说明：</h4>
        <div class="info-content">
          <div class="info-column">
            <h5>支持格式：</h5>
            <ul>
              <li>IPv4地址：192.168.1.1</li>
              <li>IPv6地址：2001:db8::1</li>
              <li>域名：www.example.com</li>
            </ul>
          </div>
          <div class="info-column">
            <h5>查询信息：</h5>
            <ul>
              <li>地理位置（国家、省份、城市）</li>
              <li>网络运营商信息</li>
              <li>组织机构信息</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IPQuery',
  data() {
    return {
      ipAddress: '',
      ipInfo: null,
      loading: false,
      error: ''
    }
  },
  methods: {
    async queryIP() {
      if (!this.ipAddress.trim()) {
        this.error = '请输入IP地址'
        return
      }
      
      this.loading = true
      this.error = ''
      this.ipInfo = null
      
      try {
        // 使用免费的IP查询API
        const response = await fetch(`http://ip-api.com/json/${this.ipAddress}?lang=zh-CN`)
        const data = await response.json()
        
        if (data.status === 'success') {
          this.ipInfo = {
            ip: data.query,
            country: data.country,
            region: data.regionName,
            city: data.city,
            isp: data.isp,
            org: data.org
          }
        } else {
          this.error = '查询失败，请检查IP地址是否正确'
        }
      } catch (error) {
        this.error = '网络错误，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    
    async getMyIP() {
      this.loading = true
      this.error = ''
      
      try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        this.ipAddress = data.ip
        await this.queryIP()
      } catch (error) {
        this.error = '获取本机IP失败'
        this.loading = false
      }
    },
    
    setIP(ip) {
      this.ipAddress = ip
      this.queryIP()
    },
    
    async copyIPInfo() {
      if (!this.ipInfo) return
      
      const text = `IP地址信息查询结果
IP地址：${this.ipInfo.ip}
国家：${this.ipInfo.country || '未知'}
省份：${this.ipInfo.region || '未知'}
城市：${this.ipInfo.city || '未知'}
运营商：${this.ipInfo.isp || '未知'}
组织：${this.ipInfo.org || '未知'}
查询时间：${new Date().toLocaleString()}`
      
      try {
        await navigator.clipboard.writeText(text)
        this.showToast('IP信息已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    exportIPInfo() {
      if (!this.ipInfo) return
      
      const content = `IP地址信息查询报告
查询时间：${new Date().toLocaleString()}

基本信息：
IP地址：${this.ipInfo.ip}
国家：${this.ipInfo.country || '未知'}
省份：${this.ipInfo.region || '未知'}
城市：${this.ipInfo.city || '未知'}

网络信息：
运营商：${this.ipInfo.isp || '未知'}
组织：${this.ipInfo.org || '未知'}
`
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ip_info_${this.ipInfo.ip}_${Date.now()}.txt`
      link.click()
      URL.revokeObjectURL(url)
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
          if (document.body.contains(toast)) {
            document.body.removeChild(toast)
          }
        }, 300)
      }, 2000)
    }
  }
}
</script>

<style scoped>
.query-section {
  margin-bottom: 30px;
}

.input-with-btn {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.ip-input {
  flex: 1;
  min-width: 200px;
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: monospace;
}

.quick-ips {
  margin-top: 20px;
}

.quick-ips h4 {
  color: #37474f;
  margin-bottom: 12px;
}

.ip-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ip-btn {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.ip-btn:hover {
  background: #e8e8e8;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #2196f3;
}

.result-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.result-section h4 {
  color: #37474f;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.info-label {
  color: #78909c;
  min-width: 60px;
}

.info-value {
  color: #37474f;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.error-message {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
  padding: 16px;
  color: #c62828;
  text-align: center;
  margin-top: 20px;
}

.info-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.info-section h4 {
  color: #37474f;
  margin-bottom: 20px;
}

.info-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-column h5 {
  color: #37474f;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-column li {
  padding: 4px 0;
  color: #78909c;
  font-size: 13px;
  position: relative;
  padding-left: 16px;
}

.info-column li::before {
  content: '•';
  color: #2196f3;
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .input-with-btn {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ip-input {
    min-width: auto;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-content {
    grid-template-columns: 1fr;
  }
}
</style>