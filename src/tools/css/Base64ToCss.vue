<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('')
const output = ref('')
const error = ref('')

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    let b64 = input.value.trim()
    if (b64.startsWith('data:')) {
      const idx = b64.indexOf(',')
      if (idx < 0) throw new Error('无效的 Data URI 格式')
      b64 = b64.slice(idx + 1)
    }
    output.value = decodeURIComponent(escape(atob(b64)))
  } catch (e: any) {
    error.value = e.message; output.value = ''
  }
}

function copyOutput() { navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板')) }
</script>

<template>
  <div class="tool-container">
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>Base64 或 Data URI 输入</span>
          <el-button size="small" @click="input = ''; output = ''; error = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="14" placeholder="请输入Base64字符串或 data:text/css;base64,..." @change="transform" />
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
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
