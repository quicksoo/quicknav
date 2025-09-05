<template>
  <div class="world-clock-container">
    <header class="wc-header">
      <h1>世界时间</h1>
      <div class="analog-clock" ref="analogClock">
        <div class="hand hour" ref="hourHand"></div>
        <div class="hand minute" ref="minuteHand"></div>
        <div class="hand second" ref="secondHand"></div>
        <div class="center-dot"></div>
      </div>
      <div class="digital-time">{{ digitalCurrentTime }}</div>
      <div class="current-zone">当前时区: {{ userTimeZone }}</div>
    </header>

    <main class="timezone-grid">
      <div v-for="zone in zones" :key="zone.offsetText" class="tz-card">
        <div class="tz-label">UTC{{ zone.offsetText }}</div>
        <div
          v-for="city in zone.cities"
          :key="city.name"
          class="city-time"
        >
          <span class="city-name">{{ city.name }}</span>
          <span class="time-text">{{ getCityTime(city.timeZone) }}</span>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

// 引用指针元素
const hourHand = ref(null)
const minuteHand = ref(null)
const secondHand = ref(null)

// 本地时区与数字时钟
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const digitalCurrentTime = ref('')


const zones = [
  { offsetText: '-12:00', cities: [{ name: '贝克岛', timeZone: 'Etc/GMT+12' }] },
  { offsetText: '-11:00', cities: [{ name: '帕果帕果', timeZone: 'Pacific/Pago_Pago' }] },
  { offsetText: '-10:00', cities: [{ name: '檀香山', timeZone: 'Pacific/Honolulu' }] },
  { offsetText: '-09:00', cities: [{ name: '安克雷奇', timeZone: 'America/Anchorage' }] },
  { offsetText: '-08:00', cities: [{ name: '洛杉矶', timeZone: 'America/Los_Angeles' }] },
  { offsetText: '-07:00', cities: [{ name: '丹佛', timeZone: 'America/Denver' }] },
  { offsetText: '-06:00', cities: [{ name: '墨西哥城', timeZone: 'America/Mexico_City' }] },
  { offsetText: '-05:00', cities: [{ name: '纽约', timeZone: 'America/New_York' }] },
  { offsetText: '-04:00', cities: [{ name: '圣地亚哥', timeZone: 'America/Santiago' }] },
  { offsetText: '-03:00', cities: [{ name: '布宜诺斯艾利斯', timeZone: 'America/Argentina/Buenos_Aires' }] },
  { offsetText: '-02:00', cities: [{ name: '南乔治亚岛', timeZone: 'Atlantic/South_Georgia' }] },
  { offsetText: '-01:00', cities: [{ name: '佛得角', timeZone: 'Atlantic/Cape_Verde' }] },
  { offsetText: '+00:00', cities: [{ name: '伦敦', timeZone: 'Europe/London' }] },
  { offsetText: '+01:00', cities: [{ name: '柏林', timeZone: 'Europe/Berlin' }] },
  { offsetText: '+02:00', cities: [{ name: '开罗', timeZone: 'Africa/Cairo' }] },
  { offsetText: '+03:00', cities: [{ name: '莫斯科', timeZone: 'Europe/Moscow' }] },
  { offsetText: '+04:00', cities: [{ name: '迪拜', timeZone: 'Asia/Dubai' }] },
  { offsetText: '+05:00', cities: [{ name: '新德里', timeZone: 'Asia/Kolkata' }] },
  { offsetText: '+05:30', cities: [{ name: '加德满都', timeZone: 'Asia/Kathmandu' }] },
  { offsetText: '+06:00', cities: [{ name: '达卡', timeZone: 'Asia/Dhaka' }] },
  { offsetText: '+06:30', cities: [{ name: '仰光', timeZone: 'Asia/Rangoon' }] },
  { offsetText: '+07:00', cities: [{ name: '曼谷', timeZone: 'Asia/Bangkok' }] },
  { offsetText: '+08:00', cities: [{ name: '北京', timeZone: 'Asia/Shanghai' }] },
  { offsetText: '+09:00', cities: [{ name: '东京', timeZone: 'Asia/Tokyo' }] },
  { offsetText: '+09:30', cities: [{ name: '达尔文', timeZone: 'Australia/Darwin' }] },
  { offsetText: '+10:00', cities: [{ name: '悉尼', timeZone: 'Australia/Sydney' }] },
  { offsetText: '+11:00', cities: [{ name: '所罗门群岛', timeZone: 'Pacific/Guadalcanal' }] },
  { offsetText: '+12:00', cities: [{ name: '惠灵顿', timeZone: 'Pacific/Auckland' }] },
  { offsetText: '+13:00', cities: [{ name: '萨摩亚', timeZone: 'Pacific/Apia' }] },
  { offsetText: '+14:00', cities: [{ name: '基里巴斯线岛', timeZone: 'Pacific/Kiritimati' }] }
]

