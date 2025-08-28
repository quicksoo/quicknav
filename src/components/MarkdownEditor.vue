<template>
  <div class="container">
    <div class="card">
      <h2>📝 Markdown 编辑器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        在线Markdown编辑器，支持实时预览、语法高亮和常用工具
      </p>
      
      <div class="editor-toolbar">
        <div class="toolbar-group">
          <button class="toolbar-btn" @click="insertText('**', '**')" title="粗体">
            <strong>B</strong>
          </button>
          <button class="toolbar-btn" @click="insertText('*', '*')" title="斜体">
            <em>I</em>
          </button>
          <button class="toolbar-btn" @click="insertText('~~', '~~')" title="删除线">
            <s>S</s>
          </button>
          <button class="toolbar-btn" @click="insertText('`', '`')" title="行内代码">
            &lt;/&gt;
          </button>
        </div>
        
        <div class="toolbar-group">
          <button class="toolbar-btn" @click="insertHeading(1)" title="标题1">H1</button>
          <button class="toolbar-btn" @click="insertHeading(2)" title="标题2">H2</button>
          <button class="toolbar-btn" @click="insertHeading(3)" title="标题3">H3</button>
        </div>
        
        <div class="toolbar-group">
          <button class="toolbar-btn" @click="insertList('-')" title="无序列表">• 列表</button>
          <button class="toolbar-btn" @click="insertList('1.')" title="有序列表">1. 列表</button>
          <button class="toolbar-btn" @click="insertQuote()" title="引用">❝ 引用</button>
          <button class="toolbar-btn" @click="insertLink()" title="链接">🔗 链接</button>
          <button class="toolbar-btn" @click="insertImage()" title="图片">🖼️ 图片</button>
        </div>
        
        <div class="toolbar-group">
          <button class="toolbar-btn" @click="insertTable()" title="表格">📊 表格</button>
          <button class="toolbar-btn" @click="insertCodeBlock()" title="代码块">💻 代码</button>
          <button class="toolbar-btn" @click="insertHr()" title="分割线">➖ 分割线</button>
        </div>
        
        <div class="toolbar-group">
          <button class="toolbar-btn" @click="previewMode = !previewMode" :class="{ active: previewMode }" title="预览模式">
            👁️ {{ previewMode ? '编辑' : '预览' }}
          </button>
        </div>
      </div>
      
      <div class="editor-container">
        <div v-if="!previewMode" class="editor-panels">
          <div class="editor-panel">
            <div class="panel-header">
              <h4>Markdown 编辑</h4>
              <div class="editor-actions">
                <button class="action-btn" @click="loadSample">📋 示例</button>
                <button class="action-btn" @click="clearEditor">🗑️ 清空</button>
                <button class="action-btn" @click="copyMarkdown">📋 复制</button>
              </div>
            </div>
            <textarea 
              ref="mdEditor"
              v-model="markdownText" 
              @input="updatePreview"
              @scroll="syncScroll"
              placeholder="在这里输入Markdown内容..."
              rows="25"
              class="markdown-input"
            ></textarea>
            <div class="editor-stats">
              <span>字符: {{ markdownText.length }}</span>
              <span>行数: {{ getLineCount(markdownText) }}</span>
              <span>单词: {{ getWordCount(markdownText) }}</span>
            </div>
          </div>
          
          <div class="preview-panel">
            <div class="panel-header">
              <h4>实时预览</h4>
              <div class="preview-actions">
                <button class="action-btn" @click="copyHtml">📋 复制HTML</button>
                <button class="action-btn" @click="downloadHtml">💾 下载HTML</button>
                <button class="action-btn" @click="downloadMarkdown">💾 下载MD</button>
              </div>
            </div>
            <div 
              ref="previewArea"
              class="markdown-preview" 
              v-html="htmlContent"
              @scroll="syncPreviewScroll"
            ></div>
          </div>
        </div>
        
        <div v-else class="full-preview">
          <div class="preview-header">
            <h4>Markdown 预览</h4>
            <button class="action-btn" @click="previewMode = false">✏️ 返回编辑</button>
          </div>
          <div class="markdown-preview full" v-html="htmlContent"></div>
        </div>
      </div>
      
      <div class="markdown-help">
        <h4>Markdown 语法参考：</h4>
        <div class="help-grid">
          <div class="help-item">
            <strong>标题:</strong> # 一级标题 ## 二级标题
          </div>
          <div class="help-item">
            <strong>强调:</strong> **粗体** *斜体* ~~删除线~~
          </div>
          <div class="help-item">
            <strong>列表:</strong> - 项目1 或 1. 项目1
          </div>
          <div class="help-item">
            <strong>链接:</strong> [文本](http://example.com)
          </div>
          <div class="help-item">
            <strong>图片:</strong> ![描述](图片URL)
          </div>
          <div class="help-item">
            <strong>代码:</strong> `行内代码` 或 ```代码块```
          </div>
          <div class="help-item">
            <strong>引用:</strong> > 引用内容
          </div>
          <div class="help-item">
            <strong>表格:</strong> | 列1 | 列2 | 分隔行使用 |---|---|
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarkdownEditor',
  data() {
    return {
      markdownText: '',
      htmlContent: '',
      previewMode: false
    }
  },
  mounted() {
    this.updatePreview()
  },
  methods: {
    updatePreview() {
      this.htmlContent = this.markdownToHtml(this.markdownText)
    },
    
    markdownToHtml(markdown) {
      let html = markdown
      
      // 代码块
      html = html.replace(/```(\\w+)?\\n([\\s\\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
      
      // 标题
      html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
      html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
      html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')
      
      // 强调
      html = html.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>')
      html = html.replace(/\\*([^*]+)\\*/g, '<em>$1</em>')
      html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>')
      
      // 链接和图片
      html = html.replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<img src="$2" alt="$1">')
      html = html.replace(/\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank">$1</a>')
      
      // 列表
      html = html.replace(/^\\s*[-*+]\\s+(.+)$/gm, '<li>$1</li>')
      html = html.replace(/^\\s*\\d+\\.\\s+(.+)$/gm, '<li>$1</li>')
      html = html.replace(/(<li>.*<\\/li>)/s, '<ul>$1</ul>')
      
      // 引用
      html = html.replace(/^>\\s*(.+)$/gm, '<blockquote>$1</blockquote>')
      
      // 水平线
      html = html.replace(/^---$/gm, '<hr>')
      
      // 段落
      html = html.replace(/^(?!<[h|u|o|b|p])(.+)$/gm, '<p>$1</p>')
      
      // 换行
      html = html.replace(/\\n/g, '<br>')
      
      return html
    },
    
    insertText(before, after = '') {
      const textarea = this.$refs.mdEditor
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = this.markdownText.substring(start, end)
      
      const replacement = before + (selectedText || '文本') + after
      this.markdownText = this.markdownText.substring(0, start) + replacement + this.markdownText.substring(end)
      
      this.$nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, start + before.length + (selectedText || '文本').length)
      })
    },
    
    insertHeading(level) {
      const prefix = '#'.repeat(level) + ' '
      this.insertLinePrefix(prefix)
    },
    
    insertList(type) {
      const prefix = type + ' '
      this.insertLinePrefix(prefix)
    },
    
    insertQuote() {
      this.insertLinePrefix('> ')
    },
    
    insertLinePrefix(prefix) {
      const textarea = this.$refs.mdEditor
      const start = textarea.selectionStart
      const lineStart = this.markdownText.lastIndexOf('\\n', start - 1) + 1
      
      this.markdownText = this.markdownText.substring(0, lineStart) + prefix + this.markdownText.substring(lineStart)
      
      this.$nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + prefix.length, start + prefix.length)
      })
    },
    
    insertLink() {
      this.insertText('[链接文本](', 'http://example.com)')
    },
    
    insertImage() {
      this.insertText('![图片描述](', 'http://example.com/image.jpg)')
    },
    
    insertTable() {
      const table = `\\n| 列1 | 列2 | 列3 |\\n|-----|-----|-----|\\n| 行1 | 数据 | 数据 |\\n| 行2 | 数据 | 数据 |\\n`
      this.insertText(table)
    },
    
    insertCodeBlock() {
      this.insertText('\\n```javascript\\n', '\\n// 你的代码\\nconsole.log("Hello World");\\n```\\n')
    },
    
    insertHr() {
      this.insertText('\\n---\\n')
    },
    
    loadSample() {
      this.markdownText = `# Markdown 示例文档

## 二级标题

这是一个 **Markdown** 示例文档，展示了常用的语法。

### 文本格式

- **粗体文本**
- *斜体文本*
- ~~删除线文本~~
- \`行内代码\`

### 列表

#### 无序列表
- 项目 1
- 项目 2
- 项目 3

#### 有序列表
1. 第一项
2. 第二项
3. 第三项

### 链接和图片

[访问GitHub](https://github.com)

![示例图片](https://via.placeholder.com/300x200?text=Markdown+Image)

### 引用

> 这是一个引用块，可以用来突出重要内容。
> 支持多行引用。

### 代码块

\`\`\`javascript
function hello() {
    console.log("Hello, Markdown!");
}

hello();
\`\`\`

### 表格

| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |
| 王五 | 28   | 广州 |

### 分割线

---

这就是 Markdown 的基本语法示例！`
    },
    
    clearEditor() {
      this.markdownText = ''
      this.htmlContent = ''
    },
    
    async copyMarkdown() {
      try {
        await navigator.clipboard.writeText(this.markdownText)
        this.showToast('Markdown已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    async copyHtml() {
      try {
        await navigator.clipboard.writeText(this.htmlContent)
        this.showToast('HTML已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    downloadHtml() {
      const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Document</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; margin: 40px; }
        h1, h2, h3 { color: #333; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
        pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
${this.htmlContent}
</body>
</html>`
      
      this.downloadFile(fullHtml, 'document.html', 'text/html')
    },
    
    downloadMarkdown() {
      this.downloadFile(this.markdownText, 'document.md', 'text/markdown')
    },
    
    downloadFile(content, filename, type) {
      const blob = new Blob([content], { type })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    },
    
    syncScroll() {
      if (this.$refs.previewArea) {
        const editor = this.$refs.mdEditor
        const preview = this.$refs.previewArea
        const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight)
        preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight)
      }
    },
    
    syncPreviewScroll() {
      if (this.$refs.mdEditor) {
        const editor = this.$refs.mdEditor
        const preview = this.$refs.previewArea
        const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight)
        editor.scrollTop = scrollPercentage * (editor.scrollHeight - editor.clientHeight)
      }
    },
    
    getLineCount(text) {
      return text ? text.split('\\n').length : 0
    },
    
    getWordCount(text) {
      return text ? text.trim().split(/\\s+/).filter(word => word).length : 0
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
  watch: {
    markdownText() {
      this.updatePreview()
    }
  }
}
</script>

<style scoped>
.editor-toolbar {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  gap: 4px;
  align-items: center;
}

.toolbar-btn {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.toolbar-btn:hover {
  background: #e8e8e8;
}

.toolbar-btn.active {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.editor-container {
  margin-bottom: 30px;
}

.editor-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 600px;
}

.editor-panel, .preview-panel {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.editor-actions, .preview-actions {
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

.markdown-input {
  flex: 1;
  border: none;
  resize: none;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
}

.editor-stats {
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e8e8e8;
  font-size: 12px;
  color: #78909c;
}

.markdown-preview {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
}

.markdown-preview.full {
  height: 500px;
}

.full-preview {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.preview-header h4 {
  margin: 0;
  color: #37474f;
  font-size: 14px;
}

.markdown-help {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.markdown-help h4 {
  color: #37474f;
  margin-bottom: 12px;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
}

.help-item {
  background: white;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  font-size: 13px;
}

/* Markdown 预览样式 */
.markdown-preview h1 {
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
}

.markdown-preview h2 {
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.markdown-preview h3 {
  color: #666;
}

.markdown-preview code {
  background: #f4f4f4;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
}

.markdown-preview pre {
  background: #f8f8f8;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
}

.markdown-preview pre code {
  background: none;
  padding: 0;
}

.markdown-preview blockquote {
  border-left: 4px solid #ddd;
  margin: 16px 0;
  padding-left: 16px;
  color: #666;
  font-style: italic;
}

.markdown-preview table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.markdown-preview th,
.markdown-preview td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.markdown-preview th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.markdown-preview ul,
.markdown-preview ol {
  padding-left: 24px;
  margin: 12px 0;
}

.markdown-preview li {
  margin: 4px 0;
}

.markdown-preview hr {
  border: none;
  border-top: 2px solid #eee;
  margin: 24px 0;
}

.markdown-preview a {
  color: #2196f3;
  text-decoration: none;
}

.markdown-preview a:hover {
  text-decoration: underline;
}

.markdown-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 8px 0;
}

@media (max-width: 768px) {
  .editor-panels {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .editor-panel, .preview-panel {
    height: 400px;
  }
  
  .toolbar-group {
    flex-wrap: wrap;
  }
  
  .help-grid {
    grid-template-columns: 1fr;
  }
}
</style>