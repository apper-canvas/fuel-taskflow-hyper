import { motion, AnimatePresence } from "framer-motion"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Checkbox from "@/components/atoms/Checkbox"
import PriorityBadge from "@/components/molecules/PriorityBadge"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, category }) => {
  const getDueDateDisplay = (dueDate) => {
    if (!dueDate) return null
    
    const date = new Date(dueDate)
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    if (isPast(date)) return `Overdue - ${format(date, "MMM d")}`
    return format(date, "MMM d")
  }

  const dueDateDisplay = getDueDateDisplay(task.dueDate)
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed

  const handleComplete = () => {
    onToggleComplete(task)
    
    // Add confetti effect
    if (!task.completed) {
      // Create temporary confetti elements
      const card = document.getElementById(`task-${task.id}`)
      if (card) {
        for (let i = 0; i < 6; i++) {
          const confetti = document.createElement("div")
          confetti.className = "absolute w-2 h-2 bg-primary rounded-full animate-confetti pointer-events-none"
          confetti.style.left = "50%"
          confetti.style.top = "50%"
          confetti.style.animationDelay = `${i * 100}ms`
          card.appendChild(confetti)
          
          setTimeout(() => {
            confetti.remove()
          }, 600)
        }
      }
    }
  }

  return (
    <motion.div
      id={`task-${task.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "card p-4 group relative",
        task.completed && "opacity-60"
      )}
      style={{ borderLeft: `4px solid ${category?.color || "#5B47E0"}` }}
    >
      <div className="flex items-start space-x-4">
        <div className="mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleComplete}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={cn(
                "font-medium text-gray-900 mb-1",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mb-3",
                  task.completed && "line-through"
                )}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center space-x-3">
                <PriorityBadge priority={task.priority} />
                
                {dueDateDisplay && (
                  <div className={cn(
                    "flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full",
                    isOverdue ? "bg-error/10 text-error" : 
                    dueDateDisplay === "Today" ? "bg-warning/10 text-warning" :
                    "bg-gray-100 text-gray-600"
                  )}>
                    <ApperIcon 
                      name={isOverdue ? "AlertTriangle" : "Calendar"} 
                      size={10} 
                    />
                    <span>{dueDateDisplay}</span>
                  </div>
                )}
                
                {category && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <ApperIcon name={category.icon} size={10} />
                    <span>{category.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(task)}
                className="text-gray-400 hover:text-primary"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                className="text-gray-400 hover:text-error"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const TaskList = ({ 
  tasks, 
  categories, 
  loading, 
  error, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onRetry,
  onAddTask 
}) => {
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={onRetry} />
  if (!tasks.length) {
    return (
      <Empty
        title="No tasks found"
        description="Create your first task to get started with TaskFlow"
        actionText="Add Task"
        onAction={onAddTask}
      />
    )
  }

  const getCategoryForTask = (taskCategoryId) => {
    return categories.find(cat => cat.id === taskCategoryId)
  }

  // Group tasks by completion status
  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  return (
    <div className="space-y-6">
      {activeTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">
            Active Tasks ({activeTasks.length})
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={getCategoryForTask(task.categoryId)}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold text-gray-500 mb-4">
            Completed ({completedTasks.length})
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={getCategoryForTask(task.categoryId)}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList