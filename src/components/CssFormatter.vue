<template>
  <div class="container">
    <div class="card">
      <h2>🎨 CSS 格式化工具</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        CSS代码美化、压缩、验证和分析工具
      </p>
      
      <div class="formatter-controls">
        <div class="mode-tabs">
          <button 
            class="mode-tab" 
            :class="{ active: mode === 'beautify' }"
            @click="mode = 'beautify'"
          >
            🎨 美化格式
          </button>
          <button 
            class="mode-tab" 
            :class="{ active: mode === 'minify' }"
            @click="mode = 'minify'"
          >
            📦 压缩代码
          </button>
          <button 
            class="mode-tab" 
            :class="{ active: mode === 'validate' }"
            @click="mode = 'validate'"
          >
            ✅ 验证CSS
          </button>
        </div>
        
        <div v-if="mode === 'beautify'" class="format-options">
          <label class="option">
            <span>缩进方式：</span>
            <select v-model="indentType">
              <option value="space">空格</option>
              <option value="tab">制表符</option>
            </select>
          </label>
          <label class="option">
            <span>缩进大小：</span>
            <input type="number" v-model="indentSize" min="1" max="8" style="width: 60px;">
          </label>
          <label class="option">
            <input type="checkbox" v-model="newlineAfterRule">
            <span>规则后换行</span>
          </label>
        </div>
      </div>
      
      <div class="css-panels">
        <div class="input-panel">
          <div class="panel-header">
            <h4>输入CSS代码</h4>
            <div class="input-actions">
              <button class="action-btn" @click="loadSample" title="加载示例">📋</button>
              <button class="action-btn" @click="clearInput" title="清空">🗑️</button>
            </div>
          </div>
          <textarea 
            v-model="inputCSS" 
            placeholder="请输入CSS代码..."
            rows="20"
            class="css-input"
          ></textarea>
          <div class="input-stats">
            <span>字符数: {{ inputCSS.length }}</span>
            <span>行数: {{ getLineCount(inputCSS) }}</span>
            <span>大小: {{ formatSize(inputCSS.length) }}</span>
          </div>
        </div>
        
        <div class="process-panel">
          <button class="process-btn" @click="processCSS">
            {{ getProcessButtonText() }}
          </button>
          
          <div v-if="cssAnalysis" class="analysis-info">
            <h5>代码分析：</h5>
            <div class="analysis-grid">
              <div class="analysis-item">
                <span class="label">选择器：</span>
                <span class="value">{{ cssAnalysis.selectors }}</span>
              </div>
              <div class="analysis-item">
                <span class="label">属性：</span>
                <span class="value">{{ cssAnalysis.properties }}</span>
              </div>
              <div class="analysis-item">
                <span class="label">颜色：</span>
                <span class="value">{{ cssAnalysis.colors }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="output-panel">
          <div class="panel-header">
            <h4>处理结果</h4>
            <div class="output-actions">
              <button class="action-btn" @click="copyOutput" title="复制">📋</button>
              <button class="action-btn" @click="downloadOutput" title="下载">💾</button>
              <button class="action-btn" @click="clearOutput" title="清空">🗑️</button>
            </div>
          </div>
          <textarea 
            v-model="outputCSS" 
            readonly 
            rows="20"
            class="css-output"
            placeholder="处理结果将显示在这里..."
          ></textarea>
          <div class="output-stats">
            <span>字符数: {{ outputCSS.length }}</span>
            <span>行数: {{ getLineCount(outputCSS) }}</span>
            <span>大小: {{ formatSize(outputCSS.length) }}</span>
            <span v-if="compressionRatio" class="compression">压缩率: {{ compressionRatio }}%</span>
          </div>
        </div>
      </div>
      
      <div v-if="validationErrors.length > 0" class="validation-section">
        <h4>验证错误：</h4>
        <div class="error-list">
          <div v-for="(error, index) in validationErrors" :key="index" class="error-item">
            <span class="error-line">行 {{ error.line }}:</span>
            <span class="error-message">{{ error.message }}</span>
          </div>
        </div>
      </div>
      
      <div class="tools-section">
        <h4>实用工具：</h4>
        <div class="tool-buttons">
          <button class="tool-btn" @click="extractColors">🎨 提取颜色</button>
          <button class="tool-btn" @click="extractSelectors">🎯 提取选择器</button>
          <button class="tool-btn" @click="generateReset">🔄 生成Reset CSS</button>
          <button class="tool-btn" @click="addAutoprefixes">🔧 添加前缀</button>
        </div>
      </div>
      
      <div v-if="extractedData" class="extracted-section">
        <h4>{{ extractedData.title }}：</h4>
        <div class="extracted-content">
          <div v-for="(item, index) in extractedData.items" :key="index" class="extracted-item">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CssFormatter',
  data() {
    return {
      mode: 'beautify',
      inputCSS: '',
      outputCSS: '',
      indentType: 'space',
      indentSize: 2,
      newlineAfterRule: true,
      cssAnalysis: null,
      validationErrors: [],
      compressionRatio: null,
      extractedData: null
    }
  },
  methods: {
    getProcessButtonText() {
      const texts = {
        beautify: '🎨 美化代码',
        minify: '📦 压缩代码',
        validate: '✅ 验证代码'
      }
      return texts[this.mode]
    },
    
    processCSS() {
      if (!this.inputCSS.trim()) {
        this.showToast('请输入CSS代码')
        return
      }
      
      this.validationErrors = []
      this.extractedData = null
      
      try {
        switch (this.mode) {
          case 'beautify':
            this.beautifyCSS()
            break
          case 'minify':
            this.minifyCSS()
            break
          case 'validate':
            this.validateCSS()
            break
        }
        
        this.analyzeCSS()
        
      } catch (error) {
        this.showToast('处理失败: ' + error.message)
      }
    },
    
    beautifyCSS() {
      let css = this.inputCSS.trim()
      
      // 移除多余空白
      css = css.replace(/\s+/g, ' ')
      
      // 处理大括号和分号
      css = css.replace(/\{/g, ' {\n')
      css = css.replace(/\}/g, '\n}\n')
      css = css.replace(/;/g, ';\n')
      css = css.replace(/,/g, ',\n')
      
      // 添加缩进
      const indent = this.indentType === 'space' ? ' '.repeat(this.indentSize) : '\t'
      const lines = css.split('\n')
      let indentLevel = 0
      
      const formatted = lines.map(line => {
        line = line.trim()
        if (!line) return ''
        
        if (line === '}') {
          indentLevel--
        }
        
        const result = indent.repeat(Math.max(0, indentLevel)) + line
        
        if (line.includes('{')) {
          indentLevel++
        }
        
        return result
      }).join('\n')
      
      // 清理多余空行
      this.outputCSS = formatted.replace(/\n\s*\n\s*\n/g, '\n\n').trim()
    },
    
    minifyCSS() {
      let css = this.inputCSS
      
      // 移除注释
      css = css.replace(/\/\*[\s\S]*?\*\//g, '')
      
      // 移除多余空白
      css = css.replace(/\s+/g, ' ')
      css = css.replace(/\s*{\s*/g, '{')
      css = css.replace(/\s*}\s*/g, '}')
      css = css.replace(/\s*;\s*/g, ';')
      css = css.replace(/\s*,\s*/g, ',')
      css = css.replace(/\s*:\s*/g, ':')
      
      // 移除最后的分号
      css = css.replace(/;}/g, '}')
      
      this.outputCSS = css.trim()
      
      // 计算压缩率
      const originalSize = this.inputCSS.length
      const compressedSize = this.outputCSS.length
      this.compressionRatio = Math.round((1 - compressedSize / originalSize) * 100)
    },
    
    validateCSS() {
      const css = this.inputCSS
      const lines = css.split('\n')
      this.validationErrors = []
      
      let braceCount = 0
      
      lines.forEach((line, index) => {
        const lineNum = index + 1
        const trimmed = line.trim()
        
        if (!trimmed) return
        
        // 检查大括号匹配
        const openBraces = (line.match(/\{/g) || []).length
        const closeBraces = (line.match(/\}/g) || []).length
        braceCount += openBraces - closeBraces
        
        // 检查选择器语法
        if (trimmed.includes('{') && !trimmed.match(/^[^{]*\{/)) {
          this.validationErrors.push({
            line: lineNum,
            message: '选择器语法错误'
          })
        }
        
        // 检查属性语法
        if (trimmed.includes(':') && !trimmed.includes('{') && !trimmed.includes('}')) {
          if (!trimmed.match(/^[^:]+:[^;]+;?$/)) {
            this.validationErrors.push({
              line: lineNum,
              message: '属性语法错误'
            })
          }
        }
      })
      
      if (braceCount !== 0) {
        this.validationErrors.push({
          line: '全局',
          message: '大括号不匹配'
        })
      }
      
      if (this.validationErrors.length === 0) {
        this.outputCSS = '✅ CSS代码验证通过，未发现语法错误'
      } else {
        this.outputCSS = `❌ 发现 ${this.validationErrors.length} 个错误，请查看下方错误列表`
      }
    },
    
    analyzeCSS() {
      const css = this.inputCSS
      
      // 统计选择器
      const selectors = (css.match(/[^{}]+(?=\s*\{)/g) || []).length
      
      // 统计属性
      const properties = (css.match(/[^{}:]+\s*:/g) || []).length
      
      // 提取颜色
      const colorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/g
      const colors = new Set((css.match(colorRegex) || []))
      
      this.cssAnalysis = {
        selectors,
        properties,
        colors: colors.size
      }
    },
    
    extractColors() {
      const css = this.inputCSS
      const colorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/g
      const colors = [...new Set((css.match(colorRegex) || []))]
      
      this.extractedData = {
        title: '提取的颜色',
        items: colors
      }
    },
    
    extractSelectors() {
      const css = this.inputCSS
      const selectors = (css.match(/[^{}]+(?=\s*\{)/g) || [])
        .map(s => s.trim())
        .filter(s => s)
      
      this.extractedData = {
        title: '提取的选择器',
        items: [...new Set(selectors)]
      }
    },
    
    generateReset() {
      const resetCSS = `/* CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: Arial, sans-serif;
}

ul, ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  max-width: 100%;
  height: auto;
}

button {
  border: none;
  background: none;
  cursor: pointer;
}`

      this.outputCSS = resetCSS
    },
    
    addAutoprefixes() {
      let css = this.inputCSS
      
      // 简单的自动前缀添加
      const prefixes = {
        'transform': ['-webkit-transform', '-moz-transform', '-ms-transform'],
        'transition': ['-webkit-transition', '-moz-transition', '-ms-transition'],
        'border-radius': ['-webkit-border-radius', '-moz-border-radius'],
        'box-shadow': ['-webkit-box-shadow', '-moz-box-shadow'],
        'user-select': ['-webkit-user-select', '-moz-user-select', '-ms-user-select']
      }
      
      Object.keys(prefixes).forEach(prop => {
        const regex = new RegExp(`(\\s+)${prop}\\s*:([^;]+);`, 'gi')
        css = css.replace(regex, (match, indent, value) => {
          const prefixed = prefixes[prop].map(prefix => 
            `${indent}${prefix}:${value};`
          ).join('\n')
          return `${prefixed}\n${match}`
        })
      })
      
      this.outputCSS = css
    },
    
    loadSample() {
      this.inputCSS = `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 2rem 0;
  text-align: center;
}

.nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

.nav a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav a:hover {
  color: #ff6b6b;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  .nav ul {
    flex-direction: column;
  }
}`
    },
    
    clearInput() {
      this.inputCSS = ''
      this.cssAnalysis = null
      this.validationErrors = []
      this.extractedData = null
    },
    
    clearOutput() {
      this.outputCSS = ''
      this.compressionRatio = null
    },
    
    async copyOutput() {
      if (!this.outputCSS) {
        this.showToast('没有结果可复制')
        return
      }
      
      try {
        await navigator.clipboard.writeText(this.outputCSS)
        this.showToast('代码已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    downloadOutput() {
      if (!this.outputCSS) {
        this.showToast('没有结果可下载')
        return
      }
      
      const blob = new Blob([this.outputCSS], { type: 'text/css' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `formatted_${Date.now()}.css`
      link.click()
      URL.revokeObjectURL(url)
    },
    
    getLineCount(text) {
      return text ? text.split('\n').length : 0
    },
    
    formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB'
      return Math.round(bytes / 1048576) + ' MB'
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
.formatter-controls {
  margin-bottom: 20px;
}

.mode-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.mode-tab {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.mode-tab.active {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.format-options {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.option {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.css-panels {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.input-panel, .output-panel {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.panel-header h4 {
  margin: 0;
  color: #37474f;
  font-size: 14px;
}

.input-actions, .output-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: transparent;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e8e8e8;
}

.css-input, .css-output {
  width: 100%;
  border: none;
  resize: vertical;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  outline: none;
}

.css-output {
  background: #f8f9fa;
}

.input-stats, .output-stats {
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e8e8e8;
  font-size: 12px;
  color: #78909c;
}

.compression {
  color: #2196f3;
  font-weight: 600;
}

.process-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  min-width: 160px;
}

.process-btn {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease;
}

.process-btn:hover {
  background: #1976d2;
}

.analysis-info {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  width: 100%;
}

.analysis-info h5 {
  margin: 0 0 8px 0;
  color: #37474f;
  font-size: 13px;
}

.analysis-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.analysis-item .label {
  color: #78909c;
}

.analysis-item .value {
  color: #37474f;
  font-weight: 500;
}

.validation-section {
  margin-bottom: 30px;
}

.validation-section h4 {
  color: #f44336;
  margin-bottom: 16px;
}

.error-list {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
  padding: 16px;
  max-height: 200px;
  overflow-y: auto;
}

.error-item {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 14px;
}

.error-line {
  color: #f44336;
  font-weight: 600;
  min-width: 60px;
}

.error-message {
  color: #d32f2f;
}

.tools-section {
  margin-bottom: 30px;
}

.tools-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.tool-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tool-btn {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  background: #e8e8e8;
}

.extracted-section {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.extracted-section h4 {
  color: #37474f;
  margin-bottom: 12px;
}

.extracted-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.extracted-item {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: monospace;
  font-size: 13px;
  color: #37474f;
}

@media (max-width: 768px) {
  .css-panels {
    grid-template-columns: 1fr;
  }
  
  .process-panel {
    order: 2;
    min-width: auto;
  }
  
  .format-options {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .extracted-content {
    grid-template-columns: 1fr;
  }
}
</style>