import { motion } from 'framer-motion'
import { Heart, Bookmark, Share2, Clock } from 'lucide-react'
import useStore from '../../store/useStore'

export default function InteractionBar({ project }) {
  const { interactions, toggleLike, toggleBookmark } = useStore()
  const userInter = interactions[project.id] || { liked: false, bookmarked: false }

  const handleShare = async () => {
    const url = window.location.href
    const text = `${project.title} - 实践作业博客`

    if (navigator.share) {
      try {
        await navigator.share({ title: text, url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      alert('链接已复制到剪贴板！')
    }
  }

  const readTime = Math.max(1, Math.ceil((project.content?.length || 0) / 500))

  return (
    <div className="flex items-center gap-3 py-4 border-t border-b border-slate-200 dark:border-slate-700 my-6">
      {/* Like */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => toggleLike(project.id)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
          userInter.liked
            ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-800'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${userInter.liked ? 'fill-current' : ''}`} />
        <span>{project.likes || 0}</span>
      </motion.button>

      {/* Bookmark */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => toggleBookmark(project.id)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
          userInter.bookmarked
            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200 dark:border-amber-800'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${userInter.bookmarked ? 'fill-current' : ''}`} />
        <span>收藏</span>
      </motion.button>

      {/* Share */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleShare}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-all duration-200 cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        <span>分享</span>
      </motion.button>

      {/* Reading time estimate */}
      <div className="ml-auto flex items-center gap-1 text-xs text-slate-400">
        <Clock className="w-3 h-3" />
        <span>约 {readTime} 分钟阅读</span>
      </div>
    </div>
  )
}
