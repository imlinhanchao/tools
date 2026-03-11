<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'
import smCrypto from 'sm-crypto'

const { sm2 } = smCrypto

const input = ref('Hello, SM2!')
const output = ref('')
const publicKey = ref('')
const cipherMode = ref(1)

const cipherModeOptions = [
  { value: 1, label: 'C1C3C2 (模式1, 推荐)' },
  { value: 0, label: 'C1C2C3 (模式0)' },
]

function generateSampleKey() {
  try {
    const keypair = sm2.generateKeyPairHex()
    publicKey.value = keypair.publicKey
    message.success('已生成示例公钥，请妥善保存对应私钥')
  } catch (e) {
    message.error(`生成失败: ${(e as Error).message}`)
  }
}

function process() {
  try {
    if (!input.value) { output.value = ''; return }
    if (!publicKey.value.trim()) { message.warning('请输入 SM2 公钥'); return }

    const encryptedHex = sm2.doEncrypt(input.value, publicKey.value.trim(), cipherMode.value)
    output.value = encryptedHex
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
      <div class="option-item" style="flex:1; min-width:300px">
        <div class="option-label">
          SM2 公钥 (Hex 格式，以 04 开头)
          <el-tag color="blue" style="margin-left:8px; cursor:pointer" @click="generateSampleKey">
            生成示例密钥对
          </el-tag>
        </div>
        <el-input v-model="publicKey" placeholder="输入 SM2 公钥（130位十六进制字符串，04开头）" />
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
          <span>明文输入</span>
          <el-button size="small" @click="input = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="10" placeholder="输入要加密的文本" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>密文输出 (Hex)</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="10"
          readonly
          placeholder="加密结果将显示在这里（Hex格式）"
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
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
