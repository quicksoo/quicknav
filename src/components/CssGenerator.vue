<template>
  <div class="container">
    <div class="card">
      <h2>🎨 CSS样式生成器</h2>
      <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
        可视化CSS样式生成工具，支持毛玻璃效果、阴影、圆角、按钮等样式生成
      </p>
      
      <div class="generator-tabs">
        <button 
          v-for="generator in generators" 
          :key="generator.id"
          class="tab-btn"
          :class="{ active: activeGenerator === generator.id }"
          @click="activeGenerator = generator.id"
        >
          {{ generator.name }}
        </button>
      </div>
      
      <!-- 毛玻璃效果生成器 -->
      <div v-if="activeGenerator === 'glassmorphism'" class="generator-content">
        <h3>毛玻璃效果生成器</h3>
        <div class="controls-preview">
          <div class="controls">
            <div class="control-group">
              <label>背景透明度</label>
              <input type="range" v-model="glass.opacity" min="0" max="1" step="0.1">
              <span>{{ glass.opacity }}</span>
            </div>
            
            <div class="control-group">
              <label>模糊强度</label>
              <input type="range" v-model="glass.blur" min="0" max="50" step="1">
              <span>{{ glass.blur }}px</span>
            </div>
            
            <div class="control-group">
              <label>边框透明度</label>
              <input type="range" v-model="glass.borderOpacity" min="0" max="1" step="0.1">
              <span>{{ glass.borderOpacity }}</span>
            </div>
            
            <div class="control-group">
              <label>圆角大小</label>
              <input type="range" v-model="glass.borderRadius" min="0" max="50" step="1">
              <span>{{ glass.borderRadius }}px</span>
            </div>
          </div>
          
          <div class="preview-area">
            <div class="glass-preview" :style="glassStyle">
              <h4>毛玻璃效果预览</h4>
              <p>这是一个毛玻璃效果的示例</p>
            </div>
          </div>
        </div>
        
        <div class="code-output">
          <h4>生成的CSS代码：</h4>
          <pre><code>{{ glassCssCode }}</code></pre>
          <button class="btn" @click="copyCode(glassCssCode)">复制CSS代码</button>
        </div>
      </div>
      
      <!-- 阴影效果生成器 -->
      <div v-if="activeGenerator === 'shadow'" class="generator-content">
        <h3>阴影效果生成器</h3>
        <div class="controls-preview">
          <div class="controls">
            <div class="control-group">
              <label>水平偏移</label>
              <input type="range" v-model="shadow.x" min="-50" max="50" step="1">
              <span>{{ shadow.x }}px</span>
            </div>
            
            <div class="control-group">
              <label>垂直偏移</label>
              <input type="range" v-model="shadow.y" min="-50" max="50" step="1">
              <span>{{ shadow.y }}px</span>
            </div>
            
            <div class="control-group">
              <label>模糊半径</label>
              <input type="range" v-model="shadow.blur" min="0" max="50" step="1">
              <span>{{ shadow.blur }}px</span>
            </div>
            
            <div class="control-group">
              <label>扩展半径</label>
              <input type="range" v-model="shadow.spread" min="-20" max="20" step="1">
              <span>{{ shadow.spread }}px</span>
            </div>
            
            <div class="control-group">
              <label>阴影颜色</label>
              <input type="color" v-model="shadow.color">
            </div>
            
            <div class="control-group">
              <label>透明度</label>
              <input type="range" v-model="shadow.opacity" min="0" max="1" step="0.1">
              <span>{{ shadow.opacity }}</span>
            </div>
          </div>
          
          <div class="preview-area">
            <div class="shadow-preview" :style="shadowStyle">
              阴影效果预览
            </div>
          </div>
        </div>
        
        <div class="code-output">
          <h4>生成的CSS代码：</h4>
          <pre><code>{{ shadowCssCode }}</code></pre>
          <button class="btn" @click="copyCode(shadowCssCode)">复制CSS代码</button>
        </div>
      </div>
      
      <!-- 圆角生成器 -->
      <div v-if="activeGenerator === 'border-radius'" class="generator-content">
        <h3>圆角效果生成器</h3>
        <div class="controls-preview">
          <div class="controls">
            <div class="control-group">
              <label>左上角</label>
              <input type="range" v-model="borderRadius.topLeft" min="0" max="100" step="1">
              <span>{{ borderRadius.topLeft }}px</span>
            </div>
            
            <div class="control-group">
              <label>右上角</label>
              <input type="range" v-model="borderRadius.topRight" min="0" max="100" step="1">
              <span>{{ borderRadius.topRight }}px</span>
            </div>
            
            <div class="control-group">
              <label>右下角</label>
              <input type="range" v-model="borderRadius.bottomRight" min="0" max="100" step="1">
              <span>{{ borderRadius.bottomRight }}px</span>
            </div>
            
            <div class="control-group">
              <label>左下角</label>
              <input type="range" v-model="borderRadius.bottomLeft" min="0" max="100" step="1">
              <span>{{ borderRadius.bottomLeft }}px</span>
            </div>
            
            <div class="control-group">
              <label>背景颜色</label>
              <input type="color" v-model="borderRadius.backgroundColor">
            </div>
          </div>
          
          <div class="preview-area">
            <div class="border-radius-preview" :style="borderRadiusStyle">
              圆角效果预览
            </div>
          </div>
        </div>
        
        <div class="code-output">
          <h4>生成的CSS代码：</h4>
          <pre><code>{{ borderRadiusCssCode }}</code></pre>
          <button class="btn" @click="copyCode(borderRadiusCssCode)">复制CSS代码</button>
        </div>
      </div>
      
      <!-- 按钮生成器 -->
      <div v-if="activeGenerator === 'button'" class="generator-content">
        <h3>按钮样式生成器</h3>
        <div class="controls-preview">
          <div class="controls">
            <div class="control-group">
              <label>按钮文字</label>
              <input type="text" v-model="button.text" placeholder="按钮文字">
            </div>
            
            <div class="control-group">
              <label>背景颜色</label>
              <input type="color" v-model="button.backgroundColor">
            </div>
            
            <div class="control-group">
              <label>文字颜色</label>
              <input type="color" v-model="button.textColor">
            </div>
            
            <div class="control-group">
              <label>圆角大小</label>
              <input type="range" v-model="button.borderRadius" min="0" max="50" step="1">
              <span>{{ button.borderRadius }}px</span>
            </div>
            
            <div class="control-group">
              <label>内边距（上下）</label>
              <input type="range" v-model="button.paddingY" min="5" max="30" step="1">
              <span>{{ button.paddingY }}px</span>
            </div>
            
            <div class="control-group">
              <label>内边距（左右）</label>
              <input type="range" v-model="button.paddingX" min="10" max="50" step="1">
              <span>{{ button.paddingX }}px</span>
            </div>
            
            <div class="control-group">
              <label>字体大小</label>
              <input type="range" v-model="button.fontSize" min="12" max="24" step="1">
              <span>{{ button.fontSize }}px</span>
            </div>
          </div>
          
          <div class="preview-area">
            <button class="button-preview" :style="buttonStyle">
              {{ button.text || '按钮预览' }}
            </button>
          </div>
        </div>
        
        <div class="code-output">
          <h4>生成的CSS代码：</h4>
          <pre><code>{{ buttonCssCode }}</code></pre>
          <button class="btn" @click="copyCode(buttonCssCode)">复制CSS代码</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CssGenerator',
  data() {
    return {
      activeGenerator: 'glassmorphism',
      generators: [
        { id: 'glassmorphism', name: '毛玻璃效果' },
        { id: 'shadow', name: '阴影效果' },
        { id: 'border-radius', name: '圆角效果' },
        { id: 'button', name: '按钮样式' }
      ],
      glass: {
        opacity: 0.2,
        blur: 10,
        borderOpacity: 0.3,
        borderRadius: 16
      },
      shadow: {
        x: 0,
        y: 8,
        blur: 25,
        spread: 0,
        color: '#000000',
        opacity: 0.15
      },
      borderRadius: {
        topLeft: 10,
        topRight: 10,
        bottomRight: 10,
        bottomLeft: 10,
        backgroundColor: '#667eea'
      },
      button: {
        text: '点击我',
        backgroundColor: '#667eea',
        textColor: '#ffffff',
        borderRadius: 8,
        paddingY: 12,
        paddingX: 24,
        fontSize: 16
      }
    }
  },
  computed: {
    glassStyle() {
      return {
        background: `rgba(255, 255, 255, ${this.glass.opacity})`,
        backdropFilter: `blur(${this.glass.blur}px)`,
        border: `1px solid rgba(255, 255, 255, ${this.glass.borderOpacity})`,
        borderRadius: `${this.glass.borderRadius}px`
      }
    },
    
    glassCssCode() {
      return `.glassmorphism {
  background: rgba(255, 255, 255, ${this.glass.opacity});
  backdrop-filter: blur(${this.glass.blur}px);
  -webkit-backdrop-filter: blur(${this.glass.blur}px);
  border: 1px solid rgba(255, 255, 255, ${this.glass.borderOpacity});
  border-radius: ${this.glass.borderRadius}px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}`
    },
    
    shadowStyle() {
      const rgba = this.hexToRgba(this.shadow.color, this.shadow.opacity)
      return {
        boxShadow: `${this.shadow.x}px ${this.shadow.y}px ${this.shadow.blur}px ${this.shadow.spread}px ${rgba}`,
        background: '#fff',
        padding: '20px',
        borderRadius: '8px'
      }
    },
    
    shadowCssCode() {
      const rgba = this.hexToRgba(this.shadow.color, this.shadow.opacity)
      return `.shadow-element {
  box-shadow: ${this.shadow.x}px ${this.shadow.y}px ${this.shadow.blur}px ${this.shadow.spread}px ${rgba};
}`
    },
    
    borderRadiusStyle() {
      return {
        borderRadius: `${this.borderRadius.topLeft}px ${this.borderRadius.topRight}px ${this.borderRadius.bottomRight}px ${this.borderRadius.bottomLeft}px`,
        backgroundColor: this.borderRadius.backgroundColor,
        width: '200px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold'
      }
    },
    
    borderRadiusCssCode() {
      return `.border-radius-element {
  border-radius: ${this.borderRadius.topLeft}px ${this.borderRadius.topRight}px ${this.borderRadius.bottomRight}px ${this.borderRadius.bottomLeft}px;
  background-color: ${this.borderRadius.backgroundColor};
}`
    },
    
    buttonStyle() {
      return {
        backgroundColor: this.button.backgroundColor,
        color: this.button.textColor,
        borderRadius: `${this.button.borderRadius}px`,
        padding: `${this.button.paddingY}px ${this.button.paddingX}px`,
        fontSize: `${this.button.fontSize}px`,
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.3s ease'
      }
    },
    
    buttonCssCode() {
      return `.custom-button {
  background-color: ${this.button.backgroundColor};
  color: ${this.button.textColor};
  border: none;
  border-radius: ${this.button.borderRadius}px;
  padding: ${this.button.paddingY}px ${this.button.paddingX}px;
  font-size: ${this.button.fontSize}px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}`
    }
  },
  methods: {
    hexToRgba(hex, opacity) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    },
    
    async copyCode(code) {
      try {
        await navigator.clipboard.writeText(code)
        this.showToast('CSS代码已复制到剪贴板！')
      } catch (error) {
        console.error('复制失败:', error)
        this.showToast('复制失败，请手动复制')
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
          document.body.removeChild(toast)
        }, 300)
      }, 2000)
    }
  }
}
</script>

