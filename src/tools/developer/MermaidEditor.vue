<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage as message } from 'element-plus'
import mermaid from 'mermaid'

const input = ref(`graph TD
    A[开始] --> B{判断}
    B -->|是| C[执行操作]
    B -->|否| D[跳过]
    C --> E[结束]
    D --> E`)

const svgOutput = ref('')
const error = ref('')
let idCounter = 0

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
})

async function render() {
  error.value = ''
  if (!input.value.trim()) { svgOutput.value = ''; return }
  try {
    const id = `mermaid-${++idCounter}`
    const { svg } = await mermaid.render(id, input.value)
    svgOutput.value = svg
  } catch (e: any) {
    error.value = e.message
    svgOutput.value = ''
  }
}

async function downloadSvg() {
  if (!svgOutput.value) return
  const blob = new Blob([svgOutput.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'diagram.svg'; a.click()
  URL.revokeObjectURL(url)
}

watch(input, () => render(), { immediate: false })
onMounted(() => render())
</script>

<template>
  <div class="tool-container">
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>Mermaid 代码</span>
          <el-button size="small" @click="render">渲染</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="18" placeholder="请输入Mermaid代码..." class="mono-textarea" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>预览</span>
          <el-button size="small" @click="downloadSvg" :disabled="!svgOutput">下载 SVG</el-button>
        </div>
        <div class="preview-box">
          <div v-if="svgOutput" v-html="svgOutput" class="svg-wrap" />
          <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />
          <div v-if="!svgOutput && !error" class="placeholder">渲染结果将在此显示</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.preview-box {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  min-height: 300px;
  padding: 16px;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.svg-wrap :deep(svg) { max-width: 100%; height: auto; }
.placeholder { color: #bbb; font-size: 13px; margin: auto; }
:global(body.dark-mode) .preview-box { border-color: #303050; background: #1a1f2e; }
:deep(.mono-textarea textarea) { font-family: monospace !important; font-size: 13px !important; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
