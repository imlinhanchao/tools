<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message, ElLoading } from 'element-plus'
import { KEYUTIL } from 'jsrsasign'

const keySize = ref(2048)
const publicKey = ref('')
const privateKey = ref('')
const loading = ref(false)

const keySizeOptions = [1024, 2048, 4096]

async function generate() {
  loading.value = true
  const loadingInst = ElLoading.service({ text: '正在生成密钥对，请稍候...', background: 'rgba(0,0,0,0.2)' })
  try {
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          const kp = KEYUTIL.generateKeypair('RSA', keySize.value)
          publicKey.value = KEYUTIL.getPEM(kp.pubKeyObj)
          privateKey.value = KEYUTIL.getPEM(kp.prvKeyObj, 'PKCS8PRV')
          resolve()
        } catch (e) {
          reject(e)
        }
      }, 50)
    })
    message.success('密钥对生成成功')
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
        <div class="option-label">密钥长度</div>
        <el-select v-model="keySize" style="width:120px">
          <el-option v-for="s in keySizeOptions" :key="s" :value="s">{{ s }} 位</el-option>
        </el-select>
      </div>
      <el-button type="primary" :loading="loading" @click="generate">生成密钥对</el-button>
    </div>

    <el-alert
      v-if="keySize === 4096"
      message="4096 位密钥生成可能需要较长时间（30-60秒），请耐心等待"
      type="warning"
      show-icon
      style="margin-bottom:16px"
    />

    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>公钥</span>
          <el-button size="small" @click="copyPublic" :disabled="!publicKey">复制</el-button>
        </div>
        <el-input type="textarea" v-model="publicKey" :rows="12"
          readonly
          placeholder="生成的公钥将显示在这里"
          class="key-textarea"
        />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>私钥</span>
          <el-button size="small" @click="copyPrivate" :disabled="!privateKey">复制</el-button>
        </div>
        <el-input type="textarea" v-model="privateKey" :rows="12"
          readonly
          placeholder="生成的私钥将显示在这里"
          class="key-textarea"
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
.key-textarea { font-family: monospace; font-size: 12px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
