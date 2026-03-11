<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'
import { KEYUTIL, b64tohex } from 'jsrsasign'

const SAMPLE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD2ZGFvIlFwh/yZ
KLWmLFkKQXK8rkSgLKA1UQP99q64z+a5QBnR1WuUoY0g05AbavIzMfkMKcgMZe8W
3AGa8EaZN3UGjiKSuQWM5xdDb4CJwm5Q4Si7qvo/CBlRTq78mh0hQIpXrAhS5L8S
JnS09MNsBChaBlo7qsJQrmqWqND+S4sRmyW/XPJD3WV1TsjEvDCn+DPl5l5Ln+60
Ej0lA3rY6KI/XEV59ex6oxtf5+UfaNVArMCXro1FQAOyCHJnL3cC9rkQZQwl5V/C
Xj9dIsz7a6GYEA7rF0+v5ABL2lvedhP1qCR8/8as61jSi9jUdh7v1c8npoDnLy0U
vjcwf3MHAgMBAAECggEADM+rr7esJV5BMVqdeYj0OOxYlvjTJsLtB5pxSzILVcl5
I2grq/V50XjGC51oDPeSwcpeOvnznrj3rH1wyXtuRL/AKXmYJg1uNki634pCm1HG
IsAd5M17r99v4DtZZqxsgou4KU9lABHzGg7iYgr8qgxqZ5fp9tft2V/D1ZaXMKYR
ycrcQiRxlJG/8dyIESq6M3G9ixmHy3EygvIO/jIct6nmNEtp1hVHSI0I1ELG42n/
x8M75kKrmbYf23i2jqRlX6/nKtD6i5m99AopyhkvS5NPu1aSzdl6DSOr8uUX5vlk
F2GTgzyui6wNqVlPjrwrGk2OzSewgpoLVRTPiaInTQKBgQD7cHaM75ZknwByt50K
HlhbkzUKBQ0vvSq1yzOc/FjkOjGT3Sm/z0aua6Q+7wxmnWiLSi1w6Ys9lveRfJLd
DwwjYVSmonahxdWhNY+sjpqP8RDYs75ngsMW+tCQ/5FntZgLDert8c2fqpIKassE
IPNAqO3OqKpEj69WDP99bGAwIwKBgQD63Hs1inPbNeb9Leewxjm1ilSczcX6ebLd
2shNF5nHeQ0ve51NyBmqBwIhNpGCSqAEYXm/g5Lnk+BDHDQPElucjCFleAZYXkdU
ThFpK+hGKleH/zH+jiRj80WUMT2apn1APofG+7QJUxS4bpmieeB2W+zfhDYez+a7
69VVc75tzQKBgQC0TRIFwCxVHRuCJ56JyfbMPAQ1mie5iumckQkC0oWfqwcwI9Cz
RZxGqNOPeXWoA8oaz+dD54S8dowynGTn9clbeYjtMOTm3mlxf2n2cA/vlgrhigrI
SSFCUjrLLyiCeNp9Ws6TL+imTPcKV0gbPtGQFVLp9VKbdXliuFFhDBzxhwKBgA5g
jH8pDDLICBECjIDJG42X+/lwoaQVTXcBjvE8JQgVm/fYsc8/ZJkmBa05n2VEOZ+G
pp+fPtAe3X97IlCq0K1MKq3SDysJXDUstDq+1XUQACw/J/Ja2yMPUjGIEOvIFu2T
p9xzmIHgTRO04wE40vB1nEHDJgbmC2dBwNxA4e0RAoGBAM23zSQAsiN0WANfd/hU
UOwUQRjiuHjIEcL6D+V3pxl7F3jv/UE7QlC5lFGWtPnWO4p2kj4PsmFYgDohA/05
yOLprOcZhyOm42sugCZVdoaNYL4OPdy2Cka6Vi/yekHo8WYmX8m7rM3NwGEMQuwb
4bNPSb1aR+jJRKW5w7xpMhHJ
-----END PRIVATE KEY-----`

const input = ref('')
const output = ref('')
const privateKey = ref(SAMPLE_PRIVATE_KEY)
const inputFormat = ref('Base64')

const formatOptions = ['Base64', 'Hex']

function process() {
  try {
    if (!input.value) { output.value = ''; return }
    if (!privateKey.value.trim()) { message.warning('请输入私钥'); return }

    const privKey = KEYUTIL.getKey(privateKey.value.trim()) as any
    if (!privKey || typeof privKey.decrypt !== 'function') {
      message.error('无效的私钥格式'); return
    }

    const cipherHex = inputFormat.value === 'Base64'
      ? b64tohex(input.value.trim())
      : input.value.trim()

    output.value = privKey.decrypt(cipherHex)
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
      <div class="option-item">
        <div class="option-label">密文格式</div>
        <el-select v-model="inputFormat" style="width:100px">
          <el-option v-for="f in formatOptions" :key="f" :value="f">{{ f }}</el-option>
        </el-select>
      </div>
    </div>
    <div class="key-area">
      <div class="option-label">
        私钥 (PEM 格式)
        <el-tag color="orange" style="margin-left:8px">示例密钥（仅供测试）</el-tag>
      </div>
      <el-input type="textarea" v-model="privateKey" :rows="8" placeholder="粘贴 PEM 格式私钥" class="key-textarea" />
    </div>
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>密文输入</span>
          <el-button size="small" @click="input = ''">清除</el-button>
        </div>
        <el-input type="textarea" v-model="input" :rows="8" placeholder="输入 Base64 或 Hex 格式的密文" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>明文输出</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="8" readonly placeholder="解密结果将显示在这里" />
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
.option-label { font-size: 12px; color: #666; margin-bottom: 4px; }
.key-area { margin-bottom: 16px; }
.key-textarea { font-family: monospace; font-size: 12px; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
