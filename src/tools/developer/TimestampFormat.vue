<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const timestamp = ref(Date.now())
const dateString = ref(new Date().toISOString().slice(0, 19).replace('T', ' '))
const customFormat = ref('YYYY-MM-DD HH:mm:ss')

const fromTs = computed(() => {
  const n = Number(timestamp.value)
  if (isNaN(n)) return null
  const ms = String(n).length <= 10 ? n * 1000 : n
  return dayjs(ms)
})

const fromDate = computed(() => {
  if (!dateString.value.trim()) return null
  const d = dayjs(dateString.value)
  return d.isValid() ? d : null
})

const tsFormats = computed(() => {
  const d = fromTs.value
  if (!d) return []
  return [
    ['ISO 8601', d.toISOString()],
    ['本地时间', d.format('YYYY-MM-DD HH:mm:ss')],
    ['UTC 时间', d.utc().format('YYYY-MM-DD HH:mm:ss [UTC]')],
    ['Unix 秒', String(d.unix())],
    ['Unix 毫秒', String(d.valueOf())],
    ['自定义格式', d.format(customFormat.value)],
    ['日期', d.format('YYYY-MM-DD')],
    ['时间', d.format('HH:mm:ss')],
    ['相对时间', getRelativeTime(d)],
  ]
})

const dateFormats = computed(() => {
  const d = fromDate.value
  if (!d) return []
  return [
    ['Unix 秒', String(d.unix())],
    ['Unix 毫秒', String(d.valueOf())],
    ['ISO 8601', d.toISOString()],
    ['UTC 时间', d.utc().format('YYYY-MM-DD HH:mm:ss [UTC]')],
    ['自定义格式', d.format(customFormat.value)],
    ['相对时间', getRelativeTime(d)],
  ]
})

function getRelativeTime(d: dayjs.Dayjs): string {
  const diff = dayjs().diff(d, 'second')
  if (Math.abs(diff) < 60) return `${diff >= 0 ? '' : '-'}${Math.abs(diff)} 秒前`
  if (Math.abs(diff) < 3600) return `${Math.round(diff / 60)} 分钟前`
  if (Math.abs(diff) < 86400) return `${Math.round(diff / 3600)} 小时前`
  return `${Math.round(diff / 86400)} 天前`
}

function useNow() {
  timestamp.value = Date.now()
  dateString.value = new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function copy(text: string) {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="tool-container">
    <div class="section-grid">
      <!-- Timestamp to Date -->
      <div class="section">
        <div class="section-title">时间戳 → 日期</div>
        <div class="input-row">
          <el-input v-model="timestamp" placeholder="Unix 时间戳（秒或毫秒）" style="flex:1" />
          <el-button @click="useNow">当前时间</el-button>
        </div>
        <table v-if="fromTs" class="result-table">
          <tr v-for="[label, val] in tsFormats" :key="label">
            <td class="label">{{ label }}</td>
            <td class="value mono">{{ val }}</td>
            <td class="copy-cell"><el-button size="small" text @click="copy(val)">复制</el-button></td>
          </tr>
        </table>
        <el-alert v-else title="无效的时间戳" type="error" :closable="false" style="margin-top:8px" />
      </div>

      <!-- Date to Timestamp -->
      <div class="section">
        <div class="section-title">日期 → 时间戳</div>
        <div class="input-row">
          <el-input v-model="dateString" placeholder="如: 2024-01-01 00:00:00" style="flex:1" />
        </div>
        <div class="format-row">
          <span style="font-size:13px;color:#888">自定义格式：</span>
          <el-input v-model="customFormat" size="small" style="width:200px" />
        </div>
        <table v-if="fromDate" class="result-table">
          <tr v-for="[label, val] in dateFormats" :key="label">
            <td class="label">{{ label }}</td>
            <td class="value mono">{{ val }}</td>
            <td class="copy-cell"><el-button size="small" text @click="copy(val)">复制</el-button></td>
          </tr>
        </table>
        <el-alert v-else title="无效的日期字符串" type="error" :closable="false" style="margin-top:8px" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.section { border: 1px solid #dcdfe6; border-radius: 8px; padding: 16px; }
.section-title { font-weight: 600; margin-bottom: 12px; color: #1677ff; }
.input-row { display: flex; gap: 8px; margin-bottom: 12px; align-items: center; }
.format-row { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
.result-table { width: 100%; border-collapse: collapse; }
.result-table tr { border-bottom: 1px solid #f5f5f5; }
.result-table tr:last-child { border-bottom: none; }
.label { padding: 7px 4px; color: #888; font-size: 12px; width: 100px; }
.value { padding: 7px 4px; font-size: 12px; word-break: break-all; }
.mono { font-family: monospace; }
.copy-cell { width: 40px; }
:global(body.dark-mode) .section { border-color: #303050; }
:global(body.dark-mode) .result-table tr { border-bottom-color: #303050; }
@media (max-width: 768px) { .section-grid { grid-template-columns: 1fr; } }
</style>
