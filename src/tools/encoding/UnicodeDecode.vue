<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('Hello \\u4e16\\u754c \\ud83c\\udf0d')
const output = ref('')

function process() {
  try {
    if (!input.value) { output.value = ''; return }
    output.value = input.value.replace(
      /\\u([0-9a-fA-F]{4})/g,
      (_, hex) => String.fromCharCode(parseInt(hex, 16))
    )
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
          <span>输入 (Unicode 转义)</span>
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
