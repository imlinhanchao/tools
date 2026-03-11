<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('')
const output = ref('')
const error = ref('')
const keyPath = ref('address.city')

const EXAMPLE = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "coding", "hiking"],
  "active": true
}`

function extractValue(obj: any, path: string): any {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean)
  let current = obj
  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    current = current[part]
  }
  return current
}

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    const data = JSON.parse(input.value)
    if (!keyPath.value.trim()) {
      output.value = JSON.stringify(data, null, 2)
      return
    }
    const val = extractValue(data, keyPath.value)
    output.value = val === undefined ? '(未找到)' : JSON.stringify(val, null, 2)
  } catch (e) {
    error.value = (e as Error).message
    output.value = ''
  }
}

function loadExample() {
  input.value = EXAMPLE
  transform()
}

function copyOutput() {
  navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板'))
}

onMounted(loadExample)
</script>

<template>
  <div class="tool-container">
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>JSON 输入</span>
          <div class="btn-group">
            <el-button size="small" @click="loadExample">示例</el-button>
            <el-button size="small" @click="input = ''; output = ''; error = ''">清除</el-button>
          </div>
        </div>
        <el-input type="textarea" v-model="input" :rows="15" placeholder="请输入JSON..." @change="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>提取结果</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <div class="path-row">
          <span class="path-label">键路径</span>
          <el-input v-model="keyPath" placeholder="例如: address.city" @change="transform" style="flex:1" />
        </div>
        <el-input type="textarea" v-model="output" :rows="13" readonly />
        <el-alert v-if="error" :message="error" type="error" show-icon style="margin-top:8px" />
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
.path-row { display: flex; align-items: center; gap: 8px; }
.path-label { white-space: nowrap; font-size: 13px; color: #666; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
