import categoriesData from "@/services/mockData/categories.json"

class CategoryService {
  constructor() {
    this.storageKey = "taskflow_categories"
    this.initializeStorage()
  }

  initializeStorage() {
    const existing = localStorage.getItem(this.storageKey)
    if (!existing) {
      localStorage.setItem(this.storageKey, JSON.stringify(categoriesData))
    }
  }

  getCategories() {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  saveCategories(categories) {
    localStorage.setItem(this.storageKey, JSON.stringify(categories))
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = this.getCategories()
        resolve([...categories])
      }, 200)
    })
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const categories = this.getCategories()
        const category = categories.find(c => c.Id === parseInt(id))
        if (category) {
          resolve({ ...category })
        } else {
          reject(new Error("Category not found"))
        }
      }, 150)
    })
  }

  async create(categoryData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = this.getCategories()
        const maxId = Math.max(...categories.map(c => c.Id), 0)
        
        const newCategory = {
          Id: maxId + 1,
          id: `category-${maxId + 1}`,
          ...categoryData,
          createdAt: new Date(),
        }
        
        categories.push(newCategory)
        this.saveCategories(categories)
        resolve({ ...newCategory })
      }, 300)
    })
  }

  async update(id, categoryData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const categories = this.getCategories()
        const index = categories.findIndex(c => c.id === id)
        
        if (index !== -1) {
          categories[index] = { ...categories[index], ...categoryData }
          this.saveCategories(categories)
          resolve({ ...categories[index] })
        } else {
          reject(new Error("Category not found"))
        }
      }, 250)
    })
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const categories = this.getCategories()
        const index = categories.findIndex(c => c.id === id)
        
        if (index !== -1) {
          const deletedCategory = categories.splice(index, 1)[0]
          this.saveCategories(categories)
          resolve({ ...deletedCategory })
        } else {
          reject(new Error("Category not found"))
        }
      }, 200)
    })
  }
}

export const categoryService = new CategoryService()