<template>
  <div class="flex flex-col gap-6">
    <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative" @click="triggerInput">
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        accept="image/*"
        @change="handleFileUpload"
      />
      <div v-if="!imageUrl" class="flex flex-col items-center justify-center text-gray-500">
        <Icon icon="ep:upload-filled" class="text-4xl mb-2 text-gray-400" />
        <p>点击或拖拽图片到此处进行二维码解析</p>
      </div>
      <div v-else class="flex flex-col items-center justify-center">
        <img :src="imageUrl" alt="Uploaded Image" class="max-h-[200px] object-contain rounded shadow-sm mb-4" />
        <el-button @click.stop="clearImage" size="small">清除图片</el-button>
      </div>
    </div>

    <div v-if="decodeResult !== null">
      <div class="font-bold mb-2">解析结果:</div>
      <el-alert
        v-if="decodeResult === ''"
        title="未能识别出二维码"
        type="warning"
        :closable="false"
        show-icon
      />
      <el-input
        v-else
        v-model="decodeResult"
        type="textarea"
        :rows="4"
        readonly
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import jsQR from 'jsqr'
import { Icon } from '@iconify/vue'

const fileInput = ref<HTMLInputElement | null>(null)
const imageUrl = ref('')
const decodeResult = ref<string | null>(null)

function triggerInput() {
  fileInput.value?.click()
}

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string
    decodeImage(imageUrl.value)
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  imageUrl.value = ''
  decodeResult.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function decodeImage(src: string) {
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      decodeResult.value = 'Canvas not supported'
      return
    }
    
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0, img.width, img.height)
    
    const imageData = ctx.getImageData(0, 0, img.width, img.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    
    if (code) {
      decodeResult.value = code.data
    } else {
      decodeResult.value = ''
    }
  }
  img.src = src
}
</script>
