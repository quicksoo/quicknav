<template>
  <div class="container">
    <div class="card">
      <h2>📱 二维码生成器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        在线生成二维码，支持文本、链接、WiFi配置等多种类型
      </p>
      
      <div class="generator-section">
        <div class="type-selector">
          <label>二维码类型：</label>
          <div class="type-options">
            <label class="type-option">
              <input type="radio" value="text" v-model="qrType" @change="updateQR">
              <span>📝 纯文本</span>
            </label>
            <label class="type-option">
              <input type="radio" value="url" v-model="qrType" @change="updateQR">
              <span>🔗 网页链接</span>
            </label>
            <label class="type-option">
              <input type="radio" value="wifi" v-model="qrType" @change="updateQR">
              <span>📶 WiFi配置</span>
            </label>
            <label class="type-option">
              <input type="radio" value="email" v-model="qrType" @change="updateQR">
              <span>📧 邮件地址</span>
            </label>
            <label class="type-option">
              <input type="radio" value="phone" v-model="qrType" @change="updateQR">
              <span>📞 电话号码</span>
            </label>
          </div>
        </div>
        
        <!-- 文本输入 -->
        <div v-if="qrType === 'text'" class="input-group">
          <label>文本内容：</label>
          <textarea 
            v-model="textContent" 
            @input="updateQR"
            placeholder="请输入要生成二维码的文本内容..."
            rows="4"
          ></textarea>
        </div>
        
        <!-- URL输入 -->
        <div v-if="qrType === 'url'" class="input-group">
          <label>网页链接：</label>
          <input 
            v-model="urlContent" 
            @input="updateQR"
            placeholder="https://www.example.com"
            type="url"
          >
        </div>
        
        <!-- WiFi配置 -->
        <div v-if="qrType === 'wifi'" class="wifi-config">
          <div class="input-group">
            <label>网络名称 (SSID)：</label>
            <input v-model="wifiSSID" @input="updateQR" placeholder="WiFi网络名称">
          </div>
          <div class="input-group">
            <label>密码：</label>
            <input v-model="wifiPassword" @input="updateQR" placeholder="WiFi密码" type="password">
          </div>
          <div class="input-group">
            <label>加密类型：</label>
            <select v-model="wifiEncryption" @change="updateQR">
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">无密码</option>
            </select>
          </div>
        </div>
        
        <!-- 邮件地址 -->
        <div v-if="qrType === 'email'" class="email-config">
          <div class="input-group">
            <label>邮件地址：</label>
            <input v-model="emailAddress" @input="updateQR" placeholder="example@email.com" type="email">
          </div>
          <div class="input-group">
            <label>主题（可选）：</label>
            <input v-model="emailSubject" @input="updateQR" placeholder="邮件主题">
          </div>
          <div class="input-group">
            <label>内容（可选）：</label>
            <textarea v-model="emailBody" @input="updateQR" placeholder="邮件内容..." rows="3"></textarea>
          </div>
        </div>
        
        <!-- 电话号码 -->
        <div v-if="qrType === 'phone'" class="input-group">
          <label>电话号码：</label>
          <input v-model="phoneNumber" @input="updateQR" placeholder="+86 138 1234 5678" type="tel">
        </div>
        
        <!-- 设置选项 -->
        <div class="settings-section">
          <h4>生成设置：</h4>
          <div class="settings-grid">
            <div class="setting-item">
              <label>尺寸：</label>
              <select v-model="qrSize" @change="updateQR">
                <option value="200">200x200</option>
                <option value="300">300x300</option>
                <option value="400">400x400</option>
                <option value="500">500x500</option>
              </select>
            </div>
            <div class="setting-item">
              <label>容错级别：</label>
              <select v-model="errorLevel" @change="updateQR">
                <option value="L">低 (7%)</option>
                <option value="M">中 (15%)</option>
                <option value="Q">较高 (25%)</option>
                <option value="H">高 (30%)</option>
              </select>
            </div>
            <div class="setting-item">
              <label>前景色：</label>
              <input type="color" v-model="foregroundColor" @change="updateQR">
            </div>
            <div class="setting-item">
              <label>背景色：</label>
              <input type="color" v-model="backgroundColor" @change="updateQR">
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="qrDataURL" class="result-section">
        <h4>生成结果：</h4>
        <div class="qr-display">
          <div class="qr-image">
            <img :src="qrDataURL" :alt="'二维码: ' + getCurrentContent()" />
          </div>
          <div class="qr-actions">
            <button class="btn" @click="downloadQR">💾 下载图片</button>
            <button class="btn" @click="copyQRImage">📋 复制图片</button>
          </div>
        </div>
        
        <div class="qr-info">
          <h5>二维码信息：</h5>
          <div class="info-item">
            <span class="info-label">类型：</span>
            <span class="info-value">{{ getQRTypeLabel() }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">内容：</span>
            <span class="info-value">{{ getCurrentContent() }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">尺寸：</span>
            <span class="info-value">{{ qrSize }}x{{ qrSize }}px</span>
          </div>
        </div>
      </div>
      
      <div class="examples-section">
        <h4>使用示例：</h4>
        <div class="example-grid">
          <div class="example-item" @click="loadExample('url')">
            <h5>🔗 网站链接</h5>
            <p>生成网页地址二维码，方便手机快速访问</p>
          </div>
          <div class="example-item" @click="loadExample('wifi')">
            <h5>📶 WiFi分享</h5>
            <p>生成WiFi配置二维码，客人扫码即可连网</p>
          </div>
          <div class="example-item" @click="loadExample('contact')">
            <h5>📇 联系方式</h5>
            <p>生成包含联系信息的二维码</p>
          </div>
          <div class="example-item" @click="loadExample('location')">
            <h5>📍 地理位置</h5>
            <p>生成地图坐标二维码，便于导航</p>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <h4>关于二维码：</h4>
        <div class="info-content">
          <p><strong>容错级别说明：</strong></p>
          <ul>
            <li><strong>低 (7%)：</strong> 适用于清洁环境，文件较小</li>
            <li><strong>中 (15%)：</strong> 一般用途推荐级别</li>
            <li><strong>较高 (25%)：</strong> 适用于可能有轻微损坏的场景</li>
            <li><strong>高 (30%)：</strong> 适用于恶劣环境或需要添加Logo的场景</li>
          </ul>
          
          <p><strong>使用建议：</strong></p>
          <ul>
            <li>确保前景色和背景色有足够的对比度</li>
            <li>打印时建议使用较高的容错级别</li>
            <li>移动设备扫描建议尺寸不小于200x200</li>
            <li>长文本内容会增加二维码复杂度，影响扫描速度</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QrGenerator',
  data() {
    return {
      qrType: 'text',
      textContent: '欢迎使用二维码生成器！',
      urlContent: 'https://www.example.com',
      wifiSSID: '',
      wifiPassword: '',
      wifiEncryption: 'WPA',
      emailAddress: '',
      emailSubject: '',
      emailBody: '',
      phoneNumber: '',
      qrSize: '300',
      errorLevel: 'M',
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      qrDataURL: ''
    }
  },
  methods: {
    updateQR() {
      const content = this.getCurrentContent()
      if (!content) {
        this.qrDataURL = ''
        return
      }
      
      // 使用 QRCode.js 库生成二维码
      // 这里使用在线API作为示例，实际项目中建议使用本地库
      const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=${this.qrSize}x${this.qrSize}&color=${this.foregroundColor.substring(1)}&bgcolor=${this.backgroundColor.substring(1)}&ecc=${this.errorLevel}&data=${encodeURIComponent(content)}`
      this.qrDataURL = qrAPI
    },
    
    getCurrentContent() {
      switch (this.qrType) {
        case 'text':
          return this.textContent
        case 'url':
          return this.urlContent
        case 'wifi':
          return this.getWiFiString()
        case 'email':
          return this.getEmailString()
        case 'phone':
          return `tel:${this.phoneNumber}`
        default:
          return ''
      }
    },
    
    getWiFiString() {
      if (!this.wifiSSID) return ''
      const security = this.wifiEncryption === 'nopass' ? 'nopass' : this.wifiEncryption
      return `WIFI:T:${security};S:${this.wifiSSID};P:${this.wifiPassword};;`
    },
    
    getEmailString() {
      if (!this.emailAddress) return ''
      let emailString = `mailto:${this.emailAddress}`
      const params = []
      if (this.emailSubject) params.push(`subject=${encodeURIComponent(this.emailSubject)}`)
      if (this.emailBody) params.push(`body=${encodeURIComponent(this.emailBody)}`)
      if (params.length > 0) emailString += '?' + params.join('&')
      return emailString
    },
    
    getQRTypeLabel() {
      const labels = {
        text: '纯文本',
        url: '网页链接',
        wifi: 'WiFi配置',
        email: '邮件地址',
        phone: '电话号码'
      }
      return labels[this.qrType] || '未知'
    },
    
    downloadQR() {
      if (!this.qrDataURL) return
      
      const link = document.createElement('a')
      link.download = `qrcode_${Date.now()}.png`
      link.href = this.qrDataURL
      link.click()
    },
    
    async copyQRImage() {
      try {
        const response = await fetch(this.qrDataURL)
        const blob = await response.blob()
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        this.showToast('二维码已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请使用下载功能')
      }
    },
    
    loadExample(type) {
      switch (type) {
        case 'url':
          this.qrType = 'url'
          this.urlContent = 'https://github.com'
          break
        case 'wifi':
          this.qrType = 'wifi'
          this.wifiSSID = 'MyWiFi'
          this.wifiPassword = 'password123'
          this.wifiEncryption = 'WPA'
          break
        case 'contact':
          this.qrType = 'text'
          this.textContent = 'BEGIN:VCARD\nVERSION:3.0\nFN:张三\nTEL:138-1234-5678\nEMAIL:zhangsan@example.com\nEND:VCARD'
          break
        case 'location':
          this.qrType = 'text'
          this.textContent = 'geo:39.9042,116.4074'
          break
      }
      this.updateQR()
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
  },
  mounted() {
    this.updateQR()
  }
}
</script>

<style scoped>
.generator-section {
  margin-bottom: 30px;
}

.type-selector {
  margin-bottom: 20px;
}

.type-selector label {
  display: block;
  margin-bottom: 12px;
  color: #37474f;
  font-weight: 500;
}

.type-options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.type-option:hover {
  background: #f8f9fa;
}

.type-option input:checked + span {
  color: #2196f3;
  font-weight: 600;
}

.wifi-config, .email-config {
  display: grid;
  gap: 16px;
}

.settings-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.settings-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.setting-item label {
  font-size: 14px;
  color: #37474f;
  font-weight: 500;
}

.setting-item select,
.setting-item input[type="color"] {
  padding: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.setting-item input[type="color"] {
  height: 40px;
  cursor: pointer;
}

.result-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.qr-display {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.qr-image {
  text-align: center;
}

.qr-image img {
  max-width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.qr-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.qr-info {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.qr-info h5 {
  color: #37474f;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-label {
  color: #78909c;
  min-width: 60px;
}

.info-value {
  color: #37474f;
  word-break: break-all;
}

.examples-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.example-item {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.example-item:hover {
  border-color: #2196f3;
  background: #f0f7ff;
}

.example-item h5 {
  color: #37474f;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}

.example-item p {
  color: #78909c;
  margin: 0;
  font-size: 13px;
}

.info-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.info-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.info-content {
  color: #37474f;
  line-height: 1.6;
}

.info-content ul {
  margin: 8px 0 16px 20px;
}

.info-content li {
  margin-bottom: 4px;
  font-size: 14px;
  color: #78909c;
}

@media (max-width: 768px) {
  .type-options {
    flex-direction: column;
  }
  
  .qr-display {
    flex-direction: column;
    align-items: center;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .example-grid {
    grid-template-columns: 1fr;
  }
}
</style>