// 返回指定时区的年月日 时:分:秒
function getCityTime(tz) {
  const now = new Date()
  const opt = {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  return now.toLocaleString('zh-CN', opt).replace(/\//g, '-')
}

// 更新模拟时钟与数字时钟
function updateClock() {
  const now = new Date()

  // 更新数字时钟
  const opt = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  digitalCurrentTime.value = now.toLocaleString('zh-CN', opt).replace(/\//g, '-')

  // 更新指针角度
  const hrs = now.getHours() % 12
  const mins = now.getMinutes()
  const secs = now.getSeconds()
  if (hourHand.value) {
    hourHand.value.style.transform = `rotate(${hrs * 30 + mins * 0.5}deg)`
  }
  if (minuteHand.value) {
    minuteHand.value.style.transform = `rotate(${mins * 6}deg)`
  }
  if (secondHand.value) {
    secondHand.value.style.transform = `rotate(${secs * 6}deg)`
  }
}

// 挂载后启动定时器
onMounted(() => {
  updateClock()
  setInterval(updateClock, 1000)
})
</script>
<style scoped>
::root {
  --bg-color: #f6f8fa;
  --header-bg: #24292f;
  --card-bg: #ffffff;
  --text-color: #1e2125;        /* 深色主文本 */
  --subtext-color: #4a4f58;     /* 次级文本 */
  --accent-color: #ff7b72;      /* 强调色 */
  --border-color: #d1d5da;
  --font: 'PingFang SC', sans-serif;
}

/* 容器与布局保持不变 */
.world-clock-container {
  background: var(--bg-color);
  min-height: 100vh;
}

/* Header 区域 */
.wc-header {
  background: var(--header-bg);
  color: #fff;
  text-align: center;
  padding: 32px 16px;            /* 增大上下内边距 */
}

.wc-header h1 {
  font-size: 28px;               /* 放大标题 */
  margin-bottom: 16px;
}

/* 模拟时钟尺寸略增 */
.analog-clock {
  margin: 0 auto 16px;
  width: 200px;
  height: 200px;
  border: 4px solid #fff;
  border-radius: 50%;
  position: relative;
  background: #24292f;           /* 更改背景颜色为深色 */
}

.hand {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
  background: #fff;             /* 指针颜色改为白色 */
}

.hour {
  width: 6px;
  height: 50px;
  margin-top: -6px;
  margin-left: -3px;
}

.minute {
  width: 4px;
  height: 80px;
  margin-top: -4px;
  margin-left: -2px;
}

.second {
  width: 2px;
  height: 90px;
  margin-top: -2px;
  margin-left: -1px;
}

.center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  margin-top: -5px;
  margin-left: -5px;
  background: #fff;             /* 中心点颜色改为白色 */
  border-radius: 50%;
}

/* 数字时钟样式升级 */
.digital-time {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15); /* 半透明背景增强可读性 */
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 20px;               /* 放大字体 */
  letter-spacing: 1px;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.6);
  margin-bottom: 4px;
}

.current-zone {
  font-size: 14px;
  color: #cbd2d9;                /* 相对淡化，保留层次 */
  margin-top: 4px;
}

/* 主体网格保持 */
.timezone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 24px;
}

/* 卡片微调 */
.tz-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;            /* 略增圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
  padding: 20px;                 /* 增大内边距 */
  transition: transform .2s;
}

.tz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
}

.tz-label {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 16px;               /* 略增 */
  color: var(--text-color);
}

/* 城市时间行样式 */
.city-time {
  display: flex;
  justify-content: space-between;
  align-items: center;           /* 垂直居中 */
  margin-bottom: 8px;
  padding: 6px 8px;
  background: #f0f3f5;           /* 浅灰背景突出文字 */
  border-radius: 4px;
}

.city-time:last-child {
  margin-bottom: 0;
}

.city-name {
  color: var(--text-color);
  font-size: 14px;
  font-weight: 500;
}

.time-text {
  color: var(--subtext-color);
  font-size: 14px;
  font-family: var(--font);
  letter-spacing: 0.5px;
  background: rgba(0, 0, 0, 0.03);
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
