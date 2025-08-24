import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Plot from 'plotly.js-dist'
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react'

const HeatmapChart = ({ data }) => {
  const chartRef = useRef(null)
  const plotRef = useRef(null)

  useEffect(() => {
    if (!data || data.length === 0) return

    // Extract crime categories (excluding Location and Year)
    const crimeCategories = Object.keys(data[0]).filter(key => 
      key !== 'Location' && key !== 'Year' && typeof data[0][key] === 'number'
    )

    // Prepare data for heatmap
    const locations = [...new Set(data.map(item => item.Location))]
    const years = [...new Set(data.map(item => item.Year))].sort()
    
    // Create z matrix for heatmap
    const zMatrix = crimeCategories.map(crime => {
      return locations.map(location => {
        const locationData = data.filter(item => item.Location === location)
        if (locationData.length === 0) return 0
        
        // Sum all years for this location and crime type
        return locationData.reduce((sum, item) => sum + (item[crime] || 0), 0)
      })
    })

    // Calculate total crimes per location for color intensity
    const totalCrimesPerLocation = locations.map(location => {
      const locationData = data.filter(item => item.Location === location)
      return locationData.reduce((sum, item) => {
        return sum + crimeCategories.reduce((crimeSum, crime) => crimeSum + (item[crime] || 0), 0)
      }, 0)
    })

    // Find max value for color scaling
    const maxValue = Math.max(...zMatrix.flat())

    const layout = {
      title: {
        text: 'Crime Distribution Heatmap',
        font: { size: 18, color: '#1f2937' },
        x: 0.5
      },
      xaxis: {
        title: 'Police Station/Area',
        tickangle: -45,
        tickfont: { size: 10 },
        tickmode: 'array',
        tickvals: locations.map((_, i) => i),
        ticktext: locations
      },
      yaxis: {
        title: 'Crime Categories',
        tickmode: 'array',
        tickvals: crimeCategories.map((_, i) => i),
        ticktext: crimeCategories
      },
      margin: { l: 80, r: 50, t: 80, b: 120 },
      height: 500,
      coloraxis: {
        colorscale: [
          [0, '#f0f9ff'],    // Light blue
          [0.2, '#7dd3fc'],  // Blue
          [0.4, '#0ea5e9'],  // Darker blue
          [0.6, '#0369a1'],  // Even darker blue
          [0.8, '#1e40af'],  // Dark blue
          [1, '#1e3a8a']     // Very dark blue
        ],
        colorbar: {
          title: 'Crime Count',
          thickness: 20,
          len: 0.8
        }
      },
      annotations: []
    }

    // Add annotations for total crime counts
    locations.forEach((location, i) => {
      const total = totalCrimesPerLocation[i]
      layout.annotations.push({
        x: i,
        y: -0.5,
        text: `Total: ${total}`,
        showarrow: false,
        font: { size: 10, color: '#6b7280' },
        xref: 'x',
        yref: 'paper'
      })
    })

    const plotData = [{
      z: zMatrix,
      x: locations,
      y: crimeCategories,
      type: 'heatmap',
      hoverongaps: false,
      hovertemplate: 
        '<b>%{y}</b><br>' +
        '<b>%{x}</b><br>' +
        'Count: %{z}<br>' +
        '<extra></extra>',
      hoverlabel: {
        bgcolor: 'white',
        bordercolor: '#e5e7eb',
        font: { color: '#1f2937' }
      }
    }]

    if (plotRef.current) {
      Plot.newPlot(chartRef.current, plotData, layout, { responsive: true })
    }
  }, [data])

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-300 mb-2" />
          <p>No data available for heatmap visualization</p>
        </div>
      </div>
    )
  }

  // Calculate summary statistics
  const crimeCategories = Object.keys(data[0]).filter(key => 
    key !== 'Location' && key !== 'Year' && typeof data[0][key] === 'number'
  )
  
  const totalCrimes = data.reduce((sum, item) => {
    return sum + crimeCategories.reduce((crimeSum, crime) => crimeSum + (item[crime] || 0), 0)
  }, 0)

  const avgCrimesPerLocation = totalCrimes / data.length

  const topCrimeType = crimeCategories.reduce((top, crime) => {
    const total = data.reduce((sum, item) => sum + (item[crime] || 0), 0)
    return total > top.total ? { type: crime, total } : top
  }, { type: '', total: 0 })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Crimes</p>
              <p className="text-2xl font-bold text-blue-900">{totalCrimes.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Avg per Location</p>
              <p className="text-2xl font-bold text-green-900">{avgCrimesPerLocation.toFixed(1)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Top Crime Type</p>
              <p className="text-lg font-bold text-purple-900">{topCrimeType.type}</p>
              <p className="text-sm text-purple-700">{topCrimeType.total} cases</p>
            </div>
            <TrendingDown className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Heatmap Chart */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div ref={chartRef} className="w-full" />
      </div>

      {/* Chart Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 rounded"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-300 rounded"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span>High</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-900 rounded"></div>
          <span>Very High</span>
        </div>
      </div>
    </motion.div>
  )
}

export default HeatmapChart
