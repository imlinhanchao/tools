<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'
import { KEYUTIL } from 'jsrsasign'

const input = ref('')
const output = ref('')

function process() {
  try {
    if (!input.value.trim()) { output.value = ''; return }

    // Extract public key from private key using jsrsasign
    const prvKey = KEYUTIL.getKey(input.value.trim()) as any
    if (!prvKey) { message.error('无法解析私钥'); return }

    // Get the public key object from the private key, then export as PEM
    const pubKey = KEYUTIL.getKey({ n: prvKey.n, e: prvKey.e })
    output.value = KEYUTIL.getPEM(pubKey)
  } catch (e) {
    message.error(`提取失败: ${(e as Error).message}`)
    output.value = ''
  }
}

function copyOutput() {
  navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板'))
}
</script>

<template>
  <div class="tool-container">
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>私钥输入 (PEM 格式)</span>
          <el-button size="small" @click="input = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="14"
          placeholder="粘贴 PKCS#1 或 PKCS#8 格式的 RSA 私钥"
          class="key-textarea"
        />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>公钥输出 (PEM 格式)</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="14"
          readonly
          placeholder="从私钥提取的公钥将显示在这里"
          class="key-textarea"
        />
      </div>
    </div>
    <div style="margin-top:12px">
      <el-button type="primary" @click="process">提取公钥</el-button>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.key-textarea { font-family: monospace; font-size: 12px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
