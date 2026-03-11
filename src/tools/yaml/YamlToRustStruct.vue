<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage as message } from 'element-plus'
import yaml from 'js-yaml'

const input = ref('')
const output = ref('')
const error = ref('')

const example = `name: John Doe
age: 30
active: true
score: 9.5
address:
  street: 123 Main St
  city: New York
hobbies:
  - reading
  - coding`

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }
function toPascalCase(s: string) { return s.split(/[_\-\s]+/).map(capitalize).join('') }
function toSnakeCase(s: string) { return s.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '') }

function rustType(val: any, key: string): string {
  if (val === null) return 'Option<serde_json::Value>'
  if (Array.isArray(val)) {
    if (val.length === 0) return 'Vec<serde_json::Value>'
    if (typeof val[0] === 'object' && val[0] !== null) return `Vec<${toPascalCase(key)}>`
    return `Vec<${rustType(val[0], key)}>`
  }
  if (typeof val === 'object') return toPascalCase(key)
  if (typeof val === 'string') return 'String'
  if (typeof val === 'number') return Number.isInteger(val) ? 'i64' : 'f64'
  if (typeof val === 'boolean') return 'bool'
  return 'serde_json::Value'
}

function toRustStruct(obj: any, name = 'Root'): string {
  const fields: string[] = []
  const nested: string[] = []
  for (const [k, v] of Object.entries(obj as object)) {
    const fieldName = toSnakeCase(k)
    const rename = fieldName !== k ? `    #[serde(rename = "${k}")]\n` : ''
    fields.push(`${rename}    pub ${fieldName}: ${rustType(v, k)},`)
    if (v !== null && !Array.isArray(v) && typeof v === 'object') nested.push(toRustStruct(v, toPascalCase(k)))
    else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null) nested.push(toRustStruct(v[0], toPascalCase(k)))
  }
  const struct = `#[derive(Debug, Serialize, Deserialize)]\npub struct ${name} {\n${fields.join('\n')}\n}`
  return [struct, ...nested].join('\n\n')
}

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    const data = yaml.load(input.value)
    if (typeof data !== 'object' || data === null) throw new Error('YAML root must be an object')
    output.value = 'use serde::{Serialize, Deserialize};\n\n' + toRustStruct(data)
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
          <span>Rust 结构体</span>
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
