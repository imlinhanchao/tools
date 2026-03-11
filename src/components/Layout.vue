<template>
  <el-container class="h-screen overflow-hidden">
    <!-- Sidebar -->
    <el-aside 
      :width="sidebarWidth" 
      class="h-screen overflow-hidden flex flex-col bg-white border-r border-[#f0f0f0] transition-all duration-300 relative z-100 shrink-0 dark:bg-transparent dark:bg-gradient-to-b dark:from-[#1a1f2e] dark:to-[#141828] dark:border-[#303050]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-100 min-h-[72px] shrink-0 overflow-hidden dark:border-white/5 bg-transparent">
        <span class="text-2xl leading-none shrink-0 drop-shadow-sm">🔨</span>
        <span v-if="!collapsed" class="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 whitespace-nowrap overflow-hidden dark:from-blue-400 dark:to-indigo-400">在线工具箱</span>
      </div>

      <!-- Search -->
      <div v-if="!collapsed" class="p-2.5 px-3 shrink-0">
        <el-input
          v-model="searchQuery"
          placeholder="搜索工具..."
          clearable
          size="small"
          :prefix-icon="SearchIcon"
        />
      </div>

      <!-- Navigation Menu -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <el-menu
          :default-openeds="openKeys"
          :default-active="activeKey"
          :background-color="isDark ? 'transparent' : '#ffffff'"
          :text-color="isDark ? 'rgba(255,255,255,0.75)' : '#333'"
          :active-text-color="isDark ? '#4096ff' : '#1677ff'"
          :collapse="collapsed"
          @select="onMenuSelect"
        >
          <el-sub-menu
             v-if="favoriteTools.length > 0 && !searchQuery.trim()"
             index="favorites"
          >
            <template #title>
              <Icon icon="ep:star" class="mr-1.5 text-[15px] align-middle text-amber-500" />
              <span>收藏夹</span>
            </template>
            <el-menu-item
              v-for="tool in favoriteTools"
              :key="tool.id"
              :index="tool.id"
            >
              {{ tool.name }}
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu
            v-for="cat in filteredCategories"
            :key="cat.id"
            :index="cat.id"
          >
            <template #title>
              <Icon :icon="catIconMap[cat.icon] || 'ep:tools'" class="mr-1.5 text-[15px] align-middle" />
              <span>{{ cat.name }}</span>
            </template>
            <el-menu-item
              v-for="tool in getFilteredTools(cat.id)"
              :key="tool.id"
              :index="tool.id"
            >
              {{ tool.name }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-black/6 shrink-0 dark:border-white/6" v-if="!collapsed">
        <el-tooltip :content="isDark ? '切换浅色模式' : '切换深色模式'" placement="top">
          <el-button text class="w-full flex items-center gap-2 justify-start text-inherit text-[13px]! !mx-0" @click="toggleDark">
            <Icon :icon="isDark ? 'ep:sunny' : 'ep:moon'" />
            <span>{{ isDark ? '浅色模式' : '深色模式' }}</span>
          </el-button>
        </el-tooltip>
      </div>
    </el-aside>

    <!-- Main area -->
    <el-container class="flex-1 min-w-0 overflow-hidden flex flex-col">
      <!-- Header -->
      <el-header class="bg-white/80 backdrop-blur-md px-6 flex items-center gap-4 relative z-20 !h-[72px] shrink-0 border-b border-gray-100 dark:bg-[#1A1D24]/80 dark:border-white/5">
        <el-button text class="shrink-0 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-white/5 !p-2 !rounded-xl transition-all" @click="collapsed = !collapsed">
          <Icon :icon="collapsed ? 'ep:expand' : 'ep:fold'" class="text-xl" />
        </el-button>

        <!-- Breadcrumb -->
        <el-breadcrumb class="flex-1 custom-breadcrumb" v-if="currentTool" separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentCategoryName }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentTool.name }}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="flex items-center gap-2 ml-auto">
          <el-tooltip content="GitHub 仓库" placement="bottom">
            <el-button text tag="a" href="https://github.com/imlinhanchao/tools" target="_blank" class="!px-2 !rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-all">
              <Icon icon="mdi:github" class="text-xl" />
            </el-button>
          </el-tooltip>
          <div class="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"></div>
          <el-tooltip :content="isDark ? '切换浅色模式' : '切换深色模式'" placement="bottom">
            <el-button text @click="toggleDark" class="!px-2 !rounded-xl text-gray-500 hover:text-amber-500 hover:bg-amber-50 dark:text-gray-400 dark:hover:text-yellow-400 dark:hover:bg-white/5 transition-all">
              <Icon :icon="isDark ? 'ep:sunny' : 'ep:moon'" class="text-xl" />
            </el-button>
          </el-tooltip>
        </div>
      </el-header>

      <!-- Content -->
      <el-main class="flex-1 overflow-y-auto bg-[#f5f5f5] transition-colors duration-300 p-0 dark:bg-[#0f1117]">
        <slot />
      </el-main>
    </el-container>

    <!-- Mobile overlay -->
    <div
      v-if="!collapsed && isMobile"
      class="fixed inset-0 bg-black/45 z-99"
      @click="collapsed = true"
    />
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { Search as SearchIcon } from '@element-plus/icons-vue'
import { categories, getToolsByCategory, findTool, tools as allTools } from '@/tools/index'
import { useFavorites } from '@/composables/useFavorites'

