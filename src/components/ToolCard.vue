<template>
  <div class="cursor-pointer rounded-2xl border border-transparent bg-white shadow-sm transition-all duration-300 ease-out h-full hover:(border-[#1677ff]/30 shadow-md -translate-y-1) dark:(bg-[#1A1D24] border-white/5 hover:border-[#4096ff]/50 hover:shadow-lg) group relative" @click="navigate">
    <!-- Favorite Icon overlay -->
    <div class="absolute top-4 right-4 z-10" @click.stop="toggleFavorite(tool.id)">
      <Icon 
        :icon="isFav ? 'ep:star-filled' : 'ep:star'" 
        class="text-[18px] transition-all duration-300 hover:scale-110"
        :class="isFav ? 'text-amber-400' : 'text-gray-300 hover:text-amber-400 dark:text-gray-600'" 
      />
    </div>
    <div class="p-5 h-full flex flex-col gap-3">
      <div class="flex items-center justify-between pr-6">
        <span class="inline-flex items-center justify-center text-white text-[12px] font-medium px-2.5 py-1 rounded-lg tracking-wide" :style="{ background: categoryColor }">
          {{ categoryName }}
        </span>
      </div>
      <div class="flex-1 mt-1">
        <h3 class="text-base font-bold text-gray-800 m-0 mb-2 leading-tight dark:text-gray-100 flex items-center justify-between">
          {{ tool.name }}
          <span class="text-[18px] text-gray-300 transition-all duration-300 group-hover:text-[#1677ff] group-hover:translate-x-1 dark:text-gray-600 opacity-0 group-hover:opacity-100">→</span>
        </h3>
        <p class="text-sm text-gray-500 leading-relaxed m-0 line-clamp-2 dark:text-gray-400">{{ tool.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { categories } from '@/tools/index'
import type { Tool } from '@/tools/index'
import { useFavorites } from '@/composables/useFavorites'

const props = defineProps<{ tool: Tool }>()
const router = useRouter()
const { isFavorite, toggleFavorite } = useFavorites()

const isFav = computed(() => isFavorite(props.tool.id))

const categoryColors: Record<string, string> = {
  encoding: '#1677ff',
  encryption: '#722ed1',
  json: '#13c2c2',
  yaml: '#eb2f96',
  css: '#fa8c16',
  js: '#fadb14',
  developer: '#52c41a',
}

const categoryColor = computed(
  () => categoryColors[props.tool.category] ?? '#1677ff'
)

const categoryName = computed(() => {
  const cat = categories.find(c => c.id === props.tool.category)
  return cat?.name ?? props.tool.category
})

function navigate() {
  router.push(`/tool/${props.tool.id}`)
}
</script>

<style scoped>
</style>
