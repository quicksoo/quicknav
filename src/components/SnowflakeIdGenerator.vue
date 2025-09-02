<template>
  <div class="snowflake-id-generator">
    <h2>❄️ 雪花ID生成器</h2>
    <p class="tool-description">基于Twitter Snowflake算法的分布式ID生成器，生成全局唯一的64位整数ID</p>
    
    <div class="config-section">
      <h3>参数配置</h3>
      <div class="config-grid">
        <div class="config-item">
          <label for="workerId">工作机器ID (0-31)</label>
          <input 
            id="workerId" 
            type="number" 
            v-model="workerId" 
            min="0" 
            max="31"
            @input="validateWorkerId"
          >
        </div>
        
        <div class="config-item">
          <label for="datacenterId">数据中心ID (0-31)</label>
          <input 
            id="datacenterId" 
            type="number" 
            v-model="datacenterId" 
            min="0" 
            max="31"
            @input="validateDatacenterId"
          >
        </div>
      </div>
      
      <div class="config-info">
        <p><strong>说明：</strong>雪花ID由时间戳(41位)+数据中心ID(5位)+工作机器ID(5位)+序列号(12位)组成</p>
      </div>
    </div>
    
    <div class="generator-section">
      <button @click="generateId" class="generate-btn">生成雪花ID</button>
      <button @click="generateBatch" class="batch-btn">批量生成(10个)</button>
      <button @click="clearResults" class="clear-btn">清空结果</button>
    </div>
    
    <div class="result-section" v-if="generatedIds.length > 0">
      <h3>生成结果</h3>
      <div class="result-header">
        <span class="result-count">共生成 {{ generatedIds.length }} 个ID</span>
        <button @click="copyAll" class="copy-all-btn">复制全部</button>
      </div>
      
      <div class="result-list">
        <div 
          v-for="(id, index) in generatedIds" 
          :key="index" 
          class="result-item"
        >
          <span class="id-number">{{ id }}</span>
          <button @click="copyId(id)" class="copy-btn">复制</button>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <h3>雪花ID算法介绍</h3>
      <div class="info-content">
        <p><strong>雪花ID (Snowflake ID)</strong> 是Twitter开源的分布式ID生成算法，能够生成全局唯一的64位整数ID。</p>
        
        <h4>结构组成：</h4>
        <ul>
          <li><strong>1位符号位：</strong>始终为0，表示正数</li>
          <li><strong>41位时间戳：</strong>毫秒级时间戳，可以用(2^41-1)/(1000*60*60*24*365) ≈ 69年</li>
          <li><strong>5位数据中心ID：</strong>可以支持32个数据中心</li>
          <li><strong>5位工作机器ID：</strong>每个数据中心可以支持32台机器</li>
          <li><strong>12位序列号：</strong>同一毫秒内可以生成4096个ID</li>
        </ul>
        
        <h4>优点：</h4>
        <ul>
          <li>全局唯一性：通过时间戳、数据中心ID、机器ID和序列号保证全局唯一</li>
          <li>趋势递增：ID整体趋势是递增的，有利于数据库索引性能</li>
          <li>高性能：纯内存计算，性能极高</li>
          <li>高可用：不依赖第三方服务</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SnowflakeIdGenerator',
  data() {
    return {
      workerId: 1,
      datacenterId: 1,
      generatedIds: [],
      lastTimestamp: 0,
      sequence: 0
    }
  },
  methods: {
    // 验证工作机器ID
    validateWorkerId() {
      if (this.workerId < 0) this.workerId = 0
      if (this.workerId > 31) this.workerId = 31
    },
    
    // 验证数据中心ID
    validateDatacenterId() {
      if (this.datacenterId < 0) this.datacenterId = 0
      if (this.datacenterId > 31) this.datacenterId = 31
    },
    
    // 生成雪花ID
    generateId() {
      try {
        let timestamp = this.getCurrentTimestamp()
        
        // 如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过，抛出异常
        if (timestamp < this.lastTimestamp) {
          throw new Error('时钟回拨异常，无法生成ID')
        }
        
        // 如果是同一毫秒内生成的，则进行序列号递增
        if (timestamp === this.lastTimestamp) {
          this.sequence = (this.sequence + 1) & 0xFFF // 序列号最大值为4095
          // 如果序列号溢出，等待下一毫秒
          if (this.sequence === 0) {
            timestamp = this.waitNextMillis(this.lastTimestamp)
          }
        } else {
          // 如果是新的毫秒，序列号重置为0
          this.sequence = 0
        }
        
        this.lastTimestamp = timestamp
        
        // 组合雪花ID
        const id = (timestamp - 1288834974657n) << 22n |
                  (BigInt(this.datacenterId) << 17n) |
                  (BigInt(this.workerId) << 12n) |
                  BigInt(this.sequence)
        
        this.generatedIds.unshift(id.toString())
        
        // 限制只保留最近100个结果
        if (this.generatedIds.length > 100) {
          this.generatedIds.pop()
        }
      } catch (error) {
        alert('生成ID失败: ' + error.message)
      }
    },
    
    // 批量生成ID
    generateBatch() {
      for (let i = 0; i < 10; i++) {
        this.generateId()
      }
    },
    
    // 清空结果
    clearResults() {
      this.generatedIds = []
    },
    
    // 复制单个ID
    copyId(id) {
      navigator.clipboard.writeText(id).then(() => {
        alert('ID已复制到剪贴板')
      }).catch(() => {
        alert('复制失败，请手动复制')
      })
    },
    
    // 复制全部ID
    copyAll() {
      const allIds = this.generatedIds.join('\n')
      navigator.clipboard.writeText(allIds).then(() => {
        alert('全部ID已复制到剪贴板')
      }).catch(() => {
        alert('复制失败，请手动复制')
      })
    },
    
    // 获取当前时间戳
    getCurrentTimestamp() {
      return BigInt(Date.now())
    },
    
    // 等待下一毫秒
    waitNextMillis(lastTimestamp) {
      let timestamp = this.getCurrentTimestamp()
      while (timestamp <= lastTimestamp) {
        timestamp = this.getCurrentTimestamp()
      }
      return timestamp
    }
  }
}
</script>

