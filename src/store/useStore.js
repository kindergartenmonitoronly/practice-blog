import { create } from 'zustand'
import { projects as defaultProjects } from '../data/projects'

// Load projects from localStorage, fallback to defaults
const loadProjects = () => {
  try {
    const saved = localStorage.getItem('blog-projects')
    return saved ? JSON.parse(saved) : defaultProjects
  } catch {
    return defaultProjects
  }
}

const saveProjects = (projects) => {
  localStorage.setItem('blog-projects', JSON.stringify(projects))
}

// Load user interactions (likes, bookmarks)
const loadInteractions = () => {
  try {
    const saved = localStorage.getItem('blog-interactions')
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

const useStore = create((set, get) => ({
  // ===== Display Settings =====
  viewStyle: localStorage.getItem('viewStyle') || 'card',
  setViewStyle: (style) => {
    localStorage.setItem('viewStyle', style)
    set({ viewStyle: style })
  },

  theme: localStorage.getItem('theme') || 'light',
  toggleTheme: () => {
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      return { theme: next }
    })
  },

  // ===== Filters =====
  categoryFilter: 'all',
  setCategoryFilter: (cat) => set({ categoryFilter: cat }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),

  // ===== Projects CRUD =====
  projects: loadProjects(),

  addProject: (project) => {
    const newProject = {
      ...project,
      id: project.id || `project-${Date.now()}`,
      date: project.date || new Date().toISOString().split('T')[0],
      likes: 0,
      bookmarks: 0,
    }
    set((state) => {
      const updated = [newProject, ...state.projects]
      saveProjects(updated)
      return { projects: updated }
    })
    return newProject.id
  },

  updateProject: (id, updates) => {
    set((state) => {
      const updated = state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      )
      saveProjects(updated)
      return { projects: updated }
    })
  },

  deleteProject: (id) => {
    set((state) => {
      const updated = state.projects.filter((p) => p.id !== id)
      saveProjects(updated)
      return { projects: updated }
    })
  },

  // ===== User Interactions =====
  interactions: loadInteractions(),

  toggleLike: (projectId) => {
    set((state) => {
      const current = state.interactions[projectId] || { liked: false, bookmarked: false }
      const newLiked = !current.liked
      const updatedInteractions = {
        ...state.interactions,
        [projectId]: { ...current, liked: newLiked },
      }
      localStorage.setItem('blog-interactions', JSON.stringify(updatedInteractions))

      // Update project like count
      const updatedProjects = state.projects.map((p) => {
        if (p.id === projectId) {
          return { ...p, likes: (p.likes || 0) + (newLiked ? 1 : -1) }
        }
        return p
      })
      saveProjects(updatedProjects)

      return { interactions: updatedInteractions, projects: updatedProjects }
    })
  },

  toggleBookmark: (projectId) => {
    set((state) => {
      const current = state.interactions[projectId] || { liked: false, bookmarked: false }
      const newBookmarked = !current.bookmarked
      const updatedInteractions = {
        ...state.interactions,
        [projectId]: { ...current, bookmarked: newBookmarked },
      }
      localStorage.setItem('blog-interactions', JSON.stringify(updatedInteractions))
      return { interactions: updatedInteractions }
    })
  },

  // ===== Import/Export =====
  exportData: () => {
    const { projects } = get()
    const dataStr = JSON.stringify(projects, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `practice-blog-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  },

  importData: (jsonStr) => {
    try {
      const imported = JSON.parse(jsonStr)
      if (Array.isArray(imported)) {
        set((state) => {
          const merged = [...imported, ...state.projects]
          // Deduplicate by id
          const seen = new Set()
          const deduped = merged.filter((p) => {
            if (seen.has(p.id)) return false
            seen.add(p.id)
            return true
          })
          saveProjects(deduped)
          return { projects: deduped }
        })
        return { success: true, count: imported.length }
      }
      return { success: false, error: '数据格式无效' }
    } catch (e) {
      return { success: false, error: e.message }
    }
  },

  resetToDefaults: () => {
    saveProjects(defaultProjects)
    set({ projects: defaultProjects })
  },
}))

export default useStore
