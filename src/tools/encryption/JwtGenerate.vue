<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage as message } from 'element-plus'
import { KJUR, KEYUTIL } from 'jsrsasign'

const algorithm = ref('HS256')
const secret = ref('mySecretKey')
const headerJson = ref('{"alg":"HS256","typ":"JWT"}')
const payloadJson = ref('{"sub":"1234567890","name":"John Doe","iat":1516239022}')
const output = ref('')

const algOptions = ['HS256', 'HS384', 'HS512', 'RS256']

watch(algorithm, (alg) => {
  try {
    const h = JSON.parse(headerJson.value)
    h.alg = alg
    headerJson.value = JSON.stringify(h, null, 2)
  } catch { /* ignore parse error */ }
})

function process() {
  try {
    const header = JSON.parse(headerJson.value)
    const payload = JSON.parse(payloadJson.value)

    let key: unknown
    if (algorithm.value.startsWith('HS')) {
      key = { utf8: secret.value }
    } else {
      // RS256: treat secret as private key PEM
      key = KEYUTIL.getKey(secret.value)
    }

    output.value = KJUR.jws.JWS.sign(
      null,
      JSON.stringify(header),
      JSON.stringify(payload),
      key as any,
    )
  } catch (e) {
    message.error(`生成失败: ${(e as Error).message}`)
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
        <div class="option-label">算法</div>
        <el-select v-model="algorithm" style="width:120px">
          <el-option v-for="a in algOptions" :key="a" :value="a">{{ a }}</el-option>
        </el-select>
      </div>
      <div class="option-item" style="flex:1; min-width:200px">
        <div class="option-label">
          {{ algorithm.startsWith('HS') ? '密钥 (Secret)' : '私钥 (Private Key PEM)' }}
        </div>
        <el-input
          v-if="algorithm.startsWith('HS')"
          v-model="secret"
          placeholder="输入 HMAC 密钥"
        />
        <a-textarea
          v-else
          v-model="secret"
          :rows="4"
          placeholder="粘贴 RSA 私钥 PEM"
          class="key-textarea"
        />
      </div>
    </div>
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header"><span>Header (JSON)</span></div>
        <el-input type="textarea" v-model="headerJson" :rows="5" placeholder='{"alg":"HS256","typ":"JWT"}' class="code-textarea" />
      </div>
      <div class="io-panel">
        <div class="panel-header"><span>Payload (JSON)</span></div>
        <el-input type="textarea" v-model="payloadJson" :rows="5" placeholder='{"sub":"1234567890"}' class="code-textarea" />
      </div>
    </div>
    <div style="margin-top:12px">
      <el-button type="primary" @click="process">生成 JWT</el-button>
    </div>
    <div v-if="output" class="output-area">
      <div class="panel-header" style="margin-bottom:8px">
        <span>JWT Token</span>
        <el-button size="small" @click="copyOutput">复制</el-button>
      </div>
      <el-input type="textarea" v-model="output" :rows="4" readonly class="code-textarea" />
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.options-row { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; align-items: flex-start; }
.option-item { display: flex; flex-direction: column; gap: 4px; }
.option-label { font-size: 12px; color: #666; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.output-area { margin-top: 16px; }
.code-textarea { font-family: monospace; font-size: 12px; }
.key-textarea { font-family: monospace; font-size: 12px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
