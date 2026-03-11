<template>
  <div class="flex gap-6 h-full flex-col md:flex-row">
    <!-- 左侧：连接和发送配置 -->
    <div class="flex flex-col gap-4 md:w-1/3">
      <div>
        <label class="block text-sm font-medium mb-1">WebSocket URL</label>
        <el-input v-model="wsUrl" placeholder="ws:// 或 wss://" @keyup.enter="toggleConnect">
          <template #append>
            <el-button @click="toggleConnect" :type="isConnected ? 'danger' : 'primary'">
              {{ isConnected ? '断开' : '连接' }}
            </el-button>
          </template>
        </el-input>
      </div>

      <div class="flex-1 flex flex-col mt-2">
        <label class="block text-sm font-medium mb-1">发送消息</label>
        <el-input
          v-model="message"
          type="textarea"
          :rows="6"
          placeholder="请输入要发送的内容..."
          :disabled="!isConnected"
          class="flex-1 mb-2"
        />
        <el-button type="success" :disabled="!isConnected || !message.trim()" @click="sendMessage">
          发送请求
        </el-button>
      </div>
    </div>

    <!-- 右侧：日志记录 -->
    <div class="flex flex-col flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-black/20">
      <div class="flex justify-between items-center mb-2 px-2">
        <span class="text-sm font-bold">通讯日志</span>
        <el-button size="small" @click="clearLogs">清空日志</el-button>
      </div>
      <div class="flex-1 overflow-y-auto bg-white dark:bg-[#1f2133] rounded p-3 h-[400px]">
        <div v-if="logs.length === 0" class="text-gray-400 text-center mt-10 text-sm">
          暂无日志...
        </div>
        <div v-for="(log, idx) in logs" :key="idx" class="mb-3 text-sm flex gap-2">
          <div class="whitespace-nowrap font-mono text-gray-400 mt-1">[{{ log.time }}]</div>
          <div class="flex-1">
            <span
              class="inline-block px-1.5 py-0.5 rounded text-xs text-white"
              :class="{
                'bg-blue-500': log.type === 'send',
                'bg-emerald-500': log.type === 'receive',
                'bg-amber-500': log.type === 'system',
                'bg-red-500': log.type === 'error'
              }"
            >
              {{ log.type === 'send' ? '发送' : log.type === 'receive' ? '接收' : log.type === 'error' ? '错误' : '系统' }}
            </span>
            <div class="mt-1 text-gray-800 dark:text-gray-200 break-all font-mono whitespace-pre-wrap">{{ log.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'

const wsUrl = ref('wss://echo.websocket.events')
const isConnected = ref(false)
const message = ref('')
const logs = ref<{ time: string; type: 'send' | 'receive' | 'system' | 'error'; content: string }[]>([])

let socket: WebSocket | null = null

function appendLog(type: 'send' | 'receive' | 'system' | 'error', content: string) {
  logs.value.push({
    time: dayjs().format('HH:mm:ss.SSS'),
    type,
    content
  })
}

function toggleConnect() {
  if (isConnected.value) {
    disconnect()
  } else {
    connect()
  }
}

function connect() {
  if (!wsUrl.value) return
  
  try {
    socket = new WebSocket(wsUrl.value)
    
    appendLog('system', `正在连接到 ${wsUrl.value} ...`)
    
    socket.onopen = () => {
      isConnected.value = true
      appendLog('system', '连接成功')
    }
    
    socket.onmessage = (event) => {
      appendLog('receive', event.data)
    }
    
    socket.onerror = () => {
      appendLog('error', 'WebSocket 发生错误')
    }
    
    socket.onclose = () => {
      isConnected.value = false
      appendLog('system', '连接已关闭')
      socket = null
    }
  } catch (error: any) {
    appendLog('error', `连接异常: ${error.message}`)
  }
}

function disconnect() {
  if (socket) {
    socket.close()
  }
}

function sendMessage() {
  if (!socket || !isConnected.value || !message.value.trim()) return
  
  socket.send(message.value)
  appendLog('send', message.value)
  message.value = ''
}

function clearLogs() {
  logs.value = []
}

onBeforeUnmount(() => {
  disconnect()
})
</script>
