<template>
  <div class="container">
    <div class="card">
      <h2>🎨 颜色转换器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        在线颜色格式转换工具，支持HEX、RGB、HSL等格式互转
      </p>
      
      <div class="color-picker-section">
        <div class="color-display">
          <div class="color-preview" :style="{ backgroundColor: currentColor }"></div>
          <div class="color-info">
            <h4>当前颜色</h4>
            <p>{{ currentColor }}</p>
          </div>
        </div>
        
        <div class="picker-controls">
          <label>颜色选择器：</label>
          <input 
            type="color" 
            v-model="pickerColor" 
            @input="updateFromPicker"
            class="color-picker"
          >
        </div>
      </div>
      
      <div class="conversion-section">
        <div class="format-group">
          <label>HEX 格式：</label>
          <div class="input-with-copy">
            <input 
              v-model="hexValue" 
              @input="updateFromHex"
              placeholder="#FF0000"
              class="color-input"
            >
            <button class="copy-btn" @click="copyValue(hexValue)" title="复制">📋</button>
          </div>
        </div>
        
        <div class="format-group">
          <label>RGB 格式：</label>
          <div class="rgb-inputs">
            <div class="rgb-input-group">
              <label>R:</label>
              <input 
                type="number" 
                v-model.number="rgbValue.r" 
                @input="updateFromRGB"
                min="0" max="255"
                class="rgb-input"
              >
            </div>
            <div class="rgb-input-group">
              <label>G:</label>
              <input 
                type="number" 
                v-model.number="rgbValue.g" 
                @input="updateFromRGB"
                min="0" max="255"
                class="rgb-input"
              >
            </div>
            <div class="rgb-input-group">
              <label>B:</label>
              <input 
                type="number" 
                v-model.number="rgbValue.b" 
                @input="updateFromRGB"
                min="0" max="255"
                class="rgb-input"
              >
            </div>
            <button class="copy-btn" @click="copyValue(rgbString)" title="复制">📋</button>
          </div>
          <div class="format-result">{{ rgbString }}</div>
        </div>
        
        <div class="format-group">
          <label>HSL 格式：</label>
          <div class="hsl-inputs">
            <div class="hsl-input-group">
              <label>H:</label>
              <input 
                type="number" 
                v-model.number="hslValue.h" 
                @input="updateFromHSL"
                min="0" max="360"
                class="hsl-input"
              >
            </div>
            <div class="hsl-input-group">
              <label>S:</label>
              <input 
                type="number" 
                v-model.number="hslValue.s" 
                @input="updateFromHSL"
                min="0" max="100"
                class="hsl-input"
              >
              <span>%</span>
            </div>
            <div class="hsl-input-group">
              <label>L:</label>
              <input 
                type="number" 
                v-model.number="hslValue.l" 
                @input="updateFromHSL"
                min="0" max="100"
                class="hsl-input"
              >
              <span>%</span>
            </div>
            <button class="copy-btn" @click="copyValue(hslString)" title="复制">📋</button>
          </div>
          <div class="format-result">{{ hslString }}</div>
        </div>
        
        <div class="format-group">
          <label>CSS 变量：</label>
          <div class="input-with-copy">
            <input 
              :value="cssVarString" 
              readonly
              class="color-input readonly"
            >
            <button class="copy-btn" @click="copyValue(cssVarString)" title="复制">📋</button>
          </div>
        </div>
      </div>
      
      <div class="palette-section">
        <h4>预设颜色：</h4>
        <div class="color-palette">
          <div 
            v-for="color in presetColors" 
            :key="color.name"
            class="palette-item"
            @click="loadPresetColor(color)"
          >
            <div class="palette-color" :style="{ backgroundColor: color.hex }"></div>
            <span class="palette-name">{{ color.name }}</span>
            <span class="palette-hex">{{ color.hex }}</span>
          </div>
        </div>
      </div>
      
      <div class="gradient-section">
        <h4>渐变生成器：</h4>
        <div class="gradient-controls">
          <div class="gradient-colors">
            <div class="gradient-color-input">
              <label>起始颜色：</label>
              <input type="color" v-model="gradientStart" @input="updateGradient">
            </div>
            <div class="gradient-color-input">
              <label>结束颜色：</label>
              <input type="color" v-model="gradientEnd" @input="updateGradient">
            </div>
            <div class="gradient-direction">
              <label>方向：</label>
              <select v-model="gradientDirection" @change="updateGradient">
                <option value="to right">水平 →</option>
                <option value="to left">水平 ←</option>
                <option value="to bottom">垂直 ↓</option>
                <option value="to top">垂直 ↑</option>
                <option value="45deg">对角 ↗</option>
                <option value="135deg">对角 ↘</option>
              </select>
            </div>
          </div>
          
          <div class="gradient-preview" :style="{ background: gradientCSS }"></div>
          
          <div class="gradient-code">
            <label>CSS 代码：</label>
            <div class="input-with-copy">
              <textarea 
                :value="gradientCSS" 
                readonly
                rows="2"
                class="gradient-textarea"
              ></textarea>
              <button class="copy-btn" @click="copyValue(gradientCSS)" title="复制">📋</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <h4>颜色格式说明：</h4>
        <div class="format-info">
          <div class="format-item">
            <h5>HEX（十六进制）</h5>
            <p>格式：#RRGGBB 或 #RGB</p>
            <p>示例：#FF0000, #F00</p>
          </div>
          <div class="format-item">
            <h5>RGB（红绿蓝）</h5>
            <p>格式：rgb(r, g, b)</p>
            <p>取值范围：0-255</p>
          </div>
          <div class="format-item">
            <h5>HSL（色相饱和度亮度）</h5>
            <p>格式：hsl(h, s%, l%)</p>
            <p>H: 0-360°, S/L: 0-100%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorConverter',
  data() {
    return {
      pickerColor: '#ff0000',
      hexValue: '#FF0000',
      rgbValue: { r: 255, g: 0, b: 0 },
      hslValue: { h: 0, s: 100, l: 50 },
      currentColor: '#FF0000',
      gradientStart: '#ff0000',
      gradientEnd: '#0000ff',
      gradientDirection: 'to right',
      gradientCSS: '',
      presetColors: [
        { name: '红色', hex: '#FF0000' },
        { name: '绿色', hex: '#00FF00' },
        { name: '蓝色', hex: '#0000FF' },
        { name: '黄色', hex: '#FFFF00' },
        { name: '青色', hex: '#00FFFF' },
        { name: '洋红', hex: '#FF00FF' },
        { name: '橙色', hex: '#FFA500' },
        { name: '紫色', hex: '#800080' },
        { name: '粉色', hex: '#FFC0CB' },
        { name: '棕色', hex: '#A52A2A' },
        { name: '灰色', hex: '#808080' },
        { name: '黑色', hex: '#000000' },
        { name: '白色', hex: '#FFFFFF' },
        { name: '深蓝', hex: '#003366' },
        { name: '草绿', hex: '#7CB342' },
        { name: '金色', hex: '#FFD700' }
      ]
    }
  },
  computed: {
    rgbString() {
      return `rgb(${this.rgbValue.r}, ${this.rgbValue.g}, ${this.rgbValue.b})`
    },
    hslString() {
      return `hsl(${this.hslValue.h}, ${this.hslValue.s}%, ${this.hslValue.l}%)`
    },
    cssVarString() {
      return `--primary-color: ${this.hexValue};`
    }
  },
  methods: {
    updateFromPicker() {
      this.hexValue = this.pickerColor.toUpperCase()
      this.currentColor = this.hexValue
      this.hexToRgb()
      this.rgbToHsl()
    },
    
    updateFromHex() {
      if (this.isValidHex(this.hexValue)) {
        this.currentColor = this.hexValue
        this.pickerColor = this.hexValue
        this.hexToRgb()
        this.rgbToHsl()
      }
    },
    
    updateFromRGB() {
      this.rgbValue.r = Math.max(0, Math.min(255, this.rgbValue.r || 0))
      this.rgbValue.g = Math.max(0, Math.min(255, this.rgbValue.g || 0))
      this.rgbValue.b = Math.max(0, Math.min(255, this.rgbValue.b || 0))
      
      this.hexValue = this.rgbToHex()
      this.currentColor = this.hexValue
      this.pickerColor = this.hexValue
      this.rgbToHsl()
    },
    
    updateFromHSL() {
      this.hslValue.h = Math.max(0, Math.min(360, this.hslValue.h || 0))
      this.hslValue.s = Math.max(0, Math.min(100, this.hslValue.s || 0))
      this.hslValue.l = Math.max(0, Math.min(100, this.hslValue.l || 0))
      
      this.hslToRgb()
      this.hexValue = this.rgbToHex()
      this.currentColor = this.hexValue
      this.pickerColor = this.hexValue
    },
    
    updateGradient() {
      this.gradientCSS = `linear-gradient(${this.gradientDirection}, ${this.gradientStart}, ${this.gradientEnd})`
    },
    
    isValidHex(hex) {
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
    },
    
    hexToRgb() {
      const hex = this.hexValue.replace('#', '')
      const bigint = parseInt(hex, 16)
      this.rgbValue.r = (bigint >> 16) & 255
      this.rgbValue.g = (bigint >> 8) & 255
      this.rgbValue.b = bigint & 255
    },
    
    rgbToHex() {
      return '#' + [this.rgbValue.r, this.rgbValue.g, this.rgbValue.b]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('').toUpperCase()
    },
    
    rgbToHsl() {
      const r = this.rgbValue.r / 255
      const g = this.rgbValue.g / 255
      const b = this.rgbValue.b / 255
      
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h, s, l = (max + min) / 2
      
      if (max === min) {
        h = s = 0
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }
        h /= 6
      }
      
      this.hslValue.h = Math.round(h * 360)
      this.hslValue.s = Math.round(s * 100)
      this.hslValue.l = Math.round(l * 100)
    },
    
    hslToRgb() {
      const h = this.hslValue.h / 360
      const s = this.hslValue.s / 100
      const l = this.hslValue.l / 100
      
      let r, g, b
      
      if (s === 0) {
        r = g = b = l
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1
          if (t > 1) t -= 1
          if (t < 1/6) return p + (q - p) * 6 * t
          if (t < 1/2) return q
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
          return p
        }
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
      }
      
      this.rgbValue.r = Math.round(r * 255)
      this.rgbValue.g = Math.round(g * 255)
      this.rgbValue.b = Math.round(b * 255)
    },
    
    loadPresetColor(color) {
      this.hexValue = color.hex
      this.updateFromHex()
    },
    
    async copyValue(value) {
      try {
        await navigator.clipboard.writeText(value)
        this.showToast('复制成功！')
      } catch (error) {
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
          if (document.body.contains(toast)) {
            document.body.removeChild(toast)
          }
        }, 300)
      }, 2000)
    }
  },
  mounted() {
    this.updateGradient()
  }
}
</script>

