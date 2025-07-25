import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"
import SortDropdown from "@/components/molecules/SortDropdown"
import Button from "@/components/atoms/Button"

const Header = ({ 
  onSearch, 
  onSort, 
  onAddTask, 
  currentSort,
  totalTasks,
  completedTasks 
}) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl">
            <ApperIcon name="CheckSquare" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-gray-600">
              {totalTasks === 0 ? "Ready to organize your tasks" : 
               `${completedTasks} of ${totalTasks} completed (${completionRate}%)`}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 sm:w-80">
            <SearchBar onSearch={onSearch} />
          </div>
          
          <div className="flex items-center space-x-3">
            <SortDropdown onSort={onSort} currentSort={currentSort} />
            <Button onClick={onAddTask} className="whitespace-nowrap">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header