<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message, ElLoading } from 'element-plus'
import * as openpgp from 'openpgp'

const input = ref('Hello, this message will be signed!')
const privateKey = ref('')
const passphrase = ref('')
const output = ref('')
const loading = ref(false)

async function process() {
  try {
    if (!input.value) { output.value = ''; return }
    if (!privateKey.value.trim()) { message.warning('请输入 PGP 私钥'); return }

    loading.value = true
    const loadingInst = ElLoading.service({ text: '正在签名...', background: 'rgba(0,0,0,0.2)' })
    try {
      const privKeyObj = await openpgp.readPrivateKey({ armoredKey: privateKey.value.trim() })
      const signingKey = passphrase.value
        ? await openpgp.decryptKey({ privateKey: privKeyObj, passphrase: passphrase.value })
        : privKeyObj

      const signed = await openpgp.sign({
        message: await openpgp.createMessage({ text: input.value }),
        signingKeys: signingKey,
      })
      output.value = signed as string
    } finally {
      loadingInst.close()
      loading.value = false
    }
  } catch (e) {
    message.error(`签名失败: ${(e as Error).message}`)
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
    <div class="key-row">
      <div class="key-area" style="flex:1">
        <div class="option-label">PGP 私钥 (Armored)</div>
        <el-input type="textarea" v-model="privateKey" :rows="6"
          placeholder="粘贴 PGP 私钥 (-----BEGIN PGP PRIVATE KEY BLOCK-----)"
          class="pgp-textarea"
        />
      </div>
      <div class="key-area" style="width:200px">
        <div class="option-label">密码短语 (Passphrase)</div>
        <el-input-password v-model="passphrase" placeholder="私钥密码（如有）" />
      </div>
    </div>
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>待签名消息</span>
          <el-button size="small" @click="input = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="10" placeholder="输入要签名的消息" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>签名后消息 (Armored)</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="10"
          readonly
          placeholder="签名后的 PGP 消息将显示在这里"
          class="pgp-textarea"
        />
      </div>
    </div>
    <div style="margin-top:12px">
      <el-button type="primary" :loading="loading" @click="process">签名</el-button>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.key-row { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; align-items: flex-start; }
.key-area { display: flex; flex-direction: column; gap: 4px; }
.option-label { font-size: 12px; color: #666; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.pgp-textarea { font-family: monospace; font-size: 11px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
