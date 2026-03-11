<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 flex flex-col gap-2">
        <div class="font-bold">中文输入</div>
        <el-input
          v-model="input"
          type="textarea"
          :rows="6"
          placeholder="请输入汉字..."
        />
        
        <div class="flex gap-4 mt-2 mb-2 items-center flex-wrap">
          <el-radio-group v-model="toneType" size="small">
            <el-radio-button value="symbol">拼音+音调符</el-radio-button>
            <el-radio-button value="num">拼音+数字</el-radio-button>
            <el-radio-button value="none">无音调</el-radio-button>
          </el-radio-group>
          
          <el-checkbox v-model="typeEmpty">保留非汉字字符</el-checkbox>
        </div>
      </div>
      
      <div class="flex-1 flex flex-col gap-2">
        <div class="font-bold">拼音输出</div>
        <el-input
          v-model="output"
          type="textarea"
          :rows="6"
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { pinyin } from 'pinyin-pro'

const input = ref('')
const output = ref('')
const toneType = ref<'symbol'|'num'|'none'>('symbol')
const typeEmpty = ref(false)

watch([input, toneType, typeEmpty], () => {
  if (!input.value) {
    output.value = ''
    return
  }
  
  output.value = pinyin(input.value, {
    toneType: toneType.value,
    type: 'string',
    nonZh: typeEmpty.value ? 'consecutive' : 'removed'
  }) as string
}, { immediate: true })
</script>
