<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage as message } from 'element-plus'
import { css as cssBeautify } from 'js-beautify'

const input = ref('')
const output = ref('')
const error = ref('')
const indentSize = ref(2)

const example = `.container{display:flex;flex-direction:column;align-items:center;padding:16px;margin:0 auto;max-width:1200px}.button{background-color:#1677ff;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer}`

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    output.value = cssBeautify(input.value, {
      indent_size: indentSize.value,
      end_with_newline: true,
    })
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
      <span>缩进：</span>
      <el-radio-group v-model="indentSize" @change="transform">
        <el-radio-button :value="2">2 空格</el-radio-button>
        <el-radio-button :value="4">4 空格</el-radio-button>
      </el-radio-group>
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
        <el-input type="textarea" v-model="input" :rows="15" placeholder="请输入CSS代码..." @change="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>格式化结果</span>
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
.options-bar { margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.btn-group { display: flex; gap: 4px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
