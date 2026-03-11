<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('72 101 108 108 111 32 19990 30028')
const output = ref('')

function process() {
  try {
    if (!input.value) { output.value = ''; return }
    const tokens = input.value.trim().split(/\s+/)
    const codes = tokens.map(t => {
      const v = t.startsWith('0x') || t.startsWith('0X')
        ? parseInt(t, 16)
        : parseInt(t, 10)
      if (isNaN(v) || v < 0 || v > 0xFFFF) throw new Error(`无效的 UTF-16 码元: ${t}`)
      return v
    })
    output.value = String.fromCharCode(...codes)
  } catch (e) {
    message.error(`解码失败: ${(e as Error).message}`)
  }
}

function copyOutput() {
  navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板'))
}

process()
</script>

<template>
  <div class="tool-container">
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>输入 (UTF-16 码元，空格分隔)</span>
          <el-button size="small" @click="input = ''; process()">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="12" @change="process" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>输出</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="12" readonly />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.io-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
