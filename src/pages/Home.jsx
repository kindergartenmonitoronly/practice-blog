import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, FolderOpen, Code, Wrench, FileText, Inbox } from 'lucide-react'
import useStore from '../store/useStore'
import { categories } from '../data/projects'
import CardGridView from '../components/views/CardGridView'
import TimelineView from '../components/views/TimelineView'
import Wall3DView from '../components/views/Wall3DView'
import LabBenchView from '../components/views/LabBenchView'

const categoryIcons = {
  all: FolderOpen,
  code: Code,
  hardware: Wrench,
  document: FileText,
}

export default function Home() {
  const { viewStyle, categoryFilter, setCategoryFilter, searchQuery, setSearchQuery, projects } = useStore()

  const filtered = useMemo(() => {
    let result = projects
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return result
  }, [categoryFilter, searchQuery])

  const views = {
    card: CardGridView,
    timeline: TimelineView,
    wall3d: Wall3DView,
    labbench: LabBenchView,
  }
  const ViewComponent = views[viewStyle]

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">
          <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
            实践作业展示
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          记录每一次动手实践，展示代码与实物的碰撞
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
      >
        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.key]
            return (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  categoryFilter === cat.key
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </motion.div>

      {/* View */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-slate-400"
        >
          <Inbox className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-lg">没有找到匹配的项目</p>
        </motion.div>
      ) : (
        <ViewComponent projects={filtered} />
      )}
    </div>
  )
}
