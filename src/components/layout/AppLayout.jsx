import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Moon, Sun } from 'lucide-react'
import useStore from '../../store/useStore'
import StyleSwitcher from './StyleSwitcher'
import ReadingProgress from '../shared/ReadingProgress'
import AdminPanel from '../admin/AdminPanel'

export default function AppLayout({ children }) {
  const { theme, toggleTheme } = useStore()
  const location = useLocation()
  const [showAdmin, setShowAdmin] = useState(false)

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
        {/* Reading Progress */}
        <ReadingProgress />

        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/25"
              >
                P
              </motion.div>
              <span className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                Practice Blog
              </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {location.pathname === '/' && <StyleSwitcher />}

              {/* Admin button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAdmin(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
                title="管理面板"
              >
                <Settings className="w-4 h-4" />
              </motion.button>

              {/* Theme toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Admin Panel Modal */}
        <AnimatePresence>
          {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
        </AnimatePresence>
      </div>
    </div>
  )
}
