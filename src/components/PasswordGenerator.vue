<template>
  <div class="container">
    <div class="card">
      <h2>🔐 密码生成器</h2>
      <p class="tool-description">
        生成安全可靠的随机密码，支持多种字符集和自定义规则
      </p>
      
      <div class="generator-section">
        <div class="settings-panel">
          <h4>密码设置：</h4>
          
          <div class="setting-group">
            <label>密码长度：</label>
            <div class="length-control">
              <input 
                type="range" 
                v-model="passwordLength" 
                min="4" 
                max="128" 
                @input="generatePassword"
                class="length-slider"
              >
              <input 
                type="number" 
                v-model="passwordLength" 
                min="4" 
                max="128" 
                @change="generatePassword"
                class="length-input"
              >
              <span class="length-label">位</span>
            </div>
          </div>
          
          <div class="setting-group">
            <label>字符类型：</label>
            <div class="charset-options">
              <label class="charset-option">
                <input type="checkbox" v-model="includeUppercase" @change="generatePassword">
                <span>大写字母 (A-Z)</span>
                <small>{{ uppercaseChars }}</small>
              </label>
              <label class="charset-option">
                <input type="checkbox" v-model="includeLowercase" @change="generatePassword">
                <span>小写字母 (a-z)</span>
                <small>{{ lowercaseChars }}</small>
              </label>
              <label class="charset-option">
                <input type="checkbox" v-model="includeNumbers" @change="generatePassword">
                <span>数字 (0-9)</span>
                <small>{{ numberChars }}</small>
              </label>
              <label class="charset-option">
                <input type="checkbox" v-model="includeSymbols" @change="generatePassword">
                <span>特殊符号</span>
                <small>{{ symbolChars }}</small>
              </label>
            </div>
          </div>
          
          <div class="setting-group">
            <label>自定义字符：</label>
            <input 
              v-model="customChars" 
              @input="generatePassword"
              placeholder="添加自定义字符..."
              class="custom-input"
            >
            <small>例如：!@#$%^&*()</small>
          </div>
          
          <div class="setting-group">
            <label>排除字符：</label>
            <input 
              v-model="excludeChars" 
              @input="generatePassword"
              placeholder="排除容易混淆的字符..."
              class="exclude-input"
            >
            <small>例如：0O1lI (排除容易混淆的字符)</small>
          </div>
          
          <div class="setting-group">
            <label>高级选项：</label>
            <div class="advanced-options">
              <label class="option">
                <input type="checkbox" v-model="avoidAmbiguous" @change="generatePassword">
                <span>避免混淆字符 (0O1lI)</span>
              </label>
              <label class="option">
                <input type="checkbox" v-model="requireAllTypes" @change="generatePassword">
                <span>必须包含所有选中类型</span>
              </label>
              <label class="option">
                <input type="checkbox" v-model="noRepeats" @change="generatePassword">
                <span>不重复字符</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="result-panel">
          <h4>生成的密码：</h4>
          <div class="password-display">
            <div class="password-field">
              <input 
                :value="generatedPassword" 
                readonly 
                :type="showPassword ? 'text' : 'password'"
                class="password-input"
                ref="passwordInput"
              >
              <button 
                class="toggle-btn" 
                @click="showPassword = !showPassword"
                title="显示/隐藏密码"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
              <button 
                class="copy-btn" 
                @click="copyPassword"
                title="复制密码"
              >
                📋
              </button>
            </div>
          </div>
          
          <div class="password-actions">
            <button class="btn btn-primary" @click="generatePassword">🔄 重新生成</button>
            <button class="btn" @click="generateMultiple">🔢 批量生成</button>
            <button class="btn" @click="checkStrength">🛡️ 强度检测</button>
          </div>
          
          <div v-if="passwordStrength" class="strength-display">
            <h5>密码强度分析：</h5>
            <div class="strength-bar">
              <div 
                class="strength-fill" 
                :class="passwordStrength.level"
                :style="{ width: passwordStrength.score + '%' }"
              ></div>
            </div>
            <div class="strength-info">
              <div class="strength-level">
                强度：<span :class="passwordStrength.level">{{ passwordStrength.label }}</span>
              </div>
              <div class="strength-details">
                <div class="detail-item">长度：{{ generatedPassword.length }} 位</div>
                <div class="detail-item">字符类型：{{ passwordStrength.types }} 种</div>
                <div class="detail-item">熵值：{{ passwordStrength.entropy }} 位</div>
                <div class="detail-item">破解时间：{{ passwordStrength.crackTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="multiplePasswords.length > 0" class="multiple-section">
        <h4>批量生成结果：</h4>
        <div class="passwords-list">
          <div 
            v-for="(password, index) in multiplePasswords" 
            :key="index"
            class="password-item"
          >
            <span class="password-text">{{ password }}</span>
            <button class="copy-btn" @click="copyValue(password)" title="复制">📋</button>
          </div>
        </div>
        <div class="multiple-actions">
          <button class="btn" @click="copyAllPasswords">📋 复制全部</button>
          <button class="btn" @click="exportPasswords">💾 导出文件</button>
          <button class="btn" @click="clearMultiple">🗑️ 清空</button>
        </div>
      </div>
      
      <div class="presets-section">
        <h4>预设方案：</h4>
        <div class="preset-buttons">
          <button class="preset-btn" @click="loadPreset('simple')">
            <h5>简单密码</h5>
            <p>8位，字母+数字</p>
          </button>
          <button class="preset-btn" @click="loadPreset('standard')">
            <h5>标准密码</h5>
            <p>12位，字母+数字+符号</p>
          </button>
          <button class="preset-btn" @click="loadPreset('strong')">
            <h5>强密码</h5>
            <p>16位，所有字符类型</p>
          </button>
          <button class="preset-btn" @click="loadPreset('wifi')">
            <h5>WiFi密码</h5>
            <p>8-15位，易记忆</p>
          </button>
          <button class="preset-btn" @click="loadPreset('pin')">
            <h5>PIN码</h5>
            <p>4-6位纯数字</p>
          </button>
        </div>
      </div>
      
      <div class="tips-section">
        <h4>密码安全建议：</h4>
        <div class="tips-content">
          <div class="tip-category">
            <h5>强度建议：</h5>
            <ul>
              <li>长度至少 12 位以上</li>
              <li>包含大小写字母、数字和特殊符号</li>
              <li>避免使用个人信息</li>
              <li>避免使用常见词汇和模式</li>
            </ul>
          </div>
          <div class="tip-category">
            <h5>使用建议：</h5>
            <ul>
              <li>不同账户使用不同密码</li>
              <li>定期更换重要密码</li>
              <li>使用密码管理器</li>
              <li>启用双因素认证</li>
            </ul>
          </div>
          <div class="tip-category">
            <h5>存储建议：</h5>
            <ul>
              <li>不在浏览器中保存重要密码</li>
              <li>不通过不安全渠道传输</li>
              <li>不在纸质文档中明文记录</li>
              <li>使用专业密码管理工具</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordGenerator',
  data() {
    return {
      passwordLength: 12,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      customChars: '',
      excludeChars: '',
      avoidAmbiguous: false,
      requireAllTypes: false,
      noRepeats: false,
      generatedPassword: '',
      showPassword: true,
      passwordStrength: null,
      multiplePasswords: [],
      uppercaseChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercaseChars: 'abcdefghijklmnopqrstuvwxyz',
      numberChars: '0123456789',
      symbolChars: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    }
  },
  methods: {
    generatePassword() {
      let charset = ''
      
      // 构建字符集
      if (this.includeUppercase) charset += this.uppercaseChars
      if (this.includeLowercase) charset += this.lowercaseChars
      if (this.includeNumbers) charset += this.numberChars
      if (this.includeSymbols) charset += this.symbolChars
      if (this.customChars) charset += this.customChars
      
      // 处理排除字符
      if (this.excludeChars) {
        for (const char of this.excludeChars) {
          charset = charset.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
        }
      }
      
      // 避免混淆字符
      if (this.avoidAmbiguous) {
        charset = charset.replace(/[0O1lI]/g, '')
      }
      
      if (!charset) {
        this.generatedPassword = ''
        return
      }
      
      // 去重字符集（如果需要）
      if (this.noRepeats) {
        charset = [...new Set(charset)].join('')
        if (this.passwordLength > charset.length) {
          this.passwordLength = charset.length
        }
      }
      
      let password = ''
      const usedChars = new Set()
      
      // 如果需要包含所有类型，先确保每种类型至少有一个字符
      if (this.requireAllTypes) {
        const requiredChars = []
        if (this.includeUppercase) requiredChars.push(this.getRandomChar(this.uppercaseChars))
        if (this.includeLowercase) requiredChars.push(this.getRandomChar(this.lowercaseChars))
        if (this.includeNumbers) requiredChars.push(this.getRandomChar(this.numberChars))
        if (this.includeSymbols) requiredChars.push(this.getRandomChar(this.symbolChars))
        
        // 随机排列必需字符
        for (let i = requiredChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]]
        }
        
        password = requiredChars.join('')
        if (this.noRepeats) {
          requiredChars.forEach(char => usedChars.add(char))
        }
      }
      
      // 生成剩余字符
      while (password.length < this.passwordLength) {
        let availableChars = charset
        if (this.noRepeats) {
          availableChars = charset.split('').filter(char => !usedChars.has(char)).join('')
          if (!availableChars) break
        }
        
        const randomChar = this.getRandomChar(availableChars)
        password += randomChar
        if (this.noRepeats) {
          usedChars.add(randomChar)
        }
      }
      
      // 最终打乱密码
      this.generatedPassword = this.shuffleString(password)
      this.passwordStrength = null
    },
    
    getRandomChar(charset) {
      return charset.charAt(Math.floor(Math.random() * charset.length))
    },
    
    shuffleString(str) {
      const array = str.split('')
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array.join('')
    },
    
    generateMultiple() {
      const count = parseInt(prompt('请输入要生成的密码数量 (1-50):', '10'))
      if (!count || count < 1 || count > 50) return
      
      this.multiplePasswords = []
      for (let i = 0; i < count; i++) {
        this.generatePassword()
        if (this.generatedPassword) {
          this.multiplePasswords.push(this.generatedPassword)
        }
      }
      this.generatePassword() // 重新生成一个显示在主面板
    },
    
    checkStrength() {
      this.passwordStrength = this.calculateStrength(this.generatedPassword)
    },
    
    calculateStrength(password) {
      if (!password) return null
      
      let score = 0
      let types = 0
      const checks = {
        hasLower: /[a-z]/.test(password),
        hasUpper: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSymbol: /[^a-zA-Z0-9]/.test(password)
      }
      
      // 计算字符类型
      Object.values(checks).forEach(check => {
        if (check) types++
      })
      
      // 长度评分
      if (password.length >= 8) score += 25
      if (password.length >= 12) score += 25
      if (password.length >= 16) score += 25
      
      // 字符类型评分
      score += types * 5
      
      // 复杂度评分
      if (types >= 3) score += 10
      if (types === 4) score += 15
      
      // 计算熵值
      let charset = 0
      if (checks.hasLower) charset += 26
      if (checks.hasUpper) charset += 26
      if (checks.hasNumber) charset += 10
      if (checks.hasSymbol) charset += 32
      
      const entropy = Math.log2(charset) * password.length
      
      // 确定强度等级
      let level, label, crackTime
      if (score < 40) {
        level = 'weak'
        label = '弱'
        crackTime = '几秒内'
      } else if (score < 60) {
        level = 'fair'
        label = '一般'
        crackTime = '几小时内'
      } else if (score < 80) {
        level = 'good'
        label = '良好'
        crackTime = '几年'
      } else {
        level = 'strong'
        label = '强'
        crackTime = '数世纪'
      }
      
      return {
        score: Math.min(score, 100),
        level,
        label,
        types,
        entropy: Math.round(entropy),
        crackTime
      }
    },
    
    loadPreset(type) {
      switch (type) {
        case 'simple':
          this.passwordLength = 8
          this.includeUppercase = true
          this.includeLowercase = true
          this.includeNumbers = true
          this.includeSymbols = false
          this.avoidAmbiguous = true
          break
        case 'standard':
          this.passwordLength = 12
          this.includeUppercase = true
          this.includeLowercase = true
          this.includeNumbers = true
          this.includeSymbols = true
          this.requireAllTypes = true
          break
        case 'strong':
          this.passwordLength = 16
          this.includeUppercase = true
          this.includeLowercase = true
          this.includeNumbers = true
          this.includeSymbols = true
          this.requireAllTypes = true
          this.avoidAmbiguous = false
          break
        case 'wifi':
          this.passwordLength = 12
          this.includeUppercase = true
          this.includeLowercase = true
          this.includeNumbers = true
          this.includeSymbols = false
          this.avoidAmbiguous = true
          break
        case 'pin':
          this.passwordLength = 6
          this.includeUppercase = false
          this.includeLowercase = false
          this.includeNumbers = true
          this.includeSymbols = false
          break
      }
      
      this.customChars = ''
      this.excludeChars = ''
      this.noRepeats = false
      this.generatePassword()
    },
    
    async copyPassword() {
      await this.copyValue(this.generatedPassword)
    },
    
    async copyValue(value) {
      try {
        await navigator.clipboard.writeText(value)
        this.showToast('复制成功！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    async copyAllPasswords() {
      const text = this.multiplePasswords.join('\n')
      await this.copyValue(text)
    },
    
    exportPasswords() {
      const text = this.multiplePasswords.join('\n')
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `passwords_${Date.now()}.txt`
      link.click()
      URL.revokeObjectURL(url)
    },
    
    clearMultiple() {
      this.multiplePasswords = []
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
    this.generatePassword()
  }
}
</script>

<style scoped>
.tool-description {
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

.generator-section {
  margin-top: 20px;
}

.settings-panel {
  background: var(--color-bg-secondary);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid var(--color-border);
}

.settings-panel h4 {
  color: var(--color-text-primary);
  margin-bottom: 20px;
  font-size: 16px;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group label {
  display: block;
  margin-bottom: 10px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.length-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.length-slider {
  flex: 1;
}

.length-input {
  width: 80px;
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.length-label {
  color: var(--color-text-secondary);
}

.charset-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.charset-option {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.charset-option:hover {
  border-color: var(--color-accent);
}

.charset-option input {
  margin-right: 8px;
}

.charset-option span {
  color: var(--color-text-primary);
  font-weight: 500;
}

.charset-option small {
  color: var(--color-text-muted);
  font-size: 12px;
  margin-top: 4px;
}

.custom-input,
.exclude-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 14px;
}

.custom-input::placeholder,
.exclude-input::placeholder {
  color: var(--color-text-muted);
}

.advanced-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
}

.option input {
  margin: 0;
}

.option span {
  color: var(--color-text-primary);
  font-size: 14px;
}

.result-panel {
  background: var(--color-bg-secondary);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.result-panel h4 {
  color: var(--color-text-primary);
  margin-bottom: 20px;
  font-size: 16px;
}

.password-display {
  margin-bottom: 20px;
}

.password-field {
  display: flex;
  gap: 10px;
}

.password-input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: monospace;
  font-size: 14px;
}

.password-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.toggle-btn,
.copy-btn {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0 15px;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: all 0.2s ease;
}

.toggle-btn:hover,
.copy-btn:hover {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.password-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.strength-display {
  background: var(--color-bg-primary);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.strength-display h5 {
  color: var(--color-text-primary);
  margin-bottom: 15px;
}

.strength-bar {
  height: 10px;
  background: var(--color-bg-tertiary);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 15px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background: var(--color-error);
  width: 25%;
}

.strength-fill.medium {
  background: var(--color-warning);
  width: 50%;
}

.strength-fill.strong {
  background: var(--color-success);
  width: 75%;
}

.strength-fill.very-strong {
  background: #0ea5e9;
  width: 100%;
}

.strength-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.strength-level {
  color: var(--color-text-primary);
  font-weight: 500;
}

.strength-level .weak {
  color: var(--color-error);
}

.strength-level .medium {
  color: var(--color-warning);
}

.strength-level .strong {
  color: var(--color-success);
}

.strength-level .very-strong {
  color: #0ea5e9;
}

.strength-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.multiple-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.multiple-section h4 {
  color: var(--color-text-primary);
  margin-bottom: 20px;
}

.passwords-list {
  display: grid;
  gap: 10px;
  margin-bottom: 20px;
}

.password-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.password-text {
  flex: 1;
  font-family: monospace;
  color: var(--color-text-primary);
  word-break: break-all;
}

.multiple-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.presets-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.presets-section h4 {
  color: var(--color-text-primary);
  margin-bottom: 20px;
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.preset-btn {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.preset-btn:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.preset-btn h5 {
  color: var(--color-text-primary);
  margin-bottom: 8px;
  font-size: 14px;
}

.preset-btn p {
  color: var(--color-text-secondary);
  font-size: 12px;
  margin: 0;
}

.info-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.info-section h4 {
  color: var(--color-text-primary);
  margin-bottom: 15px;
}

.info-content ul {
  color: var(--color-text-secondary);
  line-height: 1.8;
  padding-left: 20px;
  margin-bottom: 15px;
}

.info-content li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .charset-options {
    grid-template-columns: 1fr;
  }
  
  .advanced-options {
    grid-template-columns: 1fr;
  }
  
  .strength-info {
    grid-template-columns: 1fr;
  }
  
  .preset-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .password-field {
    flex-direction: column;
  }
  
  .toggle-btn,
  .copy-btn {
    padding: 12px;
  }
}
</style>