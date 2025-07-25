import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Select from "@/components/atoms/Select"

const TaskForm = ({ onSubmit, onCancel, initialData = null, categories = [] }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "medium",
    dueDate: initialData?.dueDate ? format(new Date(initialData.dueDate), "yyyy-MM-dd") : "",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
    }
    
    onSubmit(taskData)
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title *
        </label>
        <Input
          type="text"
          value={formData.title}
          onChange={handleChange("title")}
          placeholder="Enter task title..."
          className={errors.title ? "border-error focus:ring-error" : ""}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-error">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={handleChange("description")}
          placeholder="Add task description..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <Select
            value={formData.priority}
            onChange={handleChange("priority")}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={handleChange("dueDate")}
            min={format(new Date(), "yyyy-MM-dd")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <Select
          value={formData.categoryId}
          onChange={handleChange("categoryId")}
          className={errors.categoryId ? "border-error focus:ring-error" : ""}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-error">{errors.categoryId}</p>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1">
          <ApperIcon name={initialData ? "Save" : "Plus"} size={16} className="mr-2" />
          {initialData ? "Update Task" : "Create Task"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </motion.form>
  )
}

export default TaskForm