import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Image, Code, FileCode, X, Plus, Trash2, Upload, Save } from 'lucide-react'
import useStore from '../../store/useStore'

const emptyProject = {
  title: '',
  description: '',
  category: 'code',
  tags: [],
  coverImage: '',
  images: [],
  videos: [],
  codeBlocks: [],
  content: '',
}

const tabs = [
  { key: 'basic', label: '基本信息', icon: FileText },
  { key: 'media', label: '图片视频', icon: Image },
  { key: 'code', label: '代码块', icon: Code },
  { key: 'content', label: '正文内容', icon: FileCode },
]

export default function ProjectEditor({ project, onClose, onSave }) {
  const { addProject, updateProject } = useStore()
  const [form, setForm] = useState(project || { ...emptyProject })
  const [tagInput, setTagInput] = useState('')
  const [codeInput, setCodeInput] = useState({ title: '', language: 'javascript', code: '' })
  const [activeTab, setActiveTab] = useState('basic')
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      handleChange('tags', [...form.tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag) => {
    handleChange('tags', form.tags.filter((t) => t !== tag))
  }

  const handleAddCodeBlock = () => {
    if (codeInput.title && codeInput.code) {
      handleChange('codeBlocks', [...form.codeBlocks, { ...codeInput }])
      setCodeInput({ title: '', language: 'javascript', code: '' })
    }
  }

  const handleRemoveCodeBlock = (index) => {
    handleChange('codeBlocks', form.codeBlocks.filter((_, i) => i !== index))
  }

  const handleImageUpload = (e, field) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          if (file.type.startsWith('image/')) {
            if (field === 'coverImage') {
              handleChange('coverImage', ev.target.result)
            } else {
              handleChange('images', [...form.images, ev.target.result])
            }
          } else {
            handleChange('videos', [...form.videos, ev.target.result])
          }
        }
        reader.readAsDataURL(file)
      }
    })
    e.target.value = ''
  }

  const handleRemoveImage = (index) => {
    handleChange('images', form.images.filter((_, i) => i !== index))
  }

  const handleRemoveVideo = (index) => {
    handleChange('videos', form.videos.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!form.title.trim()) {
      alert('请输入项目标题')
      return
    }
    if (project?.id) {
      updateProject(project.id, form)
    } else {
      addProject(form)
    }
    onSave?.()
    onClose?.()
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
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">
            {project?.id ? '编辑项目' : '新建项目'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 relative flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.key
                    ? 'text-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="editor-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">项目标题 *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="输入项目标题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">项目描述</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all duration-200"
                    placeholder="简短描述项目内容"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">分类</label>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                  >
                    <option value="code">代码项目</option>
                    <option value="hardware">硬件项目</option>
                    <option value="document">文档报告</option>
                    <option value="mixed">综合项目</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">日期</label>
                  <input
                    type="date"
                    value={form.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">标签</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                      placeholder="输入标签后回车"
                    />
                    <button onClick={handleAddTag} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
                      添加
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-1">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">封面图</label>
                  <div className="flex items-center gap-4">
                    {form.coverImage && (
                      <img src={form.coverImage} alt="封面预览" className="w-24 h-16 object-cover rounded-lg" />
                    )}
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'coverImage')}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-sm transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        上传图片
                      </button>
                      <input
                        type="text"
                        value={form.coverImage.startsWith('data:') ? '' : form.coverImage}
                        onChange={(e) => handleChange('coverImage', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm outline-none"
                        placeholder="或粘贴图片URL"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'media' && (
              <motion.div
                key="media"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">项目图片</label>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, 'images')}
                    className="hidden"
                  />
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 text-slate-500 cursor-pointer"
                  >
                    <Image className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                    <div>点击或拖拽上传图片</div>
                    <div className="text-xs mt-1">支持 JPG、PNG、GIF，可多选</div>
                  </button>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">项目视频</label>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, 'videos')}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="block w-full py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 text-slate-500 cursor-pointer text-center"
                  >
                    <Image className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                    <div>点击上传视频文件</div>
                    <div className="text-xs mt-1">支持 MP4、WebM、MOV</div>
                  </label>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {form.videos.map((vid, i) => (
                      <div key={i} className="relative group">
                        <video src={vid} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          onClick={() => handleRemoveVideo(i)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={codeInput.title}
                      onChange={(e) => setCodeInput((p) => ({ ...p, title: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm outline-none"
                      placeholder="文件名 (如 main.py)"
                    />
                    <select
                      value={codeInput.language}
                      onChange={(e) => setCodeInput((p) => ({ ...p, language: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm outline-none"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="jsx">JSX</option>
                      <option value="json">JSON</option>
                      <option value="bash">Bash</option>
                    </select>
                  </div>
                  <textarea
                    value={codeInput.code}
                    onChange={(e) => setCodeInput((p) => ({ ...p, code: e.target.value }))}
                    rows={8}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 font-mono text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="粘贴代码..."
                  />
                  <button
                    onClick={handleAddCodeBlock}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    添加代码块
                  </button>
                </div>

                <div className="space-y-3">
                  {form.codeBlocks.map((block, i) => (
                    <div key={i} className="bg-slate-900 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
                        <span className="text-slate-300 text-sm font-mono">{block.title}</span>
                        <button onClick={() => handleRemoveCodeBlock(i)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 cursor-pointer">
                          <Trash2 className="w-3 h-3" />
                          删除
                        </button>
                      </div>
                      <pre className="p-4 text-sm text-slate-300 overflow-x-auto max-h-40">
                        <code>{block.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <label className="block text-sm font-medium mb-2">正文内容 (Markdown)</label>
                <textarea
                  value={form.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={20}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 font-mono text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 leading-relaxed transition-all duration-200"
                  placeholder="## 项目概述\n\n在这里写项目介绍...\n\n## 功能特点\n\n- 功能1\n- 功能2\n\n## 技术栈\n\n| 技术 | 用途 |\n|------|------|\n| React | 前端框架 |"
                />
                <p className="text-xs text-slate-400 mt-2">支持 Markdown 语法：## 标题、**加粗**、- 列表、| 表格 |</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-5 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            保存项目
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
