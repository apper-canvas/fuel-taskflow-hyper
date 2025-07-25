import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const SortDropdown = ({ onSort, currentSort = "createdAt" }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const sortOptions = [
    { value: "createdAt", label: "Date Created", icon: "Calendar" },
    { value: "dueDate", label: "Due Date", icon: "Clock" },
    { value: "priority", label: "Priority", icon: "Flag" },
    { value: "title", label: "Title", icon: "Type" },
    { value: "completed", label: "Status", icon: "CheckSquare" },
  ]
  
  const currentOption = sortOptions.find(option => option.value === currentSort)

  const handleSort = (value) => {
    onSort(value)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <ApperIcon name={currentOption?.icon || "ArrowUpDown"} size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          Sort by {currentOption?.label || "Date"}
        </span>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            {sortOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ backgroundColor: "#f3f4f6" }}
                onClick={() => handleSort(option.value)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  currentSort === option.value ? "bg-primary/5 text-primary" : "text-gray-700"
                }`}
              >
                <ApperIcon name={option.icon} size={16} />
                <span className="text-sm font-medium">{option.label}</span>
                {currentSort === option.value && (
                  <ApperIcon name="Check" size={14} className="ml-auto text-primary" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default SortDropdown