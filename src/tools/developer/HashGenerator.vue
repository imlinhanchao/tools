<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage as message } from 'element-plus'
import CryptoJS from 'crypto-js'

const input = ref('Hello, World!')
const encoding = ref<'utf8' | 'base64'>('utf8')

const algorithms = ['MD5', 'SHA1', 'SHA224', 'SHA256', 'SHA384', 'SHA512', 'SHA3', 'RIPEMD160']

function computeHash(algo: string, text: string): string {
  const msg = encoding.value === 'base64'
    ? CryptoJS.enc.Base64.parse(text)
    : CryptoJS.enc.Utf8.parse(text)
  switch (algo) {
    case 'MD5': return CryptoJS.MD5(msg).toString()
    case 'SHA1': return CryptoJS.SHA1(msg).toString()
    case 'SHA224': return CryptoJS.SHA224(msg).toString()
    case 'SHA256': return CryptoJS.SHA256(msg).toString()
    case 'SHA384': return CryptoJS.SHA384(msg).toString()
    case 'SHA512': return CryptoJS.SHA512(msg).toString()
    case 'SHA3': return CryptoJS.SHA3(msg).toString()
    case 'RIPEMD160': return CryptoJS.RIPEMD160(msg).toString()
    default: return ''
  }
}

const hashes = computed(() => {
  if (!input.value) return []
  try {
    return algorithms.map(algo => {
      try {
        return { algo, hash: computeHash(algo, input.value) }
      } catch {
        return { algo, hash: '计算失败' }
      }
    })
  } catch {
    return []
  }
})

function copy(text: string) {
  navigator.clipboard.writeText(text).then(() => message.success('已复制'))
}

function copyAll() {
  const all = hashes.value.map(h => `${h.algo}: ${h.hash}`).join('\n')
  navigator.clipboard.writeText(all).then(() => message.success('已复制全部'))
}
</script>

<template>
  <div class="tool-container">
    <div class="input-section">
      <div class="input-row">
        <el-input
          v-model="input"
          type="textarea"
          :rows="3"
          placeholder="请输入要计算哈希值的文本..."
        />
      </div>
      <div class="options-row">
        <span>输入编码：</span>
        <el-radio-group v-model="encoding" size="small">
          <el-radio-button value="utf8">UTF-8 文本</el-radio-button>
          <el-radio-button value="base64">Base64</el-radio-button>
        </el-radio-group>
        <el-button size="small" @click="copyAll" :disabled="hashes.length === 0">复制全部</el-button>
      </div>
    </div>

    <div class="hash-list">
      <div v-for="{ algo, hash } in hashes" :key="algo" class="hash-row">
        <span class="hash-algo">{{ algo }}</span>
        <code class="hash-value">{{ hash }}</code>
        <el-button size="small" text @click="copy(hash)">复制</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.input-section { margin-bottom: 20px; }
.input-row { margin-bottom: 12px; }
.options-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.hash-list { border: 1px solid #dcdfe6; border-radius: 8px; overflow: hidden; }
.hash-row { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid #f0f0f0; }
.hash-row:last-child { border-bottom: none; }
.hash-algo { min-width: 90px; font-size: 12px; color: #888; font-weight: 600; }
.hash-value { flex: 1; font-family: monospace; font-size: 12px; word-break: break-all; color: #333; }
:global(body.dark-mode) .hash-list { border-color: #303050; }
:global(body.dark-mode) .hash-row { border-bottom-color: #303050; }
:global(body.dark-mode) .hash-value { color: rgba(255,255,255,0.75); }
</style>
