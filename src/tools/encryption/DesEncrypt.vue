<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage as message } from 'element-plus'
import CryptoJS from 'crypto-js'

const input = ref('Hello, World!')
const output = ref('')
const key = ref('12345678')
const iv = ref('12345678')
const mode = ref('CBC')
const outputFormat = ref('Base64')

const showIv = computed(() => mode.value !== 'ECB')
const modeOptions = ['CBC', 'ECB', 'CFB', 'OFB']
const formatOptions = ['Base64', 'Hex']

function process() {
  try {
    if (!input.value) { output.value = ''; return }
    if (!key.value) { message.warning('请输入密钥'); return }
    if (key.value.length !== 8) { message.warning('DES 密钥必须为 8 个字符'); return }

    const keyParsed = CryptoJS.enc.Utf8.parse(key.value)
    const ivParsed = CryptoJS.enc.Utf8.parse(iv.value)

    const options: Record<string, unknown> = {
      mode: (CryptoJS.mode as Record<string, unknown>)[mode.value] as any,
      padding: CryptoJS.pad.Pkcs7,
    }
    if (mode.value !== 'ECB') options.iv = ivParsed

    const encrypted = CryptoJS.DES.encrypt(input.value, keyParsed, options)
    output.value = outputFormat.value === 'Base64'
      ? encrypted.toString()
      : encrypted.ciphertext.toString()
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
        <div class="option-label">密钥 (8字符)</div>
        <el-input v-model="key" placeholder="输入8字节密钥" style="width:160px" />
      </div>
      <div class="option-item">
        <div class="option-label">模式</div>
        <el-select v-model="mode" style="width:100px">
          <el-option v-for="m in modeOptions" :key="m" :value="m">{{ m }}</el-option>
        </el-select>
      </div>
      <div class="option-item" v-if="showIv">
        <div class="option-label">IV (8字符)</div>
        <el-input v-model="iv" placeholder="输入8字节IV" style="width:160px" />
      </div>
      <div class="option-item">
        <div class="option-label">输出格式</div>
        <el-select v-model="outputFormat" style="width:100px">
          <el-option v-for="f in formatOptions" :key="f" :value="f">{{ f }}</el-option>
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
        <el-input type="textarea" v-model="output" :rows="10" readonly placeholder="加密结果将显示在这里" />
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
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
