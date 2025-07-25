import React from "react"
import { cn } from "@/utils/cn"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = React.forwardRef(({ 
  className, 
  checked, 
  onChange,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange?.({ target: { checked: !checked } })}
        className={cn(
          "w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center",
          checked 
            ? "bg-primary border-primary" 
            : "border-gray-300 hover:border-gray-400",
          className
        )}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <ApperIcon name="Check" size={12} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox