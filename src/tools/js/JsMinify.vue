<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('')
const output = ref('')
const error = ref('')

const example = `function greet(name) {
  const greeting = 'Hello, ' + name + '!';
  console.log(greeting);
  return greeting;
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(function(n) {
  return n * 2;
});

if (doubled.length > 0) {
  console.log('Doubled:', doubled);
}`

function minifyJs(code: string): string {
  return code
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,=+\-*/<>!&|?:[\]])\s*/g, '$1')
    .trim()
}

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    output.value = minifyJs(input.value)
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
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>JS 输入</span>
          <div class="btn-group">
            <el-button size="small" @click="loadExample">示例</el-button>
            <el-button size="small" @click="input = ''; output = ''; error = ''">清除</el-button>
          </div>
        </div>
        <el-input type="textarea" v-model="input" :rows="15" placeholder="请输入JavaScript代码..." @change="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>压缩结果</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="15" readonly />
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
.btn-group { display: flex; gap: 4px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
