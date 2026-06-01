import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Plus, Download, Upload, RotateCcw, Pencil, Trash2, X, Heart, Inbox, CheckCircle, AlertCircle } from 'lucide-react'
import useStore from '../../store/useStore'
import ProjectEditor from './ProjectEditor'

export default function AdminPanel({ onClose }) {
  const { projects, deleteProject, exportData, importData, resetToDefaults } = useStore()
  const [editingProject, setEditingProject] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = importData(ev.target.result)
      setImportResult(result)
      setTimeout(() => setImportResult(null), 3000)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleDelete = (id, title) => {
    if (confirm(`确定删除项目「${title}」吗？`)) {
      deleteProject(id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            管理面板
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 flex-wrap">
          <button
            onClick={() => { setEditingProject(null); setShowEditor(true) }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            新建项目
          </button>
          <button
            onClick={exportData}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            导出数据
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            导入数据
          </button>
          <button
            onClick={() => { if (confirm('确定恢复默认数据吗？当前数据将被覆盖。')) resetToDefaults() }}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            恢复默认
          </button>

          {/* Import result toast */}
          <AnimatePresence>
            {importResult && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`ml-auto px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                  importResult.success
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {importResult.success ? (
                  <><CheckCircle className="w-4 h-4" /> 导入 {importResult.count} 个项目</>
                ) : (
                  <><AlertCircle className="w-4 h-4" /> {importResult.error}</>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Project list */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 160px)' }}>
          {projects.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Inbox className="w-16 h-16 mx-auto mb-3 text-slate-300" />
              <p>还没有项目，点击「新建项目」开始吧</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200"
                >
                  {/* Thumbnail */}
                  <img
                    src={project.coverImage}
                    alt=""
                    className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{project.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>{project.date}</span>
                      <span>·</span>
                      <span>{project.category}</span>
                      {project.likes > 0 && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" /> {project.likes}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingProject(project); setShowEditor(true) }}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.title)}
                      className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      删除
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Project Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <ProjectEditor
            project={editingProject}
            onClose={() => { setShowEditor(false); setEditingProject(null) }}
            onSave={() => {}}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
