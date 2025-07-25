import { motion } from "framer-motion"
import { NavLink, useParams } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Sidebar = ({ categories, tasks, className }) => {
  const { categoryId } = useParams()

  const getTaskCount = (catId) => {
    return tasks.filter(task => task.categoryId === catId && !task.completed).length
  }

  const getCompletedCount = (catId) => {
    return tasks.filter(task => task.categoryId === catId && task.completed).length
  }

  const allTasksCount = tasks.filter(task => !task.completed).length

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("bg-white border-r border-gray-200 overflow-y-auto", className)}
    >
      <div className="p-6">
        <h2 className="text-lg font-display font-semibold text-gray-900 mb-6">
          Categories
        </h2>
        
        <nav className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) => cn(
              "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50",
              isActive && !categoryId ? 
                "bg-gradient-to-r from-primary to-secondary text-white shadow-md" : 
                "text-gray-700"
            )}
          >
            <div className="flex items-center space-x-3">
              <ApperIcon name="Inbox" size={18} />
              <span>All Tasks</span>
            </div>
            {allTasksCount > 0 && (
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-semibold",
                !categoryId ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              )}>
                {allTasksCount}
              </span>
            )}
          </NavLink>

          {categories.map((category) => {
            const taskCount = getTaskCount(category.id)
            const completedCount = getCompletedCount(category.id)
            const isActive = categoryId === category.id
            
            return (
              <NavLink
                key={category.id}
                to={`/category/${category.id}`}
                className={({ isActive }) => cn(
                  "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 group",
                  isActive ? 
                    "bg-gradient-to-r from-primary to-secondary text-white shadow-md" : 
                    "text-gray-700"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className={cn(
                      "w-3 h-3 rounded-full",
                      isActive ? "bg-white/80" : ""
                    )}
                    style={{ backgroundColor: isActive ? undefined : category.color }}
                  />
                  <ApperIcon name={category.icon} size={18} />
                  <span>{category.name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {taskCount > 0 && (
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    )}>
                      {taskCount}
                    </span>
                  )}
                  {completedCount > 0 && (
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      isActive ? "bg-white/10 text-white/70" : "bg-success/10 text-success"
                    )}>
                      ✓ {completedCount}
                    </span>
                  )}
                </div>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </motion.aside>
  )
}

export default Sidebar