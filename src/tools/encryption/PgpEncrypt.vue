<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message, ElLoading } from 'element-plus'
import * as openpgp from 'openpgp'

const input = ref('Hello, PGP!')
const publicKey = ref('')
const output = ref('')
const loading = ref(false)

async function process() {
  try {
    if (!input.value) { output.value = ''; return }
    if (!publicKey.value.trim()) { message.warning('请输入 PGP 公钥'); return }

    loading.value = true
    const loadingInst = ElLoading.service({ text: '正在加密...', background: 'rgba(0,0,0,0.2)' })
    try {
      const pubKeyObj = await openpgp.readKey({ armoredKey: publicKey.value.trim() })
      const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: input.value }),
        encryptionKeys: pubKeyObj,
      })
      output.value = encrypted as string
    } finally {
      loadingInst.close()
      loading.value = false
    }
  } catch (e) {
    message.error(`加密失败: ${(e as Error).message}`)
    output.value = ''
    loading.value = false
  }
}

function copyOutput() {
  navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板'))
}
</script>

<template>
  <div class="tool-container">
    <div class="key-area">
      <div class="option-label">PGP 公钥 (Armored)</div>
      <el-input type="textarea" v-model="publicKey" :rows="6"
        placeholder="粘贴 PGP 公钥 (-----BEGIN PGP PUBLIC KEY BLOCK-----)"
        class="pgp-textarea"
      />
    </div>
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>明文输入</span>
          <el-button size="small" @click="input = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="10" placeholder="输入要加密的消息" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>PGP 加密消息</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="10"
          readonly
          placeholder="加密后的 PGP 消息将显示在这里"
          class="pgp-textarea"
        />
      </div>
    </div>
    <div style="margin-top:12px">
      <el-button type="primary" :loading="loading" @click="process">加密</el-button>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.key-area { margin-bottom: 16px; }
.option-label { font-size: 12px; color: #666; margin-bottom: 4px; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.pgp-textarea { font-family: monospace; font-size: 11px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
