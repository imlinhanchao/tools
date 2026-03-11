<template>
  <div class="flex flex-col gap-4 h-full">
    <div class="flex gap-4 mb-2 h-full flex-col md:flex-row">
      <div class="flex-1 flex flex-col h-[500px]">
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold">Markdown 输入</div>
          <el-button size="small" @click="markdown = ''">清空</el-button>
        </div>
        <el-input
          v-model="markdown"
          type="textarea"
          class="flex-1 h-full font-mono !text-[14px]"
          :input-style="{ height: '100%', resize: 'none' }"
          placeholder="请输入 Markdown..."
        />
      </div>
      <div class="flex-1 flex flex-col h-[500px]">
        <div class="font-bold mb-2">预览区</div>
        <div 
          class="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#1A1D24] overflow-y-auto markdown-preview-body"
          v-html="htmlContent"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { marked } from 'marked'

const markdown = ref('# Hello Markdown\n\n欢迎使用 **Markdown 预览** 工具。\n\n## 功能特性\n- 实时预览\n- 基础样式支持\n\n```javascript\nconsole.log("Hello World")\n```')

const htmlContent = computed(() => marked(markdown.value))
</script>

<style>
/* Basic Markdown styles */
.markdown-preview-body {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
  line-height: 1.6;
  color: #24292f;
}
:global(.dark) .markdown-preview-body {
  color: #c9d1d9;
}
.markdown-preview-body h1,
.markdown-preview-body h2,
.markdown-preview-body h3,
.markdown-preview-body h4 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}
.markdown-preview-body h1 { font-size: 2em; border-bottom: 1px solid #d0d7de; padding-bottom: .3em; }
.markdown-preview-body h2 { font-size: 1.5em; border-bottom: 1px solid #d0d7de; padding-bottom: .3em; }
:global(.dark) .markdown-preview-body h1,
:global(.dark) .markdown-preview-body h2 { border-color: #21262d; }
.markdown-preview-body h3 { font-size: 1.25em; }
.markdown-preview-body p,
.markdown-preview-body blockquote,
.markdown-preview-body ul,
.markdown-preview-body ol,
.markdown-preview-body dl,
.markdown-preview-body pre {
  margin-top: 0;
  margin-bottom: 16px;
}
.markdown-preview-body blockquote {
  padding: 0 1em;
  color: #57606a;
  border-left: .25em solid #d0d7de;
}
:global(.dark) .markdown-preview-body blockquote {
  color: #8b949e;
  border-left-color: #30363d;
}
.markdown-preview-body ul,
.markdown-preview-body ol {
  padding-left: 2em;
}
.markdown-preview-body ul li {
  list-style-type: disc;
}
.markdown-preview-body ol li {
  list-style-type: decimal;
}
.markdown-preview-body code {
  padding: .2em .4em;
  margin: 0;
  font-size: 85%;
  white-space: pre-wrap;
  background-color: rgba(175,184,193,0.2);
  border-radius: 6px;
  font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
}
:global(.dark) .markdown-preview-body code {
  background-color: rgba(110,118,129,0.4);
}
.markdown-preview-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
}
:global(.dark) .markdown-preview-body pre {
  background-color: #161b22;
}
.markdown-preview-body pre code {
  padding: 0;
  background-color: transparent;
  white-space: pre;
}
.markdown-preview-body a {
  color: #0969da;
  text-decoration: none;
}
:global(.dark) .markdown-preview-body a {
  color: #58a6ff;
}
.markdown-preview-body a:hover {
  text-decoration: underline;
}
</style>
