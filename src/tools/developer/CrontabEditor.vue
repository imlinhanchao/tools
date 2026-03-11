<script setup lang="ts">
import { ref, computed } from 'vue'

const expression = ref('0 9 * * 1-5')
const error = ref('')

const FIELD_NAMES = ['分钟', '小时', '日', '月', '星期']
const FIELD_RANGES = [[0,59],[0,23],[1,31],[1,12],[0,6]]
const MONTH_NAMES = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
const WEEK_NAMES = ['周日','周一','周二','周三','周四','周五','周六']

function parseCronField(field: string, [min, max]: [number, number]): string {
  if (field === '*') return '每个'
  if (field.includes('/')) {
    const [range, step] = field.split('/')
    const from = range === '*' ? min : parseInt(range.split('-')[0])
    return `每 ${step} 个（从 ${from} 开始）`
  }
  if (field.includes('-')) {
    const [start, end] = field.split('-').map(Number)
    return `${start} 到 ${end}`
  }
  if (field.includes(',')) {
    return field.split(',').join('、')
  }
  return field
}

const parsed = computed(() => {
  error.value = ''
  const parts = expression.value.trim().split(/\s+/)
  if (parts.length !== 5) {
    error.value = 'Crontab 表达式须包含5个字段（分 时 日 月 周）'
    return []
  }
  return parts.map((p, i) => ({
    field: FIELD_NAMES[i],
    value: p,
    desc: parseCronField(p, FIELD_RANGES[i] as [number, number]),
  }))
})

const humanReadable = computed(() => {
  if (parsed.value.length !== 5 || error.value) return ''
  const [min, hour, day, month, week] = parsed.value.map(p => p.value)
  const parts: string[] = []

  if (min === '*') parts.push('每分钟')
  else if (min.includes('/')) parts.push(`每 ${min.split('/')[1]} 分钟`)
  else parts.push(`${min} 分`)

  if (hour !== '*') {
    if (hour.includes('/')) parts.push(`每 ${hour.split('/')[1]} 小时`)
    else parts.push(`${hour} 时`)
  }

  if (day !== '*') {
    if (day.includes('/')) parts.push(`每 ${day.split('/')[1]} 天`)
    else parts.push(`${day} 日`)
  }

  if (month !== '*') {
    if (month.includes(',')) parts.push(month.split(',').map(m => MONTH_NAMES[parseInt(m) - 1]).join('、'))
    else parts.push(MONTH_NAMES[parseInt(month) - 1] || `${month} 月`)
  }

  if (week !== '*') {
    if (week.includes(',')) parts.push(week.split(',').map(w => WEEK_NAMES[parseInt(w)]).join('、'))
    else if (week.includes('-')) {
      const [s, e] = week.split('-').map(Number)
      parts.push(`${WEEK_NAMES[s]} 至 ${WEEK_NAMES[e]}`)
    } else parts.push(WEEK_NAMES[parseInt(week)] || `星期 ${week}`)
  }

  return parts.join('，')
})

const nextTimes = computed(() => {
  if (error.value) return []
  const now = new Date()
  const results: string[] = []
  const parts = expression.value.trim().split(/\s+/)
  if (parts.length !== 5) return []

  const [minF, hourF] = parts
  let date = new Date(now)
  date.setSeconds(0, 0)
  date.setMinutes(date.getMinutes() + 1)

  // Use at most 1 year of minutes (525600) to find next 5 occurrences
  const MAX_TRIES = 525600
  let tries = 0
  while (results.length < 5 && tries < MAX_TRIES) {
    tries++
    const m = date.getMinutes()
    const h = date.getHours()
    const d = date.getDate()
    const mo = date.getMonth() + 1
    const w = date.getDay()

    const matchMin = minF === '*' || minF === String(m) || (minF.includes('/') && m % parseInt(minF.split('/')[1]) === 0)
    const matchHour = hourF === '*' || hourF === String(h) || matchRange(hourF, h)
    const matchDay = parts[2] === '*' || matchRange(parts[2], d)
    const matchMonth = parts[3] === '*' || matchRange(parts[3], mo)
    const matchWeek = parts[4] === '*' || matchRange(parts[4], w)

    if (matchMin && matchHour && matchDay && matchMonth && matchWeek) {
      results.push(date.toLocaleString('zh-CN'))
    }
    date.setMinutes(date.getMinutes() + 1)
  }
  return results
})

function matchRange(field: string, val: number): boolean {
  for (const part of field.split(',')) {
    if (part.includes('-')) {
      const [s, e] = part.split('-').map(Number)
      if (val >= s && val <= e) return true
    } else if (part.includes('/')) {
      const step = parseInt(part.split('/')[1])
      if (val % step === 0) return true
    } else if (parseInt(part) === val) return true
  }
  return false
}
</script>

<template>
  <div class="tool-container">
    <div class="input-section">
      <div class="input-label">Crontab 表达式</div>
      <el-input v-model="expression" placeholder="分 时 日 月 周" style="max-width:400px;font-family:monospace" />
      <div class="field-hints">
        <span v-for="(name, i) in FIELD_NAMES" :key="i" class="field-hint">{{ name }}</span>
      </div>
    </div>

    <el-alert v-if="error" :title="error" type="error" show-icon style="margin-bottom:12px" />

    <div v-if="!error" class="info-grid">
      <div class="info-card">
        <div class="card-title">字段解析</div>
        <table class="field-table">
          <tr v-for="f in parsed" :key="f.field">
            <td class="fl">{{ f.field }}</td>
            <td class="fv mono">{{ f.value }}</td>
            <td class="fd">{{ f.desc }}</td>
          </tr>
        </table>
      </div>
      <div class="info-card">
        <div class="card-title">人类可读描述</div>
        <div class="readable-desc">{{ humanReadable }}</div>
        <div class="card-title" style="margin-top:16px">最近 5 次执行时间</div>
        <div v-for="(t, i) in nextTimes" :key="i" class="next-time">{{ i + 1 }}. {{ t }}</div>
        <div v-if="nextTimes.length === 0" class="no-times">无法计算（表达式过于宽泛）</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.input-section { margin-bottom: 20px; }
.input-label { font-weight: 500; margin-bottom: 8px; }
.field-hints { display: flex; gap: 0; margin-top: 4px; max-width: 400px; }
.field-hint { flex: 1; text-align: center; font-size: 11px; color: #999; padding: 2px; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.info-card { border: 1px solid #dcdfe6; border-radius: 8px; padding: 16px; }
.card-title { font-weight: 600; margin-bottom: 12px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
.field-table { width: 100%; border-collapse: collapse; }
.field-table tr { border-bottom: 1px solid #f5f5f5; }
.fl { padding: 8px 4px; color: #888; font-size: 12px; width: 50px; }
.fv { padding: 8px 4px; font-family: monospace; font-size: 13px; font-weight: 600; color: #1677ff; }
.fd { padding: 8px 4px; font-size: 12px; }
.mono { font-family: monospace; }
.readable-desc { font-size: 14px; line-height: 1.6; color: #333; padding: 8px 0; }
.next-time { font-size: 13px; padding: 4px 0; font-family: monospace; color: #555; }
.no-times { color: #999; font-size: 13px; }
:global(body.dark-mode) .info-card { border-color: #303050; }
:global(body.dark-mode) .field-table tr { border-bottom-color: #303050; }
:global(body.dark-mode) .readable-desc { color: rgba(255,255,255,0.75); }
@media (max-width: 768px) { .info-grid { grid-template-columns: 1fr; } }
</style>
