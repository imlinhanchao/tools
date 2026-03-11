<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref(`.container {
  display: flex;
  padding: 16px;
}`)
const output = ref('')

function transform() {
  if (!input.value.trim()) { output.value = ''; return }
  const encoded = btoa(unescape(encodeURIComponent(input.value)))
  output.value = `data:text/css;base64,${encoded}`
}

function copyOutput() { navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板')) }

transform()
</script>

<template>
  <div class="tool-container">
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>CSS 输入</span>
          <el-button size="small" @click="input = ''; output = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="14" placeholder="请输入CSS代码..." @change="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>Base64 Data URI</span>
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
