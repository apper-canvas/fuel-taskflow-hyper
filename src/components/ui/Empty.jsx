import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No tasks yet", 
  description = "Create your first task to get started with TaskFlow",
  actionText = "Add Task",
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full p-6 mb-6">
        <ApperIcon name="CheckSquare" size={64} className="text-primary" />
      </div>
      
      <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md text-lg">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="btn-primary flex items-center space-x-2 text-lg px-6 py-3"
        >
          <ApperIcon name="Plus" size={20} />
          <span>{actionText}</span>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty