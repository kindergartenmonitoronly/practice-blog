import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function TimelineView({ projects }) {
  // Group by month
  const grouped = projects.reduce((acc, p) => {
    const month = p.date.slice(0, 7) // YYYY-MM
    if (!acc[month]) acc[month] = []
    acc[month].push(p)
    return acc
  }, {})

  const months = Object.keys(grouped).sort().reverse()

  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-fuchsia-500 to-emerald-500" />

      {months.map((month, mi) => (
        <div key={month} className="mb-12">
          {/* Month label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 flex justify-center mb-8"
          >
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-bold shadow-lg shadow-violet-500/30">
              {month}
            </div>
          </motion.div>

          {/* Items */}
          {grouped[month].map((project, i) => {
            const isLeft = i % 2 === 0
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-center mb-8 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-row`}
              >
                {/* Dot on timeline */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-violet-500 -translate-x-1/2 z-10 shadow-lg" />

                {/* Card */}
                <div className={`ml-12 md:ml-0 md:w-5/12 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                  <Link to={`/project/${project.id}`}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-xl transition-shadow"
                    >
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                      <div className="p-4">
                        <div className="text-xs text-slate-400 mb-1">{project.date}</div>
                        <h3 className="font-bold mb-1">{project.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
