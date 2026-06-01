import { motion } from 'framer-motion'
import ProjectCard from '../shared/ProjectCard'

export default function CardGridView({ projects }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
    >
      {projects.map((project, i) => (
        <div key={project.id} className="break-inside-avoid">
          <ProjectCard project={project} index={i} />
        </div>
      ))}
    </motion.div>
  )
}
