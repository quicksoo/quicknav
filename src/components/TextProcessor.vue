<template>
  <div class="container">
    <div class="card">
      <h2>📝 文本处理工具集</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        多功能文本处理工具，包含大小写转换、去重排序、统计分析等功能
      </p>
      
      <div class="input-section">
        <div class="input-group">
          <label>输入文本：</label>
          <textarea 
            v-model="inputText" 
            placeholder="请输入要处理的文本内容..."
            rows="10"
            class="text-input"
          ></textarea>
        </div>
        
        <div class="text-stats">
          <div class="stat-item">字符数: {{ getCharCount() }}</div>
          <div class="stat-item">单词数: {{ getWordCount() }}</div>
          <div class="stat-item">行数: {{ getLineCount() }}</div>
          <div class="stat-item">段落数: {{ getParagraphCount() }}</div>
        </div>
      </div>
      
      <div class="tools-grid">
        <!-- 大小写转换 -->
        <div class="tool-card">
          <h4>🔤 大小写转换</h4>
          <div class="tool-buttons">
            <button class="tool-btn" @click="processText('uppercase')">全部大写</button>
            <button class="tool-btn" @click="processText('lowercase')">全部小写</button>
            <button class="tool-btn" @click="processText('capitalize')">首字母大写</button>
            <button class="tool-btn" @click="processText('title')">标题格式</button>
            <button class="tool-btn" @click="processText('toggle')">大小写切换</button>
          </div>
        </div>
        
        <!-- 排序去重 -->
        <div class="tool-card">
          <h4>📊 排序去重</h4>
          <div class="tool-buttons">
            <button class="tool-btn" @click="processText('sort-asc')">升序排列</button>
            <button class="tool-btn" @click="processText('sort-desc')">降序排列</button>
            <button class="tool-btn" @click="processText('unique')">去除重复</button>
            <button class="tool-btn" @click="processText('reverse')">反转行序</button>
            <button class="tool-btn" @click="processText('shuffle')">随机排序</button>
          </div>
        </div>
        
        <!-- 格式处理 -->
        <div class="tool-card">
          <h4>📐 格式处理</h4>
          <div class="tool-buttons">
            <button class="tool-btn" @click="processText('trim')">去除空格</button>
            <button class="tool-btn" @click="processText('remove-empty')">删除空行</button>
            <button class="tool-btn" @click="processText('add-numbers')">添加行号</button>
            <button class="tool-btn" @click="processText('extract-numbers')">提取数字</button>
            <button class="tool-btn" @click="processText('extract-emails')">提取邮箱</button>
          </div>
        </div>
        
        <!-- 编码处理 -->
        <div class="tool-card">
          <h4>🔄 编码处理</h4>
          <div class="tool-buttons">
            <button class="tool-btn" @click="processText('html-encode')">HTML编码</button>
            <button class="tool-btn" @click="processText('html-decode')">HTML解码</button>
            <button class="tool-btn" @click="processText('url-encode')">URL编码</button>
            <button class="tool-btn" @click="processText('url-decode')">URL解码</button>
            <button class="tool-btn" @click="processText('unicode-encode')">Unicode编码</button>
          </div>
        </div>
      </div>
      
      <div class="result-section">
        <div class="result-header">
          <label>处理结果：</label>
          <div class="result-actions">
            <button class="action-btn" @click="copyResult" title="复制结果">📋</button>
            <button class="action-btn" @click="clearResult" title="清空">🗑️</button>
            <button class="action-btn" @click="replaceInput" title="替换输入">🔄</button>
          </div>
        </div>
        <textarea 
          v-model="resultText" 
          readonly 
          rows="10"
          class="result-output"
          placeholder="处理结果将显示在这里..."
        ></textarea>
      </div>
      
      <div class="batch-section">
        <h4>批量处理：</h4>
        <div class="batch-controls">
          <div class="separator-input">
            <label>分隔符：</label>
            <select v-model="separator">
              <option value="\n">换行符</option>
              <option value=",">逗号</option>
              <option value=";">分号</option>
              <option value=" ">空格</option>
              <option value="\t">制表符</option>
            </select>
          </div>
          <button class="btn" @click="batchProcess">批量处理</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextProcessor',
  data() {
    return {
      inputText: '',
      resultText: '',
      separator: '\n'
    }
  },
  methods: {
    processText(operation) {
      if (!this.inputText.trim()) {
        this.showToast('请先输入文本内容')
        return
      }
      
      switch (operation) {
        case 'uppercase':
          this.resultText = this.inputText.toUpperCase()
          break
        case 'lowercase':
          this.resultText = this.inputText.toLowerCase()
          break
        case 'capitalize':
          this.resultText = this.inputText.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
          break
        case 'title':
          this.resultText = this.inputText.replace(/\w\S*/g, txt => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
          break
        case 'toggle':
          this.resultText = this.inputText.split('').map(char => 
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          ).join('')
          break
        case 'sort-asc':
          this.resultText = this.inputText.split('\n').sort().join('\n')
          break
        case 'sort-desc':
          this.resultText = this.inputText.split('\n').sort().reverse().join('\n')
          break
        case 'unique':
          this.resultText = [...new Set(this.inputText.split('\n'))].join('\n')
          break
        case 'reverse':
          this.resultText = this.inputText.split('\n').reverse().join('\n')
          break
        case 'shuffle':
          const lines = this.inputText.split('\n')
          for (let i = lines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[lines[i], lines[j]] = [lines[j], lines[i]]
          }
          this.resultText = lines.join('\n')
          break
        case 'trim':
          this.resultText = this.inputText.split('\n').map(line => line.trim()).join('\n')
          break
        case 'remove-empty':
          this.resultText = this.inputText.split('\n').filter(line => line.trim() !== '').join('\n')
          break
        case 'add-numbers':
          this.resultText = this.inputText.split('\n').map((line, index) => 
            `${index + 1}. ${line}`).join('\n')
          break
        case 'extract-numbers':
          this.resultText = this.inputText.match(/\d+/g)?.join('\n') || ''
          break
        case 'extract-emails':
          this.resultText = this.inputText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g)?.join('\n') || ''
          break
        case 'html-encode':
          this.resultText = this.inputText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
          break
        case 'html-decode':
          this.resultText = this.inputText
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
          break
        case 'url-encode':
          this.resultText = encodeURIComponent(this.inputText)
          break
        case 'url-decode':
          try {
            this.resultText = decodeURIComponent(this.inputText)
          } catch (error) {
            this.showToast('URL解码失败')
          }
          break
        case 'unicode-encode':
          this.resultText = this.inputText.split('').map(char => 
            char.charCodeAt(0) > 127 ? '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0') : char
          ).join('')
          break
      }
    },
    
    batchProcess() {
      const items = this.inputText.split(this.separator)
      this.resultText = items.map(item => item.trim()).filter(item => item).join('\n')
    },
    
    getCharCount() {
      return this.inputText.length
    },
    
    getWordCount() {
      return this.inputText.trim() ? this.inputText.trim().split(/\s+/).length : 0
    },
    
    getLineCount() {
      return this.inputText ? this.inputText.split('\n').length : 0
    },
    
    getParagraphCount() {
      return this.inputText.trim() ? this.inputText.trim().split(/\n\s*\n/).length : 0
    },
    
    async copyResult() {
      if (!this.resultText) {
        this.showToast('没有结果可复制')
        return
      }
      
      try {
        await navigator.clipboard.writeText(this.resultText)
        this.showToast('结果已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    clearResult() {
      this.resultText = ''
    },
    
    replaceInput() {
      if (this.resultText) {
        this.inputText = this.resultText
        this.resultText = ''
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
  }
}
</script>

<style scoped>
.input-section {
  margin-bottom: 30px;
}

.text-input {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
}

.text-stats {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
  color: #78909c;
  flex-wrap: wrap;
}

.stat-item {
  font-weight: 500;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.tool-card {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.tool-card h4 {
  color: #37474f;
  margin-bottom: 12px;
  font-size: 14px;
}

.tool-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-btn {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  border-color: #2196f3;
  background: #f0f7ff;
}

.result-section {
  margin-bottom: 30px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.result-header label {
  color: #37474f;
  font-weight: 500;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e2e8f0;
}

.result-output {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #f8f9fa;
  resize: vertical;
}

.batch-section {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.batch-section h4 {
  color: #37474f;
  margin-bottom: 12px;
}

.batch-controls {
  display: flex;
  gap: 16px;
  align-items: end;
  flex-wrap: wrap;
}

.separator-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.separator-input label {
  font-size: 14px;
  color: #37474f;
  font-weight: 500;
}

.separator-input select {
  padding: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: white;
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .text-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .batch-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>