<template>
  <div class="flex flex-col md:flex-row gap-6">
    <!-- Config -->
    <div class="flex-1 flex flex-col gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">内容 / 链接</label>
        <el-input
          v-model="content"
          type="textarea"
          :rows="4"
          placeholder="请输入生成二维码的内容..."
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">纠错等级</label>
          <el-select v-model="errorCorrectionLevel" class="w-full">
            <el-option label="L (低 - 7%)" value="L" />
            <el-option label="M (中 - 15%)" value="M" />
            <el-option label="Q (高 - 25%)" value="Q" />
            <el-option label="H (最高 - 30%)" value="H" />
          </el-select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">边距 (Margin)</label>
          <el-input-number v-model="margin" :min="0" :max="10" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">前景色 (暗部)</label>
          <el-color-picker v-model="colorDark" show-alpha />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">背景色 (亮部)</label>
          <el-color-picker v-model="colorLight" show-alpha />
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div class="md:w-1/3 flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-black/20">
      <div v-if="!content" class="text-gray-400 text-sm">请输入内容生成二维码</div>
      <div v-else class="flex flex-col items-center gap-4">
        <img :src="qrcodeDataUrl" alt="QR Code" v-if="qrcodeDataUrl" class="max-w-[200px] w-full rounded shadow-sm bg-white" />
        <el-button type="primary" @click="download" :disabled="!qrcodeDataUrl">下载图片</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import QRCode from 'qrcode'

const content = ref('https://github.com')
const errorCorrectionLevel = ref<'L' | 'M' | 'Q' | 'H'>('M')
const margin = ref(4)
const colorDark = ref('#000000ff')
const colorLight = ref('#ffffffff')

const qrcodeDataUrl = ref('')

async function generate() {
  if (!content.value) {
    qrcodeDataUrl.value = ''
    return
  }
  
  try {
    qrcodeDataUrl.value = await QRCode.toDataURL(content.value, {
      errorCorrectionLevel: errorCorrectionLevel.value,
      margin: margin.value,
      color: {
        dark: colorDark.value,
        light: colorLight.value
      }
    })
  } catch (error) {
    console.error(error)
  }
}

watch([content, errorCorrectionLevel, margin, colorDark, colorLight], generate, { immediate: true })

function download() {
  if (!qrcodeDataUrl.value) return
  const a = document.createElement('a')
  a.href = qrcodeDataUrl.value
  a.download = `qrcode_${Date.now()}.png`
  a.click()
}
</script>
