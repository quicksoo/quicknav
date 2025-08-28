<template>
  <div class="container">
    <div class="card">
      <h2>🔄 格式转换器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        JSON、CSV、XML等数据格式互转工具
      </p>
      
      <div class="converter-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'json-csv' }"
          @click="activeTab = 'json-csv'"
        >
          JSON ↔ CSV
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'json-xml' }"
          @click="activeTab = 'json-xml'"
        >
          JSON ↔ XML
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'csv-xml' }"
          @click="activeTab = 'csv-xml'"
        >
          CSV ↔ XML
        </button>
      </div>
      
      <div class="converter-content">
        <div class="input-panel">
          <div class="panel-header">
            <h4>输入数据</h4>
            <div class="format-selector">
              <label>格式：</label>
              <select v-model="inputFormat" @change="onFormatChange">
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="xml">XML</option>
              </select>
            </div>
          </div>
          <textarea 
            v-model="inputData" 
            :placeholder="getPlaceholder(inputFormat)"
            rows="12"
            class="data-input"
          ></textarea>
          <div class="input-actions">
            <button class="btn" @click="formatInput">🎨 格式化</button>
            <button class="btn" @click="loadSample">📋 加载示例</button>
            <button class="btn" @click="clearInput">🗑️ 清空</button>
          </div>
        </div>
        
        <div class="convert-panel">
          <div class="convert-controls">
            <button class="convert-btn" @click="convertData">
              🔄 转换为 {{ outputFormat.toUpperCase() }}
            </button>
            <div class="output-format">
              <label>输出格式：</label>
              <select v-model="outputFormat">
                <option v-for="format in getAvailableOutputs()" :key="format" :value="format">
                  {{ format.toUpperCase() }}
                </option>
              </select>
            </div>
          </div>
          
          <div v-if="conversionOptions" class="options-panel">
            <h5>转换选项：</h5>
            <div class="options-grid">
              <label v-if="inputFormat === 'csv' || outputFormat === 'csv'" class="option">
                <span>CSV分隔符：</span>
                <select v-model="csvSeparator">
                  <option value=",">逗号 (,)</option>
                  <option value=";">分号 (;)</option>
                  <option value="\t">制表符</option>
                  <option value="|">竖线 (|)</option>
                </select>
              </label>
              <label v-if="inputFormat === 'csv' || outputFormat === 'csv'" class="option">
                <input type="checkbox" v-model="csvHasHeader">
                <span>包含表头</span>
              </label>
              <label v-if="outputFormat === 'json'" class="option">
                <input type="checkbox" v-model="jsonPretty">
                <span>美化JSON</span>
              </label>
              <label v-if="outputFormat === 'xml'" class="option">
                <span>根节点名：</span>
                <input v-model="xmlRootName" placeholder="root">
              </label>
            </div>
          </div>
        </div>
        
        <div class="output-panel">
          <div class="panel-header">
            <h4>转换结果</h4>
            <div class="output-actions">
              <button class="action-btn" @click="copyOutput" title="复制">📋</button>
              <button class="action-btn" @click="downloadOutput" title="下载">💾</button>
              <button class="action-btn" @click="clearOutput" title="清空">🗑️</button>
            </div>
          </div>
          <textarea 
            v-model="outputData" 
            readonly 
            rows="12"
            class="data-output"
            placeholder="转换结果将显示在这里..."
          ></textarea>
        </div>
      </div>
      
      <div v-if="error" class="error-message">
        <p>❌ {{ error }}</p>
      </div>
      
      <div class="examples-section">
        <h4>格式示例：</h4>
        <div class="example-tabs">
          <button 
            class="example-tab" 
            :class="{ active: exampleTab === 'json' }"
            @click="exampleTab = 'json'"
          >
            JSON
          </button>
          <button 
            class="example-tab" 
            :class="{ active: exampleTab === 'csv' }"
            @click="exampleTab = 'csv'"
          >
            CSV
          </button>
          <button 
            class="example-tab" 
            :class="{ active: exampleTab === 'xml' }"
            @click="exampleTab = 'xml'"
          >
            XML
          </button>
        </div>
        <div class="example-content">
          <pre><code>{{ getExampleData(exampleTab) }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormatConverter',
  data() {
    return {
      activeTab: 'json-csv',
      inputFormat: 'json',
      outputFormat: 'csv',
      inputData: '',
      outputData: '',
      error: '',
      csvSeparator: ',',
      csvHasHeader: true,
      jsonPretty: true,
      xmlRootName: 'root',
      exampleTab: 'json'
    }
  },
  computed: {
    conversionOptions() {
      return this.inputFormat !== this.outputFormat
    }
  },
  methods: {
    onFormatChange() {
      const formats = this.getAvailableOutputs()
      if (!formats.includes(this.outputFormat)) {
        this.outputFormat = formats[0]
      }
      this.error = ''
    },
    
    getAvailableOutputs() {
      const all = ['json', 'csv', 'xml']
      return all.filter(format => format !== this.inputFormat)
    },
    
    getPlaceholder(format) {
      switch (format) {
        case 'json':
          return '请输入JSON数据，例如：[{"name": "张三", "age": 25}]'
        case 'csv':
          return '请输入CSV数据，例如：\nname,age\n张三,25\n李四,30'
        case 'xml':
          return '请输入XML数据，例如：\n<users>\n  <user>\n    <name>张三</name>\n    <age>25</age>\n  </user>\n</users>'
        default:
          return '请输入数据...'
      }
    },
    
    formatInput() {
      if (!this.inputData.trim()) return
      
      try {
        if (this.inputFormat === 'json') {
          const parsed = JSON.parse(this.inputData)
          this.inputData = JSON.stringify(parsed, null, 2)
        }
        this.error = ''
      } catch (error) {
        this.error = `格式化失败: ${error.message}`
      }
    },
    
    loadSample() {
      this.inputData = this.getExampleData(this.inputFormat)
    },
    
    clearInput() {
      this.inputData = ''
      this.error = ''
    },
    
    convertData() {
      if (!this.inputData.trim()) {
        this.error = '请输入数据'
        return
      }
      
      this.error = ''
      
      try {
        if (this.inputFormat === 'json' && this.outputFormat === 'csv') {
          this.outputData = this.jsonToCsv(this.inputData)
        } else if (this.inputFormat === 'csv' && this.outputFormat === 'json') {
          this.outputData = this.csvToJson(this.inputData)
        } else if (this.inputFormat === 'json' && this.outputFormat === 'xml') {
          this.outputData = this.jsonToXml(this.inputData)
        } else if (this.inputFormat === 'xml' && this.outputFormat === 'json') {
          this.outputData = this.xmlToJson(this.inputData)
        } else if (this.inputFormat === 'csv' && this.outputFormat === 'xml') {
          this.outputData = this.csvToXml(this.inputData)
        } else if (this.inputFormat === 'xml' && this.outputFormat === 'csv') {
          this.outputData = this.xmlToCsv(this.inputData)
        }
      } catch (error) {
        this.error = `转换失败: ${error.message}`
      }
    },
    
    jsonToCsv(jsonStr) {
      const data = JSON.parse(jsonStr)
      if (!Array.isArray(data)) {
        throw new Error('JSON数据必须是数组格式')
      }
      
      if (data.length === 0) return ''
      
      const headers = Object.keys(data[0])
      let csv = this.csvHasHeader ? headers.join(this.csvSeparator) + '\n' : ''
      
      data.forEach(row => {
        const values = headers.map(header => {
          let value = row[header] || ''
          if (typeof value === 'string' && (value.includes(this.csvSeparator) || value.includes('\n') || value.includes('"'))) {
            value = '"' + value.replace(/"/g, '""') + '"'
          }
          return value
        })
        csv += values.join(this.csvSeparator) + '\n'
      })
      
      return csv.trim()
    },
    
    csvToJson(csvStr) {
      const lines = csvStr.trim().split('\n')
      if (lines.length === 0) return '[]'
      
      const headers = this.csvHasHeader 
        ? this.parseCsvLine(lines[0])
        : lines[0].split(this.csvSeparator).map((_, i) => `column${i + 1}`)
      
      const startIndex = this.csvHasHeader ? 1 : 0
      const data = []
      
      for (let i = startIndex; i < lines.length; i++) {
        const values = this.parseCsvLine(lines[i])
        const row = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        data.push(row)
      }
      
      return this.jsonPretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
    },
    
    parseCsvLine(line) {
      const result = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"'
            i++
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === this.csvSeparator && !inQuotes) {
          result.push(current)
          current = ''
        } else {
          current += char
        }
      }
      result.push(current)
      return result
    },
    
    jsonToXml(jsonStr) {
      const data = JSON.parse(jsonStr)
      
      const toXml = (obj, indent = '') => {
        if (Array.isArray(obj)) {
          return obj.map(item => toXml(item, indent)).join('\n')
        } else if (typeof obj === 'object' && obj !== null) {
          let xml = ''
          Object.keys(obj).forEach(key => {
            const value = obj[key]
            if (Array.isArray(value)) {
              value.forEach(item => {
                xml += `${indent}<${key}>\n${toXml(item, indent + '  ')}\n${indent}</${key}>\n`
              })
            } else if (typeof value === 'object' && value !== null) {
              xml += `${indent}<${key}>\n${toXml(value, indent + '  ')}\n${indent}</${key}>\n`
            } else {
              xml += `${indent}<${key}>${this.escapeXml(value)}</${key}>\n`
            }
          })
          return xml.trim()
        } else {
          return this.escapeXml(obj)
        }
      }
      
      return `<?xml version="1.0" encoding="UTF-8"?>\n<${this.xmlRootName}>\n${toXml(data, '  ')}\n</${this.xmlRootName}>`
    },
    
    escapeXml(text) {
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
    },
    
    xmlToJson(xmlStr) {
      // 简化的XML解析，实际项目中建议使用专业的XML解析库
      throw new Error('XML to JSON conversion requires a proper XML parser library')
    },
    
    csvToXml(csvStr) {
      const jsonStr = this.csvToJson(csvStr)
      return this.jsonToXml(jsonStr)
    },
    
    xmlToCsv(xmlStr) {
      const jsonStr = this.xmlToJson(xmlStr)
      return this.jsonToCsv(jsonStr)
    },
    
    getExampleData(format) {
      const examples = {
        json: `[
  {
    "name": "张三",
    "age": 25,
    "city": "北京",
    "email": "zhangsan@example.com"
  },
  {
    "name": "李四",
    "age": 30,
    "city": "上海",
    "email": "lisi@example.com"
  }
]`,
        csv: `name,age,city,email
张三,25,北京,zhangsan@example.com
李四,30,上海,lisi@example.com`,
        xml: `<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user>
    <name>张三</name>
    <age>25</age>
    <city>北京</city>
    <email>zhangsan@example.com</email>
  </user>
  <user>
    <name>李四</name>
    <age>30</age>
    <city>上海</city>
    <email>lisi@example.com</email>
  </user>
</users>`
      }
      return examples[format]
    },
    
    async copyOutput() {
      if (!this.outputData) {
        this.showToast('没有结果可复制')
        return
      }
      
      try {
        await navigator.clipboard.writeText(this.outputData)
        this.showToast('结果已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    downloadOutput() {
      if (!this.outputData) {
        this.showToast('没有结果可下载')
        return
      }
      
      const blob = new Blob([this.outputData], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `converted_data.${this.outputFormat}`
      link.click()
      URL.revokeObjectURL(url)
    },
    
    clearOutput() {
      this.outputData = ''
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
.converter-tabs {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #e8e8e8;
}

.tab-btn {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 14px;
  color: #78909c;
  transition: all 0.2s ease;
}

.tab-btn.active {
  color: #2196f3;
  border-bottom-color: #2196f3;
}

.converter-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  margin-bottom: 20px;
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

.format-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.format-selector select {
  padding: 4px 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: white;
}

.data-input, .data-output {
  width: 100%;
  border: none;
  resize: vertical;
  padding: 16px;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.5;
  outline: none;
}

.data-output {
  background: #f8f9fa;
}

.input-actions, .output-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e8e8e8;
}

.convert-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  min-width: 200px;
}

.convert-btn {
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

.convert-btn:hover {
  background: #1976d2;
}

.output-format {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.output-format select {
  padding: 6px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: white;
}

.options-panel {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  width: 100%;
}

.options-panel h5 {
  margin: 0 0 8px 0;
  color: #37474f;
  font-size: 13px;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  cursor: pointer;
}

.option input, .option select {
  margin: 0;
}

.error-message {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
  padding: 12px;
  color: #c62828;
  margin-bottom: 20px;
}

.examples-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.examples-section h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.example-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.example-tab {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.example-tab.active {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.example-content {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
}

.example-content pre {
  margin: 0;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
  color: #37474f;
}

@media (max-width: 768px) {
  .converter-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
  
  .convert-panel {
    order: 2;
    min-width: auto;
  }
  
  .options-grid {
    flex-direction: column;
  }
}
</style>