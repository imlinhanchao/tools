<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'
import { KEYUTIL, hextob64 } from 'jsrsasign'

const SAMPLE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA9mRhbyJRcIf8mSi1pixZ
CkFyvK5EoCygNVED/fauuM/muUAZ0dVrlKGNINOQG2ryMzH5DCnIDGXvFtwBmvBG
mTd1Bo4ikrkFjOcXQ2+AicJuUOEou6r6PwgZUU6u/JodIUCKV6wIUuS/EiZ0tPTD
bAQoWgZaO6rCUK5qlqjQ/kuLEZslv1zyQ91ldU7IxLwwp/gz5eZeS5/utBI9JQN6
2OiiP1xFefXseqMbX+flH2jVQKzAl66NRUADsghyZy93Ava5EGUMJeVfwl4/XSLM
+2uhmBAO6xdPr+QAS9pb3nYT9agkfP/GrOtY0ovY1HYe79XPJ6aA5y8tFL43MH9z
BwIDAQAB
-----END PUBLIC KEY-----`

const input = ref('Hello, RSA!')
const output = ref('')
const publicKey = ref(SAMPLE_PUBLIC_KEY)
const outputFormat = ref('Base64')

const formatOptions = ['Base64', 'Hex']

function process() {
  try {
    if (!input.value) { output.value = ''; return }
    if (!publicKey.value.trim()) { message.warning('请输入公钥'); return }

    const pubKey = KEYUTIL.getKey(publicKey.value.trim()) as any
    if (!pubKey || typeof pubKey.encrypt !== 'function') {
      message.error('无效的公钥格式'); return
    }
    const encHex: string = pubKey.encrypt(input.value)
    output.value = outputFormat.value === 'Base64' ? hextob64(encHex) : encHex
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
      <div class="option-item">
        <div class="option-label">输出格式</div>
        <el-select v-model="outputFormat" style="width:100px">
          <el-option v-for="f in formatOptions" :key="f" :value="f">{{ f }}</el-option>
        </el-select>
      </div>
    </div>
    <div class="key-area">
      <div class="option-label">
        公钥 (PEM 格式)
        <el-tag color="orange" style="margin-left:8px">示例密钥（仅供测试）</el-tag>
      </div>
      <el-input type="textarea" v-model="publicKey" :rows="6" placeholder="粘贴 PEM 格式公钥" class="key-textarea" />
    </div>
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>明文输入</span>
          <el-button size="small" @click="input = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="8" placeholder="输入要加密的文本（RSA 明文长度受密钥长度限制）" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>密文输出</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="8" readonly placeholder="加密结果将显示在这里" />
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
.option-label { font-size: 12px; color: #666; margin-bottom: 4px; }
.key-area { margin-bottom: 16px; }
.key-textarea { font-family: monospace; font-size: 12px; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
