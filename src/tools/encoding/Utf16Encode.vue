<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('Hello 世界')
const output = ref('')
const mode = ref<'decimal' | 'hex'>('decimal')

function process() {
  try {
    if (!input.value) { output.value = ''; return }
    const units: number[] = []
    for (let i = 0; i < input.value.length; i++) {
      units.push(input.value.charCodeAt(i))
    }
    output.value = units
      .map(u => mode.value === 'hex' ? '0x' + u.toString(16).padStart(4, '0') : String(u))
      .join(' ')
  } catch (e) {
    message.error(`编码失败: ${(e as Error).message}`)
  }
}

function copyOutput() {
  navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板'))
}

process()
</script>

<template>
  <div class="tool-container">
    <div class="options-bar">
      <el-radio-group v-model="mode" @change="process">
        <el-radio-button value="decimal">十进制</el-radio-button>
        <el-radio-button value="hex">十六进制</el-radio-button>
      </el-radio-group>
    </div>
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>输入</span>
          <el-button size="small" @click="input = ''; process()">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="12" @change="process" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>输出 (UTF-16 码元)</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="12" readonly />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.options-bar { margin-bottom: 16px; }
.io-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
