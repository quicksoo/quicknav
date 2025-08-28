<template>
  <div class="container">
    <div class="card">
      <h2>📊 文本差异对比</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        在线文本差异对比工具，快速找出两段文本的差异和变化
      </p>
      
      <div class="compare-section">
        <div class="input-panels">
          <div class="text-panel">
            <div class="panel-header">
              <h4>原始文本</h4>
              <div class="panel-actions">
                <button class="action-btn" @click="clearText('original')" title="清空">🗑️</button>
                <button class="action-btn" @click="loadSample('original')" title="加载示例">📋</button>
              </div>
            </div>
            <textarea 
              v-model="originalText" 
              @input="compareTexts"
              placeholder="请输入原始文本内容..."
              rows="15"
              class="text-input"
            ></textarea>
            <div class="text-info">
              <span>行数: {{ getLineCount(originalText) }}</span>
              <span>字符数: {{ originalText.length }}</span>
              <span>单词数: {{ getWordCount(originalText) }}</span>
            </div>
          </div>
          
          <div class="text-panel">
            <div class="panel-header">
              <h4>修改后文本</h4>
              <div class="panel-actions">
                <button class="action-btn" @click="clearText('modified')" title="清空">🗑️</button>
                <button class="action-btn" @click="loadSample('modified')" title="加载示例">📋</button>
              </div>
            </div>
            <textarea 
              v-model="modifiedText" 
              @input="compareTexts"
              placeholder="请输入修改后的文本内容..."
              rows="15"
              class="text-input"
            ></textarea>
            <div class="text-info">
              <span>行数: {{ getLineCount(modifiedText) }}</span>
              <span>字符数: {{ modifiedText.length }}</span>
              <span>单词数: {{ getWordCount(modifiedText) }}</span>
            </div>
          </div>
        </div>
        
        <div class="compare-options">
          <h4>对比设置：</h4>
          <div class="option-group">
            <label class="option">
              <input type="checkbox" v-model="ignoreWhitespace" @change="compareTexts">
              <span>忽略空白字符</span>
            </label>
            <label class="option">
              <input type="checkbox" v-model="ignoreCase" @change="compareTexts">
              <span>忽略大小写</span>
            </label>
            <label class="option">
              <input type="checkbox" v-model="ignorePunctuation" @change="compareTexts">
              <span>忽略标点符号</span>
            </label>
            <label class="option">
              <input type="radio" value="line" v-model="compareMode" @change="compareTexts">
              <span>按行对比</span>
            </label>
            <label class="option">
              <input type="radio" value="word" v-model="compareMode" @change="compareTexts">
              <span>按词对比</span>
            </label>
            <label class="option">
              <input type="radio" value="char" v-model="compareMode" @change="compareTexts">
              <span>按字符对比</span>
            </label>
          </div>
        </div>
      </div>
      
      <div v-if="diffResult" class="result-section">
        <div class="result-summary">
          <h4>对比结果：</h4>
          <div class="summary-stats">
            <div class="stat-item added">
              <span class="stat-icon">+</span>
              <span class="stat-text">新增 {{ diffStats.added }} 项</span>
            </div>
            <div class="stat-item removed">
              <span class="stat-icon">-</span>
              <span class="stat-text">删除 {{ diffStats.removed }} 项</span>
            </div>
            <div class="stat-item modified">
              <span class="stat-icon">~</span>
              <span class="stat-text">修改 {{ diffStats.modified }} 项</span>
            </div>
            <div class="stat-item unchanged">
              <span class="stat-icon">=</span>
              <span class="stat-text">未变 {{ diffStats.unchanged }} 项</span>
            </div>
          </div>
        </div>
        
        <div class="diff-display">
          <div class="view-controls">
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'side' }"
              @click="viewMode = 'side'"
            >
              并排显示
            </button>
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'unified' }"
              @click="viewMode = 'unified'"
            >
              统一显示
            </button>
            <button class="export-btn" @click="exportDiff">💾 导出差异</button>
          </div>
          
          <!-- 并排显示模式 -->
          <div v-if="viewMode === 'side'" class="side-view">
            <div class="diff-panel">
              <h5>原始文本</h5>
              <div class="diff-content" v-html="diffResult.original"></div>
            </div>
            <div class="diff-panel">
              <h5>修改后文本</h5>
              <div class="diff-content" v-html="diffResult.modified"></div>
            </div>
          </div>
          
          <!-- 统一显示模式 -->
          <div v-if="viewMode === 'unified'" class="unified-view">
            <div class="unified-content" v-html="diffResult.unified"></div>
          </div>
        </div>
      </div>
      
      <div class="tools-section">
        <h4>快捷操作：</h4>
        <div class="tool-buttons">
          <button class="tool-btn" @click="swapTexts">🔄 交换文本</button>
          <button class="tool-btn" @click="mergeTexts">🔗 合并文本</button>
          <button class="tool-btn" @click="copyDifferences">📋 复制差异</button>
          <button class="tool-btn" @click="resetAll">🔄 重置全部</button>
        </div>
      </div>
      
      <div class="examples-section">
        <h4>使用场景：</h4>
        <div class="example-grid">
          <div class="example-item">
            <h5>📝 代码审查</h5>
            <p>对比代码修改前后的差异</p>
          </div>
          <div class="example-item">
            <h5>📄 文档版本</h5>
            <p>比较文档不同版本的变化</p>
          </div>
          <div class="example-item">
            <h5>🔍 内容校对</h5>
            <p>检查文本修改和校对结果</p>
          </div>
          <div class="example-item">
            <h5>📋 数据对比</h5>
            <p>对比两组数据的差异</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextDiff',
  data() {
    return {
      originalText: '',
      modifiedText: '',
      ignoreWhitespace: false,
      ignoreCase: false,
      ignorePunctuation: false,
      compareMode: 'line',
      viewMode: 'side',
      diffResult: null,
      diffStats: {
        added: 0,
        removed: 0,
        modified: 0,
        unchanged: 0
      }
    }
  },
  methods: {
    compareTexts() {
      if (!this.originalText && !this.modifiedText) {
        this.diffResult = null
        return
      }
      
      let original = this.preprocessText(this.originalText)
      let modified = this.preprocessText(this.modifiedText)
      
      let originalItems, modifiedItems
      
      switch (this.compareMode) {
        case 'line':
          originalItems = original.split('\n')
          modifiedItems = modified.split('\n')
          break
        case 'word':
          originalItems = original.split(/\s+/).filter(item => item.length > 0)
          modifiedItems = modified.split(/\s+/).filter(item => item.length > 0)
          break
        case 'char':
          originalItems = original.split('')
          modifiedItems = modified.split('')
          break
      }
      
      const diff = this.computeDiff(originalItems, modifiedItems)
      this.diffResult = this.formatDiff(diff, originalItems, modifiedItems)
      this.calculateStats(diff)
    },
    
    preprocessText(text) {
      let processed = text
      
      if (this.ignoreCase) {
        processed = processed.toLowerCase()
      }
      
      if (this.ignoreWhitespace) {
        processed = processed.replace(/\s+/g, ' ').trim()
      }
      
      if (this.ignorePunctuation) {
        processed = processed.replace(/[^\w\s\u4e00-\u9fa5]/g, '')
      }
      
      return processed
    },
    
    computeDiff(original, modified) {
      const dp = Array(original.length + 1).fill(null).map(() => 
        Array(modified.length + 1).fill(0)
      )
      
      // 计算最长公共子序列
      for (let i = 1; i <= original.length; i++) {
        for (let j = 1; j <= modified.length; j++) {
          if (original[i - 1] === modified[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
          }
        }
      }
      
      // 回溯生成差异
      const diff = []
      let i = original.length, j = modified.length
      
      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && original[i - 1] === modified[j - 1]) {
          diff.unshift({ type: 'equal', value: original[i - 1], oldIndex: i - 1, newIndex: j - 1 })
          i--
          j--
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
          diff.unshift({ type: 'added', value: modified[j - 1], newIndex: j - 1 })
          j--
        } else if (i > 0) {
          diff.unshift({ type: 'removed', value: original[i - 1], oldIndex: i - 1 })
          i--
        }
      }
      
      return diff
    },
    
    formatDiff(diff, originalItems, modifiedItems) {
      let originalHtml = ''
      let modifiedHtml = ''
      let unifiedHtml = ''
      
      for (const item of diff) {
        const escapedValue = this.escapeHtml(item.value)
        const separator = this.compareMode === 'line' ? '\n' : (this.compareMode === 'word' ? ' ' : '')
        
        switch (item.type) {
          case 'equal':
            originalHtml += `<span class="diff-equal">${escapedValue}</span>${separator}`
            modifiedHtml += `<span class="diff-equal">${escapedValue}</span>${separator}`
            unifiedHtml += `<span class="diff-equal">${escapedValue}</span>${separator}`
            break
          case 'removed':
            originalHtml += `<span class="diff-removed">${escapedValue}</span>${separator}`
            unifiedHtml += `<span class="diff-removed">- ${escapedValue}</span>${separator}`
            break
          case 'added':
            modifiedHtml += `<span class="diff-added">${escapedValue}</span>${separator}`
            unifiedHtml += `<span class="diff-added">+ ${escapedValue}</span>${separator}`
            break
        }
      }
      
      return {
        original: originalHtml,
        modified: modifiedHtml,
        unified: unifiedHtml
      }
    },
    
    calculateStats(diff) {
      this.diffStats = {
        added: diff.filter(item => item.type === 'added').length,
        removed: diff.filter(item => item.type === 'removed').length,
        modified: 0,
        unchanged: diff.filter(item => item.type === 'equal').length
      }
    },
    
    escapeHtml(text) {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    },
    
    getLineCount(text) {
      return text ? text.split('\n').length : 0
    },
    
    getWordCount(text) {
      return text ? text.split(/\s+/).filter(word => word.length > 0).length : 0
    },
    
    clearText(type) {
      if (type === 'original') {
        this.originalText = ''
      } else {
        this.modifiedText = ''
      }
      this.compareTexts()
    },
    
    loadSample(type) {
      const originalSample = `function calculateSum(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}`

      const modifiedSample = `function calculateSum(numbers) {
  let total = 0;
  for (const number of numbers) {
    total += number;
  }
  return total;
}`

      if (type === 'original') {
        this.originalText = originalSample
      } else {
        this.modifiedText = modifiedSample
      }
      this.compareTexts()
    },
    
    swapTexts() {
      const temp = this.originalText
      this.originalText = this.modifiedText
      this.modifiedText = temp
      this.compareTexts()
    },
    
    mergeTexts() {
      const merged = this.originalText + '\n\n' + this.modifiedText
      this.originalText = merged
      this.modifiedText = ''
      this.compareTexts()
    },
    
    async copyDifferences() {
      if (!this.diffResult) return
      
      const diffText = this.viewMode === 'unified' 
        ? this.diffResult.unified.replace(/<[^>]*>/g, '')
        : `原始文本:\n${this.diffResult.original.replace(/<[^>]*>/g, '')}\n\n修改后文本:\n${this.diffResult.modified.replace(/<[^>]*>/g, '')}`
      
      try {
        await navigator.clipboard.writeText(diffText)
        this.showToast('差异内容已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    exportDiff() {
      if (!this.diffResult) return
      
      const content = `文本差异对比报告
生成时间: ${new Date().toLocaleString()}
对比模式: ${this.compareMode === 'line' ? '按行' : this.compareMode === 'word' ? '按词' : '按字符'}

统计信息:
- 新增: ${this.diffStats.added} 项
- 删除: ${this.diffStats.removed} 项
- 修改: ${this.diffStats.modified} 项
- 未变: ${this.diffStats.unchanged} 项

详细差异:
${this.diffResult.unified.replace(/<[^>]*>/g, '')}
`
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `text_diff_${Date.now()}.txt`
      link.click()
      URL.revokeObjectURL(url)
    },
    
    resetAll() {
      this.originalText = ''
      this.modifiedText = ''
      this.diffResult = null
      this.ignoreWhitespace = false
      this.ignoreCase = false
      this.ignorePunctuation = false
      this.compareMode = 'line'
      this.viewMode = 'side'
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
.compare-section {
  margin-bottom: 30px;
}

.input-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.text-panel {
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

.panel-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.action-btn:hover {
  background: #e8e8e8;
}

.text-input {
  width: 100%;
  border: none;
  resize: vertical;
  padding: 16px;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.5;
  outline: none;
}

.text-info {
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  background: #f8f9fa;
  font-size: 12px;
  color: #78909c;
  border-top: 1px solid #e8e8e8;
}

.compare-options {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.compare-options h4 {
  margin: 0 0 12px 0;
  color: #37474f;
}

.option-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

.result-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.result-summary h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.summary-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
}

.stat-item.added {
  background: #e8f5e8;
  color: #2e7d2e;
}

.stat-item.removed {
  background: #ffebee;
  color: #c62828;
}

.stat-item.modified {
  background: #fff3e0;
  color: #ef6c00;
}

.stat-item.unchanged {
  background: #f0f0f0;
  color: #666;
}

.stat-icon {
  font-weight: bold;
  font-size: 16px;
}

.view-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
}

.view-btn {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.view-btn.active {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.view-btn:not(.active):hover {
  background: #e8e8e8;
}

.export-btn {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  margin-left: auto;
}

.export-btn:hover {
  background: #45a049;
}

.side-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.diff-panel {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.diff-panel h5 {
  margin: 0;
  padding: 12px 16px;
  background: #f8f9fa;
  color: #37474f;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.diff-content {
  padding: 16px;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}

.unified-view {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.unified-content {
  padding: 16px;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}

.diff-equal {
  background: transparent;
}

.diff-added {
  background: #e8f5e8;
  color: #2e7d2e;
  padding: 2px 4px;
  border-radius: 3px;
}

.diff-removed {
  background: #ffebee;
  color: #c62828;
  padding: 2px 4px;
  border-radius: 3px;
  text-decoration: line-through;
}

.tools-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
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

.examples-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.examples-section h4 {
  color: #37474f;
  margin-bottom: 20px;
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
}

.example-item h5 {
  color: #37474f;
  margin-bottom: 8px;
  font-size: 14px;
}

.example-item p {
  color: #78909c;
  margin: 0;
  font-size: 13px;
}

@media (max-width: 768px) {
  .input-panels {
    grid-template-columns: 1fr;
  }
  
  .side-view {
    grid-template-columns: 1fr;
  }
  
  .summary-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .option-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .view-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .export-btn {
    margin-left: 0;
  }
}
</style>
