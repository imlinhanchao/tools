<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref(`Hello \\"World\\"!\\nThis is a \\'test\\'.\\nPath: C:\\\\Users\\\\John`)
const output = ref('')
const error = ref('')

function transform() {
  error.value = ''
  if (!input.value) { output.value = ''; return }
  try {
    // Safely replace escape sequences without executing code
    output.value = input.value
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')
      .replace(/\\v/g, '\v')
      .replace(/\\0/g, '\0')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
  } catch (e: any) {
    error.value = e.message
  }
}

function copyOutput() { navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板')) }
transform()
</script>

<template>
  <div class="tool-container">
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>转义字符串</span>
          <el-button size="small" @click="input = ''; output = ''; error = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="14" placeholder="请输入已转义的字符串..." @input="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>反转义结果</span>
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
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
