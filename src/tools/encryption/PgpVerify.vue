<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message, ElLoading } from 'element-plus'
import * as openpgp from 'openpgp'

const signedMessage = ref('')
const publicKey = ref('')
const verifyStatus = ref<'idle' | 'valid' | 'invalid'>('idle')
const originalMessage = ref('')
const signerInfo = ref('')
const loading = ref(false)

async function verify() {
  try {
    if (!signedMessage.value.trim()) { message.warning('请输入已签名的 PGP 消息'); return }
    if (!publicKey.value.trim()) { message.warning('请输入 PGP 公钥'); return }

    loading.value = true
    verifyStatus.value = 'idle'
    signerInfo.value = ''
    const loadingInst = ElLoading.service({ text: '正在验证签名...', background: 'rgba(0,0,0,0.2)' })
    try {
      const pubKeyObj = await openpgp.readKey({ armoredKey: publicKey.value.trim() })
      const msg = await openpgp.readMessage({ armoredMessage: signedMessage.value.trim() })
      const { data, signatures } = await openpgp.verify({
        message: msg,
        verificationKeys: pubKeyObj,
      })

      originalMessage.value = data as string

      if (signatures.length === 0) {
        verifyStatus.value = 'invalid'
        signerInfo.value = '未找到签名'
        return
      }

      const sig = signatures[0]
      try {
        await sig.verified
        verifyStatus.value = 'valid'
        const keyID = sig.keyID.toHex()
        signerInfo.value = `签名密钥 ID: ${keyID}`
      } catch {
        verifyStatus.value = 'invalid'
        signerInfo.value = '签名与提供的公钥不匹配'
      }
    } finally {
      loadingInst.close()
      loading.value = false
    }
  } catch (e) {
    message.error(`验证失败: ${(e as Error).message}`)
    verifyStatus.value = 'invalid'
    loading.value = false
  }
}

function copyMessage() {
  navigator.clipboard.writeText(originalMessage.value).then(() => message.success('已复制到剪贴板'))
}
</script>

<template>
  <div class="tool-container">
    <div class="key-area" style="margin-bottom:16px">
      <div class="option-label">PGP 公钥 (Armored)</div>
      <el-input type="textarea" v-model="publicKey" :rows="6"
        placeholder="粘贴 PGP 公钥 (-----BEGIN PGP PUBLIC KEY BLOCK-----)"
        class="pgp-textarea"
      />
    </div>
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>已签名消息 (Armored)</span>
          <el-button size="small" @click="signedMessage = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="signedMessage" :rows="12"
          placeholder="粘贴 PGP 签名消息 (-----BEGIN PGP MESSAGE-----)"
          class="pgp-textarea"
        />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>原始消息</span>
          <el-button size="small" @click="copyMessage" :disabled="!originalMessage">复制</el-button>
        </div>
        <el-input type="textarea" v-model="originalMessage" :rows="12" readonly placeholder="验证通过后原始消息将显示在这里" />
      </div>
    </div>
    <div style="margin-top:12px">
      <el-button type="primary" :loading="loading" @click="verify">验证签名</el-button>
    </div>
    <div v-if="verifyStatus !== 'idle'" style="margin-top:12px">
      <el-alert
        :type="verifyStatus === 'valid' ? 'success' : 'error'"
        :message="verifyStatus === 'valid' ? '✓ 签名验证通过' : '✗ 签名验证失败'"
        :description="signerInfo"
        show-icon
      />
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.key-area { display: flex; flex-direction: column; gap: 4px; }
.option-label { font-size: 12px; color: #666; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.pgp-textarea { font-family: monospace; font-size: 11px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
