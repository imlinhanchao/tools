<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'
import html2canvas from 'html2canvas'

const code = ref(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Print first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(fibonacci(i));
}`)

const language = ref('javascript')
const theme = ref('dark')
const fontSize = ref(14)
const padding = ref(32)
const codeRef = ref<HTMLElement | null>(null)
const downloading = ref(false)

const themes: Record<string, { bg: string; text: string; keyword: string; string: string; comment: string; number: string }> = {
  dark: { bg: '#1e1e2e', text: '#cdd6f4', keyword: '#cba6f7', string: '#a6e3a1', comment: '#6c7086', number: '#fab387' },
  light: { bg: '#fafafa', text: '#383a42', keyword: '#a626a4', string: '#50a14f', comment: '#a0a1a7', number: '#986801' },
  github: { bg: '#fff', text: '#24292e', keyword: '#d73a49', string: '#032f62', comment: '#6a737d', number: '#005cc5' },
}

const keywords = new Set(['function','return','const','let','var','if','else','for','while','class','import','export','default','new','this','typeof','async','await','true','false','null','undefined'])

function highlight(code: string): string {
  return code
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(\/\/[^\n]*)/g, `<span style="color:${themes[theme.value].comment}">$1</span>`)
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, `<span style="color:${themes[theme.value].string}">$1</span>`)
    .replace(/\b(\d+(?:\.\d+)?)\b/g, `<span style="color:${themes[theme.value].number}">$1</span>`)
    .replace(/\b(function|return|const|let|var|if|else|for|while|class|import|export|default|new|this|typeof|async|await|true|false|null|undefined)\b/g,
      `<span style="color:${themes[theme.value].keyword}">$1</span>`)
}

async function download() {
  if (!codeRef.value || downloading.value) return
  downloading.value = true
  try {
    const canvas = await html2canvas(codeRef.value, { scale: 2, backgroundColor: null })
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url; a.download = 'code.png'; a.click()
  } catch (e: any) {
    message.error('导出失败: ' + e.message)
  } finally {
    downloading.value = false
  }
}
</script>

<template>
  <div class="tool-container">
    <div class="controls">
      <div class="control-group">
        <span>主题：</span>
        <el-radio-group v-model="theme" size="small">
          <el-radio-button value="dark">深色</el-radio-button>
          <el-radio-button value="light">浅色</el-radio-button>
          <el-radio-button value="github">GitHub</el-radio-button>
        </el-radio-group>
      </div>
      <div class="control-group">
        <span>字号：</span>
        <el-input-number v-model="fontSize" :min="10" :max="24" size="small" style="width:100px" />
      </div>
      <div class="control-group">
        <span>内边距：</span>
        <el-input-number v-model="padding" :min="8" :max="64" :step="8" size="small" style="width:100px" />
      </div>
      <el-button type="primary" size="small" :loading="downloading" @click="download">下载图片</el-button>
    </div>

    <div class="editor-area">
      <el-input type="textarea" v-model="code" :rows="12" placeholder="请输入代码..." class="code-input" />
    </div>

    <div class="preview-label">预览（点击下载按钮导出）</div>
    <div
      ref="codeRef"
      class="code-preview"
      :style="{
        background: themes[theme].bg,
        padding: `${padding}px`,
        fontSize: `${fontSize}px`,
        color: themes[theme].text,
      }"
    >
      <div class="window-dots">
        <span class="dot red" /><span class="dot yellow" /><span class="dot green" />
      </div>
      <pre v-html="highlight(code)" class="code-content" :style="{ color: themes[theme].text }" />
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 16px; }
.control-group { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.editor-area { margin-bottom: 16px; }
.preview-label { font-weight: 500; margin-bottom: 8px; font-size: 13px; color: #888; }
.code-preview {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  display: inline-block;
  min-width: 400px;
  max-width: 100%;
}
.window-dots { display: flex; gap: 6px; margin-bottom: 16px; }
.dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
.red { background: #ff5f57; }
.yellow { background: #febc2e; }
.green { background: #28c840; }
.code-content { margin: 0; font-family: 'Fira Code', 'Consolas', monospace; line-height: 1.6; white-space: pre; }
:deep(.code-input textarea) { font-family: monospace !important; font-size: 13px !important; }
</style>
