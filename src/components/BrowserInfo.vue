<template>
  <div class="container">
    <div class="card">
      <h2>🔍 浏览器信息查看器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        查看当前浏览器的详细信息，包括User Agent、屏幕分辨率、操作系统等
      </p>
      
      <div class="info-sections">
        <!-- 基本浏览器信息 -->
        <div class="info-section">
          <h3>🌐 浏览器基本信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>浏览器名称</label>
              <span>{{ browserInfo.name }}</span>
            </div>
            <div class="info-item">
              <label>浏览器版本</label>
              <span>{{ browserInfo.version }}</span>
            </div>
            <div class="info-item">
              <label>渲染引擎</label>
              <span>{{ browserInfo.engine }}</span>
            </div>
            <div class="info-item">
              <label>浏览器厂商</label>
              <span>{{ browserInfo.vendor }}</span>
            </div>
          </div>
        </div>
        
        <!-- 操作系统信息 -->
        <div class="info-section">
          <h3>💻 操作系统信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>操作系统</label>
              <span>{{ systemInfo.os }}</span>
            </div>
            <div class="info-item">
              <label>系统架构</label>
              <span>{{ systemInfo.arch }}</span>
            </div>
            <div class="info-item">
              <label>设备类型</label>
              <span>{{ systemInfo.deviceType }}</span>
            </div>
            <div class="info-item">
              <label>平台</label>
              <span>{{ systemInfo.platform }}</span>
            </div>
          </div>
        </div>
        
        <!-- 屏幕和显示信息 -->
        <div class="info-section">
          <h3>📱 屏幕显示信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>屏幕分辨率</label>
              <span>{{ screenInfo.resolution }}</span>
            </div>
            <div class="info-item">
              <label>可用分辨率</label>
              <span>{{ screenInfo.availableResolution }}</span>
            </div>
            <div class="info-item">
              <label>窗口大小</label>
              <span>{{ screenInfo.windowSize }}</span>
            </div>
            <div class="info-item">
              <label>设备像素比</label>
              <span>{{ screenInfo.pixelRatio }}</span>
            </div>
            <div class="info-item">
              <label>颜色深度</label>
              <span>{{ screenInfo.colorDepth }} 位</span>
            </div>
            <div class="info-item">
              <label>屏幕方向</label>
              <span>{{ screenInfo.orientation }}</span>
            </div>
          </div>
        </div>
        
        <!-- 网络和连接信息 -->
        <div class="info-section">
          <h3>🌍 网络连接信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>在线状态</label>
              <span :class="networkInfo.online ? 'status-online' : 'status-offline'">
                {{ networkInfo.online ? '在线' : '离线' }}
              </span>
            </div>
            <div class="info-item" v-if="networkInfo.connection">
              <label>连接类型</label>
              <span>{{ networkInfo.connectionType }}</span>
            </div>
            <div class="info-item" v-if="networkInfo.connection">
              <label>网络速度</label>
              <span>{{ networkInfo.downlink }} Mbps</span>
            </div>
            <div class="info-item">
              <label>语言设置</label>
              <span>{{ networkInfo.language }}</span>
            </div>
            <div class="info-item">
              <label>时区</label>
              <span>{{ networkInfo.timezone }}</span>
            </div>
          </div>
        </div>
        
        <!-- 浏览器功能支持 -->
        <div class="info-section">
          <h3>⚡ 浏览器功能支持</h3>
          <div class="features-grid">
            <div class="feature-item" v-for="feature in features" :key="feature.name">
              <span class="feature-name">{{ feature.name }}</span>
              <span :class="['feature-status', feature.supported ? 'supported' : 'not-supported']">
                {{ feature.supported ? '✅ 支持' : '❌ 不支持' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- User Agent 详细信息 -->
        <div class="info-section">
          <h3>🔧 User Agent 信息</h3>
          <div class="user-agent-section">
            <div class="input-group">
              <label>完整 User Agent</label>
              <textarea readonly :value="userAgent" rows="4"></textarea>
            </div>
            <button class="btn" @click="copyUserAgent">复制 User Agent</button>
          </div>
        </div>
        
        <!-- IP和地理位置信息 -->
        <div class="info-section">
          <h3>📍 IP和位置信息</h3>
          <div class="location-info">
            <p class="info-note">
              注意：出于隐私保护，位置信息需要用户授权。IP地址信息需要第三方服务支持。
            </p>
            <button class="btn" @click="getLocationInfo">获取位置信息</button>
            <div v-if="locationInfo" class="location-result">
              <div class="info-item">
                <label>纬度</label>
                <span>{{ locationInfo.latitude }}</span>
              </div>
              <div class="info-item">
                <label>经度</label>
                <span>{{ locationInfo.longitude }}</span>
              </div>
              <div class="info-item">
                <label>精度</label>
                <span>{{ locationInfo.accuracy }} 米</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="export-section">
        <h3>导出信息</h3>
        <div class="export-actions">
          <button class="btn" @click="exportAsJson">导出为JSON</button>
          <button class="btn" @click="exportAsText">导出为文本</button>
          <button class="btn" @click="copyAllInfo">复制所有信息</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BrowserInfo',
  data() {
    return {
      locationInfo: null,
      userAgent: navigator.userAgent,
      browserInfo: {},
      systemInfo: {},
      screenInfo: {},
      networkInfo: {},
      features: []
    }
  },
  mounted() {
    this.collectBrowserInfo()
    this.collectSystemInfo()
    this.collectScreenInfo()
    this.collectNetworkInfo()
    this.checkFeatureSupport()
  },
  methods: {
    collectBrowserInfo() {
      const ua = navigator.userAgent
      let name = 'Unknown'
      let version = 'Unknown'
      let engine = 'Unknown'
      let vendor = 'Unknown'
      
      // 检测浏览器
      if (ua.includes('Chrome') && !ua.includes('Edg')) {
        name = 'Google Chrome'
        vendor = 'Google'
        engine = 'Blink'
        const match = ua.match(/Chrome\/([\\d.]+)/)
        if (match) version = match[1]
      } else if (ua.includes('Firefox')) {
        name = 'Mozilla Firefox'
        vendor = 'Mozilla'
        engine = 'Gecko'
        const match = ua.match(/Firefox\/([\\d.]+)/)
        if (match) version = match[1]
      } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        name = 'Apple Safari'
        vendor = 'Apple'
        engine = 'WebKit'
        const match = ua.match(/Version\/([\\d.]+)/)
        if (match) version = match[1]
      } else if (ua.includes('Edg')) {
        name = 'Microsoft Edge'
        vendor = 'Microsoft'
        engine = 'Blink'
        const match = ua.match(/Edg\/([\\d.]+)/)
        if (match) version = match[1]
      } else if (ua.includes('Opera') || ua.includes('OPR')) {
        name = 'Opera'
        vendor = 'Opera Software'
        engine = 'Blink'
        const match = ua.match(/(?:Opera|OPR)[\\/\\s]([\\d.]+)/)
        if (match) version = match[1]
      }
      
      this.browserInfo = { name, version, engine, vendor }
    },
    
    collectSystemInfo() {
      const ua = navigator.userAgent
      const platform = navigator.platform
      let os = 'Unknown'
      let arch = 'Unknown'
      let deviceType = 'Desktop'
      
      // 检测操作系统
      if (ua.includes('Windows NT')) {
        os = 'Windows'
        const match = ua.match(/Windows NT ([\\d.]+)/)
        if (match) {
          const version = match[1]
          if (version === '10.0') os = 'Windows 10/11'
          else if (version === '6.3') os = 'Windows 8.1'
          else if (version === '6.2') os = 'Windows 8'
          else if (version === '6.1') os = 'Windows 7'
        }
      } else if (ua.includes('Mac OS X')) {
        os = 'macOS'
        const match = ua.match(/Mac OS X ([\\d_]+)/)
        if (match) {
          const version = match[1].replace(/_/g, '.')
          os = `macOS ${version}`
        }
      } else if (ua.includes('Linux')) {
        os = 'Linux'
      } else if (ua.includes('Android')) {
        os = 'Android'
        deviceType = 'Mobile'
        const match = ua.match(/Android ([\\d.]+)/)
        if (match) os = `Android ${match[1]}`
      } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
        deviceType = ua.includes('iPad') ? 'Tablet' : 'Mobile'
        os = 'iOS'
        const match = ua.match(/OS ([\\d_]+)/)
        if (match) {
          const version = match[1].replace(/_/g, '.')
          os = `iOS ${version}`
        }
      }
      
      // 检测架构
      if (ua.includes('x86_64') || ua.includes('Win64') || ua.includes('WOW64')) {
        arch = 'x64'
      } else if (ua.includes('ARM') || ua.includes('arm')) {
        arch = 'ARM'
      } else if (ua.includes('x86')) {
        arch = 'x86'
      }
      
      this.systemInfo = {
        os,
        arch,
        deviceType,
        platform
      }
    },
    
    collectScreenInfo() {
      const screen = window.screen
      const orientation = screen.orientation ? screen.orientation.type : 'Unknown'
      
      this.screenInfo = {
        resolution: `${screen.width} × ${screen.height}`,
        availableResolution: `${screen.availWidth} × ${screen.availHeight}`,
        windowSize: `${window.innerWidth} × ${window.innerHeight}`,
        pixelRatio: window.devicePixelRatio || 1,
        colorDepth: screen.colorDepth,
        orientation
      }
    },
    
    collectNetworkInfo() {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      
      this.networkInfo = {
        online: navigator.onLine,
        connection: !!connection,
        connectionType: connection ? connection.effectiveType || connection.type || 'Unknown' : 'Unknown',
        downlink: connection ? connection.downlink || 'Unknown' : 'Unknown',
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    },
    
    checkFeatureSupport() {
      this.features = [
        {
          name: 'Local Storage',
          supported: typeof(Storage) !== 'undefined' && localStorage
        },
        {
          name: 'Session Storage',
          supported: typeof(Storage) !== 'undefined' && sessionStorage
        },
        {
          name: 'IndexedDB',
          supported: 'indexedDB' in window
        },
        {
          name: 'WebSocket',
          supported: 'WebSocket' in window
        },
        {
          name: 'WebRTC',
          supported: 'RTCPeerConnection' in window
        },
        {
          name: 'Service Worker',
          supported: 'serviceWorker' in navigator
        },
        {
          name: 'Push Notifications',
          supported: 'Notification' in window
        },
        {
          name: 'Geolocation',
          supported: 'geolocation' in navigator
        },
        {
          name: 'Camera/Microphone',
          supported: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
        },
        {
          name: 'WebGL',
          supported: (() => {
            try {
              const canvas = document.createElement('canvas')
              return !!(window.WebGLRenderingContext && canvas.getContext('webgl'))
            } catch (e) {
              return false
            }
          })()
        },
        {
          name: 'WebAssembly',
          supported: 'WebAssembly' in window
        },
        {
          name: 'CSS Grid',
          supported: CSS.supports('display', 'grid')
        },
        {
          name: 'CSS Flexbox',
          supported: CSS.supports('display', 'flex')
        },
        {
          name: 'Touch Events',
          supported: 'ontouchstart' in window
        }
      ]
    },
    
    async getLocationInfo() {
      if (!navigator.geolocation) {
        this.showToast('此浏览器不支持地理位置功能')
        return
      }
      
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 600000
          })
        })
        
        this.locationInfo = {
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
          accuracy: Math.round(position.coords.accuracy)
        }
      } catch (error) {
        this.showToast('获取位置信息失败：' + error.message)
      }
    },
    
    async copyUserAgent() {
      try {
        await navigator.clipboard.writeText(this.userAgent)
        this.showToast('User Agent 已复制到剪贴板！')
      } catch (error) {
        console.error('复制失败:', error)
        this.showToast('复制失败，请手动复制')
      }
    },
    
    getAllInfo() {
      return {
        timestamp: new Date().toISOString(),
        userAgent: this.userAgent,
        browser: this.browserInfo,
        system: this.systemInfo,
        screen: this.screenInfo,
        network: this.networkInfo,
        features: this.features,
        location: this.locationInfo
      }
    },
    
    exportAsJson() {
      const data = this.getAllInfo()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = 'browser-info.json'
      a.click()
      
      URL.revokeObjectURL(url)
    },
    
    exportAsText() {
      const data = this.getAllInfo()
      let text = '浏览器信息报告\\n'
      text += '生成时间: ' + new Date().toLocaleString() + '\\n\\n'
      
      text += '=== 浏览器信息 ===\\n'
      text += `名称: ${data.browser.name}\\n`
      text += `版本: ${data.browser.version}\\n`
      text += `引擎: ${data.browser.engine}\\n`
      text += `厂商: ${data.browser.vendor}\\n\\n`
      
      text += '=== 系统信息 ===\\n'
      text += `操作系统: ${data.system.os}\\n`
      text += `架构: ${data.system.arch}\\n`
      text += `设备类型: ${data.system.deviceType}\\n`
      text += `平台: ${data.system.platform}\\n\\n`
      
      text += '=== 屏幕信息 ===\\n'
      text += `分辨率: ${data.screen.resolution}\\n`
      text += `可用分辨率: ${data.screen.availableResolution}\\n`
      text += `窗口大小: ${data.screen.windowSize}\\n`
      text += `设备像素比: ${data.screen.pixelRatio}\\n`
      text += `颜色深度: ${data.screen.colorDepth}位\\n\\n`
      
      text += '=== 功能支持 ===\\n'
      data.features.forEach(feature => {
        text += `${feature.name}: ${feature.supported ? '支持' : '不支持'}\\n`
      })
      
      text += '\\n=== User Agent ===\\n'
      text += data.userAgent + '\\n'
      
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = 'browser-info.txt'
      a.click()
      
      URL.revokeObjectURL(url)
    },
    
    async copyAllInfo() {
      try {
        const data = this.getAllInfo()
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
        this.showToast('所有信息已复制到剪贴板！')
      } catch (error) {
        console.error('复制失败:', error)
        this.showToast('复制失败，请手动复制')
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
.info-sections {
  margin-bottom: 40px;
}

.info-section {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
}

.info-section h3 {
  color: #37474f;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #2196f3;
  font-size: 1.2rem;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.2s ease;
}

.info-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.info-item label {
  color: #546e7a;
  font-weight: 500;
  font-size: 14px;
}

.info-item span {
  color: #37474f;
  font-weight: 600;
  font-size: 14px;
  text-align: right;
}

.status-online {
  color: #4caf50 !important;
}

.status-offline {
  color: #f44336 !important;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
}

.feature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.2s ease;
}

.feature-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.feature-name {
  color: #546e7a;
  font-weight: 500;
  font-size: 14px;
}

.feature-status {
  font-weight: 600;
  font-size: 14px;
}

.feature-status.supported {
  color: #4caf50;
}

.feature-status.not-supported {
  color: #f44336;
}

.user-agent-section {
  text-align: center;
}

.user-agent-section .input-group {
  margin-bottom: 16px;
}

.user-agent-section .input-group label {
  display: block;
  color: #37474f;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: left;
}

.user-agent-section textarea {
  width: 100%;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #37474f;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  resize: vertical;
  box-sizing: border-box;
}

.user-agent-section textarea:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.location-info {
  text-align: center;
}

.info-note {
  color: #78909c;
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.5;
  background: #e3f2fd;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #2196f3;
}

.location-result {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.export-section {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid #e8e8e8;
}

.export-section h3 {
  color: #37474f;
  margin-bottom: 20px;
  font-weight: 600;
}

.export-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 添加加载状态 */
.loading {
  text-align: center;
  padding: 20px;
  color: #78909c;
}

/* 添加动画效果 */
.info-section {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item,
  .feature-item {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .info-item span {
    text-align: center;
  }
  
  .export-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .export-actions .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .info-section {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .info-section h3 {
    font-size: 1.1rem;
  }
  
  .info-item,
  .feature-item {
    padding: 10px;
  }
  
  .info-item label,
  .info-item span,
  .feature-name,
  .feature-status {
    font-size: 13px;
  }
}
</style>