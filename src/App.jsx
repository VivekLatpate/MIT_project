import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import UploadData from './components/UploadData'
import HeatmapChart from './components/HeatmapChart'
import PuneCrimeMap from './components/PuneCrimeMap'
import SidebarFilters from './components/SidebarFilters'
import { BarChart3, Map, Upload, AlertCircle } from 'lucide-react'

function App() {
  const [data, setData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [filters, setFilters] = useState({
    year: 'all',
    crimeType: 'all'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Update filtered data when filters or data changes
  useEffect(() => {
    if (!data) {
      setFilteredData(null)
      return
    }

    let filtered = [...data]

    // Apply year filter
    if (filters.year !== 'all') {
      filtered = filtered.filter(item => item.Year === parseInt(filters.year))
    }

    // Apply crime type filter
    if (filters.crimeType !== 'all') {
      filtered = filtered.filter(item => item[filters.crimeType] > 0)
    }

    setFilteredData(filtered)
  }, [data, filters])

  const handleDataUpload = (uploadedData) => {
    setData(uploadedData)
    setError(null)
  }

  const handleError = (errorMessage) => {
    setError(errorMessage)
    setData(null)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pune Crime Analytics</h1>
                <p className="text-sm text-gray-500">Women-related crimes visualization dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {data ? `${data.length} locations loaded` : 'No data loaded'}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center min-h-[60vh]"
            >
              <UploadData 
                onDataUpload={handleDataUpload}
                onError={handleError}
                loading={loading}
                setLoading={setLoading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Sidebar Filters */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <SidebarFilters 
                  data={data}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </motion.div>

              {/* Main Content Area */}
              <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6">
                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                  </motion.div>
                )}

                {/* Heatmap Chart */}
                <motion.div variants={itemVariants}>
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-primary-600" />
                        <span>Crime Heatmap</span>
                      </h2>
                      <button
                        onClick={() => setData(null)}
                        className="btn-secondary text-sm"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Data
                      </button>
                    </div>
                    <HeatmapChart data={filteredData} />
                  </div>
                </motion.div>

                {/* Interactive Map */}
                <motion.div variants={itemVariants}>
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <Map className="h-5 w-5 text-primary-600" />
                        <span>Pune Crime Map</span>
                      </h2>
                    </div>
                    <PuneCrimeMap data={filteredData} />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
