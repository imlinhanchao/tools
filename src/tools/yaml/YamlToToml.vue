<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage as message } from 'element-plus'
import yaml from 'js-yaml'

const input = ref('')
const output = ref('')
const error = ref('')

const example = `name: John Doe
age: 30
email: john@example.com
address:
  street: 123 Main St
  city: New York
  country: USA
hobbies:
  - reading
  - coding
  - hiking
active: true`

function toToml(obj: any, prefix = ''): string {
  const lines: string[] = []
  const sections: string[] = []
  for (const [k, v] of Object.entries(obj as object)) {
    if (v === null) continue
    else if (typeof v === 'boolean') lines.push(`${k} = ${v}`)
    else if (typeof v === 'number') lines.push(`${k} = ${v}`)
    else if (typeof v === 'string') lines.push(`${k} = "${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`)
    else if (Array.isArray(v)) {
      const key = prefix ? `${prefix}.${k}` : k
      if (v.length === 0 || typeof v[0] !== 'object') {
        const items = v.map((i: any) => typeof i === 'string' ? `"${i}"` : String(i))
        lines.push(`${k} = [${items.join(', ')}]`)
      } else {
        v.forEach((item: any) => { sections.push(`\n[[${key}]]`); sections.push(toToml(item, key)) })
      }
    } else if (typeof v === 'object') {
      const key = prefix ? `${prefix}.${k}` : k
      sections.push(`\n[${key}]`)
      sections.push(toToml(v as any, key))
    }
  }
  return [...lines, ...sections].join('\n')
}

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    const data = yaml.load(input.value)
    if (typeof data !== 'object' || data === null) throw new Error('YAML root must be an object')
    output.value = toToml(data)
  } catch (e: any) {
    error.value = e.message
    output.value = ''
  }
}

function loadExample() {
  input.value = example
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
          <span>YAML 输入</span>
          <div class="btn-group">
            <el-button size="small" @click="loadExample">示例</el-button>
            <el-button size="small" @click="input = ''; output = ''; error = ''">清除</el-button>
          </div>
        </div>
        <el-input type="textarea" v-model="input" :rows="15" placeholder="请输入YAML..." @change="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>输出</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="15" readonly />
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
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
