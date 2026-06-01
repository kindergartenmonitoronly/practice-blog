import { motion } from 'framer-motion'
import { LayoutGrid, Clock, Box, FlaskConical } from 'lucide-react'
import useStore from '../../store/useStore'

const styles = [
  { key: 'card', label: '卡片', icon: LayoutGrid },
  { key: 'timeline', label: '时间轴', icon: Clock },
  { key: 'wall3d', label: '3D墙', icon: Box },
  { key: 'labbench', label: '工作台', icon: FlaskConical },
]

export default function StyleSwitcher() {
  const { viewStyle, setViewStyle } = useStore()

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
      {styles.map((s) => {
        const Icon = s.icon
        return (
          <motion.button
            key={s.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewStyle(s.key)}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 cursor-pointer ${
              viewStyle === s.key
                ? 'text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {viewStyle === s.key && (
              <motion.div
                layoutId="style-indicator"
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Icon className="relative z-10 w-4 h-4" />
            <span className="relative z-10 hidden sm:inline">{s.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
