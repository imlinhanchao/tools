<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'
import CryptoJS from 'crypto-js'

const input = ref('')
const output = ref('')
const key = ref('mySecretKey')
const inputFormat = ref('Base64')

const formatOptions = ['Base64', 'Hex']

function process() {
  try {
    if (!input.value) { output.value = ''; return }
    if (!key.value) { message.warning('请输入密钥'); return }

    const keyParsed = CryptoJS.enc.Utf8.parse(key.value)

    let cipherInput: string | CryptoJS.lib.CipherParams
    if (inputFormat.value === 'Hex') {
      cipherInput = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(input.value.trim()),
      })
    } else {
      cipherInput = input.value.trim()
    }

    const decrypted = CryptoJS.RC4.decrypt(cipherInput, keyParsed)
    output.value = decrypted.toString(CryptoJS.enc.Utf8)
    if (!output.value) throw new Error('解密结果为空，请检查密钥或密文格式')
  } catch (e) {
    message.error(`解密失败: ${(e as Error).message}`)
    output.value = ''
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
        <div class="option-label">密钥 (Key)</div>
        <el-input v-model="key" placeholder="输入密钥" style="width:200px" />
      </div>
      <div class="option-item">
        <div class="option-label">密文格式</div>
        <el-select v-model="inputFormat" style="width:100px">
          <el-option v-for="f in formatOptions" :key="f" :value="f">{{ f }}</el-option>
        </el-select>
      </div>
    </div>
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>密文输入</span>
          <el-button size="small" @click="input = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="10" placeholder="输入要解密的密文（Base64 或 Hex）" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>明文输出</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="10" readonly placeholder="解密结果将显示在这里" />
      </div>
    </div>
    <div style="margin-top:12px">
      <el-button type="primary" @click="process">解密</el-button>
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
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
