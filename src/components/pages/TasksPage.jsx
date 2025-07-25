import { useState, useEffect, useMemo } from "react"
import { useParams, useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import { compareAsc, compareDesc } from "date-fns"
import Header from "@/components/organisms/Header"
import TaskList from "@/components/organisms/TaskList"
import TaskModal from "@/components/organisms/TaskModal"
import { taskService } from "@/services/api/taskService"

const TasksPage = () => {
  const { categoryId } = useParams()
  const { tasks: allTasks, categories, loading, onDataChange } = useOutletContext()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [error, setError] = useState("")

  const currentCategory = categoryId ? categories.find(cat => cat.id === categoryId) : null

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = allTasks

    // Filter by category
    if (categoryId) {
      filtered = filtered.filter(task => task.categoryId === categoryId)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      )
    }

    // Sort tasks
    const sortedTasks = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "priority": {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        case "dueDate": {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return compareAsc(new Date(a.dueDate), new Date(b.dueDate))
        }
        case "completed":
          return a.completed === b.completed ? 0 : a.completed ? 1 : -1
        case "createdAt":
        default:
          return compareDesc(new Date(a.createdAt), new Date(b.createdAt))
      }
    })

    return sortedTasks
  }, [allTasks, categoryId, searchTerm, sortBy])

  const handleAddTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, {
          ...taskData,
          completedAt: editingTask.completedAt,
          completed: editingTask.completed,
        })
        toast.success("Task updated successfully!")
      } else {
        // Set default category if viewing specific category
        const finalTaskData = {
          ...taskData,
          categoryId: taskData.categoryId || categoryId || categories[0]?.id,
        }
        await taskService.create(finalTaskData)
        toast.success("Task created successfully!")
      }
      
      setIsModalOpen(false)
      setEditingTask(null)
      onDataChange()
    } catch (error) {
      toast.error("Failed to save task")
    }
  }

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null,
      }
      
      await taskService.update(task.id, updatedTask)
      
      if (!task.completed) {
        toast.success("Task completed! 🎉")
      } else {
        toast.info("Task marked as incomplete")
      }
      
      onDataChange()
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId)
        toast.success("Task deleted successfully")
        onDataChange()
      } catch (error) {
        toast.error("Failed to delete task")
      }
    }
  }

  const handleRetry = () => {
    setError("")
    onDataChange()
  }

  const totalTasks = filteredAndSortedTasks.length
  const completedTasks = filteredAndSortedTasks.filter(task => task.completed).length

  return (
    <div className="flex flex-col h-full">
      <Header
        onSearch={setSearchTerm}
        onSort={setSortBy}
        onAddTask={handleAddTask}
        currentSort={sortBy}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
      />

      <div className="flex-1 p-6">
        {currentCategory && (
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
              {currentCategory.name}
            </h2>
            <p className="text-gray-600">
              {totalTasks === 0 ? "No tasks in this category" : 
               `${completedTasks} of ${totalTasks} tasks completed`}
            </p>
          </div>
        )}

        <TaskList
          tasks={filteredAndSortedTasks}
          categories={categories}
          loading={loading}
          error={error}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onRetry={handleRetry}
          onAddTask={handleAddTask}
        />
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleSubmitTask}
        task={editingTask}
        categories={categories}
      />
    </div>
  )
}

export default TasksPage