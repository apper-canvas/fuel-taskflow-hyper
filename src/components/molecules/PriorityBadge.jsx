import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const PriorityBadge = ({ priority, className }) => {
  const priorityConfig = {
    high: {
      color: "bg-error text-white",
      icon: "AlertTriangle",
      label: "High"
    },
    medium: {
      color: "bg-warning text-white",
      icon: "Clock",
      label: "Medium"
    },
    low: {
      color: "bg-success text-white",
      icon: "ArrowDown",
      label: "Low"
    }
  }

  const config = priorityConfig[priority] || priorityConfig.low

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200",
        config.color,
        className
      )}
    >
      <ApperIcon name={config.icon} size={10} />
      <span>{config.label}</span>
    </motion.div>
  )
}

export default PriorityBadge