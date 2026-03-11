<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage as message } from 'element-plus'
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'

const version = ref<'v1' | 'v4'>('v4')
const count = ref(5)
const uppercase = ref(false)
const noDashes = ref(false)
const uuids = ref<string[]>([])

function format(u: string) {
  let r = u
  if (uppercase.value) r = r.toUpperCase()
  if (noDashes.value) r = r.replace(/-/g, '')
  return r
}

function generate() {
  uuids.value = Array.from({ length: count.value }, () =>
    format(version.value === 'v1' ? uuidv1() : uuidv4())
  )
}

function copyAll() {
  navigator.clipboard.writeText(uuids.value.join('\n')).then(() => message.success('已复制全部'))
}

function copyOne(u: string) {
  navigator.clipboard.writeText(u).then(() => message.success('已复制'))
}

generate()
</script>

<template>
  <div class="tool-container">
    <div class="options-row">
      <div class="option-group">
        <span>版本：</span>
        <el-radio-group v-model="version" @change="generate">
          <el-radio-button value="v4">UUID v4（随机）</el-radio-button>
          <el-radio-button value="v1">UUID v1（时间戳）</el-radio-button>
        </el-radio-group>
      </div>
      <div class="option-group">
        <span>数量：</span>
        <el-input-number v-model="count" :min="1" :max="100" @change="generate" style="width:120px" />
      </div>
      <div class="option-group">
        <el-checkbox v-model="uppercase" @change="generate">大写</el-checkbox>
        <el-checkbox v-model="noDashes" @change="generate">去除连字符</el-checkbox>
      </div>
    </div>

    <div class="uuid-actions">
      <el-button type="primary" @click="generate">重新生成</el-button>
      <el-button @click="copyAll">复制全部</el-button>
    </div>

    <div class="uuid-list">
      <div v-for="(u, i) in uuids" :key="i" class="uuid-item">
        <span class="uuid-text">{{ u }}</span>
        <el-button size="small" text @click="copyOne(u)">复制</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.options-row { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 16px; }
.option-group { display: flex; align-items: center; gap: 8px; }
.uuid-actions { margin-bottom: 16px; display: flex; gap: 8px; }
.uuid-list { border: 1px solid #dcdfe6; border-radius: 6px; overflow: hidden; }
.uuid-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid #f0f0f0; }
.uuid-item:last-child { border-bottom: none; }
.uuid-text { font-family: monospace; font-size: 13px; letter-spacing: 0.5px; }
:global(body.dark-mode) .uuid-list { border-color: #303050; }
:global(body.dark-mode) .uuid-item { border-bottom-color: #303050; }
</style>
