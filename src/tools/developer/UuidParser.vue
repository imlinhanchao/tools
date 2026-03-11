<script setup lang="ts">
import { ref, computed } from 'vue'
import { parse as uuidParse, version as uuidVersion, validate as uuidValidate } from 'uuid'

const input = ref('550e8400-e29b-41d4-a716-446655440000')

interface UuidInfo {
  valid: boolean
  version?: number
  variant?: string
  timestamp?: string
  clockSeq?: string
  node?: string
}

const info = computed<UuidInfo>(() => {
  const uuid = input.value.trim().toLowerCase()
  if (!uuid) return { valid: false }
  if (!uuidValidate(uuid)) return { valid: false }

  const ver = uuidVersion(uuid)
  const result: UuidInfo = { valid: true, version: ver }

  // Variant
  const parts = uuid.split('-')
  const variantByte = parseInt(parts[3].slice(0, 2), 16)
  if ((variantByte & 0x80) === 0) result.variant = 'NCS backward compatibility'
  else if ((variantByte & 0xc0) === 0x80) result.variant = 'RFC 4122 / ITU-T X.667'
  else if ((variantByte & 0xe0) === 0xc0) result.variant = 'Microsoft backward compatibility'
  else result.variant = 'Reserved'

  if (ver === 1) {
    // Extract timestamp from UUID v1
    const timeLow = parts[0]
    const timeMid = parts[1]
    const timeHigh = parts[2].slice(1) // remove version nibble
    const timeHex = timeHigh + timeMid + timeLow
    const timeInt = BigInt('0x' + timeHex)
    // UUID v1 epoch: Oct 15, 1582
    const uuidEpoch = BigInt('122192928000000000')
    const unixNs = (timeInt - uuidEpoch) * BigInt(100)
    const ms = Number(unixNs / BigInt(1000000))
    result.timestamp = new Date(ms).toISOString()
    result.clockSeq = parseInt(parts[3], 16).toString()
    result.node = parts[4]
  }

  return result
})
</script>

<template>
  <div class="tool-container">
    <div class="input-row">
      <el-input v-model="input" placeholder="请输入UUID..." clearable />
    </div>

    <div v-if="input.trim()" class="result-card">
      <div v-if="!info.valid" class="invalid-badge">
        <el-tag type="danger">无效的 UUID</el-tag>
      </div>
      <template v-else>
        <el-tag type="success" style="margin-bottom:16px">有效的 UUID</el-tag>
        <table class="info-table">
          <tr>
            <td class="label">UUID</td>
            <td class="value mono">{{ input.trim().toLowerCase() }}</td>
          </tr>
          <tr>
            <td class="label">版本</td>
            <td class="value">UUID v{{ info.version }}</td>
          </tr>
          <tr>
            <td class="label">变体</td>
            <td class="value">{{ info.variant }}</td>
          </tr>
          <tr v-if="info.timestamp">
            <td class="label">时间戳</td>
            <td class="value">{{ info.timestamp }}</td>
          </tr>
          <tr v-if="info.clockSeq">
            <td class="label">时钟序列</td>
            <td class="value mono">{{ info.clockSeq }}</td>
          </tr>
          <tr v-if="info.node">
            <td class="label">节点（MAC）</td>
            <td class="value mono">{{ info.node }}</td>
          </tr>
        </table>
      </template>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; max-width: 640px; }
.input-row { margin-bottom: 20px; }
.result-card { border: 1px solid #dcdfe6; border-radius: 8px; padding: 20px; }
.invalid-badge { text-align: center; padding: 20px; }
.info-table { width: 100%; border-collapse: collapse; }
.info-table tr { border-bottom: 1px solid #f0f0f0; }
.info-table tr:last-child { border-bottom: none; }
.label { padding: 10px 0; color: #888; font-size: 13px; width: 120px; }
.value { padding: 10px 0; font-size: 13px; }
.mono { font-family: monospace; }
:global(body.dark-mode) .result-card { border-color: #303050; }
:global(body.dark-mode) .info-table tr { border-bottom-color: #303050; }
</style>
