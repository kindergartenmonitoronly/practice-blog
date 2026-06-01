import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function LabBenchView({ projects }) {
  // Fixed "desk" positions for items (pre-computed for aesthetics)
  const positions = [
    { x: 8, y: 5, rotate: -3 },
    { x: 35, y: 8, rotate: 2 },
    { x: 62, y: 3, rotate: -1 },
    { x: 12, y: 50, rotate: 1.5 },
    { x: 40, y: 48, rotate: -2.5 },
    { x: 68, y: 45, rotate: 3 },
    { x: 25, y: 85, rotate: -1 },
    { x: 55, y: 82, rotate: 2 },
  ]

  return (
    <div className="relative" style={{ minHeight: '75vh' }}>
      {/* Lab bench background */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        {/* Wood texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900" />
        {/* Wood grain lines */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(0,0,0,0.1) 40px,
              rgba(0,0,0,0.1) 41px
            )`,
          }}
        />
        {/* Top edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
        {/* Subtle shadow at top */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/10 to-transparent" />
      </div>

      {/* Desk label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="px-6 py-2 rounded-b-xl bg-amber-950/80 backdrop-blur-sm text-amber-200 text-sm font-mono tracking-wider border-t border-amber-700/50">
          实验工作台 — Lab Bench
        </div>
      </div>

      {/* Items on the desk */}
      {projects.map((project, i) => {
        const pos = positions[i % positions.length]
        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30, rotate: pos.rotate }}
            animate={{ opacity: 1, y: 0, rotate: pos.rotate }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 120 }}
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `rotate(${pos.rotate}deg)`,
              zIndex: 10 + i,
            }}
          >
            <Link to={`/project/${project.id}`}>
              <motion.div
                whileHover={{ y: -8, rotate: 0, scale: 1.08, zIndex: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative"
              >
                {/* Card */}
                <div className="w-48 sm:w-56 bg-white rounded-lg shadow-2xl shadow-black/30 overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-28 sm:h-32 object-cover"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <h3 className="font-bold text-sm">{project.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">{project.description}</p>
                  </div>
                </div>

                {/* Lab label tag */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-100 border border-amber-300 rounded px-2 py-0.5 text-[10px] font-mono text-amber-800 shadow whitespace-nowrap">
                  #{String(i + 1).padStart(2, '0')} {project.date}
                </div>

                {/* Tape effect on top */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/60 rounded-sm -rotate-2 shadow-sm" />
              </motion.div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
