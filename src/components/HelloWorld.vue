<template>
  <div class="container">
    <div class="card">
      <h2>👋 Hello World 代码示例</h2>
      <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
        各种编程语言的Hello World代码示例集合，学习编程的第一步
      </p>
      
      <div class="language-selector">
        <button 
          v-for="lang in languages" 
          :key="lang.name"
          class="lang-btn"
          :class="{ active: selectedLang === lang.name }"
          @click="selectLanguage(lang.name)"
        >
          {{ lang.name }}
        </button>
      </div>
      
      <div class="code-display">
        <div class="code-header">
          <span class="language-name">{{ getCurrentLanguage().name }}</span>
          <div class="code-actions">
            <button class="btn" @click="copyCode">复制代码</button>
            <button class="btn" @click="downloadCode">下载文件</button>
          </div>
        </div>
        
        <div class="code-content">
          <pre><code>{{ getCurrentLanguage().code }}</code></pre>
        </div>
        
        <div class="language-info">
          <h4>语言介绍：</h4>
          <p>{{ getCurrentLanguage().description }}</p>
          <div class="file-info">
            <strong>文件扩展名：</strong> {{ getCurrentLanguage().extension }} | 
            <strong>类型：</strong> {{ getCurrentLanguage().type }}
          </div>
        </div>
      </div>
      
      <div class="all-languages">
        <h3>所有语言一览</h3>
        <div class="language-grid">
          <div 
            v-for="lang in languages" 
            :key="lang.name"
            class="language-card"
            @click="selectLanguage(lang.name)"
          >
            <h4>{{ lang.name }}</h4>
            <span class="lang-type">{{ lang.type }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      selectedLang: 'JavaScript',
      languages: [
        {
          name: 'JavaScript',
          code: `console.log("Hello, World!");`,
          extension: '.js',
          type: '脚本语言',
          description: 'JavaScript是一种轻量级的解释性编程语言，主要用于网页开发。'
        },
        {
          name: 'Python',
          code: `print("Hello, World!")`,
          extension: '.py',
          type: '解释型语言',
          description: 'Python是一种高级编程语言，以其简洁的语法和强大的功能而闻名。'
        },
        {
          name: 'Java',
          code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
          extension: '.java',
          type: '编译型语言',
          description: 'Java是一种面向对象的编程语言，具有"一次编写，到处运行"的特性。'
        },
        {
          name: 'C++',
          code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
          extension: '.cpp',
          type: '编译型语言',
          description: 'C++是C语言的扩展，支持面向对象编程，广泛用于系统开发。'
        },
        {
          name: 'C',
          code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
          extension: '.c',
          type: '编译型语言',
          description: 'C语言是一种通用的编程语言，被广泛用于系统软件开发。'
        },
        {
          name: 'C#',
          code: `using System;

class HelloWorld {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
          extension: '.cs',
          type: '编译型语言',
          description: 'C#是微软开发的面向对象编程语言，主要用于.NET平台开发。'
        },
        {
          name: 'PHP',
          code: `<?php
echo "Hello, World!";
?>`,
          extension: '.php',
          type: '脚本语言',
          description: 'PHP是一种服务器端脚本语言，主要用于Web开发。'
        },
        {
          name: 'Ruby',
          code: `puts "Hello, World!"`,
          extension: '.rb',
          type: '解释型语言',
          description: 'Ruby是一种动态的面向对象编程语言，以其优雅的语法著称。'
        },
        {
          name: 'Go',
          code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
          extension: '.go',
          type: '编译型语言',
          description: 'Go是Google开发的编程语言，以其简洁性和并发性能著称。'
        },
        {
          name: 'Rust',
          code: `fn main() {
    println!("Hello, World!");
}`,
          extension: '.rs',
          type: '编译型语言',
          description: 'Rust是一种系统编程语言，注重安全性和性能。'
        },
        {
          name: 'Swift',
          code: `print("Hello, World!")`,
          extension: '.swift',
          type: '编译型语言',
          description: 'Swift是苹果开发的编程语言，主要用于iOS和macOS应用开发。'
        },
        {
          name: 'Kotlin',
          code: `fun main() {
    println("Hello, World!")
}`,
          extension: '.kt',
          type: '编译型语言',
          description: 'Kotlin是JetBrains开发的编程语言，与Java完全兼容。'
        },
        {
          name: 'TypeScript',
          code: `console.log("Hello, World!");`,
          extension: '.ts',
          type: '编译型语言',
          description: 'TypeScript是JavaScript的超集，添加了静态类型检查。'
        },
        {
          name: 'HTML',
          code: `<!DOCTYPE html>
<html>
<head>
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,
          extension: '.html',
          type: '标记语言',
          description: 'HTML是用于创建网页的标准标记语言。'
        },
        {
          name: 'CSS',
          code: `body::before {
    content: "Hello, World!";
    font-size: 24px;
    color: #333;
}`,
          extension: '.css',
          type: '样式表语言',
          description: 'CSS用于描述HTML文档的样式和布局。'
        }
      ]
    }
  },
  methods: {
    selectLanguage(langName) {
      this.selectedLang = langName
    },
    
    getCurrentLanguage() {
      return this.languages.find(lang => lang.name === this.selectedLang) || this.languages[0]
    },
    
    async copyCode() {
      try {
        await navigator.clipboard.writeText(this.getCurrentLanguage().code)
        this.showToast('代码已复制到剪贴板！')
      } catch (error) {
        console.error('复制失败:', error)
        this.showToast('复制失败，请手动复制')
      }
    },
    
    downloadCode() {
      const lang = this.getCurrentLanguage()
      const blob = new Blob([lang.code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `hello_world${lang.extension}`
      a.click()
      
      URL.revokeObjectURL(url)
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
          document.body.removeChild(toast)
        }, 300)
      }, 2000)
    }
  }
}
</script>

<style scoped>
.language-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lang-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.lang-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.lang-btn.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
}

.code-display {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  margin-bottom: 40px;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.language-name {
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.code-actions {
  display: flex;
  gap: 10px;
}

.code-content {
  padding: 20px;
}

.code-content pre {
  margin: 0;
  overflow-x: auto;
  background: none;
}

.code-content code {
  color: #51cf66;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre;
}

.language-info {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.language-info h4 {
  color: white;
  margin-bottom: 10px;
}

.language-info p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 15px;
}

.file-info {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.all-languages {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.all-languages h3 {
  color: white;
  margin-bottom: 25px;
  text-align: center;
}

.language-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.language-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.language-card h4 {
  color: white;
  margin-bottom: 8px;
  font-size: 16px;
}

.lang-type {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

@media (max-width: 768px) {
  .language-selector {
    justify-content: center;
  }
  
  .code-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .code-actions {
    justify-content: center;
  }
  
  .language-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .code-content code {
    font-size: 12px;
  }
}
</style>