const router = useRouter()
const route = useRoute()
const { favorites } = useFavorites()

const favoriteTools = computed(() => {
  return favorites.value.map(id => findTool(id)).filter(Boolean) as typeof allTools
})

const collapsed = ref(false)
const isMobile = ref(false)
const isDark = ref(false)
const searchQuery = ref('')

const catIconMap: Record<string, string> = {
  CodeOutlined: 'pepicons-pop:code',
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

const currentTool = computed(() => {
  const id = route.params.id as string
  return id ? findTool(id) : null
})

const currentCategoryName = computed(() => {
  if (!currentTool.value) return ''
  const cat = categories.find(c => c.id === currentTool.value!.category)
  return cat?.name ?? ''
})

const sidebarWidth = computed(() => collapsed.value ? '0px' : '220px')

const openKeys = ref<string[]>([])

const activeKey = computed(() => {
  if (currentTool.value) return currentTool.value.id
  return ''
})

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories
  const q = searchQuery.value.toLowerCase()
  return categories.filter(cat => {
    if (cat.name.toLowerCase().includes(q)) return true
    const catTools = getToolsByCategory(cat.id)
    return catTools.some(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords?.some(k => k.toLowerCase().includes(q))
    )
  })
})

function getFilteredTools(catId: string) {
  const catTools = getToolsByCategory(catId)
  if (!searchQuery.value.trim()) return catTools
  const q = searchQuery.value.toLowerCase()
  return catTools.filter(
    t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords?.some(k => k.toLowerCase().includes(q))
  )
}

function onMenuSelect(toolId: string) {
  const tool = findTool(toolId)
  if (tool) {
    router.push(`/tool/${toolId}`)
    if (isMobile.value) collapsed.value = true
  }
}

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('darkMode', isDark.value ? '1' : '0')
}

onMounted(() => {
  const saved = localStorage.getItem('darkMode')
  if (saved === '1') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  isMobile.value = window.innerWidth < 992
  if (isMobile.value) collapsed.value = true
})

watch(searchQuery, (q) => {
  if (q.trim()) {
    openKeys.value = filteredCategories.value.map(c => c.id)
  }
})
</script>

<style scoped>
/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.15);
  border-radius: 2px;
}
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15);
}

/* Breadcrumb dark mode overrides */
:global(.dark) :deep(.custom-breadcrumb .el-breadcrumb__inner),
:global(.dark) :deep(.custom-breadcrumb .el-breadcrumb__separator) {
  color: rgba(255, 255, 255, 0.65) !important;
}

:global(.dark) :deep(.custom-breadcrumb .el-breadcrumb__inner.is-link),
:global(.dark) :deep(.custom-breadcrumb .el-breadcrumb__inner a) {
  color: rgba(255, 255, 255, 0.85) !important;
}

/* Element Plus Menu overrides */
:deep(.el-menu) {
  border-right: none !important;
}
:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 13px;
}
</style>
