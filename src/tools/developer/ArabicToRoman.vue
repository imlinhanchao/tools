<script setup lang="ts">
import { ref, computed } from 'vue'

const arabicInput = ref('2024')
const romanInput = ref('')
const direction = ref<'to-roman' | 'to-arabic'>('to-roman')

const ROMAN_MAP: [number, string][] = [
  [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
  [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
  [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I'],
]

function toRoman(n: number): string {
  if (n < 1 || n > 3999) return '超出范围 (1-3999)'
  let result = ''
  for (const [val, sym] of ROMAN_MAP) {
    while (n >= val) { result += sym; n -= val }
  }
  return result
}

function fromRoman(s: string): number | null {
  const str = s.toUpperCase().trim()
  const map: Record<string, number> = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 }
  let total = 0
  for (let i = 0; i < str.length; i++) {
    const cur = map[str[i]]
    const next = map[str[i + 1]]
    if (cur === undefined) return null
    if (next && cur < next) total -= cur
    else total += cur
  }
  return total
}

const arabicResult = computed(() => {
  const n = parseInt(arabicInput.value)
  if (isNaN(n)) return '请输入有效数字'
  return toRoman(n)
})

const romanResult = computed(() => {
  const n = fromRoman(romanInput.value)
  if (n === null) return '无效的罗马数字'
  return String(n)
})

// Generate reference table
const referenceRows = [1,2,3,4,5,6,7,8,9,10,14,19,20,40,50,90,100,399,400,500,900,1000,1999,2024,3999].map(n => [n, toRoman(n)])
</script>

<template>
  <div class="tool-container">
    <div class="converters">
      <div class="converter-card">
        <div class="card-title">阿拉伯数字 → 罗马数字</div>
        <el-input v-model="arabicInput" placeholder="输入阿拉伯数字 (1-3999)" type="number" :min="1" :max="3999" />
        <div class="result-display">{{ arabicResult }}</div>
      </div>
      <div class="converter-card">
        <div class="card-title">罗马数字 → 阿拉伯数字</div>
        <el-input v-model="romanInput" placeholder="输入罗马数字，如 MMXXIV" />
        <div class="result-display">{{ romanInput ? romanResult : '—' }}</div>
      </div>
    </div>

    <div class="ref-section">
      <div class="ref-title">参考对照表</div>
      <div class="ref-grid">
        <div v-for="[arabic, roman] in referenceRows" :key="arabic" class="ref-row">
          <span class="ref-arabic">{{ arabic }}</span>
          <span class="ref-arrow">→</span>
          <span class="ref-roman">{{ roman }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.converters { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.converter-card { border: 1px solid #dcdfe6; border-radius: 8px; padding: 16px; }
.card-title { font-weight: 600; margin-bottom: 12px; color: #1677ff; font-size: 14px; }
.result-display { margin-top: 12px; font-size: 28px; font-weight: 700; color: #1677ff; text-align: center; padding: 12px; background: #f0f5ff; border-radius: 6px; min-height: 56px; }
.ref-section { margin-top: 8px; }
.ref-title { font-weight: 600; margin-bottom: 12px; font-size: 14px; }
.ref-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; }
.ref-row { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border: 1px solid #f0f0f0; border-radius: 6px; }
.ref-arabic { font-weight: 600; min-width: 36px; text-align: right; }
.ref-arrow { color: #bbb; }
.ref-roman { font-family: monospace; color: #1677ff; }
:global(body.dark-mode) .converter-card { border-color: #303050; }
:global(body.dark-mode) .result-display { background: #1a2a4a; }
:global(body.dark-mode) .ref-row { border-color: #303050; }
@media (max-width: 768px) { .converters { grid-template-columns: 1fr; } }
</style>
