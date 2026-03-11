<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('')
const output = ref('')
const error = ref('')
const useCamelCase = ref(true)

const example = `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
}`

function toCamelCase(s: string): string {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    const blockMatch = input.value.match(/\{([^}]*)\}/)
    const cssText = blockMatch ? blockMatch[1] : input.value
    const props: string[] = []
    for (const line of cssText.split(';')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      const colonIdx = trimmed.indexOf(':')
      if (colonIdx < 0) continue
      const prop = trimmed.slice(0, colonIdx).trim()
      const val = trimmed.slice(colonIdx + 1).trim()
      const key = useCamelCase.value ? toCamelCase(prop) : `'${prop}'`
      const numericVal = /^[\d.]+$/.test(val) ? val : `'${val}'`
      props.push(`  ${key}: ${numericVal},`)
    }
    output.value = `{\n${props.join('\n')}\n}`
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
    <div class="options-bar">
      <el-checkbox v-model="useCamelCase" @change="transform">使用驼峰命名</el-checkbox>
    </div>
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>CSS 输入</span>
          <div class="btn-group">
            <el-button size="small" @click="loadExample">示例</el-button>
            <el-button size="small" @click="input = ''; output = ''; error = ''">清除</el-button>
          </div>
        </div>
        <el-input type="textarea" v-model="input" :rows="14" placeholder="请输入CSS样式..." @change="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>JS 对象</span>
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
.options-bar { margin-bottom: 12px; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.btn-group { display: flex; gap: 4px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
