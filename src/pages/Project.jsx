import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Search, FileText, Code, Image } from 'lucide-react'
import useStore from '../store/useStore'
import InteractionBar from '../components/shared/InteractionBar'
import { useState } from 'react'

export default function Project() {
  const { id } = useParams()
  const { projects } = useStore()
  const project = projects.find((p) => p.id === id)
  const [activeTab, setActiveTab] = useState('overview')
  const [lightboxImage, setLightboxImage] = useState(null)

  if (!project) {
    return (
      <div className="text-center py-20">
        <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <h2 className="text-2xl font-bold mb-2">项目未找到</h2>
        <Link to="/" className="text-blue-600 hover:underline">← 返回首页</Link>
      </div>
    )
  }

  const tabs = [
    { key: 'overview', label: '概览', icon: FileText, show: true },
    { key: 'code', label: '代码', icon: Code, show: project.codeBlocks?.length > 0 },
    { key: 'media', label: '媒体', icon: Image, show: (project.images?.length > 0) || (project.videos?.length > 0) },
  ].filter((t) => t.show)

  return (
    <div>
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors duration-200 mb-6 cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        返回项目列表
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden mb-8"
      >
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags?.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-heading">{project.title}</h1>
          <p className="text-white/80">{project.date}</p>
        </div>
      </motion.div>

      {/* Description */}
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">{project.description}</p>

      {/* Interaction Bar */}
      <InteractionBar project={project} />

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all duration-200 relative flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.key
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{project.content}</ReactMarkdown>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-6">
            {project.codeBlocks?.map((block, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-lg">
                <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
                  <span className="text-slate-300 text-sm font-mono">{block.title}</span>
                  <span className="text-xs text-slate-500 px-2 py-0.5 rounded bg-slate-700">
                    {block.language}
                  </span>
                </div>
                <pre className="bg-slate-900 p-4 overflow-x-auto text-sm leading-relaxed">
                  <code className="text-slate-300">{block.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Images */}
            {project.images?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-1.5">
                  <Image className="w-4 h-4" />
                  图片
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.images.map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="rounded-xl overflow-hidden cursor-pointer shadow-lg"
                      onClick={() => setLightboxImage(img)}
                    >
                      <img src={img} alt={`Image ${i + 1}`} className="w-full h-64 object-cover" loading="lazy" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {project.videos?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-1.5">
                  <Image className="w-4 h-4" />
                  视频
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.videos.map((vid, i) => (
                    <div key={i} className="rounded-xl overflow-hidden shadow-lg">
                      <video
                        src={vid}
                        controls
                        className="w-full h-64 object-cover"
                        preload="metadata"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Lightbox */}
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={lightboxImage}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
          <button className="absolute top-4 right-4 text-white text-2xl hover:text-violet-400">✕</button>
        </motion.div>
      )}
    </div>
  )
}
