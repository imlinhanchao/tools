<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref(`Hello "World"!\nThis is a 'test'.\nPath: C:\\Users\\John`)
const output = ref('')

function transform() {
  if (!input.value) { output.value = ''; return }
  output.value = input.value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

function copyOutput() { navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板')) }
transform()
</script>

<template>
  <div class="tool-container">
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>原始字符串</span>
          <el-button size="small" @click="input = ''; output = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="14" placeholder="请输入要转义的字符串..." @input="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>转义后字符串</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="14" readonly />
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
