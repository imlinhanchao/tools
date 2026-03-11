<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'
import { KJUR, KEYUTIL } from 'jsrsasign'

const token = ref('')
const secret = ref('')
const algorithm = ref('HS256')
const decodedHeader = ref('')
const decodedPayload = ref('')
const verifyResult = ref<null | boolean>(null)
const expiryStatus = ref('')

const algOptions = ['HS256', 'HS384', 'HS512', 'RS256']

function decode() {
  try {
    if (!token.value.trim()) {
      decodedHeader.value = ''
      decodedPayload.value = ''
      verifyResult.value = null
      expiryStatus.value = ''
      return
    }

    const parsed = KJUR.jws.JWS.parse(token.value.trim())
    decodedHeader.value = JSON.stringify(parsed.headerObj, null, 2)
    decodedPayload.value = JSON.stringify(parsed.payloadObj, null, 2)

    // Check expiry
    const payload = parsed.payloadObj as Record<string, unknown>
    if (payload.exp) {
      const exp = Number(payload.exp)
      const now = Math.floor(Date.now() / 1000)
      if (exp < now) {
        expiryStatus.value = `已过期（${new Date(exp * 1000).toLocaleString()}）`
      } else {
        expiryStatus.value = `有效期至 ${new Date(exp * 1000).toLocaleString()}`
      }
    } else {
      expiryStatus.value = '无过期时间'
    }

    verifyResult.value = null
  } catch (e) {
    message.error(`解析失败: ${(e as Error).message}`)
  }
}

function verify() {
  try {
    if (!token.value.trim()) { message.warning('请先输入 JWT Token'); return }
    if (!secret.value) { message.warning('请输入密钥以验证签名'); return }

    let key: unknown
    if (algorithm.value.startsWith('HS')) {
      key = { utf8: secret.value }
    } else {
      key = KEYUTIL.getKey(secret.value)
    }

    verifyResult.value = KJUR.jws.JWS.verifyJWT(
      token.value.trim(),
      key as any,
      { alg: [algorithm.value] },
    )
  } catch (e) {
    message.error(`验证失败: ${(e as Error).message}`)
    verifyResult.value = false
  }
}
</script>

<template>
  <div class="tool-container">
    <div class="token-area">
      <div class="panel-header" style="margin-bottom:8px">
        <span>JWT Token</span>
        <el-button size="small" @click="token = ''; decode()">清除</el-button>
      </div>
      <el-input type="textarea" v-model="token" :rows="4"
        placeholder="粘贴 JWT token 以解析..."
        class="code-textarea"
        @change="decode"
      />
    </div>

    <div class="io-grid" style="margin-top:16px">
      <div class="io-panel">
        <div class="panel-header"><span>Header</span></div>
        <el-input type="textarea" v-model="decodedHeader" :rows="5" readonly class="code-textarea" placeholder="Header 将显示在这里" />
      </div>
      <div class="io-panel">
        <div class="panel-header"><span>Payload</span></div>
        <el-input type="textarea" v-model="decodedPayload" :rows="5" readonly class="code-textarea" placeholder="Payload 将显示在这里" />
      </div>
    </div>

    <div v-if="expiryStatus" class="status-row" style="margin-top:12px">
      <el-tag :color="expiryStatus.startsWith('已过期') ? 'red' : 'green'">
        ⏱ {{ expiryStatus }}
      </el-tag>
    </div>

    <el-divider>签名验证</el-divider>
    <div class="options-row">
      <div class="option-item">
        <div class="option-label">算法</div>
        <el-select v-model="algorithm" style="width:120px">
          <el-option v-for="a in algOptions" :key="a" :value="a">{{ a }}</el-option>
        </el-select>
      </div>
      <div class="option-item" style="flex:1; min-width:200px">
        <div class="option-label">
          {{ algorithm.startsWith('HS') ? '密钥 (Secret)' : '公钥 (Public Key PEM)' }}
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
          placeholder="粘贴 RSA 公钥 PEM"
          class="key-textarea"
        />
      </div>
      <div class="option-item" style="align-self:flex-end">
        <el-button type="primary" @click="verify">验证签名</el-button>
      </div>
    </div>

    <div v-if="verifyResult !== null" style="margin-top:12px">
      <el-alert
        :type="verifyResult ? 'success' : 'error'"
        :message="verifyResult ? '✓ 签名验证通过' : '✗ 签名验证失败'"
        show-icon
      />
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.token-area { }
.options-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-start; }
.option-item { display: flex; flex-direction: column; gap: 4px; }
.option-label { font-size: 12px; color: #666; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.code-textarea { font-family: monospace; font-size: 12px; }
.key-textarea { font-family: monospace; font-size: 12px; }
.status-row { display: flex; gap: 8px; flex-wrap: wrap; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
