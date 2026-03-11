<script setup lang="ts">
import { ref, computed } from 'vue'

const pattern = ref('[A-Za-z]+\\d+')
const flags = ref('g')
const testInput = ref('hello123 world456 foo789 bar')
const error = ref('')

interface MatchItem {
  index: number
  match: string
  groups: string[]
}

const matches = computed<MatchItem[]>(() => {
  error.value = ''
  if (!pattern.value || !testInput.value) return []
  try {
    const re = new RegExp(pattern.value, flags.value)
    const results: MatchItem[] = []
    let m
    if (flags.value.includes('g')) {
      while ((m = re.exec(testInput.value)) !== null) {
        results.push({ index: m.index, match: m[0], groups: Array.from(m).slice(1) })
        if (m.index === re.lastIndex) re.lastIndex++
      }
    } else {
      m = re.exec(testInput.value)
      if (m) results.push({ index: m.index, match: m[0], groups: Array.from(m).slice(1) })
    }
    return results
  } catch (e: any) {
    error.value = e.message
    return []
  }
})

const highlightedText = computed(() => {
  if (!matches.value.length) return testInput.value.replace(/</g, '&lt;')
  let result = ''
  let lastIdx = 0
  const text = testInput.value
  for (const m of matches.value) {
    result += text.slice(lastIdx, m.index).replace(/</g, '&lt;')
    result += `<mark>${m.match.replace(/</g, '&lt;')}</mark>`
    lastIdx = m.index + m.match.length
  }
  result += text.slice(lastIdx).replace(/</g, '&lt;')
  return result
})

const flagOptions = ['g', 'i', 'm', 's', 'u']
const selectedFlags = ref(['g'])

function toggleFlag(f: string) {
  const idx = selectedFlags.value.indexOf(f)
  if (idx >= 0) selectedFlags.value.splice(idx, 1)
  else selectedFlags.value.push(f)
  flags.value = selectedFlags.value.join('')
}
</script>

<template>
  <div class="tool-container">
    <div class="regex-bar">
      <div class="regex-input-wrap">
        <span class="regex-slash">/</span>
        <el-input v-model="pattern" placeholder="正则表达式" class="regex-input" />
        <span class="regex-slash">/</span>
        <el-input v-model="flags" placeholder="flags" style="width:80px" />
      </div>
      <div class="flag-toggles">
        <el-tag
          v-for="f in flagOptions"
          :key="f"
          :type="selectedFlags.includes(f) ? 'primary' : 'info'"
          class="flag-tag"
          style="cursor:pointer"
          @click="toggleFlag(f)"
        >{{ f }}</el-tag>
      </div>
    </div>
    <el-alert v-if="error" :title="`正则错误: ${error}`" type="error" show-icon style="margin-bottom:12px" />

    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header"><span>测试文本</span></div>
        <el-input type="textarea" v-model="testInput" :rows="8" placeholder="输入要测试的文本..." />
        <div class="highlight-box" v-html="highlightedText" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>匹配结果（{{ matches.length }} 个）</span>
        </div>
        <div class="matches-list">
          <div v-if="matches.length === 0" class="no-match">无匹配</div>
          <div v-for="(m, i) in matches" :key="i" class="match-item">
            <span class="match-index">#{{ i + 1 }}</span>
            <span class="match-value">{{ m.match }}</span>
            <span class="match-pos">位置: {{ m.index }}</span>
            <span v-if="m.groups.length" class="match-groups">分组: {{ m.groups.join(', ') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.regex-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.regex-input-wrap { display: flex; align-items: center; gap: 4px; flex: 1; min-width: 200px; }
.regex-slash { font-size: 18px; color: #999; font-weight: bold; }
.flag-toggles { display: flex; gap: 6px; }
.flag-tag { user-select: none; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.highlight-box {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-height: 60px;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-all;
  background: #f9f9f9;
}
:deep(.highlight-box mark) { background: #ffe58f; border-radius: 2px; padding: 0 2px; }
:global(body.dark-mode) .highlight-box { background: #1a1f2e; border-color: #303050; color: rgba(255,255,255,0.75); }
.matches-list { border: 1px solid #dcdfe6; border-radius: 4px; max-height: 320px; overflow-y: auto; }
.no-match { text-align: center; padding: 24px; color: #999; }
.match-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-bottom: 1px solid #f0f0f0; flex-wrap: wrap; }
.match-index { color: #999; font-size: 12px; min-width: 30px; }
.match-value { font-family: monospace; background: #fff7e6; padding: 2px 6px; border-radius: 3px; color: #d46b08; font-weight: 500; }
.match-pos { font-size: 12px; color: #888; }
.match-groups { font-size: 12px; color: #52c41a; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
