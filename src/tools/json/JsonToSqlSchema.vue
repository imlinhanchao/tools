<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('')
const output = ref('')
const error = ref('')

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

function sqlType(val: any): string {
  if (val === null) return 'TEXT'
  if (typeof val === 'boolean') return 'BOOLEAN'
  if (typeof val === 'number') return Number.isInteger(val) ? 'INTEGER' : 'DECIMAL(10,2)'
  if (typeof val === 'string') return val.length < 256 ? 'VARCHAR(255)' : 'TEXT'
  return 'TEXT'
}

function toSqlSchema(data: any): string {
  const arr = Array.isArray(data) ? data : [data]
  const tableName = 'table_name'

  const sampleRow = arr[0] || {}
  const flatRow: Record<string, any> = {}
  for (const [k, v] of Object.entries(sampleRow)) {
    if (typeof v !== 'object' || v === null) {
      flatRow[k] = v
    }
  }

  const columns = Object.entries(flatRow).map(([k, v]) =>
    `  ${k} ${sqlType(v)}`
  )

  const create = [
    `CREATE TABLE ${tableName} (`,
    `  id INTEGER PRIMARY KEY AUTOINCREMENT,`,
    columns.join(',\n'),
    `);`,
  ].join('\n')

  const inserts = arr.map(row => {
    const cols = Object.keys(flatRow)
    const vals = cols.map(c => {
      const v = row[c]
      if (v === null || v === undefined) return 'NULL'
      if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`
      return String(v)
    })
    return `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${vals.join(', ')});`
  })

  return [create, '', ...inserts].join('\n')
}

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    const data = JSON.parse(input.value)
    output.value = toSqlSchema(data)
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
