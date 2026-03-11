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

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }
function toPascalCase(s: string) { return s.split(/[_\-\s]+/).map(capitalize).join('') }

function javaType(val: any, key: string): string {
  if (val === null) return 'Object'
  if (Array.isArray(val)) { if (val.length === 0) return 'List<Object>'; return `List<${javaType(val[0], key)}>` }
  if (typeof val === 'object') return toPascalCase(key)
  if (typeof val === 'string') return 'String'
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'double'
  if (typeof val === 'boolean') return 'boolean'
  return 'Object'
}

function toJavaBean(obj: any, name = 'Root'): string {
  const fields: string[] = []; const methods: string[] = []; const nested: string[] = []
  for (const [k, v] of Object.entries(obj as object)) {
    const tn = javaType(v, k); const mn = toPascalCase(k)
    fields.push(`    private ${tn} ${k};`)
    methods.push(`    public ${tn} get${mn}() { return ${k}; }`)
    methods.push(`    public void set${mn}(${tn} ${k}) { this.${k} = ${k}; }`)
    if (v !== null && !Array.isArray(v) && typeof v === 'object') nested.push(toJavaBean(v, toPascalCase(k)))
    else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null) nested.push(toJavaBean(v[0], toPascalCase(k)))
  }
  const cls = `public class ${name} {\n${fields.join('\n')}\n\n${methods.join('\n')}\n}`
  return [cls, ...nested].join('\n\n')
}

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    const data = yaml.load(input.value)
    if (typeof data !== 'object' || data === null) throw new Error('YAML root must be an object')
    output.value = toJavaBean(data)
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
