<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage as message } from 'element-plus'

const colorPicker = ref('#1677ff')
const hexInput = ref('#1677ff')
const error = ref('')

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!result) return null
  return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
}

function rgbToCmyk(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
  return {
    c: Math.round((1 - r - k) / (1 - k) * 100),
    m: Math.round((1 - g - k) / (1 - k) * 100),
    y: Math.round((1 - b - k) / (1 - k) * 100),
    k: Math.round(k * 100),
  }
}

const colorInfo = computed(() => {
  error.value = ''
  const hex = hexInput.value.trim().replace(/^#/, '')
  const fullHex = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex
  if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
    error.value = '无效的颜色值'
    return null
  }
  const rgb = hexToRgb('#' + fullHex)!
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)
  return {
    hex: '#' + fullHex.toUpperCase(),
    hexLower: '#' + fullHex.toLowerCase(),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    r: rgb.r, g: rgb.g, b: rgb.b,
    h: hsl.h, s: hsl.s, l: hsl.l,
  }
})

watch(colorPicker, (v) => { hexInput.value = v })
watch(hexInput, (v) => {
  const clean = v.trim()
  if (/^#?[0-9a-fA-F]{6}$/.test(clean)) {
    colorPicker.value = clean.startsWith('#') ? clean : '#' + clean
  }
})

function copy(text: string) {
  navigator.clipboard.writeText(text).then(() => message.success('已复制'))
}
</script>

<template>
  <div class="tool-container">
    <div class="picker-row">
      <input type="color" v-model="colorPicker" class="native-picker" />
      <el-input v-model="hexInput" placeholder="#RRGGBB" style="max-width:200px" />
      <div class="color-preview" :style="{ background: colorInfo?.hex || '#ccc' }" />
    </div>
    <el-alert v-if="error" :title="error" type="error" show-icon style="margin-bottom:12px;max-width:400px" />

    <div v-if="colorInfo" class="formats-grid">
      <div v-for="[label, val] in [
        ['HEX (大写)', colorInfo.hex],
        ['HEX (小写)', colorInfo.hexLower],
        ['RGB', colorInfo.rgb],
        ['RGBA', colorInfo.rgba],
        ['HSL', colorInfo.hsl],
        ['HSLA', colorInfo.hsla],
        ['HSV', colorInfo.hsv],
        ['CMYK', colorInfo.cmyk],
      ]" :key="label" class="format-row">
        <span class="format-label">{{ label }}</span>
        <code class="format-value">{{ val }}</code>
        <el-button size="small" text @click="copy(val)">复制</el-button>
      </div>
    </div>

    <div v-if="colorInfo" class="sliders-section">
      <div class="slider-row">
        <span class="slider-label">R</span>
        <el-slider v-model="colorInfo.r" :min="0" :max="255" :show-tooltip="true" class="rgb-slider" style="--slider-color: #f56c6c" />
        <span class="slider-val">{{ colorInfo.r }}</span>
      </div>
      <div class="slider-row">
        <span class="slider-label">G</span>
        <el-slider v-model="colorInfo.g" :min="0" :max="255" :show-tooltip="true" class="rgb-slider" style="--slider-color: #67c23a" />
        <span class="slider-val">{{ colorInfo.g }}</span>
      </div>
      <div class="slider-row">
        <span class="slider-label">B</span>
        <el-slider v-model="colorInfo.b" :min="0" :max="255" :show-tooltip="true" class="rgb-slider" style="--slider-color: #409eff" />
        <span class="slider-val">{{ colorInfo.b }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.picker-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.native-picker { width: 48px; height: 48px; border: none; padding: 0; cursor: pointer; border-radius: 6px; }
.color-preview { width: 48px; height: 48px; border-radius: 6px; border: 1px solid #dcdfe6; }
.formats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
.format-row { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border: 1px solid #f0f0f0; border-radius: 6px; }
.format-label { font-size: 12px; color: #888; min-width: 80px; }
.format-value { flex: 1; font-family: monospace; font-size: 12px; }
.sliders-section { max-width: 480px; }
.slider-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.slider-label { width: 16px; font-weight: 600; font-size: 13px; }
.slider-val { width: 32px; text-align: right; font-size: 13px; font-family: monospace; }
:global(body.dark-mode) .format-row { border-color: #303050; }
:global(body.dark-mode) .color-preview { border-color: #303050; }
@media (max-width: 600px) { .formats-grid { grid-template-columns: 1fr; } }
</style>
