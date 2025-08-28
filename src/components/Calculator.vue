<template>
  <div class="container">
    <div class="card">
      <h2>🧮 多功能计算器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        支持基本运算、科学计算、程序员计算等多种模式
      </p>
      
      <div class="calculator-modes">
        <button 
          v-for="mode in modes" 
          :key="mode.key"
          class="mode-btn" 
          :class="{ active: activeMode === mode.key }"
          @click="setMode(mode.key)"
        >
          {{ mode.icon }} {{ mode.name }}
        </button>
      </div>
      
      <div class="calculator">
        <div class="display">
          <div class="expression">{{ expression || '0' }}</div>
          <div class="result">{{ result }}</div>
        </div>
        
        <!-- 基础计算器 -->
        <div v-if="activeMode === 'basic'" class="keypad basic-keypad">
          <button class="key clear" @click="clear">C</button>
          <button class="key operator" @click="clearEntry">CE</button>
          <button class="key operator" @click="backspace">⌫</button>
          <button class="key operator" @click="inputOperator('/')">÷</button>
          
          <button class="key number" @click="inputNumber('7')">7</button>
          <button class="key number" @click="inputNumber('8')">8</button>
          <button class="key number" @click="inputNumber('9')">9</button>
          <button class="key operator" @click="inputOperator('*')">×</button>
          
          <button class="key number" @click="inputNumber('4')">4</button>
          <button class="key number" @click="inputNumber('5')">5</button>
          <button class="key number" @click="inputNumber('6')">6</button>
          <button class="key operator" @click="inputOperator('-')">-</button>
          
          <button class="key number" @click="inputNumber('1')">1</button>
          <button class="key number" @click="inputNumber('2')">2</button>
          <button class="key number" @click="inputNumber('3')">3</button>
          <button class="key operator" @click="inputOperator('+')">+</button>
          
          <button class="key number zero" @click="inputNumber('0')">0</button>
          <button class="key number" @click="inputDecimal">.</button>
          <button class="key equals" @click="calculate">=</button>
        </div>
        
        <!-- 科学计算器 -->
        <div v-if="activeMode === 'scientific'" class="keypad scientific-keypad">
          <button class="key function" @click="inputFunction('sin')">sin</button>
          <button class="key function" @click="inputFunction('cos')">cos</button>
          <button class="key function" @click="inputFunction('tan')">tan</button>
          <button class="key function" @click="inputFunction('log')">log</button>
          <button class="key function" @click="inputFunction('ln')">ln</button>
          
          <button class="key operator" @click="clear">C</button>
          <button class="key operator" @click="clearEntry">CE</button>
          <button class="key operator" @click="backspace">⌫</button>
          <button class="key operator" @click="inputOperator('/')">÷</button>
          <button class="key function" @click="inputFunction('sqrt')">√</button>
          
          <button class="key number" @click="inputNumber('7')">7</button>
          <button class="key number" @click="inputNumber('8')">8</button>
          <button class="key number" @click="inputNumber('9')">9</button>
          <button class="key operator" @click="inputOperator('*')">×</button>
          <button class="key function" @click="inputFunction('pow')">x²</button>
          
          <button class="key number" @click="inputNumber('4')">4</button>
          <button class="key number" @click="inputNumber('5')">5</button>
          <button class="key number" @click="inputNumber('6')">6</button>
          <button class="key operator" @click="inputOperator('-')">-</button>
          <button class="key function" @click="inputParenthesis">()</button>
          
          <button class="key number" @click="inputNumber('1')">1</button>
          <button class="key number" @click="inputNumber('2')">2</button>
          <button class="key number" @click="inputNumber('3')">3</button>
          <button class="key operator" @click="inputOperator('+')">+</button>
          <button class="key function" @click="inputConstant('pi')">π</button>
          
          <button class="key number zero" @click="inputNumber('0')">0</button>
          <button class="key number" @click="inputDecimal">.</button>
          <button class="key equals" @click="calculate">=</button>
          <button class="key function" @click="inputConstant('e')">e</button>
        </div>
        
        <!-- 程序员计算器 -->
        <div v-if="activeMode === 'programmer'" class="keypad programmer-keypad">
          <div class="number-systems">
            <div class="system" :class="{ active: numberSystem === 'hex' }" @click="setNumberSystem('hex')">
              <span>HEX</span>
              <div>{{ convertToBase(currentValue, 16) }}</div>
            </div>
            <div class="system" :class="{ active: numberSystem === 'dec' }" @click="setNumberSystem('dec')">
              <span>DEC</span>
              <div>{{ convertToBase(currentValue, 10) }}</div>
            </div>
            <div class="system" :class="{ active: numberSystem === 'oct' }" @click="setNumberSystem('oct')">
              <span>OCT</span>
              <div>{{ convertToBase(currentValue, 8) }}</div>
            </div>
            <div class="system" :class="{ active: numberSystem === 'bin' }" @click="setNumberSystem('bin')">
              <span>BIN</span>
              <div>{{ convertToBase(currentValue, 2) }}</div>
            </div>
          </div>
          
          <div class="prog-buttons">
            <button class="key operator" @click="clear">C</button>
            <button class="key operator" @click="clearEntry">CE</button>
            <button class="key operator" @click="backspace">⌫</button>
            <button class="key bitwise" @click="inputOperator('&')">AND</button>
            <button class="key bitwise" @click="inputOperator('|')">OR</button>
            <button class="key bitwise" @click="inputOperator('^')">XOR</button>
            
            <button class="key hex-digit" @click="inputHexDigit('A')" :disabled="!canInputHexDigit('A')">A</button>
            <button class="key hex-digit" @click="inputHexDigit('B')" :disabled="!canInputHexDigit('B')">B</button>
            <button class="key hex-digit" @click="inputHexDigit('C')" :disabled="!canInputHexDigit('C')">C</button>
            <button class="key hex-digit" @click="inputHexDigit('D')" :disabled="!canInputHexDigit('D')">D</button>
            <button class="key hex-digit" @click="inputHexDigit('E')" :disabled="!canInputHexDigit('E')">E</button>
            <button class="key hex-digit" @click="inputHexDigit('F')" :disabled="!canInputHexDigit('F')">F</button>
            
            <button class="key number" @click="inputDigit('7')" :disabled="!canInputDigit('7')">7</button>
            <button class="key number" @click="inputDigit('8')" :disabled="!canInputDigit('8')">8</button>
            <button class="key number" @click="inputDigit('9')" :disabled="!canInputDigit('9')">9</button>
            <button class="key operator" @click="inputOperator('/')">÷</button>
            <button class="key bitwise" @click="inputFunction('lshift')"><<</button>
            <button class="key bitwise" @click="inputFunction('rshift')">>></button>
            
            <button class="key number" @click="inputDigit('4')" :disabled="!canInputDigit('4')">4</button>
            <button class="key number" @click="inputDigit('5')" :disabled="!canInputDigit('5')">5</button>
            <button class="key number" @click="inputDigit('6')" :disabled="!canInputDigit('6')">6</button>
            <button class="key operator" @click="inputOperator('*')">×</button>
            <button class="key bitwise" @click="inputFunction('not')">NOT</button>
            <button class="key equals" @click="calculate">=</button>
            
            <button class="key number" @click="inputDigit('1')" :disabled="!canInputDigit('1')">1</button>
            <button class="key number" @click="inputDigit('2')" :disabled="!canInputDigit('2')">2</button>
            <button class="key number" @click="inputDigit('3')" :disabled="!canInputDigit('3')">3</button>
            <button class="key operator" @click="inputOperator('+')">+</button>
            
            <button class="key number zero" @click="inputDigit('0')">0</button>
            <button class="key operator" @click="inputOperator('-')">-</button>
          </div>
        </div>
      </div>
      
      <div class="history-section">
        <h4>计算历史：</h4>
        <div class="history-list">
          <div v-for="(item, index) in history" :key="index" class="history-item" @click="loadFromHistory(item)">
            <span class="history-expression">{{ item.expression }}</span>
            <span class="history-result">= {{ item.result }}</span>
          </div>
        </div>
        <button v-if="history.length > 0" class="btn" @click="clearHistory">清空历史</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calculator',
  data() {
    return {
      activeMode: 'basic',
      expression: '',
      result: '',
      currentValue: 0,
      numberSystem: 'dec',
      history: [],
      modes: [
        { key: 'basic', name: '基础', icon: '🧮' },
        { key: 'scientific', name: '科学', icon: '🔬' },
        { key: 'programmer', name: '程序员', icon: '💻' }
      ]
    }
  },
  methods: {
    setMode(mode) {
      this.activeMode = mode
      this.clear()
    },
    
    clear() {
      this.expression = ''
      this.result = ''
      this.currentValue = 0
    },
    
    clearEntry() {
      this.expression = this.expression.slice(0, -1)
    },
    
    backspace() {
      this.expression = this.expression.slice(0, -1)
    },
    
    inputNumber(num) {
      this.expression += num
    },
    
    inputDigit(digit) {
      if (this.canInputDigit(digit)) {
        this.expression += digit
      }
    },
    
    inputHexDigit(digit) {
      if (this.canInputHexDigit(digit)) {
        this.expression += digit
      }
    },
    
    canInputDigit(digit) {
      const digitValue = parseInt(digit)
      const base = this.getNumberBase()
      return digitValue < base
    },
    
    canInputHexDigit(digit) {
      return this.numberSystem === 'hex'
    },
    
    getNumberBase() {
      const bases = { bin: 2, oct: 8, dec: 10, hex: 16 }
      return bases[this.numberSystem]
    },
    
    inputDecimal() {
      if (!this.expression.includes('.')) {
        this.expression += '.'
      }
    },
    
    inputOperator(op) {
      const operators = ['+', '-', '*', '/', '&', '|', '^']
      const lastChar = this.expression.slice(-1)
      
      if (!operators.includes(lastChar)) {
        this.expression += op
      }
    },
    
    inputFunction(func) {
      switch (func) {
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log':
        case 'ln':
        case 'sqrt':
          this.expression += `${func}(`
          break
        case 'pow':
          this.expression += '^2'
          break
        default:
          this.expression += func
      }
    },
    
    inputConstant(constant) {
      const constants = { pi: Math.PI, e: Math.E }
      this.expression += constants[constant]
    },
    
    inputParenthesis() {
      const openCount = (this.expression.match(/\(/g) || []).length
      const closeCount = (this.expression.match(/\)/g) || []).length
      
      if (openCount > closeCount) {
        this.expression += ')'
      } else {
        this.expression += '('
      }
    },
    
    setNumberSystem(system) {
      this.numberSystem = system
    },
    
    convertToBase(value, base) {
      if (!value && value !== 0) return '0'
      const num = parseInt(value) || 0
      return num.toString(base).toUpperCase()
    },
    
    calculate() {
      if (!this.expression) return
      
      try {
        let expr = this.expression
        
        // 处理程序员模式的进制转换
        if (this.activeMode === 'programmer') {
          expr = this.convertProgrammerExpression(expr)
        }
        
        // 处理科学函数
        if (this.activeMode === 'scientific') {
          expr = this.convertScientificExpression(expr)
        }
        
        // 替换显示符号为计算符号
        expr = expr.replace(/×/g, '*').replace(/÷/g, '/')
        
        // 计算结果
        const result = this.evaluateExpression(expr)
        this.result = this.formatResult(result)
        this.currentValue = result
        
        // 添加到历史记录
        this.addToHistory(this.expression, this.result)
        
      } catch (error) {
        this.result = 'Error'
      }
    },
    
    convertProgrammerExpression(expr) {
      // 处理不同进制的输入
      return expr
    },
    
    convertScientificExpression(expr) {
      // 处理科学函数
      expr = expr.replace(/sin\(/g, 'Math.sin(')
      expr = expr.replace(/cos\(/g, 'Math.cos(')
      expr = expr.replace(/tan\(/g, 'Math.tan(')
      expr = expr.replace(/log\(/g, 'Math.log10(')
      expr = expr.replace(/ln\(/g, 'Math.log(')
      expr = expr.replace(/sqrt\(/g, 'Math.sqrt(')
      expr = expr.replace(/\^2/g, '**2')
      
      return expr
    },
    
    evaluateExpression(expr) {
      // 安全的表达式计算
      try {
        return Function('"use strict"; return (' + expr + ')')()
      } catch (error) {
        throw new Error('Invalid expression')
      }
    },
    
    formatResult(result) {
      if (isNaN(result) || !isFinite(result)) {
        return 'Error'
      }
      
      // 格式化数字显示
      if (Math.abs(result) < 0.000001 && result !== 0) {
        return result.toExponential(6)
      } else if (Math.abs(result) > 999999999) {
        return result.toExponential(6)
      } else {
        return parseFloat(result.toPrecision(12)).toString()
      }
    },
    
    addToHistory(expression, result) {
      this.history.unshift({ expression, result })
      if (this.history.length > 20) {
        this.history.pop()
      }
    },
    
    loadFromHistory(item) {
      this.expression = item.expression
      this.result = item.result
    },
    
    clearHistory() {
      this.history = []
    }
  }
}
</script>

<style scoped>
.calculator-modes {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.mode-btn {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.mode-btn.active {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.calculator {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.display {
  background: #1a1a1a;
  color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  min-height: 80px;
  text-align: right;
}

.expression {
  font-size: 16px;
  color: #ccc;
  margin-bottom: 8px;
  min-height: 20px;
  word-break: break-all;
}

.result {
  font-size: 24px;
  font-weight: bold;
  min-height: 32px;
}

.keypad {
  display: grid;
  gap: 8px;
}

.basic-keypad {
  grid-template-columns: repeat(4, 1fr);
}

.scientific-keypad {
  grid-template-columns: repeat(5, 1fr);
}

.programmer-keypad {
  grid-template-columns: 1fr;
  gap: 16px;
}

.key {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.key:hover:not(:disabled) {
  background: #f0f0f0;
}

.key:active:not(:disabled) {
  transform: scale(0.95);
}

.key.number {
  background: #fff;
  color: #333;
}

.key.operator {
  background: #ff9500;
  color: white;
}

.key.equals {
  background: #ff9500;
  color: white;
}

.key.clear {
  background: #d4d4d2;
  color: #333;
}

.key.function {
  background: #505050;
  color: white;
}

.key.bitwise {
  background: #007acc;
  color: white;
}

.key.hex-digit {
  background: #6c757d;
  color: white;
}

.key:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.key.zero {
  grid-column: span 2;
}

.number-systems {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.system {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.system.active {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.system span {
  font-size: 12px;
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
}

.system div {
  font-family: monospace;
  font-size: 14px;
  word-break: break-all;
}

.prog-buttons {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.history-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.history-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.history-item:hover {
  background: #e8e8e8;
}

.history-expression {
  color: #78909c;
  font-family: monospace;
}

.history-result {
  color: #37474f;
  font-weight: 500;
  font-family: monospace;
}

@media (max-width: 768px) {
  .scientific-keypad {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .prog-buttons {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .number-systems {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .key {
    padding: 12px;
    font-size: 14px;
    min-height: 45px;
  }
}
</style>