<style scoped>
.color-picker-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: center;
  flex-wrap: wrap;
}

.color-display {
  display: flex;
  align-items: center;
  gap: 16px;
}

.color-preview {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-info h4 {
  margin: 0 0 4px 0;
  color: #37474f;
  font-size: 16px;
}

.color-info p {
  margin: 0;
  color: #78909c;
  font-family: monospace;
}

.picker-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-picker {
  width: 60px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.conversion-section {
  margin-bottom: 40px;
}

.format-group {
  margin-bottom: 20px;
}

.format-group label {
  display: block;
  margin-bottom: 8px;
  color: #37474f;
  font-weight: 500;
}

.input-with-copy {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: monospace;
}

.color-input.readonly {
  background: #f8f9fa;
  color: #666;
}

.rgb-inputs, .hsl-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.rgb-input-group, .hsl-input-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rgb-input-group label, .hsl-input-group label {
  margin: 0;
  font-size: 14px;
  min-width: 15px;
}

.rgb-input, .hsl-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  text-align: center;
}

.copy-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #e2e8f0;
}

.format-result {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  font-family: monospace;
  color: #37474f;
}

.palette-section {
  margin-bottom: 40px;
}

.palette-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.color-palette {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.palette-item {
  text-align: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.palette-item:hover {
  background: #f8f9fa;
}

.palette-color {
  width: 100%;
  height: 40px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  margin-bottom: 8px;
}

.palette-name {
  display: block;
  font-size: 12px;
  color: #37474f;
  margin-bottom: 2px;
}

.palette-hex {
  display: block;
  font-size: 11px;
  color: #78909c;
  font-family: monospace;
}

.gradient-section {
  margin-bottom: 40px;
}

.gradient-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.gradient-controls {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.gradient-colors {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.gradient-color-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gradient-color-input label {
  font-size: 14px;
  color: #37474f;
}

.gradient-color-input input {
  width: 60px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.gradient-direction {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gradient-direction select {
  padding: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.gradient-preview {
  height: 60px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  margin-bottom: 16px;
}

.gradient-code label {
  display: block;
  margin-bottom: 8px;
  color: #37474f;
  font-weight: 500;
}

.gradient-textarea {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: monospace;
  resize: none;
  background: #f8f9fa;
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

.format-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.format-item {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.format-item h5 {
  color: #37474f;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.format-item p {
  color: #78909c;
  margin: 4px 0;
  font-size: 13px;
  font-family: monospace;
}

@media (max-width: 768px) {
  .color-picker-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .rgb-inputs, .hsl-inputs {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .gradient-colors {
    flex-direction: column;
  }
  
  .format-info {
    grid-template-columns: 1fr;
  }
  
  .color-palette {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>