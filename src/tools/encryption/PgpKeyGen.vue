<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message, ElLoading } from 'element-plus'
import * as openpgp from 'openpgp'

const name = ref('John Doe')
const email = ref('john@example.com')
const passphrase = ref('my-passphrase')
const keyType = ref('curve25519')
const publicKey = ref('')
const privateKey = ref('')
const loading = ref(false)

const keyTypeOptions = [
  { value: 'curve25519', label: 'Curve25519 (推荐)' },
  { value: 'rsa2048', label: 'RSA 2048' },
  { value: 'rsa4096', label: 'RSA 4096' },
]

async function generate() {
  if (!name.value.trim()) { message.warning('请输入姓名'); return }
  if (!email.value.trim()) { message.warning('请输入邮箱'); return }

  loading.value = true
  const loadingInst = ElLoading.service({ text: '正在生成 PGP 密钥对，请稍候...', background: 'rgba(0,0,0,0.2)' })
  try {
    const result = await openpgp.generateKey({
      type: keyType.value === 'curve25519' ? 'ecc' : 'rsa',
      curve: keyType.value === 'curve25519' ? 'curve25519' : undefined,
      rsaBits: keyType.value === 'rsa4096' ? 4096 : 2048,
      userIDs: [{ name: name.value.trim(), email: email.value.trim() }],
      passphrase: passphrase.value || undefined,
      format: 'armored',
    } as any) as { publicKey: string; privateKey: string; revocationCertificate: string }
    publicKey.value = result.publicKey
    privateKey.value = result.privateKey
    message.success('PGP 密钥对生成成功')
  } catch (e) {
    message.error(`生成失败: ${(e as Error).message}`)
  } finally {
    loadingInst.close()
    loading.value = false
  }
}

function copyPublic() {
  navigator.clipboard.writeText(publicKey.value).then(() => message.success('公钥已复制'))
}

function copyPrivate() {
  navigator.clipboard.writeText(privateKey.value).then(() => message.success('私钥已复制'))
}
</script>

<template>
  <div class="tool-container">
    <div class="options-row">
      <div class="option-item">
        <div class="option-label">姓名</div>
        <el-input v-model="name" placeholder="输入姓名" style="width:160px" />
      </div>
      <div class="option-item">
        <div class="option-label">邮箱</div>
        <el-input v-model="email" placeholder="输入邮箱地址" style="width:200px" />
      </div>
      <div class="option-item">
        <div class="option-label">密码短语 (Passphrase)</div>
        <el-input-password v-model="passphrase" placeholder="可选，用于保护私钥" style="width:200px" />
      </div>
      <div class="option-item">
        <div class="option-label">密钥类型</div>
        <el-select v-model="keyType" style="width:180px">
          <el-option v-for="opt in keyTypeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" :loading="loading" @click="generate">生成 PGP 密钥对</el-button>
    </div>

    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>公钥 (Armored)</span>
          <el-button size="small" @click="copyPublic" :disabled="!publicKey">复制</el-button>
        </div>
        <el-input type="textarea" v-model="publicKey" :rows="14"
          readonly
          placeholder="生成的 PGP 公钥将显示在这里"
          class="pgp-textarea"
        />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>私钥 (Armored)</span>
          <el-button size="small" @click="copyPrivate" :disabled="!privateKey">复制</el-button>
        </div>
        <el-input type="textarea" v-model="privateKey" :rows="14"
          readonly
          placeholder="生成的 PGP 私钥将显示在这里"
          class="pgp-textarea"
        />
      </div>
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
.pgp-textarea { font-family: monospace; font-size: 11px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
