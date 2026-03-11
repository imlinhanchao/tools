<template>
  <Layout>
    <div class="p-4 md:p-6 max-w-[1400px] mx-auto">
      <!-- Hero -->
      <div class="text-center px-4 md:px-8 pt-12 md:pt-16 pb-8 md:pb-12 bg-white rounded-3xl shadow-sm mb-10 dark:bg-[#1A1D24] border border-gray-100 dark:border-white/5 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-transparent dark:from-blue-900/10 dark:via-purple-900/10"></div>
        <div class="relative z-10">
          <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 m-0 mb-4 tracking-tight dark:text-white">在线工具箱</h1>
          <p class="text-base md:text-lg text-gray-500 m-0 mb-8 dark:text-gray-400">集成 {{ allTools.length }}+ 实用开发工具，无需安装，高效便捷</p>
          <div class="max-w-[600px] mx-auto overflow-hidden shadow-lg shadow-blue-500/5 rounded-2xl transition-shadow hover:shadow-xl dark:shadow-none">
            <el-input
              v-model="searchQuery"
              placeholder="搜索需要的工具，如 Base64、JSON 格式化..."
              size="large"
              clearable
              :prefix-icon="SearchIcon"
              @input="onSearch"
              class="!rounded-2xl border-none"
            />
          </div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="mb-2" v-if="!searchQuery.trim()">
        <el-tabs v-model="activeCategory">
          <el-tab-pane label="全部" name="all" />
          <el-tab-pane label="收藏" name="favorites">
            <template #label>
              <div class="flex items-center gap-1">
                <Icon icon="ep:star" />
                <span>收藏</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane
            v-for="cat in categories"
            :key="cat.id"
            :label="cat.name"
            :name="cat.id"
          />
        </el-tabs>
      </div>

      <!-- Search results hint -->
      <div v-if="searchQuery.trim()" class="flex items-center gap-2 mb-4 text-[#666] text-[13px]">
        <span>找到 {{ displayedTools.length }} 个相关工具</span>
        <el-button link size="small" @click="searchQuery = ''">清除搜索</el-button>
      </div>

      <!-- Tool Grid - single category or search -->
      <template v-if="searchQuery.trim() || activeCategory !== 'all'">
        <div class="mb-8" v-if="displayedTools.length > 0">
          <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            <ToolCard
              v-for="tool in displayedTools"
              :key="tool.id"
              :tool="tool"
            />
          </div>
        </div>
        <div v-else class="text-center py-15">
          <el-empty description="没有找到匹配的工具" />
          <el-button type="primary" @click="searchQuery = ''" class="mt-4">
            查看全部工具
          </el-button>
        </div>
      </template>

      <!-- All categories grid -->
      <template v-else>
        <div
          v-for="cat in categoriesWithTools"
          :key="cat.id"
          class="mb-8"
        >
          <div class="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-[#f0f0f0] dark:border-[#303050]">
            <Icon :icon="catIconMap[cat.icon] || 'ep:tools'" class="text-[18px] text-[#1677ff]" />
            <h2 class="text-[17px] font-bold text-[#1a1a1a] m-0 dark:text-white/90">{{ cat.name }}</h2>
            <span class="text-[12px] text-[#999] bg-[#f5f5f5] px-2 py-0.5 rounded-[10px] dark:bg-[#2a2a40] dark:text-white/45">{{ getToolsByCategory(cat.id).length }} 个工具</span>
          </div>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            <ToolCard
              v-for="tool in getToolsByCategory(cat.id)"
              :key="tool.id"
              :tool="tool"
            />
          </div>
        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Search as SearchIcon } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import ToolCard from '@/components/ToolCard.vue'
import { tools as allTools, categories, getToolsByCategory, searchTools } from '@/tools/index'
import { useFavorites } from '@/composables/useFavorites'

const searchQuery = ref('')
const activeCategory = ref('all')
const { favorites } = useFavorites()

const catIconMap: Record<string, string> = {
  CodeOutlined: 'ep:code',
  LockOutlined: 'ep:lock',
  FileTextOutlined: 'ep:document',
  BgColorsOutlined: 'mdi:palette',
  FunctionOutlined: 'mdi:function',
  ToolOutlined: 'ep:tools',
  FontSizeOutlined: 'mdi:format-size',
  PictureOutlined: 'ep:picture',
  CalculatorOutlined: 'mdi:calculator',
  GlobalOutlined: 'mdi:web',
  DatabaseOutlined: 'ep:coin',
}

function onSearch() {
  activeCategory.value = 'all'
}

const displayedTools = computed(() => {
  if (searchQuery.value.trim()) return searchTools(searchQuery.value)
  if (activeCategory.value === 'favorites') return allTools.filter(t => favorites.value.includes(t.id))
  if (activeCategory.value !== 'all') return getToolsByCategory(activeCategory.value)
  return allTools
})

const categoriesWithTools = computed(() =>
  categories.filter(cat => getToolsByCategory(cat.id).length > 0)
)
</script>

<style scoped>
</style>