<style scoped>
.snowflake-id-generator {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tool-description {
  color: #666;
  font-size: 16px;
  margin-bottom: 30px;
  text-align: center;
}

.config-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.config-section h3 {
  margin-top: 0;
  color: #333;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 15px;
}

.config-item {
  display: flex;
  flex-direction: column;
}

.config-item label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.config-item input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.config-info {
  background: #e3f2fd;
  border-radius: 4px;
  padding: 15px;
  font-size: 14px;
  color: #555;
}

.config-info strong {
  color: #1976d2;
}

.generator-section {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.generate-btn, .batch-btn, .clear-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn {
  background: linear-gradient(135deg, #2196f3, #21cbf3);
  color: white;
}

.generate-btn:hover {
  background: linear-gradient(135deg, #1976d2, #0ba4d9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.batch-btn {
  background: linear-gradient(135deg, #4caf50, #8bc34a);
  color: white;
}

.batch-btn:hover {
  background: linear-gradient(135deg, #388e3c, #689f38);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.clear-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.clear-btn:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.result-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.result-section h3 {
  margin-top: 0;
  color: #333;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.result-count {
  font-weight: 500;
  color: #555;
}

.copy-all-btn {
  padding: 8px 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.copy-all-btn:hover {
  background: #1976d2;
}

.result-list {
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: white;
  border-radius: 6px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.id-number {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: #333;
  word-break: break-all;
}

.copy-btn {
  padding: 6px 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.copy-btn:hover {
  background: #388e3c;
}

.info-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.info-section h3 {
  margin-top: 0;
  color: #333;
}

.info-content {
  line-height: 1.6;
  color: #555;
}

.info-content h4 {
  margin: 15px 0 10px;
  color: #444;
}

.info-content ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

.info-content li {
  margin-bottom: 8px;
}

.info-content strong {
  color: #333;
}

@media (max-width: 768px) {
  .snowflake-id-generator {
    padding: 15px;
  }
  
  .generator-section {
    flex-direction: column;
  }
  
  .generate-btn, .batch-btn, .clear-btn {
    width: 100%;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .id-number {
    width: 100%;
    word-break: break-all;
  }
  
  .copy-btn {
    align-self: flex-end;
  }
}
</style>