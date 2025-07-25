import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import TaskForm from "@/components/molecules/TaskForm"

const TaskModal = ({ isOpen, onClose, onSubmit, task = null, categories = [] }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-gray-900">
                {task ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <TaskForm
              onSubmit={onSubmit}
              onCancel={onClose}
              initialData={task}
              categories={categories}
            />
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default TaskModal