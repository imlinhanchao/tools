<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'
import smCrypto from 'sm-crypto'

const { sm2 } = smCrypto

const input = ref('')
const output = ref('')
const privateKey = ref('')
const cipherMode = ref(1)

const cipherModeOptions = [
  { value: 1, label: 'C1C3C2 (模式1, 推荐)' },
  { value: 0, label: 'C1C2C3 (模式0)' },
]

function process() {
  try {
    if (!input.value.trim()) { output.value = ''; return }
    if (!privateKey.value.trim()) { message.warning('请输入 SM2 私钥'); return }

    const decrypted = sm2.doDecrypt(input.value.trim(), privateKey.value.trim(), cipherMode.value)
    if (decrypted === '') {
      throw new Error('解密结果为空，请检查私钥、密文或加密模式是否匹配')
    }
    output.value = decrypted
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
      <div class="option-item" style="flex:1; min-width:300px">
        <div class="option-label">SM2 私钥 (Hex 格式，64位十六进制)</div>
        <el-input v-model="privateKey" placeholder="输入 SM2 私钥（64位十六进制字符串）" />
      </div>
      <div class="option-item">
        <div class="option-label">加密模式</div>
        <el-select v-model="cipherMode" style="width:200px">
          <el-option v-for="opt in cipherModeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>密文输入 (Hex)</span>
          <el-button size="small" @click="input = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="10"
          placeholder="输入 SM2 加密后的密文（Hex格式）"
          class="mono-textarea"
        />
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
.mono-textarea { font-family: monospace; font-size: 12px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
