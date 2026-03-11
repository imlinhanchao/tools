<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'
import smCrypto from 'sm-crypto'

const { sm4 } = smCrypto

const input = ref('Hello, SM4!')
const output = ref('')
const key = ref('0123456789abcdeffedcba9876543210')
const outputEncoding = ref('hex')

const encodingOptions = [
  { value: 'hex', label: 'Hex' },
  { value: 'base64', label: 'Base64' },
]

function process() {
  try {
    if (!input.value) { output.value = ''; return }
    if (!key.value.trim()) { message.warning('请输入 SM4 密钥'); return }
    if (key.value.trim().length !== 32) {
      message.warning('SM4 密钥必须为 32 个十六进制字符（16字节）'); return
    }

    const result = sm4.encrypt(input.value, key.value.trim(), {
      inputEncoding: 'utf8',
      outputEncoding: outputEncoding.value as 'hex' | 'base64',
    })
    output.value = result
  } catch (e) {
    message.error(`加密失败: ${(e as Error).message}`)
  }
}

function copyOutput() {
  navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板'))
}
</script>

<template>
  <div class="tool-container">
    <div class="options-row">
      <div class="option-item" style="flex:1; min-width:280px">
        <div class="option-label">SM4 密钥 (32位十六进制 = 16字节)</div>
        <el-input
          v-model="key"
          placeholder="输入32位十六进制密钥（如 0123456789abcdeffedcba9876543210）"
          class="mono-input"
        />
      </div>
      <div class="option-item">
        <div class="option-label">输出格式</div>
        <el-select v-model="outputEncoding" style="width:120px">
          <el-option v-for="opt in encodingOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>明文输入</span>
          <el-button size="small" @click="input = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="10" placeholder="输入要加密的文本" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>密文输出</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="10"
          readonly
          placeholder="加密结果将显示在这里"
          class="mono-textarea"
        />
      </div>
    </div>
    <div style="margin-top:12px">
      <el-button type="primary" @click="process">加密</el-button>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.options-row { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; align-items: flex-end; }
.option-item { display: flex; flex-direction: column; gap: 4px; }
.option-label { font-size: 12px; color: #666; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.mono-textarea { font-family: monospace; font-size: 12px; }
.mono-input { font-family: monospace; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
