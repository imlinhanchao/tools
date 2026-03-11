<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('')
const output = ref('')
const error = ref('')

const example = `{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: '16px',
  borderRadius: '8px',
  fontSize: '14px',
}`

function toKebabCase(s: string): string {
  return s.replace(/([A-Z])/g, (c) => '-' + c.toLowerCase())
}

function parseJsStyleObject(raw: string): Record<string, string | number> {
  // Remove wrapping braces if present
  const trimmed = raw.trim().replace(/^[{(]|[})]$/g, '').trim()
  const result: Record<string, string | number> = {}
  // Match key: value pairs (handles single/double quoted strings and unquoted identifiers)
  const propRegex = /([a-zA-Z][a-zA-Z0-9]*):\s*(?:'([^']*)'|"([^"]*)"|(-?\d+(?:\.\d+)?))/g
  let m
  while ((m = propRegex.exec(trimmed)) !== null) {
    const key = m[1]
    const val = m[2] ?? m[3] ?? (m[4] !== undefined ? parseFloat(m[4]) : undefined)
    if (key && val !== undefined) result[key] = val
  }
  return result
}

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    const obj = parseJsStyleObject(input.value)
    if (Object.keys(obj).length === 0) throw new Error('未能解析到任何样式属性，请检查格式')
    const lines: string[] = []
    for (const [k, v] of Object.entries(obj)) {
      const prop = toKebabCase(k)
      const val = typeof v === 'number' ? `${v}px` : String(v)
      lines.push(`  ${prop}: ${val};`)
    }
    output.value = `{\n${lines.join('\n')}\n}`
  } catch (e: any) {
    error.value = `解析失败: ${e.message}`; output.value = ''
  }
}

function loadExample() { input.value = example; transform() }
function copyOutput() { navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板')) }
onMounted(loadExample)
</script>

<template>
  <div class="tool-container">
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>JS 样式对象</span>
          <div class="btn-group">
            <el-button size="small" @click="loadExample">示例</el-button>
            <el-button size="small" @click="input = ''; output = ''; error = ''">清除</el-button>
          </div>
        </div>
        <el-input type="textarea" v-model="input" :rows="14" placeholder="请输入JS样式对象..." @change="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>CSS 输出</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="14" readonly />
        <el-alert v-if="error" :title="error" type="error" show-icon style="margin-top:8px" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.btn-group { display: flex; gap: 4px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
