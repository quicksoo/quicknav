<template>
  <div class="container">
    <div class="card">
      <h2>🗃️ SQL 格式化工具</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        SQL代码格式化、压缩、验证和美化工具
      </p>
      
      <div class="mode-tabs">
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'format' }"
          @click="mode = 'format'"
        >
          🎨 格式化
        </button>
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'minify' }"
          @click="mode = 'minify'"
        >
          📦 压缩
        </button>
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'validate' }"
          @click="mode = 'validate'"
        >
          ✅ 验证
        </button>
      </div>
      
      <div class="sql-panels">
        <div class="input-panel">
          <div class="panel-header">
            <h4>输入SQL</h4>
            <div class="input-actions">
              <button class="action-btn" @click="loadSample">📋 示例</button>
              <button class="action-btn" @click="clearInput">🗑️ 清空</button>
            </div>
          </div>
          <textarea 
            v-model="inputSql" 
            placeholder="请输入SQL语句..."
            rows="15"
            class="sql-input"
          ></textarea>
          <div class="input-stats">
            <span>字符数: {{ inputSql.length }}</span>
            <span>行数: {{ getLineCount(inputSql) }}</span>
          </div>
        </div>
        
        <div class="process-panel">
          <button class="process-btn" @click="processSql">
            {{ getProcessButtonText() }}
          </button>
          
          <div v-if="sqlInfo" class="sql-info">
            <h5>SQL信息：</h5>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">语句类型：</span>
                <span class="value">{{ sqlInfo.type }}</span>
              </div>
              <div class="info-item">
                <span class="label">表数量：</span>
                <span class="value">{{ sqlInfo.tables }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="output-panel">
          <div class="panel-header">
            <h4>处理结果</h4>
            <div class="output-actions">
              <button class="action-btn" @click="copyOutput">📋 复制</button>
              <button class="action-btn" @click="downloadOutput">💾 下载</button>
            </div>
          </div>
          <textarea 
            v-model="outputSql" 
            readonly 
            rows="15"
            class="sql-output"
            placeholder="处理结果将显示在这里..."
          ></textarea>
          <div class="output-stats">
            <span>字符数: {{ outputSql.length }}</span>
            <span>行数: {{ getLineCount(outputSql) }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="validationErrors.length > 0" class="error-section">
        <h4>验证错误：</h4>
        <div class="error-list">
          <div v-for="(error, index) in validationErrors" :key="index" class="error-item">
            {{ error }}
          </div>
        </div>
      </div>
      
      <div class="tools-section">
        <h4>实用功能：</h4>
        <div class="tool-buttons">
          <button class="tool-btn" @click="extractTables">🏷️ 提取表名</button>
          <button class="tool-btn" @click="extractColumns">📋 提取字段</button>
          <button class="tool-btn" @click="convertToUppercase">🔤 转大写</button>
          <button class="tool-btn" @click="convertToLowercase">🔡 转小写</button>
          <button class="tool-btn" @click="generateExplain">📊 生成EXPLAIN</button>
        </div>
      </div>
      
      <div v-if="extractedData" class="extracted-section">
        <h4>{{ extractedData.title }}：</h4>
        <div class="extracted-content">
          <pre class="extracted-text">{{ extractedData.content }}</pre>
          <button class="btn" @click="copyExtracted">📋 复制结果</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SqlFormatter',
  data() {
    return {
      mode: 'format',
      inputSql: '',
      outputSql: '',
      validationErrors: [],
      sqlInfo: null,
      extractedData: null
    }
  },
  methods: {
    getProcessButtonText() {
      const texts = {
        format: '🎨 格式化',
        minify: '📦 压缩',
        validate: '✅ 验证'
      }
      return texts[this.mode]
    },
    
    processSql() {
      if (!this.inputSql.trim()) {
        this.showToast('请输入SQL语句')
        return
      }
      
      this.validationErrors = []
      this.extractedData = null
      
      try {
        switch (this.mode) {
          case 'format':
            this.formatSql()
            break
          case 'minify':
            this.minifySql()
            break
          case 'validate':
            this.validateSql()
            break
        }
        
        this.analyzeSql()
        
      } catch (error) {
        this.validationErrors = [error.message]
      }
    },
    
    formatSql() {
      let sql = this.inputSql.trim()
      
      // 基本的SQL格式化
      sql = sql.replace(/\s+/g, ' ')
      sql = sql.replace(/\bSELECT\b/gi, '\nSELECT')
      sql = sql.replace(/\bFROM\b/gi, '\nFROM')
      sql = sql.replace(/\bWHERE\b/gi, '\nWHERE')
      sql = sql.replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
      sql = sql.replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
      sql = sql.replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
      sql = sql.replace(/\bFULL JOIN\b/gi, '\nFULL JOIN')
      sql = sql.replace(/\bGROUP BY\b/gi, '\nGROUP BY')
      sql = sql.replace(/\bHAVING\b/gi, '\nHAVING')
      sql = sql.replace(/\bORDER BY\b/gi, '\nORDER BY')
      sql = sql.replace(/\bLIMIT\b/gi, '\nLIMIT')
      sql = sql.replace(/\bUNION\b/gi, '\nUNION')
      sql = sql.replace(/\bINSERT INTO\b/gi, '\nINSERT INTO')
      sql = sql.replace(/\bVALUES\b/gi, '\nVALUES')
      sql = sql.replace(/\bUPDATE\b/gi, '\nUPDATE')
      sql = sql.replace(/\bSET\b/gi, '\nSET')
      sql = sql.replace(/\bDELETE FROM\b/gi, '\nDELETE FROM')
      sql = sql.replace(/\bCREATE TABLE\b/gi, '\nCREATE TABLE')
      sql = sql.replace(/\bDROP TABLE\b/gi, '\nDROP TABLE')
      sql = sql.replace(/\bALTER TABLE\b/gi, '\nALTER TABLE')
      
      // 处理逗号
      sql = sql.replace(/,/g, ',\n    ')
      
      // 处理AND/OR
      sql = sql.replace(/\bAND\b/gi, '\n  AND')
      sql = sql.replace(/\bOR\b/gi, '\n  OR')
      
      // 清理多余的空行和空格
      sql = sql.replace(/\n\s*\n/g, '\n').trim()
      
      this.outputSql = sql
    },
    
    minifySql() {
      let sql = this.inputSql.trim()
      
      // 移除注释
      sql = sql.replace(/--.*$/gm, '')
      sql = sql.replace(/\/\*[\s\S]*?\*\//g, '')
      
      // 移除多余空白
      sql = sql.replace(/\s+/g, ' ')
      sql = sql.replace(/\s*([(),;])\s*/g, '$1')
      
      this.outputSql = sql.trim()
    },
    
    validateSql() {
      const sql = this.inputSql.trim().toUpperCase()
      const errors = []
      
      // 基本语法检查
      if (!sql) {
        errors.push('SQL语句不能为空')
      }
      
      // 检查括号匹配
      const openParens = (sql.match(/\(/g) || []).length
      const closeParens = (sql.match(/\)/g) || []).length
      if (openParens !== closeParens) {
        errors.push('括号不匹配')
      }
      
      // 检查基本SQL语句格式
      const hasSelectFrom = /SELECT[\s\S]*FROM/.test(sql)
      const hasInsertInto = /INSERT\s+INTO/.test(sql)
      const hasUpdate = /UPDATE[\s\S]*SET/.test(sql)
      const hasDeleteFrom = /DELETE\s+FROM/.test(sql)
      const hasCreateTable = /CREATE\s+TABLE/.test(sql)
      
      if (!hasSelectFrom && !hasInsertInto && !hasUpdate && !hasDeleteFrom && !hasCreateTable) {
        errors.push('未识别的SQL语句类型')
      }
      
      if (errors.length === 0) {
        this.outputSql = '✅ SQL语法验证通过！'
      } else {
        this.outputSql = '❌ SQL语法验证失败'
        this.validationErrors = errors
      }
    },
    
    analyzeSql() {
      const sql = this.inputSql.toUpperCase()
      
      // 分析SQL类型
      let type = 'Unknown'
      if (sql.includes('SELECT')) type = 'SELECT'
      else if (sql.includes('INSERT')) type = 'INSERT'
      else if (sql.includes('UPDATE')) type = 'UPDATE'
      else if (sql.includes('DELETE')) type = 'DELETE'
      else if (sql.includes('CREATE')) type = 'CREATE'
      else if (sql.includes('DROP')) type = 'DROP'
      else if (sql.includes('ALTER')) type = 'ALTER'
      
      // 提取表名
      const tableMatches = sql.match(/(?:FROM|JOIN|INTO|UPDATE)\\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi) || []
      const tables = [...new Set(tableMatches.map(match => 
        match.replace(/(?:FROM|JOIN|INTO|UPDATE)\\s+/i, '').trim()
      ))].length
      
      this.sqlInfo = { type, tables }
    },
    
    extractTables() {
      const sql = this.inputSql.toUpperCase()
      const tableMatches = sql.match(/(?:FROM|JOIN|INTO|UPDATE)\\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi) || []
      const tables = [...new Set(tableMatches.map(match => 
        match.replace(/(?:FROM|JOIN|INTO|UPDATE)\\s+/i, '').trim()
      ))]
      
      this.extractedData = {
        title: '提取的表名',
        content: tables.join('\\n')
      }
    },
    
    extractColumns() {
      const sql = this.inputSql
      const columnMatches = sql.match(/SELECT\\s+([^FROM]+)/gi) || []
      const columns = columnMatches.map(match => 
        match.replace(/SELECT\\s+/i, '').trim()
      ).join('\\n')
      
      this.extractedData = {
        title: '提取的字段',
        content: columns || '未找到字段'
      }
    },
    
    convertToUppercase() {
      this.outputSql = this.inputSql.toUpperCase()
    },
    
    convertToLowercase() {
      this.outputSql = this.inputSql.toLowerCase()
    },
    
    generateExplain() {
      if (this.inputSql.trim().toUpperCase().startsWith('SELECT')) {
        this.outputSql = `EXPLAIN QUERY PLAN\\n${this.inputSql}`
      } else {
        this.showToast('EXPLAIN只适用于SELECT语句')
      }
    },
    
    loadSample() {
      this.inputSql = `SELECT 
    u.id,
    u.name,
    u.email,
    p.title,
    p.content,
    c.name AS category_name
FROM users u
INNER JOIN posts p ON u.id = p.user_id
LEFT JOIN categories c ON p.category_id = c.id
WHERE u.active = 1
    AND p.published_at IS NOT NULL
    AND (p.title LIKE '%javascript%' OR p.content LIKE '%vue%')
ORDER BY p.published_at DESC
LIMIT 10;`
    },
    
    clearInput() {
      this.inputSql = ''
      this.sqlInfo = null
      this.validationErrors = []
      this.extractedData = null
    },
    
    async copyOutput() {
      if (!this.outputSql) {
        this.showToast('没有结果可复制')
        return
      }
      
      try {
        await navigator.clipboard.writeText(this.outputSql)
        this.showToast('SQL已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    async copyExtracted() {
      if (!this.extractedData) {
        this.showToast('没有结果可复制')
        return
      }
      
      try {
        await navigator.clipboard.writeText(this.extractedData.content)
        this.showToast('提取的数据已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    downloadOutput() {
      if (!this.outputSql) {
        this.showToast('没有结果可下载')
        return
      }
      
      const blob = new Blob([this.outputSql], { type: 'text/sql' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `formatted_${Date.now()}.sql`
      link.click()
      URL.revokeObjectURL(url)
    },
    
    getLineCount(text) {
      return text ? text.split('\\n').length : 0
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
.mode-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
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

.sql-panels {
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
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e8e8e8;
}

.sql-input, .sql-output {
  width: 100%;
  border: none;
  resize: vertical;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  outline: none;
}

.sql-output {
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

.process-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  min-width: 120px;
}

.process-btn {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.process-btn:hover {
  background: #1976d2;
}

.sql-info {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  width: 100%;
}

.sql-info h5 {
  margin: 0 0 8px 0;
  color: #37474f;
  font-size: 13px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.info-item .label {
  color: #78909c;
}

.info-item .value {
  color: #37474f;
  font-weight: 500;
}

.error-section {
  margin-bottom: 20px;
}

.error-section h4 {
  color: #f44336;
  margin-bottom: 8px;
}

.error-list {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
  padding: 12px;
}

.error-item {
  color: #d32f2f;
  font-size: 14px;
  margin-bottom: 4px;
}

.tools-section {
  margin-bottom: 20px;
}

.tools-section h4 {
  color: #37474f;
  margin-bottom: 12px;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.extracted-text {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 12px;
  font-family: monospace;
  font-size: 13px;
  color: #37474f;
  margin: 0;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sql-panels {
    grid-template-columns: 1fr;
  }
  
  .process-panel {
    order: 2;
  }
}
</style>