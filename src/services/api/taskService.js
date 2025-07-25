import tasksData from "@/services/mockData/tasks.json"

class TaskService {
  constructor() {
    this.storageKey = "taskflow_tasks"
    this.initializeStorage()
  }

  initializeStorage() {
    const existing = localStorage.getItem(this.storageKey)
    if (!existing) {
      localStorage.setItem(this.storageKey, JSON.stringify(tasksData))
    }
  }

  getTasks() {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  saveTasks(tasks) {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks))
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasks()
        resolve([...tasks])
      }, 300)
    })
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tasks = this.getTasks()
        const task = tasks.find(t => t.Id === parseInt(id))
        if (task) {
          resolve({ ...task })
        } else {
          reject(new Error("Task not found"))
        }
      }, 200)
    })
  }

  async create(taskData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasks()
        const maxId = Math.max(...tasks.map(t => t.Id), 0)
        
        const newTask = {
          Id: maxId + 1,
          id: `task-${maxId + 1}`,
          ...taskData,
          completed: false,
          createdAt: new Date(),
          completedAt: null,
        }
        
        tasks.push(newTask)
        this.saveTasks(tasks)
        resolve({ ...newTask })
      }, 400)
    })
  }

  async update(id, taskData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tasks = this.getTasks()
        const index = tasks.findIndex(t => t.id === id)
        
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...taskData }
          this.saveTasks(tasks)
          resolve({ ...tasks[index] })
        } else {
          reject(new Error("Task not found"))
        }
      }, 350)
    })
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tasks = this.getTasks()
        const index = tasks.findIndex(t => t.id === id)
        
        if (index !== -1) {
          const deletedTask = tasks.splice(index, 1)[0]
          this.saveTasks(tasks)
          resolve({ ...deletedTask })
        } else {
          reject(new Error("Task not found"))
        }
      }, 250)
    })
  }

  async getByCategory(categoryId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getTasks()
        const filtered = tasks.filter(t => t.categoryId === categoryId)
        resolve([...filtered])
      }, 300)
    })
  }
}

export const taskService = new TaskService()