<style scoped>
.generator-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.tab-btn.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
}

.generator-content {
  margin-bottom: 30px;
}

.generator-content h3 {
  color: white;
  margin-bottom: 25px;
  text-align: center;
  font-size: 1.5rem;
}

.controls-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.controls {
  background: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.control-group {
  margin-bottom: 20px;
}

.control-group label {
  display: block;
  color: white;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
}

.control-group input[type="range"] {
  width: 100%;
  margin-right: 10px;
}

.control-group input[type="color"] {
  width: 60px;
  height: 35px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.control-group input[type="text"] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
}

.control-group span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 500;
}

.preview-area {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.glass-preview {
  padding: 30px;
  text-align: center;
  color: white;
  min-width: 250px;
}

.glass-preview h4 {
  margin-bottom: 15px;
  font-size: 18px;
}

.glass-preview p {
  margin: 0;
  opacity: 0.9;
}

.shadow-preview {
  color: #333;
  text-align: center;
  font-weight: bold;
  min-width: 200px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.border-radius-preview {
  /* 样式通过计算属性动态生成 */
}

.button-preview {
  /* 样式通过计算属性动态生成 */
}

.code-output {
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.code-output h4 {
  color: white;
  margin-bottom: 15px;
  font-size: 16px;
}

.code-output pre {
  background: rgba(0, 0, 0, 0.4);
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 15px;
}

.code-output code {
  color: #51cf66;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre;
}

@media (max-width: 768px) {
  .generator-tabs {
    justify-content: center;
  }
  
  .tab-btn {
    font-size: 12px;
    padding: 8px 16px;
  }
  
  .controls-preview {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .preview-area {
    padding: 20px;
    min-height: 150px;
  }
  
  .glass-preview {
    min-width: 200px;
    padding: 20px;
  }
  
  .code-output pre {
    font-size: 12px;
  }
}
</style>