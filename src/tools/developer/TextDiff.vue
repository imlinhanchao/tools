<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4 mb-2">
      <div class="flex-1">
        <div class="font-bold mb-2">原始文本 (Old)</div>
        <el-input
          v-model="oldText"
          type="textarea"
          :rows="8"
          placeholder="请输入原始文本..."
        />
      </div>
      <div class="flex-1">
        <div class="font-bold mb-2">新文本 (New)</div>
        <el-input
          v-model="newText"
          type="textarea"
          :rows="8"
          placeholder="请输入新文本..."
        />
      </div>
    </div>
    <div class="flex gap-4">
      <el-button type="primary" @click="compare">比对差异</el-button>
      <el-button @click="clear">清空</el-button>
    </div>
    
    <div v-if="diffResult.length" class="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#1f2133] p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed break-all">
      <span
        v-for="(part, i) in diffResult"
        :key="i"
        :class="{
          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': part.removed,
          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': part.added,
          'text-gray-600 dark:text-gray-400': !part.added && !part.removed
        }"
      >{{ part.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as Diff from 'diff'

const oldText = ref('')
const newText = ref('')
const diffResult = ref<Diff.Change[]>([])

function compare() {
  if (!oldText.value && !newText.value) {
    diffResult.value = []
    return
  }
  diffResult.value = Diff.diffChars(oldText.value, newText.value)
}

function clear() {
  oldText.value = ''
  newText.value = ''
  diffResult.value = []
}
</script>
