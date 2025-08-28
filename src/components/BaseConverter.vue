<template>
  <div class="container">
    <div class="card">
      <h2>🔢 进制转换器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        数字进制转换工具，支持二进制、八进制、十进制、十六进制互转
      </p>
      
      <div class="converter-section">
        <div class="input-section">
          <div class="base-input">
            <label>二进制 (Binary)：</label>
            <div class="input-with-clear">
              <input 
                v-model="binaryValue" 
                @input="convertFrom('binary')"
                placeholder="例如: 1010101"
                pattern="[01]*"
                class="base-field"
              >
              <button class="clear-btn" @click="clearValue('binary')" title="清空">✕</button>
            </div>
            <div class="input-help">仅支持 0 和 1</div>
          </div>
          
          <div class="base-input">
            <label>八进制 (Octal)：</label>
            <div class="input-with-clear">
              <input 
                v-model="octalValue" 
                @input="convertFrom('octal')"
                placeholder="例如: 125"
                pattern="[0-7]*"
                class="base-field"
              >
              <button class="clear-btn" @click="clearValue('octal')" title="清空">✕</button>
            </div>
            <div class="input-help">仅支持 0-7</div>
          </div>
          
          <div class="base-input">
            <label>十进制 (Decimal)：</label>
            <div class="input-with-clear">
              <input 
                v-model="decimalValue" 
                @input="convertFrom('decimal')"
                placeholder="例如: 85"
                pattern="[0-9]*"
                class="base-field"
              >
              <button class="clear-btn" @click="clearValue('decimal')" title="清空">✕</button>
            </div>
            <div class="input-help">仅支持 0-9</div>
          </div>
          
          <div class="base-input">
            <label>十六进制 (Hexadecimal)：</label>
            <div class="input-with-clear">
              <input 
                v-model="hexValue" 
                @input="convertFrom('hex')"
                placeholder="例如: 55 或 0x55"
                pattern="[0-9A-Fa-f]*"
                class="base-field"
              >
              <button class="clear-btn" @click="clearValue('hex')" title="清空">✕</button>
            </div>
            <div class="input-help">支持 0-9, A-F (不区分大小写)</div>
          </div>
        </div>
        
        <div class="result-section">
          <h4>转换结果：</h4>
          <div class="result-grid">
            <div class="result-item">
              <span class="result-label">二进制：</span>
              <span class="result-value">{{ formatBinary(binaryValue) }}</span>
              <button class="copy-btn" @click="copyValue(binaryValue)" title="复制">📋</button>
            </div>
            <div class="result-item">
              <span class="result-label">八进制：</span>
              <span class="result-value">{{ octalValue || '0' }}</span>
              <button class="copy-btn" @click="copyValue(octalValue)" title="复制">📋</button>
            </div>
            <div class="result-item">
              <span class="result-label">十进制：</span>
              <span class="result-value">{{ decimalValue || '0' }}</span>
              <button class="copy-btn" @click="copyValue(decimalValue)" title="复制">📋</button>
            </div>
            <div class="result-item">
              <span class="result-label">十六进制：</span>
              <span class="result-value">{{ formatHex(hexValue) }}</span>
              <button class="copy-btn" @click="copyValue(formatHex(hexValue))" title="复制">📋</button>
            </div>
          </div>
          
          <div v-if="decimalValue && decimalValue !== '0'" class="additional-info">
            <h5>附加信息：</h5>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">位数 (二进制)：</span>
                <span class="info-value">{{ getBitCount() }} 位</span>
              </div>
              <div class="info-item">
                <span class="info-label">字节数：</span>
                <span class="info-value">{{ getByteCount() }} 字节</span>
              </div>
              <div class="info-item">
                <span class="info-label">符号表示：</span>
                <span class="info-value">{{ getSignedValue() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="quick-convert">
        <h4>快速转换：</h4>
        <div class="quick-buttons">
          <button class="quick-btn" @click="loadExample(255)">255 (1字节最大值)</button>
          <button class="quick-btn" @click="loadExample(65535)">65535 (2字节最大值)</button>
          <button class="quick-btn" @click="loadExample(1024)">1024 (1KB)</button>
          <button class="quick-btn" @click="loadExample(4096)">4096 (4KB)</button>
          <button class="quick-btn" @click="loadExample(16777216)">16777216 (16MB)</button>
          <button class="quick-btn" @click="clearAll()">清空所有</button>
        </div>
      </div>
      
      <div class="calculation-section">
        <h4>进制运算：</h4>
        <div class="calc-controls">
          <div class="calc-input-group">
            <label>数值 A：</label>
            <input v-model="calcA" placeholder="输入十进制数值" type="number">
          </div>
          <div class="calc-input-group">
            <label>运算符：</label>
            <select v-model="calcOperator">
              <option value="+">加法 (+)</option>
              <option value="-">减法 (-)</option>
              <option value="*">乘法 (×)</option>
              <option value="/">除法 (÷)</option>
              <option value="%">取模 (%)</option>
              <option value="&">按位与 (&)</option>
              <option value="|">按位或 (|)</option>
              <option value="^">按位异或 (^)</option>
              <option value="<<">左移 (<<)</option>
              <option value=">>">右移 (>>)</option>
            </select>
          </div>
          <div class="calc-input-group">
            <label>数值 B：</label>
            <input v-model="calcB" placeholder="输入十进制数值" type="number">
          </div>
          <button class="btn" @click="calculate">计算</button>
        </div>
        
        <div v-if="calcResult !== null" class="calc-result">
          <h5>运算结果：</h5>
          <div class="calc-result-grid">
            <div class="calc-result-item">
              <span class="calc-label">表达式：</span>
              <span class="calc-value">{{ calcA }} {{ calcOperator }} {{ calcB }} = {{ calcResult }}</span>
            </div>
            <div class="calc-result-item">
              <span class="calc-label">二进制：</span>
              <span class="calc-value">{{ formatBinary(calcResult.toString(2)) }}</span>
            </div>
            <div class="calc-result-item">
              <span class="calc-label">八进制：</span>
              <span class="calc-value">{{ calcResult.toString(8) }}</span>
            </div>
            <div class="calc-result-item">
              <span class="calc-label">十六进制：</span>
              <span class="calc-value">{{ formatHex(calcResult.toString(16)) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <h4>进制说明：</h4>
        <div class="info-grid">
          <div class="info-card">
            <h5>二进制 (Base 2)</h5>
            <p>使用数字：0, 1</p>
            <p>用途：计算机内部表示</p>
            <p>示例：1010 = 10₁₀</p>
          </div>
          <div class="info-card">
            <h5>八进制 (Base 8)</h5>
            <p>使用数字：0, 1, 2, 3, 4, 5, 6, 7</p>
            <p>用途：Unix文件权限</p>
            <p>示例：12 = 10₁₀</p>
          </div>
          <div class="info-card">
            <h5>十进制 (Base 10)</h5>
            <p>使用数字：0, 1, 2, 3, 4, 5, 6, 7, 8, 9</p>
            <p>用途：日常计算</p>
            <p>示例：10 = 10₁₀</p>
          </div>
          <div class="info-card">
            <h5>十六进制 (Base 16)</h5>
            <p>使用字符：0-9, A-F</p>
            <p>用途：颜色代码、内存地址</p>
            <p>示例：A = 10₁₀</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseConverter',
  data() {
    return {
      binaryValue: '',
      octalValue: '',
      decimalValue: '',
      hexValue: '',
      calcA: '',
      calcB: '',
      calcOperator: '+',
      calcResult: null,
      isConverting: false
    }
  },
  methods: {
    convertFrom(fromBase) {
      if (this.isConverting) return
      this.isConverting = true
      
      try {
        let decimalVal = 0
        
        switch (fromBase) {
          case 'binary':
            if (this.binaryValue && this.isValidBinary(this.binaryValue)) {
              decimalVal = parseInt(this.binaryValue, 2)
            } else if (this.binaryValue && !this.isValidBinary(this.binaryValue)) {
              this.showError('二进制数只能包含 0 和 1')
              this.isConverting = false
              return
            }
            break
          case 'octal':
            if (this.octalValue && this.isValidOctal(this.octalValue)) {
              decimalVal = parseInt(this.octalValue, 8)
            } else if (this.octalValue && !this.isValidOctal(this.octalValue)) {
              this.showError('八进制数只能包含 0-7')
              this.isConverting = false
              return
            }
            break
          case 'decimal':
            if (this.decimalValue && this.isValidDecimal(this.decimalValue)) {
              decimalVal = parseInt(this.decimalValue, 10)
            } else if (this.decimalValue && !this.isValidDecimal(this.decimalValue)) {
              this.showError('十进制数只能包含 0-9')
              this.isConverting = false
              return
            }
            break
          case 'hex':
            if (this.hexValue && this.isValidHex(this.hexValue)) {
              const cleanHex = this.hexValue.replace(/^0x/i, '')
              decimalVal = parseInt(cleanHex, 16)
            } else if (this.hexValue && !this.isValidHex(this.hexValue)) {
              this.showError('十六进制数只能包含 0-9, A-F')
              this.isConverting = false
              return
            }
            break
        }
        
        if (decimalVal >= 0) {
          this.updateAllValues(decimalVal, fromBase)
        }
      } catch (error) {
        this.showError('转换失败，请检查输入格式')
      }
      
      this.isConverting = false
    },
    
    updateAllValues(decimalVal, excludeBase) {
      if (excludeBase !== 'decimal') {
        this.decimalValue = decimalVal.toString()
      }
      if (excludeBase !== 'binary') {
        this.binaryValue = decimalVal.toString(2)
      }
      if (excludeBase !== 'octal') {
        this.octalValue = decimalVal.toString(8)
      }
      if (excludeBase !== 'hex') {
        this.hexValue = decimalVal.toString(16).toUpperCase()
      }
    },
    
    isValidBinary(value) {
      return /^[01]+$/.test(value)
    },
    
    isValidOctal(value) {
      return /^[0-7]+$/.test(value)
    },
    
    isValidDecimal(value) {
      return /^[0-9]+$/.test(value)
    },
    
    isValidHex(value) {
      const cleanValue = value.replace(/^0x/i, '')
      return /^[0-9A-Fa-f]+$/.test(cleanValue)
    },
    
    formatBinary(value) {
      if (!value) return '0'
      return value.replace(/(.{4})/g, '$1 ').trim()
    },
    
    formatHex(value) {
      if (!value) return '0x0'
      return '0x' + value.toUpperCase()
    },
    
    getBitCount() {
      return this.binaryValue ? this.binaryValue.length : 0
    },
    
    getByteCount() {
      const bits = this.getBitCount()
      return Math.ceil(bits / 8)
    },
    
    getSignedValue() {
      const decimal = parseInt(this.decimalValue || '0')
      if (decimal <= 127) return `${decimal} (8位有符号)`
      if (decimal <= 32767) return `${decimal} (16位有符号)`
      if (decimal <= 2147483647) return `${decimal} (32位有符号)`
      return `${decimal} (64位有符号)`
    },
    
    clearValue(base) {
      switch (base) {
        case 'binary':
          this.binaryValue = ''
          break
        case 'octal':
          this.octalValue = ''
          break
        case 'decimal':
          this.decimalValue = ''
          break
        case 'hex':
          this.hexValue = ''
          break
      }
      
      // 如果清空了值，将其他值也清空
      if (!this.binaryValue && !this.octalValue && !this.decimalValue && !this.hexValue) {
        this.clearAll()
      }
    },
    
    clearAll() {
      this.binaryValue = ''
      this.octalValue = ''
      this.decimalValue = ''
      this.hexValue = ''
      this.calcResult = null
    },
    
    loadExample(value) {
      this.decimalValue = value.toString()
      this.convertFrom('decimal')
    },
    
    calculate() {
      const a = parseInt(this.calcA)
      const b = parseInt(this.calcB)
      
      if (isNaN(a) || isNaN(b)) {
        this.showError('请输入有效的数值')
        return
      }
      
      try {
        let result
        switch (this.calcOperator) {
          case '+':
            result = a + b
            break
          case '-':
            result = a - b
            break
          case '*':
            result = a * b
            break
          case '/':
            if (b === 0) {
              this.showError('除数不能为零')
              return
            }
            result = Math.floor(a / b)
            break
          case '%':
            if (b === 0) {
              this.showError('除数不能为零')
              return
            }
            result = a % b
            break
          case '&':
            result = a & b
            break
          case '|':
            result = a | b
            break
          case '^':
            result = a ^ b
            break
          case '<<':
            result = a << b
            break
          case '>>':
            result = a >> b
            break
        }
        
        this.calcResult = result
      } catch (error) {
        this.showError('计算出错')
      }
    },
    
    async copyValue(value) {
      if (!value) return
      
      try {
        await navigator.clipboard.writeText(value)
        this.showToast('复制成功！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    showError(message) {
      this.showToast(message, 'error')
    },
    
    showToast(message, type = 'success') {
      const toast = document.createElement('div')
      toast.textContent = message
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : 'rgba(0, 0, 0, 0.8)'};
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
    this.loadExample(85) // 默认示例
  }
}
</script>

<style scoped>
.converter-section {
  margin-bottom: 40px;
}

.input-section {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

.base-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.base-input label {
  color: #37474f;
  font-weight: 500;
  font-size: 14px;
}

.input-with-clear {
  display: flex;
  gap: 8px;
  align-items: center;
}

.base-field {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
}

.clear-btn {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #eeeeee;
  color: #333;
}

.input-help {
  font-size: 12px;
  color: #78909c;
}

.result-section {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.result-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.result-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.result-label {
  color: #78909c;
  min-width: 80px;
  font-size: 14px;
}

.result-value {
  flex: 1;
  font-family: monospace;
  color: #37474f;
  font-weight: 500;
}

.copy-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #e2e8f0;
}

.additional-info {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.additional-info h5 {
  color: #37474f;
  margin-bottom: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.info-label {
  color: #78909c;
}

.info-value {
  color: #37474f;
  font-weight: 500;
}

.quick-convert {
  margin-bottom: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.quick-convert h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.quick-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-btn {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #37474f;
  transition: all 0.2s ease;
}

.quick-btn:hover {
  border-color: #2196f3;
  background: #f0f7ff;
}

.calculation-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.calculation-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.calc-controls {
  display: flex;
  gap: 16px;
  align-items: end;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.calc-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.calc-input-group label {
  font-size: 14px;
  color: #37474f;
  font-weight: 500;
}

.calc-input-group input,
.calc-input-group select {
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  min-width: 120px;
}

.calc-result {
  background: #f0f7ff;
  border: 1px solid #bbdefb;
  border-radius: 6px;
  padding: 16px;
}

.calc-result h5 {
  color: #1976d2;
  margin-bottom: 12px;
}

.calc-result-grid {
  display: grid;
  gap: 8px;
}

.calc-result-item {
  display: flex;
  gap: 12px;
  font-size: 14px;
}

.calc-label {
  color: #1976d2;
  min-width: 80px;
}

.calc-value {
  font-family: monospace;
  color: #37474f;
  font-weight: 500;
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

.info-section .info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-card {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.info-card h5 {
  color: #37474f;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-card p {
  color: #78909c;
  margin: 4px 0;
  font-size: 13px;
}

@media (max-width: 768px) {
  .calc-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .quick-buttons {
    flex-direction: column;
  }
  
  .info-section .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>