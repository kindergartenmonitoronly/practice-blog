export const projects = [
  {
    id: 'arduino-weather',
    title: 'Arduino 气象站',
    description: '基于 Arduino Uno 的温湿度监测系统，使用 DHT11 传感器采集数据，OLED 屏幕实时显示，支持 WiFi 上传到云端。',
    date: '2026-03-15',
    category: 'hardware',
    tags: ['Arduino', '传感器', 'IoT'],
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop',
    ],
    videos: [],
    codeBlocks: [
      {
        title: 'main.ino',
        language: 'cpp',
        code: `#include <DHT.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  Serial.begin(9600);
  dht.begin();
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.printf("Temp: %.1f C", t);
  display.setCursor(0, 20);
  display.printf("Humi: %.1f %%", h);
  display.display();

  delay(2000);
}`,
      },
    ],
    content: `## 项目概述

这是一个基于 Arduino Uno 的气象监测站，能够实时采集环境温度和湿度数据。

## 功能特点

- DHT11 传感器采集温湿度
- OLED 0.96寸屏幕实时显示
- 每2秒刷新一次数据
- 串口输出调试信息

## 所需材料

| 材料 | 数量 |
|------|------|
| Arduino Uno | 1 |
| DHT11 传感器 | 1 |
| OLED 128x64 | 1 |
| 面包板 | 1 |
| 杜邦线 | 若干 |
`,
  },
  {
    id: 'web-todo',
    title: 'React 待办清单',
    description: '使用 React + Tailwind CSS 开发的待办事项应用，支持拖拽排序、本地存储、暗色模式。',
    date: '2026-04-02',
    category: 'code',
    tags: ['React', 'Tailwind', '前端'],
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    ],
    videos: [],
    codeBlocks: [
      {
        title: 'TodoApp.jsx',
        language: 'jsx',
        code: `import { useState, useEffect } from 'react'

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!input.trim()) return
    setTodos([...todos, { id: Date.now(), text: input, done: false }])
    setInput('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ))
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">待办清单</h1>
      <div className="flex gap-2 mb-4">
        <input value={input} onChange={e => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          onKeyDown={e => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded">
          添加
        </button>
      </div>
      {todos.map(todo => (
        <div key={todo.id} className="flex items-center gap-2 py-2 border-b">
          <input type="checkbox" checked={todo.done}
            onChange={() => toggleTodo(todo.id)} />
          <span className={todo.done ? 'line-through text-gray-400' : ''}>
            {todo.text}
          </span>
        </div>
      ))}
    </div>
  )
}`,
      },
    ],
    content: `## 项目概述

一个简洁优雅的 React 待办事项应用，练习 React hooks 和状态管理。

## 技术栈

- React 18 (Hooks)
- Tailwind CSS
- localStorage 持久化

## 核心功能

1. 添加/完成/删除待办
2. 本地存储持久化
3. 响应式设计
`,
  },
  {
    id: 'pcb-smart-home',
    title: '智能家居控制板',
    description: '自制 PCB 智能家居控制板，集成 ESP32、继电器模块、温湿度传感器，可通过手机 App 远程控制家电。',
    date: '2026-04-20',
    category: 'hardware',
    tags: ['ESP32', 'PCB', '智能家居'],
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&h=600&fit=crop',
    ],
    videos: [],
    codeBlocks: [
      {
        title: 'smart_home.ino',
        language: 'cpp',
        code: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "HomeNetwork";
const char* password = "password123";

WebServer server(80);
int relayPin = 5;

void handleOn() {
  digitalWrite(relayPin, HIGH);
  server.send(200, "text/plain", "ON");
}

void handleOff() {
  digitalWrite(relayPin, LOW);
  server.send(200, "text/plain", "OFF");
}

void setup() {
  WiFi.begin(ssid, password);
  pinMode(relayPin, OUTPUT);

  server.on("/on", handleOn);
  server.on("/off", handleOff);
  server.begin();
}

void loop() {
  server.handleClient();
}`,
      },
    ],
    content: `## 项目概述

基于 ESP32 的智能家居控制系统，通过自制 PCB 实现远程家电控制。

## 设计亮点

- 自制 PCB（嘉立创打样）
- ESP32 WiFi 控制
- 4路继电器控制
- 手机 App 操控
`,
  },
  {
    id: 'python-data-viz',
    title: 'Python 数据可视化',
    description: '使用 Python + Matplotlib + Pandas 分析并可视化某城市一年的空气质量数据，生成交互式图表。',
    date: '2026-05-10',
    category: 'code',
    tags: ['Python', '数据分析', '可视化'],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    ],
    videos: [],
    codeBlocks: [
      {
        title: 'air_quality.py',
        language: 'python',
        code: `import pandas as pd
import matplotlib.pyplot as plt

# 读取数据
df = pd.read_csv('air_quality_2026.csv')
df['date'] = pd.to_datetime(df['date'])

# 设置中文显示
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# PM2.5 趋势
axes[0, 0].plot(df['date'], df['pm25'], color='#e74c3c', linewidth=0.8)
axes[0, 0].set_title('PM2.5 月度趋势')
axes[0, 0].set_ylabel('μg/m³')

# AQI 分布
colors = ['#2ecc71', '#f1c40f', '#e67e22', '#e74c3c']
df['aqi_level'] = pd.cut(df['aqi'], bins=[0,50,100,150,300],
                          labels=['优','良','轻度','重度'])
df['aqi_level'].value_counts().plot.pie(ax=axes[0, 1], colors=colors)

plt.tight_layout()
plt.savefig('air_quality_report.png', dpi=150)
plt.show()`,
      },
    ],
    content: `## 项目概述

使用 Python 对城市空气质量数据进行分析和可视化。

## 分析维度

- PM2.5/PM10 月度趋势
- AQI 等级分布
- 各污染物相关性
- 季节性对比
`,
  },
  {
    id: 'report-doc',
    title: '嵌入式课程报告',
    description: '嵌入式系统课程的期末报告，包含项目设计思路、电路原理图、代码解析、测试结果和心得体会。',
    date: '2026-05-25',
    category: 'document',
    tags: ['报告', '嵌入式', '文档'],
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=600&fit=crop',
    ],
    videos: [],
    codeBlocks: [],
    content: `## 课程报告：基于单片机的智能环境监测系统

### 一、项目背景

随着物联网技术的发展，智能家居和环境监测成为热门方向。本项目旨在设计一套低成本、易部署的环境监测系统。

### 二、系统架构

\`\`\`
传感器层 → 数据采集层 → 通信层 → 应用层
(DHT11)    (Arduino)    (WiFi)    (手机App)
\`\`\`

### 三、测试结果

经过为期两周的连续测试，系统运行稳定，数据采集准确率达到 98.5%。

### 四、心得体会

通过本项目，深入理解了嵌入式系统的软硬件协同设计流程，提升了工程实践能力。
`,
  },
  {
    id: 'mini-program',
    title: '微信小程序点餐',
    description: '课程设计项目：一款校园食堂点餐小程序，支持菜单浏览、购物车、在线支付模拟、订单追踪。',
    date: '2026-05-28',
    category: 'code',
    tags: ['小程序', '微信', '全栈'],
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
    ],
    videos: [],
    codeBlocks: [
      {
        title: 'index.js',
        language: 'javascript',
        code: `Page({
  data: {
    cart: [],
    menu: [],
    total: 0
  },

  onLoad() {
    this.loadMenu()
  },

  loadMenu() {
    wx.request({
      url: 'https://api.example.com/menu',
      success: (res) => {
        this.setData({ menu: res.data })
      }
    })
  },

  addToCart(item) {
    const cart = [...this.data.cart]
    const exist = cart.find(c => c.id === item.currentTarget.dataset.id)
    if (exist) {
      exist.quantity++
    } else {
      cart.push({ ...item.currentTarget.dataset, quantity: 1 })
    }
    const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0)
    this.setData({ cart, total })
  },

  checkout() {
    wx.navigateTo({ url: '/pages/payment/payment' })
  }
})`,
      },
    ],
    content: `## 项目概述

校园食堂点餐小程序，解决食堂排队问题。

## 功能模块

1. **菜单浏览** - 分类展示、图片预览
2. **购物车** - 加减数量、小计计算
3. **在线支付** - 模拟微信支付流程
4. **订单追踪** - 实时状态更新
`,
  },
]

export const categories = [
  { key: 'all', label: '全部' },
  { key: 'code', label: '代码项目' },
  { key: 'hardware', label: '硬件项目' },
  { key: 'document', label: '文档报告' },
]
