<template>
  <div class="container">
    <div class="card">
      <h2>📐 单位转换器</h2>
      <p style="color: #78909c; margin-bottom: 20px;">
        长度、重量、温度、面积、体积等各种单位转换工具
      </p>
      
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category.key"
          class="category-tab" 
          :class="{ active: activeCategory === category.key }"
          @click="activeCategory = category.key"
        >
          {{ category.icon }} {{ category.name }}
        </button>
      </div>
      
      <div class="converter-section">
        <div class="input-section">
          <div class="input-group">
            <label>输入值：</label>
            <input 
              v-model="inputValue" 
              type="number" 
              step="any"
              @input="convert"
              placeholder="请输入数值"
              class="value-input"
            >
          </div>
          
          <div class="unit-selector">
            <label>从：</label>
            <select v-model="fromUnit" @change="convert" class="unit-select">
              <option v-for="unit in getCurrentUnits()" :key="unit.key" :value="unit.key">
                {{ unit.name }} ({{ unit.symbol }})
              </option>
            </select>
          </div>
        </div>
        
        <div class="convert-arrow">➡️</div>
        
        <div class="output-section">
          <div class="output-group">
            <label>结果：</label>
            <input 
              v-model="outputValue" 
              readonly 
              class="value-output"
            >
          </div>
          
          <div class="unit-selector">
            <label>到：</label>
            <select v-model="toUnit" @change="convert" class="unit-select">
              <option v-for="unit in getCurrentUnits()" :key="unit.key" :value="unit.key">
                {{ unit.name }} ({{ unit.symbol }})
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="quick-converts">
        <h4>快速转换：</h4>
        <div class="quick-buttons">
          <button 
            v-for="quick in getQuickConverts()" 
            :key="quick.label"
            class="quick-btn"
            @click="setQuickConvert(quick)"
          >
            {{ quick.label }}
          </button>
        </div>
      </div>
      
      <div class="conversion-table">
        <h4>转换表格：</h4>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ fromUnit }}</th>
                <th v-for="unit in getCurrentUnits().slice(0, 6)" :key="unit.key">
                  {{ unit.symbol }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="baseValue in [1, 10, 100, 1000]" :key="baseValue">
                <td>{{ baseValue }}</td>
                <td v-for="unit in getCurrentUnits().slice(0, 6)" :key="unit.key">
                  {{ convertValue(baseValue, fromUnit, unit.key) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="info-section">
        <h4>单位说明：</h4>
        <div class="units-info">
          <div v-for="unit in getCurrentUnits()" :key="unit.key" class="unit-info">
            <strong>{{ unit.name }} ({{ unit.symbol }})</strong>
            <p v-if="unit.description">{{ unit.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnitConverter',
  data() {
    return {
      activeCategory: 'length',
      inputValue: 1,
      outputValue: '',
      fromUnit: 'meter',
      toUnit: 'centimeter',
      categories: [
        { key: 'length', name: '长度', icon: '📏' },
        { key: 'weight', name: '重量', icon: '⚖️' },
        { key: 'temperature', name: '温度', icon: '🌡️' },
        { key: 'area', name: '面积', icon: '⬜' },
        { key: 'volume', name: '体积', icon: '🧊' },
        { key: 'speed', name: '速度', icon: '🚗' },
        { key: 'time', name: '时间', icon: '⏰' },
        { key: 'data', name: '数据', icon: '💾' }
      ],
      units: {
        length: [
          { key: 'meter', name: '米', symbol: 'm', factor: 1, description: '国际标准长度单位' },
          { key: 'centimeter', name: '厘米', symbol: 'cm', factor: 0.01 },
          { key: 'millimeter', name: '毫米', symbol: 'mm', factor: 0.001 },
          { key: 'kilometer', name: '千米', symbol: 'km', factor: 1000 },
          { key: 'inch', name: '英寸', symbol: 'in', factor: 0.0254 },
          { key: 'foot', name: '英尺', symbol: 'ft', factor: 0.3048 },
          { key: 'yard', name: '码', symbol: 'yd', factor: 0.9144 },
          { key: 'mile', name: '英里', symbol: 'mi', factor: 1609.344 }
        ],
        weight: [
          { key: 'kilogram', name: '千克', symbol: 'kg', factor: 1, description: '国际标准质量单位' },
          { key: 'gram', name: '克', symbol: 'g', factor: 0.001 },
          { key: 'pound', name: '磅', symbol: 'lb', factor: 0.453592 },
          { key: 'ounce', name: '盎司', symbol: 'oz', factor: 0.0283495 },
          { key: 'ton', name: '吨', symbol: 't', factor: 1000 },
          { key: 'stone', name: '英石', symbol: 'st', factor: 6.35029 }
        ],
        temperature: [
          { key: 'celsius', name: '摄氏度', symbol: '°C', factor: 1, offset: 0 },
          { key: 'fahrenheit', name: '华氏度', symbol: '°F', factor: 5/9, offset: -32 },
          { key: 'kelvin', name: '开尔文', symbol: 'K', factor: 1, offset: -273.15 }
        ],
        area: [
          { key: 'square_meter', name: '平方米', symbol: 'm²', factor: 1 },
          { key: 'square_centimeter', name: '平方厘米', symbol: 'cm²', factor: 0.0001 },
          { key: 'square_kilometer', name: '平方千米', symbol: 'km²', factor: 1000000 },
          { key: 'hectare', name: '公顷', symbol: 'ha', factor: 10000 },
          { key: 'acre', name: '英亩', symbol: 'ac', factor: 4046.86 },
          { key: 'square_foot', name: '平方英尺', symbol: 'ft²', factor: 0.092903 }
        ],
        volume: [
          { key: 'liter', name: '升', symbol: 'L', factor: 1 },
          { key: 'milliliter', name: '毫升', symbol: 'mL', factor: 0.001 },
          { key: 'cubic_meter', name: '立方米', symbol: 'm³', factor: 1000 },
          { key: 'gallon', name: '加仑', symbol: 'gal', factor: 3.78541 },
          { key: 'quart', name: '夸脱', symbol: 'qt', factor: 0.946353 },
          { key: 'pint', name: '品脱', symbol: 'pt', factor: 0.473176 }
        ],
        speed: [
          { key: 'meter_per_second', name: '米每秒', symbol: 'm/s', factor: 1 },
          { key: 'kilometer_per_hour', name: '千米每小时', symbol: 'km/h', factor: 0.277778 },
          { key: 'mile_per_hour', name: '英里每小时', symbol: 'mph', factor: 0.44704 },
          { key: 'knot', name: '节', symbol: 'kn', factor: 0.514444 }
        ],
        time: [
          { key: 'second', name: '秒', symbol: 's', factor: 1 },
          { key: 'minute', name: '分钟', symbol: 'min', factor: 60 },
          { key: 'hour', name: '小时', symbol: 'h', factor: 3600 },
          { key: 'day', name: '天', symbol: 'd', factor: 86400 },
          { key: 'week', name: '周', symbol: 'w', factor: 604800 },
          { key: 'month', name: '月', symbol: 'mon', factor: 2629746 },
          { key: 'year', name: '年', symbol: 'y', factor: 31556952 }
        ],
        data: [
          { key: 'byte', name: '字节', symbol: 'B', factor: 1 },
          { key: 'kilobyte', name: '千字节', symbol: 'KB', factor: 1024 },
          { key: 'megabyte', name: '兆字节', symbol: 'MB', factor: 1048576 },
          { key: 'gigabyte', name: '吉字节', symbol: 'GB', factor: 1073741824 },
          { key: 'terabyte', name: '太字节', symbol: 'TB', factor: 1099511627776 },
          { key: 'bit', name: '位', symbol: 'bit', factor: 0.125 }
        ]
      }
    }
  },
  watch: {
    activeCategory() {
      const units = this.getCurrentUnits()
      this.fromUnit = units[0].key
      this.toUnit = units[1].key
      this.convert()
    }
  },
  methods: {
    getCurrentUnits() {
      return this.units[this.activeCategory] || []
    },
    
    convert() {
      if (!this.inputValue || isNaN(this.inputValue)) {
        this.outputValue = ''
        return
      }
      
      const result = this.convertValue(this.inputValue, this.fromUnit, this.toUnit)
      this.outputValue = result
    },
    
    convertValue(value, from, to) {
      if (this.activeCategory === 'temperature') {
        return this.convertTemperature(value, from, to)
      }
      
      const fromUnit = this.getCurrentUnits().find(u => u.key === from)
      const toUnit = this.getCurrentUnits().find(u => u.key === to)
      
      if (!fromUnit || !toUnit) return ''
      
      // 转换为基准单位，再转换为目标单位
      const baseValue = parseFloat(value) * fromUnit.factor
      const result = baseValue / toUnit.factor
      
      return this.formatNumber(result)
    },
    
    convertTemperature(value, from, to) {
      let celsius = parseFloat(value)
      
      // 转换为摄氏度
      if (from === 'fahrenheit') {
        celsius = (celsius - 32) * 5/9
      } else if (from === 'kelvin') {
        celsius = celsius - 273.15
      }
      
      // 从摄氏度转换为目标单位
      let result = celsius
      if (to === 'fahrenheit') {
        result = celsius * 9/5 + 32
      } else if (to === 'kelvin') {
        result = celsius + 273.15
      }
      
      return this.formatNumber(result)
    },
    
    formatNumber(num) {
      if (isNaN(num)) return ''
      
      // 如果是整数或小数位数少于6位，保持原样
      if (num % 1 === 0 || num.toString().split('.')[1]?.length <= 6) {
        return num.toString()
      }
      
      // 否则保留6位小数
      return parseFloat(num.toFixed(6)).toString()
    },
    
    getQuickConverts() {
      const quickMaps = {
        length: [
          { from: 'meter', to: 'centimeter', value: 1, label: '1米 = 100厘米' },
          { from: 'kilometer', to: 'mile', value: 1, label: '1千米 = 0.62英里' },
          { from: 'inch', to: 'centimeter', value: 1, label: '1英寸 = 2.54厘米' },
          { from: 'foot', to: 'meter', value: 1, label: '1英尺 = 0.3米' }
        ],
        weight: [
          { from: 'kilogram', to: 'pound', value: 1, label: '1千克 = 2.2磅' },
          { from: 'gram', to: 'ounce', value: 1, label: '1克 = 0.035盎司' },
          { from: 'ton', to: 'kilogram', value: 1, label: '1吨 = 1000千克' }
        ],
        temperature: [
          { from: 'celsius', to: 'fahrenheit', value: 0, label: '0°C = 32°F' },
          { from: 'celsius', to: 'fahrenheit', value: 100, label: '100°C = 212°F' },
          { from: 'celsius', to: 'kelvin', value: 0, label: '0°C = 273.15K' }
        ]
      }
      
      return quickMaps[this.activeCategory] || []
    },
    
    setQuickConvert(quick) {
      this.fromUnit = quick.from
      this.toUnit = quick.to
      this.inputValue = quick.value
      this.convert()
    }
  },
  mounted() {
    this.convert()
  }
}
</script>

<style scoped>
.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.category-tab {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.category-tab.active {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.category-tab:hover:not(.active) {
  background: #e8e8e8;
}

.converter-section {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.input-section, .output-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group, .output-group, .unit-selector {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label, .output-group label, .unit-selector label {
  font-size: 14px;
  color: #37474f;
  font-weight: 500;
}

.value-input, .value-output, .unit-select {
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 16px;
}

.value-output {
  background: #f0f7ff;
  color: #1976d2;
  font-weight: 600;
}

.convert-arrow {
  font-size: 24px;
  color: #2196f3;
}

.quick-converts {
  margin-bottom: 30px;
}

.quick-converts h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.quick-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-btn {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.quick-btn:hover {
  border-color: #2196f3;
  background: #f0f7ff;
}

.conversion-table {
  margin-bottom: 30px;
}

.conversion-table h4 {
  color: #37474f;
  margin-bottom: 16px;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  padding: 8px 12px;
  text-align: center;
  border-bottom: 1px solid #e8e8e8;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #37474f;
}

td {
  color: #78909c;
}

.info-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.info-section h4 {
  color: #37474f;
  margin-bottom: 20px;
}

.units-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.unit-info {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
}

.unit-info strong {
  color: #37474f;
  font-size: 14px;
}

.unit-info p {
  color: #78909c;
  font-size: 12px;
  margin: 4px 0 0 0;
}

@media (max-width: 768px) {
  .converter-section {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .convert-arrow {
    transform: rotate(90deg);
  }
  
  .category-tabs {
    flex-direction: column;
  }
  
  .units-info {
    grid-template-columns: 1fr;
  }
}
</style>