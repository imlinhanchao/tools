<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('48 65 6c 6c 6f 20 e4 b8 96 e7 95 8c')
const output = ref('')

function process() {
  try {
    if (!input.value) { output.value = ''; return }
    const tokens = input.value.trim().split(/\s+/)
    const bytes = new Uint8Array(tokens.map(t => {
      const v = parseInt(t, 16)
      if (isNaN(v) || v < 0 || v > 255) throw new Error(`无效的十六进制字节: ${t}`)
      return v
    }))
    output.value = new TextDecoder('utf-8').decode(bytes)
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
          <span>输入 (UTF-8 Hex)</span>
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
