import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code, Wrench, FileText } from 'lucide-react'

const categoryConfig = {
  code: { color: 'from-blue-500 to-cyan-500', label: '代码', icon: Code },
  hardware: { color: 'from-amber-500 to-orange-500', label: '硬件', icon: Wrench },
  document: { color: 'from-emerald-500 to-teal-500', label: '文档', icon: FileText },
}

export default function ProjectCard({ project, index = 0 }) {
  const config = categoryConfig[project.category] || categoryConfig.code
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link to={`/project/${project.id}`}>
        <motion.article
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
        >
          {/* Cover image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Category badge */}
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r ${config.color} text-white text-xs font-medium shadow-lg flex items-center gap-1`}>
              <Icon className="w-3 h-3" />
              {config.label}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold mb-2 font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {project.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Date */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
              {project.date}
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  )
}
