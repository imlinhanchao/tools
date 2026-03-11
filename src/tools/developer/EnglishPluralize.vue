<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage as message } from 'element-plus'
import pluralize from 'pluralize'

const input = ref('')
const mode = ref<'pluralize' | 'singularize' | 'detect'>('pluralize')

const result = computed(() => {
  const word = input.value.trim()
  if (!word) return ''
  if (mode.value === 'pluralize') return pluralize.plural(word)
  if (mode.value === 'singularize') return pluralize.singular(word)
  const isPlural = pluralize.isPlural(word)
  const isSingular = pluralize.isSingular(word)
  if (isPlural && isSingular) return `"${word}" 单复数同形\n  单数: ${pluralize.singular(word)}\n  复数: ${pluralize.plural(word)}`
  if (isPlural) return `"${word}" 是复数形式，单数: ${pluralize.singular(word)}`
  return `"${word}" 是单数形式，复数: ${pluralize.plural(word)}`
})

function copyResult() {
  navigator.clipboard.writeText(result.value).then(() => message.success('已复制'))
}

// Some examples for demo
const examples = ['cat','child','person','tooth','mouse','datum','criterion','leaf','half','knife','wolf','city','box','fox','bus','quiz','hero','tomato','potato','auto']
</script>

<template>
  <div class="tool-container">
    <div class="options-bar">
      <el-radio-group v-model="mode">
        <el-radio-button value="pluralize">单数 → 复数</el-radio-button>
        <el-radio-button value="singularize">复数 → 单数</el-radio-button>
        <el-radio-button value="detect">自动检测</el-radio-button>
      </el-radio-group>
    </div>

    <div class="input-section">
      <el-input v-model="input" placeholder="输入英语单词..." clearable size="large" />
    </div>

    <div v-if="result" class="result-section">
      <div class="result-box">{{ result }}</div>
      <el-button size="small" @click="copyResult">复制</el-button>
    </div>

    <div class="examples-section">
      <div class="examples-title">快速示例</div>
      <div class="examples-grid">
        <div
          v-for="w in examples"
          :key="w"
          class="example-item"
          @click="input = w"
        >
          <span class="singular">{{ w }}</span>
          <span class="arrow">→</span>
          <span class="plural">{{ pluralize.plural(w) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.options-bar { margin-bottom: 16px; }
.input-section { margin-bottom: 20px; max-width: 480px; }
.result-section { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.result-box {
  flex: 1;
  max-width: 480px;
  padding: 12px 16px;
  background: #f0f5ff;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1677ff;
  white-space: pre-line;
}
.examples-title { font-weight: 600; margin-bottom: 12px; font-size: 14px; color: #888; }
.examples-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
.example-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}
.example-item:hover { border-color: #1677ff; background: #f0f5ff; }
.singular { color: #333; }
.arrow { color: #bbb; }
.plural { color: #1677ff; font-weight: 500; }
:global(body.dark-mode) .result-box { background: #1a2a4a; }
:global(body.dark-mode) .example-item { border-color: #303050; }
:global(body.dark-mode) .example-item:hover { background: #1a2a4a; }
:global(body.dark-mode) .singular { color: rgba(255,255,255,0.75); }
</style>
