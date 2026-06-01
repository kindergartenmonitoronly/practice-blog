import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Wall3DView({ projects }) {
  const containerRef = useRef(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e) => {
    setIsDragging(true)
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    setRotation((prev) => ({
      x: Math.max(-30, Math.min(30, prev.x - dy * 0.3)),
      y: prev.y + dx * 0.3,
    }))
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => setIsDragging(false)

  // Position cards in a grid on the "wall"
  const cols = Math.ceil(Math.sqrt(projects.length * 1.5))
  const cardWidth = 280
  const cardHeight = 320
  const gapX = 30
  const gapY = 30

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{ minHeight: '70vh', cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Hint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm"
      >
        拖拽旋转 | 滚轮缩放
      </motion.div>

      {/* 3D Scene */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          animate={{
            rotateX: rotation.x,
            rotateY: rotation.y,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            width: cols * (cardWidth + gapX),
            minHeight: Math.ceil(projects.length / cols) * (cardHeight + gapY),
          }}
        >
          {projects.map((project, i) => {
            const col = i % cols
            const row = Math.floor(i / cols)
            const x = col * (cardWidth + gapX)
            const y = row * (cardHeight + gapY)
            const z = Math.sin((col + row) * 0.5) * 40

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, z: -200 }}
                animate={{ opacity: 1, z }}
                transition={{ delay: i * 0.1, duration: 0.6, type: 'spring' }}
                whileHover={{ z: 60, scale: 1.05 }}
                className="absolute"
                style={{
                  left: x,
                  top: y,
                  width: cardWidth,
                  transformStyle: 'preserve-3d',
                }}
              >
                <Link to={`/project/${project.id}`}>
                  <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-2xl shadow-slate-900/30">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1">{project.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
