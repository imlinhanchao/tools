<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('')
const output = ref('')
const error = ref('')

const example = `.container {
  display: flex;
  align-items: center;
  padding: 16px;
}

.button {
  background-color: #1677ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
}`

function cssToStylus(css: string): string {
  const lines: string[] = []
  let inBlock = false
  for (const line of css.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('/*') || t.startsWith('*') || t.startsWith('*/')) continue
    if (t.endsWith('{')) {
      lines.push(t.slice(0, -1).trim())
      inBlock = true
    } else if (t === '}') {
      lines.push('')
      inBlock = false
    } else if (inBlock && t.endsWith(';')) {
      lines.push('  ' + t.slice(0, -1))
    } else if (inBlock) {
      lines.push('  ' + t)
    } else {
      lines.push(t)
    }
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    output.value = cssToStylus(input.value)
  } catch (e: any) {
    error.value = e.message; output.value = ''
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
          <span>CSS 输入</span>
          <div class="btn-group">
            <el-button size="small" @click="loadExample">示例</el-button>
            <el-button size="small" @click="input = ''; output = ''; error = ''">清除</el-button>
          </div>
        </div>
        <el-input type="textarea" v-model="input" :rows="15" placeholder="请输入CSS代码..." @change="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>Stylus 输出</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="15" readonly />
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
