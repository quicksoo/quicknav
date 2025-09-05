<template>
  <div class="container">
    <div class="card">
      <h2>☕ Java实体与JSON转换工具</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        Java实体类与JSON格式互转工具，支持生成Java实体代码和JSON数据
      </p>
      
      <div class="mode-tabs">
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'jsonToJava' }"
          @click="mode = 'jsonToJava'"
        >
          🔄 JSON转Java实体
        </button>
        <button 
          class="mode-tab" 
          :class="{ active: mode === 'javaToJson' }"
          @click="mode = 'javaToJson'"
        >
          🔁 Java实体转JSON
        </button>
      </div>
      
      <div v-if="mode === 'jsonToJava'" class="converter-section">
        <div class="input-group">
          <label>输入JSON数据：</label>
          <textarea 
            v-model="jsonInput" 
            placeholder='请输入JSON数据，例如：
{
  "id": 1,
  "name": "张三",
  "age": 25,
  "email": "zhangsan@example.com",
  "active": true
}'
            rows="10"
            @input="validateJson"
          ></textarea>
          <div v-if="jsonError" class="error-message">
            ❌ JSON格式错误: {{ jsonError }}
          </div>
          <div v-else-if="jsonInput" class="success-message">
            ✅ JSON格式正确
          </div>
        </div>
        
        <div class="options-section">
          <div class="option-group">
            <label>根类名：</label>
            <input v-model="className" type="text" placeholder="例如：User">
          </div>
          <div class="option-group">
            <label>包名：</label>
            <input v-model="packageName" type="text" placeholder="例如：com.example.model">
          </div>
        </div>
        
        <div class="tool-actions">
          <button class="btn" @click="convertJsonToJava" :disabled="!!jsonError || !jsonInput">生成Java实体</button>
          <button class="btn" @click="loadSampleJson">示例JSON</button>
          <button class="btn" @click="clearJson">清空</button>
        </div>
        
        <div v-if="javaOutput" class="result-section">
          <h4>生成的Java实体代码：</h4>
          <div class="code-block" v-for="(code, index) in javaOutput" :key="index">
            <h5>{{ code.className }}.java</h5>
            <pre><code>{{ code.content }}</code></pre>
          </div>
          <button class="btn" @click="copyAllJavaCode">📋 复制所有代码</button>
        </div>
      </div>
      
      <div v-else class="converter-section">
        <div class="input-group">
          <label>输入Java实体代码：</label>
          <textarea 
            v-model="javaInput" 
            placeholder='请输入Java实体代码，例如：
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
    private Boolean active;
    
    // getters and setters
}'
            rows="15"
          ></textarea>
        </div>
        
        <div class="tool-actions">
          <button class="btn" @click="convertJavaToJson" :disabled="!javaInput">生成JSON</button>
          <button class="btn" @click="loadSampleJava">示例Java代码</button>
          <button class="btn" @click="clearJava">清空</button>
        </div>
        
        <div v-if="jsonOutput" class="result-section">
          <h4>生成的JSON数据：</h4>
          <div class="code-block">
            <pre><code>{{ jsonOutput }}</code></pre>
          </div>
          <button class="btn" @click="copyJson">📋 复制JSON</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JavaEntityConverter',
  data() {
    return {
      mode: 'jsonToJava', // jsonToJava 或 javaToJson
      jsonInput: '',
      javaInput: '',
      jsonError: '',
      className: 'Example',
      packageName: 'com.example.model',
      javaOutput: [], // 改为数组以支持多个类
      jsonOutput: ''
    }
  },
  methods: {
    validateJson() {
      if (!this.jsonInput.trim()) {
        this.jsonError = ''
        return
      }
      
      try {
        JSON.parse(this.jsonInput)
        this.jsonError = ''
      } catch (error) {
        this.jsonError = error.message
      }
    },
    
    convertJsonToJava() {
      if (!this.jsonInput.trim()) {
        this.showToast('请输入JSON数据')
        return
      }
      
      try {
        const jsonData = JSON.parse(this.jsonInput)
        this.javaOutput = this.generateJavaEntities(jsonData, this.className || 'Example')
      } catch (error) {
        this.showToast('JSON解析错误: ' + error.message)
      }
    },
    
    // 生成多个Java实体类（支持嵌套）
    generateJavaEntities(jsonData, rootClassName) {
      const packageName = this.packageName || 'com.example.model'
      const classes = new Map() // 用于存储所有类定义
      
      // 递归处理对象，生成类定义
      this.processObject(jsonData, rootClassName, classes)
      
      // 生成所有类的Java代码
      const result = []
      for (const [className, classData] of classes.entries()) {
        result.push({
          className: className,
          content: this.generateJavaEntity(classData, className, packageName, classes)
        })
      }
      
      return result
    },
    
    // 递归处理对象，提取类定义
    processObject(obj, className, classes) {
      // 如果类已经处理过，跳过
      if (classes.has(className)) {
        return
      }
      
      // 存储类的字段信息
      const classData = {}
      classes.set(className, classData)
      
      // 遍历对象的所有属性
      for (const [key, value] of Object.entries(obj)) {
        if (value === null) {
          classData[key] = { type: 'Object', isNested: false }
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            classData[key] = { type: 'List<Object>', isNested: false }
          } else {
            const firstElement = value[0]
            if (typeof firstElement === 'object' && firstElement !== null) {
              // 数组元素是对象，需要创建新的类
              const nestedClassName = this.capitalize(key)
              classData[key] = { type: `List<${nestedClassName}>`, isNested: true, nestedClass: nestedClassName }
              this.processObject(firstElement, nestedClassName, classes)
            } else {
              const elementType = this.getJavaType(firstElement)
              classData[key] = { type: `List<${elementType}>`, isNested: false }
            }
          }
        } else if (typeof value === 'object') {
          // 嵌套对象，需要创建新的类
          const nestedClassName = this.capitalize(key)
          classData[key] = { type: nestedClassName, isNested: true, nestedClass: nestedClassName }
          this.processObject(value, nestedClassName, classes)
        } else {
          classData[key] = { type: this.getJavaType(value), isNested: false }
        }
      }
    },
    
    generateJavaEntity(classData, className, packageName, allClasses) {
      let javaCode = ''
      
      // 添加包声明
      if (packageName) {
        javaCode += `package ${packageName};\n\n`
      }
      
      // 添加导入语句
      const imports = new Set()
      imports.add('java.util.*')
      
      // 检查是否需要额外的导入
      for (const field of Object.values(classData)) {
        if (field.type.startsWith('List<')) {
          imports.add('java.util.List')
        }
        if (field.type.includes('BigDecimal')) {
          imports.add('java.math.BigDecimal')
        }
        if (field.type.includes('Date') || field.type.includes('Local')) {
          imports.add('java.time.*')
        }
      }
      
      // 添加导入语句
      for (const imp of Array.from(imports).sort()) {
        javaCode += `import ${imp};\n`
      }
      javaCode += '\n'
      
      // 添加类声明
      javaCode += `public class ${className} {\n`
      
      // 生成字段
      javaCode += this.generateFields(classData, '    ')
      
      // 生成构造函数
      javaCode += `\n    public ${className}() {}\n`
      
      // 生成getter和setter方法
      javaCode += this.generateGettersAndSetters(classData, '    ')
      
      // 生成toString方法
      javaCode += this.generateToString(className, classData, '    ')
      
      // 结束类
      javaCode += '}\n'
      
      return javaCode
    },
    
    generateFields(classData, indent) {
      let fields = ''
      
      for (const [key, fieldInfo] of Object.entries(classData)) {
        fields += `${indent}private ${fieldInfo.type} ${key};\n`
      }
      
      return fields
    },
    
    getJavaType(value) {
      switch (typeof value) {
        case 'string':
          return 'String'
        case 'number':
          if (Number.isInteger(value)) {
            return Math.abs(value) < 2147483647 ? 'Integer' : 'Long'
          } else {
            return 'Double'
          }
        case 'boolean':
          return 'Boolean'
        default:
          return 'Object'
      }
    },
    
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    
    generateGettersAndSetters(classData, indent) {
      let methods = ''
      
      for (const [key, fieldInfo] of Object.entries(classData)) {
        const capitalizedKey = this.capitalize(key)
        
        // Getter方法
        methods += `\n${indent}public ${fieldInfo.type} get${capitalizedKey}() {\n`
        methods += `${indent}    return ${key};\n`
        methods += `${indent}}\n`
        
        // Setter方法
        methods += `\n${indent}public void set${capitalizedKey}(${fieldInfo.type} ${key}) {\n`
        methods += `${indent}    this.${key} = ${key};\n`
        methods += `${indent}}\n`
      }
      
      return methods
    },
    
    generateToString(className, classData, indent) {
      let toString = `\n${indent}@Override\n`
      toString += `${indent}public String toString() {\n`
      toString += `${indent}    return "${className}{" +\n`
      
      const keys = Object.keys(classData)
      keys.forEach((key, index) => {
        const isLast = index === keys.length - 1
        toString += `${indent}        "${key}='" + ${key} + "'"${isLast ? '' : ' +'}\n`
      })
      
      toString += `${indent}        '}';\n`
      toString += `${indent}}\n`
      
      return toString
    },
    
    convertJavaToJson() {
      if (!this.javaInput.trim()) {
        this.showToast('请输入Java实体代码')
        return
      }
      
      try {
        this.jsonOutput = this.parseJavaToJSON(this.javaInput)
      } catch (error) {
        this.showToast('转换错误: ' + error.message)
      }
    },
    
    // 解析Java代码生成JSON
    parseJavaToJSON(javaCode) {
      // 这里我们实现一个简化的Java解析器
      // 实际项目中可能需要更复杂的解析逻辑
      
      // 提取类名
      const classMatch = javaCode.match(/public\s+class\s+(\w+)/)
      const className = classMatch ? classMatch[1] : 'Example'
      
      // 提取字段
      const fieldRegex = /private\s+(\w+(?:<\w+(?:<\w+>)?>)?)\s+(\w+);/g
      const fields = []
      let match
      while ((match = fieldRegex.exec(javaCode)) !== null) {
        fields.push({
          type: match[1],
          name: match[2]
        })
      }
      
      // 根据字段类型生成示例JSON
      const jsonObj = {}
      for (const field of fields) {
        jsonObj[field.name] = this.generateSampleValue(field.type)
      }
      
      return JSON.stringify(jsonObj, null, 2)
    },
    
    // 根据Java类型生成示例值
    generateSampleValue(javaType) {
      switch (javaType) {
        case 'String':
          return "示例文本"
        case 'Integer':
        case 'int':
          return 1
        case 'Long':
        case 'long':
          return 1000000
        case 'Double':
        case 'double':
          return 1.5
        case 'Float':
        case 'float':
          return 1.5
        case 'Boolean':
        case 'boolean':
          return true
        case 'Date':
          return "2023-01-01T00:00:00Z"
        case 'List<String>':
          return ["元素1", "元素2"]
        case 'List<Integer>':
          return [1, 2, 3]
        case 'Object':
          return {}
        default:
          // 处理泛型类型
          if (javaType.startsWith('List<')) {
            const elementType = javaType.substring(5, javaType.length - 1)
            return [this.generateSampleValue(elementType)]
          }
          // 假设是自定义类，返回空对象
          return {}
      }
    },
    
    loadSampleJson() {
      this.jsonInput = `{
  "id": 1,
  "name": "张三",
  "age": 25,
  "email": "zhangsan@example.com",
  "salary": 8500.50,
  "active": true,
  "createTime": "2023-10-01T08:30:00Z",
  "tags": ["developer", "java", "web"],
  "address": {
    "street": "中山路123号",
    "city": "北京",
    "zipCode": "100000"
  },
  "projects": [
    {
      "id": 101,
      "name": "项目A",
      "status": "进行中"
    },
    {
      "id": 102,
      "name": "项目B",
      "status": "已完成"
    }
  ]
}`
      this.className = 'User'
      this.packageName = 'com.example.model'
      this.validateJson()
    },
    
    loadSampleJava() {
      this.javaInput = `public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
    private Double salary;
    private Boolean active;
    private String createTime;
    private List<String> tags;
    private Address address;
    private List<Project> projects;
    
    public User() {}
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Integer getAge() {
        return age;
    }
    
    public void setAge(Integer age) {
        this.age = age;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Double getSalary() {
        return salary;
    }
    
    public void setSalary(Double salary) {
        this.salary = salary;
    }
    
    public Boolean getActive() {
        return active;
    }
    
    public void setActive(Boolean active) {
        this.active = active;
    }
    
    public String getCreateTime() {
        return createTime;
    }
    
    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public Address getAddress() {
        return address;
    }
    
    public void setAddress(Address address) {
        this.address = address;
    }
    
    public List<Project> getProjects() {
        return projects;
    }
    
    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }
    
    @Override
    public String toString() {
        return "User{" +
            "id='" + id + '\\'' +
            ", name='" + name + '\\'' +
            ", age='" + age + '\\'' +
            ", email='" + email + '\\'' +
            ", salary='" + salary + '\\'' +
            ", active='" + active + '\\'' +
            ", createTime='" + createTime + '\\'' +
            ", tags='" + tags + '\\'' +
            ", address='" + address + '\\'' +
            ", projects='" + projects + '\\'' +
            '}';
    }
}`
    },
    
    clearJson() {
      this.jsonInput = ''
      this.jsonError = ''
      this.javaOutput = []
      this.className = 'Example'
      this.packageName = 'com.example.model'
    },
    
    clearJava() {
      this.javaInput = ''
      this.jsonOutput = ''
    },
    
    async copyAllJavaCode() {
      if (!this.javaOutput || this.javaOutput.length === 0) {
        this.showToast('没有代码可复制')
        return
      }
      
      try {
        // 合并所有类的代码
        const allCode = this.javaOutput.map(item => `// ${item.className}.java\n${item.content}`).join('\n\n')
        await navigator.clipboard.writeText(allCode)
        this.showToast('所有Java代码已复制到剪贴板！')
      } catch (error) {
        this.showToast('复制失败，请手动复制')
      }
    },
    
    async copyJson() {
      if (!this.jsonOutput) {
        this.showToast('没有JSON可复制')
        return
      }
      
      try {
        await navigator.clipboard.writeText(this.jsonOutput)
        this.showToast('JSON已复制到剪贴板！')
      } catch (error) {
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
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.converter-section {
  margin-top: 20px;
}

.options-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 20px 0;
}

.option-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

.option-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.tool-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 20px 0;
}

.result-section {
  margin-top: 30px;
}

.result-section h4 {
  color: #333;
  margin-bottom: 15px;
}

.result-section h5 {
  color: #555;
  margin: 10px 0 5px 0;
  font-size: 14px;
}

.code-block {
  background: #f5f5f5;
  border-radius: 6px;
  padding: 15px;
  overflow-x: auto;
  margin-bottom: 15px;
}

.code-block pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.code-block code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  border-left: 3px solid #ff6b6b;
}

.success-message {
  color: #51cf66;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px;
  background: rgba(81, 207, 102, 0.1);
  border-radius: 4px;
  border-left: 3px solid #51cf66;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .options-section {
    grid-template-columns: 1fr;
  }
  
  .tool-actions {
    justify-content: center;
  }
}
</style>