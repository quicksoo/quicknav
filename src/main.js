import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// 导入组件
import Home from './components/Home.vue'
import RichEditor from './components/RichEditor.vue'
import JsonTool from './components/JsonTool.vue'
import Base64Tool from './components/Base64Tool.vue'
import UuidTool from './components/UuidTool.vue'
import Md5Tool from './components/Md5Tool.vue'

// 新增工具组件
import HelloWorld from './components/HelloWorld.vue'
import HtmlPreview from './components/HtmlPreview.vue'
import CssGenerator from './components/CssGenerator.vue'
import MetaGenerator from './components/MetaGenerator.vue'
import RobotsTxt from './components/RobotsTxt.vue'
import BrowserInfo from './components/BrowserInfo.vue'
import EmailEncoder from './components/EmailEncoder.vue'
import UrlEncoder from './components/UrlEncoder.vue'
import RegexTester from './components/RegexTester.vue'
import ColorConverter from './components/ColorConverter.vue'
import TimestampConverter from './components/TimestampConverter.vue'
import QrGenerator from './components/QrGenerator.vue'
import BaseConverter from './components/BaseConverter.vue'
import PasswordGenerator from './components/PasswordGenerator.vue'
import TextDiff from './components/TextDiff.vue'
import ImageBase64 from './components/ImageBase64.vue'
import IPQuery from './components/IPQuery.vue'
import TextProcessor from './components/TextProcessor.vue'
import FormatConverter from './components/FormatConverter.vue'
import UnitConverter from './components/UnitConverter.vue'
import Calculator from './components/Calculator.vue'
import CronGenerator from './components/CronGenerator.vue'

// 路由配置
const routes = [
  { path: '/', component: Home },
  { path: '/rich-editor', component: RichEditor },
  { path: '/json-tool', component: JsonTool },
  { path: '/base64-tool', component: Base64Tool },
  { path: '/uuid-tool', component: UuidTool },
  { path: '/md5-tool', component: Md5Tool },
  
  // 新增工具路由
  { path: '/hello-world', component: HelloWorld },
  { path: '/html-preview', component: HtmlPreview },
  { path: '/css-generator', component: CssGenerator },
  { path: '/meta-generator', component: MetaGenerator },
  { path: '/robots-txt', component: RobotsTxt },
  { path: '/browser-info', component: BrowserInfo },
  { path: '/email-encoder', component: EmailEncoder },
  { path: '/url-encoder', component: UrlEncoder },
  { path: '/regex-tester', component: RegexTester },
  { path: '/color-converter', component: ColorConverter },
  { path: '/timestamp-converter', component: TimestampConverter },
  { path: '/qr-generator', component: QrGenerator },
  { path: '/base-converter', component: BaseConverter },
  { path: '/password-generator', component: PasswordGenerator },
  { path: '/text-diff', component: TextDiff },
  { path: '/image-base64', component: ImageBase64 },
  { path: '/ip-query', component: IPQuery },
  { path: '/text-processor', component: TextProcessor },
  { path: '/format-converter', component: FormatConverter },
  { path: '/unit-converter', component: UnitConverter },
  { path: '/calculator', component: Calculator },
  { path: '/cron-generator', component: CronGenerator },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')