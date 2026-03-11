<template>
  <div class="flex flex-col gap-6 max-w-2xl mx-auto w-full">
    <div v-for="base in bases" :key="base.radix" class="flex flex-col gap-1">
      <div class="flex justify-between">
        <label class="font-bold text-sm">{{ base.name }} ({{ base.radix }}进制)</label>
        <el-button link size="small" type="primary" @click="copy(values[base.radix])">复制</el-button>
      </div>
      <el-input
        v-model="values[base.radix]"
        @input="onInput(base.radix)"
        :placeholder="`请输入${base.name}...`"
        clearable
        :class="{ 'is-error': errors[base.radix] }"
      />
      <div v-if="errors[base.radix]" class="text-red-500 text-xs mt-1">无效的输入</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const bases = [
  { name: '二进制', radix: 2 },
  { name: '八进制', radix: 8 },
  { name: '十进制', radix: 10 },
  { name: '十六进制', radix: 16 },
]

const values = reactive<Record<number, string>>({
  2: '',
  8: '',
  10: '',
  16: ''
})

const errors = reactive<Record<number, boolean>>({
  2: false,
  8: false,
  10: false,
  16: false
})

function onInput(sourceRadix: number) {
  const val = values[sourceRadix].trim()
  
  // Clear all
  if (!val) {
    bases.forEach(b => {
      values[b.radix] = ''
      errors[b.radix] = false
    })
    return
  }

  try {
    // Parse to BigInt to support large numbers
    const parsed = parseBigInt(val, sourceRadix)
    
    // Update others
    bases.forEach(b => {
      errors[b.radix] = false
      if (b.radix !== sourceRadix) {
        values[b.radix] = parsed.toString(b.radix)
      }
    })
  } catch (e) {
    errors[sourceRadix] = true
    bases.forEach(b => {
      if (b.radix !== sourceRadix) {
        values[b.radix] = ''
      }
    })
  }
}

function parseBigInt(str: string, radix: number): bigint {
  str = str.toLowerCase()
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let result = 0n
  const BigRadix = BigInt(radix)
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (char === '-') {
      if (i !== 0) throw new Error('Invalid')
      continue
    }
    const val = chars.indexOf(char)
    if (val === -1 || val >= radix) {
      throw new Error('Invalid character for radix')
    }
    result = result * BigRadix + BigInt(val)
  }
  
  return str.startsWith('-') ? -result : result
}

function copy(text: string) {
  if (!text) return
  navigator.clipboard.writeText(text)
}
</script>
