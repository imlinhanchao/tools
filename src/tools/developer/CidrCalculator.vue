<script setup lang="ts">
import { ref, computed } from 'vue'

const cidr = ref('192.168.1.0/24')
const error = ref('')

interface CidrInfo {
  network: string
  broadcast: string
  mask: string
  wildcard: string
  firstHost: string
  lastHost: string
  totalHosts: number
  usableHosts: number
  prefix: number
  ipClass: string
  isPrivate: boolean
}

function ipToNum(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0
}

function numToIp(n: number): string {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join('.')
}

const result = computed<CidrInfo | null>(() => {
  error.value = ''
  const input = cidr.value.trim()
  if (!input) return null
  try {
    const [ip, prefixStr] = input.split('/')
    if (!ip || !prefixStr) throw new Error('格式错误，请输入如: 192.168.1.0/24')
    const prefix = parseInt(prefixStr)
    if (isNaN(prefix) || prefix < 0 || prefix > 32) throw new Error('子网前缀长度必须在 0-32 之间')
    const octets = ip.split('.')
    if (octets.length !== 4 || octets.some(o => isNaN(parseInt(o)) || parseInt(o) < 0 || parseInt(o) > 255)) {
      throw new Error('无效的 IP 地址')
    }

    const maskNum = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0
    const ipNum = ipToNum(ip)
    const networkNum = (ipNum & maskNum) >>> 0
    const broadcastNum = (networkNum | ~maskNum) >>> 0
    const firstHost = prefix < 31 ? numToIp(networkNum + 1) : numToIp(networkNum)
    const lastHost = prefix < 31 ? numToIp(broadcastNum - 1) : numToIp(broadcastNum)
    const totalHosts = Math.pow(2, 32 - prefix)
    const usableHosts = prefix < 31 ? totalHosts - 2 : totalHosts

    // IP class
    const firstOctet = ipNum >>> 24
    let ipClass = 'E'
    if (firstOctet < 128) ipClass = 'A'
    else if (firstOctet < 192) ipClass = 'B'
    else if (firstOctet < 224) ipClass = 'C'
    else if (firstOctet < 240) ipClass = 'D'

    // Private IP check
    const isPrivate = (
      (ipNum >= ipToNum('10.0.0.0') && ipNum <= ipToNum('10.255.255.255')) ||
      (ipNum >= ipToNum('172.16.0.0') && ipNum <= ipToNum('172.31.255.255')) ||
      (ipNum >= ipToNum('192.168.0.0') && ipNum <= ipToNum('192.168.255.255'))
    )

    return {
      network: numToIp(networkNum),
      broadcast: numToIp(broadcastNum),
      mask: numToIp(maskNum),
      wildcard: numToIp(~maskNum >>> 0),
      firstHost,
      lastHost,
      totalHosts,
      usableHosts,
      prefix,
      ipClass,
      isPrivate,
    }
  } catch (e: any) {
    error.value = e.message
    return null
  }
})

const rows = computed(() => {
  if (!result.value) return []
  const r = result.value
  return [
    ['网络地址', r.network],
    ['广播地址', r.broadcast],
    ['子网掩码', r.mask],
    ['通配符掩码', r.wildcard],
    ['可用首地址', r.firstHost],
    ['可用末地址', r.lastHost],
    ['总 IP 数量', r.totalHosts.toLocaleString()],
    ['可用主机数', r.usableHosts.toLocaleString()],
    ['前缀长度', `/${r.prefix}`],
    ['IP 类型', `${r.ipClass} 类`],
    ['私有地址', r.isPrivate ? '是' : '否'],
  ]
})
</script>

<template>
  <div class="tool-container">
    <div class="input-row">
      <el-input v-model="cidr" placeholder="如: 192.168.1.0/24" clearable style="max-width:300px" @input="() => {}" />
    </div>
    <el-alert v-if="error" :title="error" type="error" show-icon style="margin-bottom:12px" />

    <table v-if="result" class="result-table">
      <tr v-for="[label, val] in rows" :key="label">
        <td class="label">{{ label }}</td>
        <td class="value mono">{{ val }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; max-width: 560px; }
.input-row { margin-bottom: 16px; }
.result-table { width: 100%; border-collapse: collapse; border: 1px solid #dcdfe6; border-radius: 8px; overflow: hidden; }
.result-table tr { border-bottom: 1px solid #f0f0f0; }
.result-table tr:last-child { border-bottom: none; }
.result-table tr:nth-child(even) { background: #fafafa; }
.label { padding: 10px 16px; color: #888; font-size: 13px; width: 140px; }
.value { padding: 10px 16px; font-size: 13px; }
.mono { font-family: monospace; }
:global(body.dark-mode) .result-table { border-color: #303050; }
:global(body.dark-mode) .result-table tr { border-bottom-color: #303050; }
:global(body.dark-mode) .result-table tr:nth-child(even) { background: #1a1f2e; }
</style>
