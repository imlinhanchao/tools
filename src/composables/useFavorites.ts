import { ref, watch } from 'vue'

const FAVORITES_KEY = 'tool_favorites'

function loadFavorites(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const favorites = ref<string[]>(loadFavorites())

watch(favorites, (newFavorites) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
}, { deep: true })

export function useFavorites() {
  const toggleFavorite = (toolId: string) => {
    const index = favorites.value.indexOf(toolId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(toolId)
    }
  }

  const isFavorite = (toolId: string) => favorites.value.includes(toolId)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  }
}
