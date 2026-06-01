import { useState, useEffect } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const springProgress = useSpring(0, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollPercent)
      springProgress.set(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [springProgress])

  if (progress < 1) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-1"
      style={{
        background: `linear-gradient(90deg, #8b5cf6 ${progress}%, transparent ${progress}%)`,
      }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-500"
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  )
}
