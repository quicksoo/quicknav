<template>
  <div class="container">
    <div class="card">
      <h2>🔍 正则表达式测试器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        在线测试和验证正则表达式，实时查看匹配结果
      </p>
      
      <div class="regex-section">
        <div class="input-group">
          <label>正则表达式：</label>
          <div class="regex-input">
            <span class="regex-delimiter">/</span>
            <input 
              v-model="regexPattern" 
              placeholder="请输入正则表达式..."
              @input="testRegex"
              class="regex-field"
            >
            <span class="regex-delimiter">/</span>
            <input 
              v-model="regexFlags" 
              placeholder="flags"
              class="flags-field"
              @input="testRegex"
            >
          </div>
        </div>
        
        <div class="input-group">
          <label>测试文本：</label>
          <textarea 
            v-model="testText" 
            placeholder="请输入要测试的文本内容..."
            rows="6"
            @input="testRegex"
          ></textarea>
        </div>
        
        <div class="flags-helper">
          <label>常用标志：</label>
          <div class="flag-options">
            <label class="flag-option">
              <input type="checkbox" value="g" v-model="selectedFlags" @change="updateFlags">
              <span>g - 全局匹配</span>
            </label>
            <label class="flag-option">
              <input type="checkbox" value="i" v-model="selectedFlags" @change="updateFlags">
              <span>i - 忽略大小写</span>
            </label>
            <label class="flag-option">
              <input type="checkbox" value="m" v-model="selectedFlags" @change="updateFlags">
              <span>m - 多行模式</span>
            </label>
            <label class="flag-option">
              <input type="checkbox" value="s" v-model="selectedFlags" @change="updateFlags">
              <span>s - 单行模式</span>
            </label>
          </div>
        </div>
      </div>
      
      <div v-if="regexResult" class="result-section">
        <h4>匹配结果：</h4>
        <div class="match-info">
          <span class="match-count">找到 {{ matchCount }} 个匹配项</span>
          <span v-if="regexError" class="error-message">{{ regexError }}</span>
        </div>
        
        <div v-if="matches.length > 0" class="matches-list">
          <div v-for="(match, index) in matches" :key="index" class="match-item">
            <div class="match-header">
              <span class="match-index">匹配 {{ index + 1 }}</span>
              <span class="match-position">位置: {{ match.index }}-{{ match.index + match[0].length }}</span>
            </div>
            <div class="match-content">{{ match[0] }}</div>
            <div v-if="match.length > 1" class="capture-groups">
              <div v-for="(group, groupIndex) in match.slice(1)" :key="groupIndex" class="capture-group">
                <span class="group-label">组 {{ groupIndex + 1 }}:</span>
                <span class="group-content">{{ group || '(空)' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="highlightedText" class="highlighted-section">
          <h5>高亮显示：</h5>
          <div class="highlighted-text" v-html="highlightedText"></div>
        </div>
      </div>
      
      <div class="examples-section">
        <h4>常用正则表达式：</h4>
        <div class="example-grid">
          <div 
            class="example-item" 
            v-for="example in regexExamples" 
            :key="example.name"
            @click="loadExample(example)"
          >
            <h5>{{ example.name }}</h5>
            <code>{{ example.pattern }}</code>
            <p>{{ example.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <h4>正则表达式语法：</h4>
        <div class="syntax-grid">
          <div class="syntax-category">
            <h5>基本语法：</h5>
            <ul>
              <li><code>.</code> - 匹配任意字符</li>
              <li><code>*</code> - 0次或多次</li>
              <li><code>+</code> - 1次或多次</li>
              <li><code>?</code> - 0次或1次</li>
              <li><code>^</code> - 行开始</li>
              <li><code>$</code> - 行结束</li>
            </ul>
          </div>
          <div class="syntax-category">
            <h5>字符类：</h5>
            <ul>
              <li><code>\d</code> - 数字 [0-9]</li>
              <li><code>\w</code> - 字母数字 [a-zA-Z0-9_]</li>
              <li><code>\s</code> - 空白字符</li>
              <li><code>[abc]</code> - 字符集</li>
              <li><code>[a-z]</code> - 字符范围</li>
              <li><code>[^abc]</code> - 否定字符集</li>
            </ul>
          </div>
          <div class="syntax-category">
            <h5>量词：</h5>
            <ul>
              <li><code>{n}</code> - 恰好n次</li>
              <li><code>{n,}</code> - 至少n次</li>
              <li><code>{n,m}</code> - n到m次</li>
              <li><code>()</code> - 捕获组</li>
              <li><code>(?:)</code> - 非捕获组</li>
              <li><code>|</code> - 或运算符</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegexTester',
  data() {
    return {
      regexPattern: '',
      regexFlags: '',
      testText: '',
      selectedFlags: [],
      regexResult: null,
      regexError: '',
      matches: [],
      matchCount: 0,
      highlightedText: '',
      regexExamples: [
        {
          name: '邮箱地址',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: '匹配标准邮箱格式',
          testText: 'user@example.com\ntest.email+tag@domain.co.uk\ninvalid.email'
        },
        {
          name: '手机号码',
          pattern: '^1[3-9]\\d{9}$',
          description: '匹配中国大陆手机号',
          testText: '13812345678\n15987654321\n12345678901'
        },
        {
          name: 'URL链接',
          pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
          description: '匹配HTTP/HTTPS链接',
          testText: 'https://www.example.com\nhttp://domain.org/path?param=value\nftp://invalid.link'
        },
        {
          name: 'IPv4地址',
          pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
          description: '匹配IPv4地址格式',
          testText: '192.168.1.1\n127.0.0.1\n255.255.255.0\n300.400.500.600'
        },
        {
          name: '中文字符',
          pattern: '[\\u4e00-\\u9fa5]+',
          description: '匹配中文字符',
          testText: 'Hello 世界\n中文测试text\n123中文456'
        },
        {
          name: '身份证号',
          pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
          description: '匹配18位身份证号',
          testText: '110101199003073333\n12345619900307333X\n123456789012345678'
        }
      ]
    }
  },
  methods: {
    testRegex() {
      this.regexError = ''
      this.matches = []
      this.matchCount = 0
      this.highlightedText = ''
      
      if (!this.regexPattern || !this.testText) {
        this.regexResult = null
        return
      }
      
      try {
        const regex = new RegExp(this.regexPattern, this.regexFlags)
        
        if (this.regexFlags.includes('g')) {
          // 全局匹配
          const matches = [...this.testText.matchAll(regex)]
          this.matches = matches
          this.matchCount = matches.length
          this.highlightMatches(regex)
        } else {
          // 单次匹配
          const match = this.testText.match(regex)
          if (match) {
            this.matches = [match]
            this.matchCount = 1
            this.highlightMatches(regex)
          } else {
            this.matches = []
            this.matchCount = 0
          }
        }
        
        this.regexResult = true
        
      } catch (error) {
        this.regexError = `正则表达式错误: ${error.message}`
        this.regexResult = true
      }
    },
    
    highlightMatches(regex) {
      let highlightedText = this.testText
      const globalRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g')
      
      highlightedText = highlightedText.replace(globalRegex, (match) => {
        return `<span class="highlight">${this.escapeHtml(match)}</span>`
      })
      
      this.highlightedText = this.escapeHtml(this.testText).replace(globalRegex, (match) => {
        return `<span class="highlight">${match}</span>`
      })
    },
    
    escapeHtml(text) {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    },
    
    updateFlags() {
      this.regexFlags = this.selectedFlags.join('')
      this.testRegex()
    },
    
    loadExample(example) {
      this.regexPattern = example.pattern
      this.testText = example.testText
      this.regexFlags = 'g'
      this.selectedFlags = ['g']
      this.testRegex()
    }
  }
}
</script>

<style scoped>
.regex-section {
  margin-bottom: 30px;
}

.regex-input {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px 12px;
  background: white;
}

.regex-delimiter {
  color: #666;
  font-weight: bold;
  font-family: monospace;
}

.regex-field {
  flex: 1;
  border: none;
  outline: none;
  font-family: monospace;
  font-size: 14px;
}

.flags-field {
  width: 60px;
  border: none;
  outline: none;
  font-family: monospace;
  font-size: 14px;
  text-align: center;
}

.flags-helper {
  margin-top: 15px;
}

.flags-helper label {
  color: #37474f;
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
}

.flag-options {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.flag-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #37474f;
}

.flag-option input {
  margin: 0;
}

.result-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.match-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.match-count {
  color: #2196f3;
  font-weight: 600;
}

.error-message {
  color: #f44336;
  font-size: 14px;
}

.matches-list {
  margin-bottom: 20px;
}

.match-item {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.match-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.match-index {
  font-weight: 600;
}

.match-content {
  background: #e3f2fd;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: monospace;
  margin-bottom: 8px;
  word-break: break-all;
}

.capture-groups {
  margin-top: 8px;
}

.capture-group {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 14px;
}

.group-label {
  color: #666;
  min-width: 40px;
}

.group-content {
  font-family: monospace;
  background: #fff3e0;
  padding: 2px 6px;
  border-radius: 3px;
}

.highlighted-section {
  margin-top: 20px;
}

.highlighted-section h5 {
  color: #37474f;
  margin-bottom: 10px;
}

.highlighted-text {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  font-family: monospace;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.highlighted-text :deep(.highlight) {
  background: #ffeb3b;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: bold;
}

.examples-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

.example-item code {
  display: block;
  background: #e8e8e8;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
  word-break: break-all;
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

.syntax-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.syntax-category h5 {
  color: #37474f;
  margin-bottom: 12px;
  font-size: 14px;
}

.syntax-category ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.syntax-category li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #78909c;
}

.syntax-category code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  min-width: 40px;
  text-align: center;
  font-family: monospace;
}

@media (max-width: 768px) {
  .match-header {
    flex-direction: column;
    gap: 4px;
  }
  
  .match-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .flag-options {
    flex-direction: column;
    gap: 8px;
  }
  
  .example-grid,
  .syntax-grid {
    grid-template-columns: 1fr;
  }
}
</style>