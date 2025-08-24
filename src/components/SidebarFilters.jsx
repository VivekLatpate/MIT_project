import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, Calendar, Shield, BarChart3, RefreshCw } from 'lucide-react'

const SidebarFilters = ({ data, filters, onFiltersChange }) => {
  const [availableYears, setAvailableYears] = useState([])
  const [availableCrimeTypes, setAvailableCrimeTypes] = useState([])
  const [crimeTypeStats, setCrimeTypeStats] = useState({})

  useEffect(() => {
    if (!data || data.length === 0) return

    // Extract available years
    const years = [...new Set(data.map(item => item.Year))].sort((a, b) => b - a)
    setAvailableYears(years)

    // Extract crime categories (excluding Location and Year)
    const crimeTypes = Object.keys(data[0]).filter(key => 
      key !== 'Location' && key !== 'Year' && typeof data[0][key] === 'number'
    )
    setAvailableCrimeTypes(crimeTypes)

    // Calculate statistics for each crime type
    const stats = {}
    crimeTypes.forEach(crimeType => {
      const total = data.reduce((sum, item) => sum + (item[crimeType] || 0), 0)
      const avg = total / data.length
      const max = Math.max(...data.map(item => item[crimeType] || 0))
      stats[crimeType] = { total, avg: avg.toFixed(1), max }
    })
    setCrimeTypeStats(stats)
  }, [data])

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    })
  }

  const resetFilters = () => {
    onFiltersChange({
      year: 'all',
      crimeType: 'all'
    })
  }

  const getFilteredDataCount = () => {
    if (!data) return 0
    
    let filtered = [...data]
    
    if (filters.year !== 'all') {
      filtered = filtered.filter(item => item.Year === parseInt(filters.year))
    }
    
    if (filters.crimeType !== 'all') {
      filtered = filtered.filter(item => item[filters.crimeType] > 0)
    }
    
    return filtered.length
  }

  if (!data || data.length === 0) {
    return (
      <div className="card">
        <div className="text-center text-gray-500">
          <Filter className="mx-auto h-8 w-8 text-gray-300 mb-2" />
          <p>No data available for filtering</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Filters Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary-600" />
            <span>Filters</span>
          </h3>
          <button
            onClick={resetFilters}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Year Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Year</span>
          </label>
          <select
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="input-field"
          >
            <option value="all">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Crime Type Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <span>Crime Type</span>
          </label>
          <select
            value={filters.crimeType}
            onChange={(e) => handleFilterChange('crimeType', e.target.value)}
            className="input-field"
          >
            <option value="all">All Crime Types</option>
            {availableCrimeTypes.map(crimeType => (
              <option key={crimeType} value={crimeType}>{crimeType}</option>
            ))}
          </select>
        </div>

        {/* Results Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Results</span>
            <span className="text-sm text-gray-500">
              {getFilteredDataCount()} of {data.length} locations
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getFilteredDataCount() / data.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Crime Type Statistics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary-600" />
          <span>Crime Statistics</span>
        </h3>
        
        <div className="space-y-3">
          {availableCrimeTypes.map(crimeType => {
            const stats = crimeTypeStats[crimeType]
            const isSelected = filters.crimeType === crimeType
            
            return (
              <motion.div
                key={crimeType}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-primary-300 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleFilterChange('crimeType', isSelected ? 'all' : crimeType)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium text-sm ${
                    isSelected ? 'text-primary-700' : 'text-gray-700'
                  }`}>
                    {crimeType}
                  </span>
                  {isSelected && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{stats.total}</div>
                    <div className="text-gray-500">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{stats.avg}</div>
                    <div className="text-gray-500">Avg</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{stats.max}</div>
                    <div className="text-gray-500">Max</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          <button
            onClick={() => handleFilterChange('year', 'all')}
            className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
              filters.year === 'all'
                ? 'border-primary-300 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">Show All Years</div>
            <div className="text-sm text-gray-500">View data from all time periods</div>
          </button>
          
          <button
            onClick={() => handleFilterChange('crimeType', 'all')}
            className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
              filters.crimeType === 'all'
                ? 'border-primary-300 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">Show All Crimes</div>
            <div className="text-sm text-gray-500">View all crime categories</div>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default SidebarFilters
