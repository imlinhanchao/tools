import { defineConfig, presetUno, presetAttributify, presetIcons, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons()
  ],
  transformers: [
    transformerVariantGroup()
  ]
})