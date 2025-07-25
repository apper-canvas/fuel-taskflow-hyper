import { motion } from "framer-motion"

const Loading = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded-lg w-48 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item * 0.1 }}
            className="bg-surface rounded-xl p-4 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Loading