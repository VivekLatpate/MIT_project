import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip } from 'react-leaflet'
import { MapPin, AlertTriangle, Info } from 'lucide-react'

// Pune city center coordinates
const PUNE_CENTER = [18.5204, 73.8567]

// Sample coordinates for Pune police stations/areas
// In a real application, you would use geocoding API or have accurate coordinates
const PUNE_LOCATIONS = {
  'Koregaon Park': [18.5314, 73.8906],
  'Deccan Gymkhana': [18.5291, 73.8564],
  'Viman Nagar': [18.5689, 73.9085],
  'Kalyani Nagar': [18.5489, 73.9047],
  'Bund Garden': [18.5347, 73.8706],
  'Camp': [18.5291, 73.8564],
  'Khadki': [18.5656, 73.8667],
  'Yerwada': [18.5489, 73.9047],
  'Hadapsar': [18.4966, 73.9419],
  'Wanowrie': [18.4966, 73.9419],
  'Kondhwa': [18.4569, 73.9013],
  'Kharadi': [18.5489, 73.9047],
  'Vishrantwadi': [18.5489, 73.9047],
  'Airport': [18.5821, 73.9197],
  'Hinjewadi': [18.5916, 73.7389],
  'Baner': [18.5596, 73.7863],
  'Aundh': [18.5596, 73.7863]
}

const PuneCrimeMap = ({ data }) => {
  const [mapData, setMapData] = useState([])
  const [maxCrimeCount, setMaxCrimeCount] = useState(0)
  const [selectedLocation, setSelectedLocation] = useState(null)

  useEffect(() => {
    if (!data || data.length === 0) return

    // Extract crime categories (excluding Location and Year)
    const crimeCategories = Object.keys(data[0]).filter(key => 
      key !== 'Location' && key !== 'Year' && typeof data[0][key] === 'number'
    )

    // Aggregate data by location
    const locationData = {}
    data.forEach(item => {
      if (!locationData[item.Location]) {
        locationData[item.Location] = {
          location: item.Location,
          coordinates: PUNE_LOCATIONS[item.Location] || [0, 0],
          totalCrimes: 0,
          crimeBreakdown: {},
          years: new Set()
        }
      }
      
      // Sum crimes for this location
      crimeCategories.forEach(crime => {
        const count = item[crime] || 0
        locationData[item.Location].totalCrimes += count
        locationData[item.Location].crimeBreakdown[crime] = 
          (locationData[item.Location].crimeBreakdown[crime] || 0) + count
      })
      
      locationData[item.Location].years.add(item.Year)
    })

    // Convert to array and find max crime count
    const mapDataArray = Object.values(locationData).filter(item => 
      item.coordinates[0] !== 0 && item.coordinates[1] !== 0
    )
    
    const maxCount = Math.max(...mapDataArray.map(item => item.totalCrimes))
    
    setMapData(mapDataArray)
    setMaxCrimeCount(maxCount)
  }, [data])

  const getMarkerColor = (crimeCount) => {
    const intensity = crimeCount / maxCrimeCount
    
    if (intensity < 0.25) return '#10b981' // Green
    if (intensity < 0.5) return '#f59e0b'  // Yellow
    if (intensity < 0.75) return '#f97316'  // Orange
    return '#ef4444' // Red
  }

  const getMarkerSize = (crimeCount) => {
    const baseSize = 8
    const maxSize = 25
    const intensity = crimeCount / maxCrimeCount
    return baseSize + (intensity * (maxSize - baseSize))
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-2" />
          <p>No data available for map visualization</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Map Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Low Crime</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Medium Crime</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">High Crime</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Very High Crime</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Info className="h-4 w-4" />
          <span>Click markers for crime details</span>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <MapContainer
          center={PUNE_CENTER}
          zoom={11}
          style={{ height: '500px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Crime Markers */}
          {mapData.map((item, index) => (
            <CircleMarker
              key={index}
              center={item.coordinates}
              radius={getMarkerSize(item.totalCrimes)}
              fillColor={getMarkerColor(item.totalCrimes)}
              color={getMarkerColor(item.totalCrimes)}
              weight={2}
              opacity={0.8}
              fillOpacity={0.6}
              eventHandlers={{
                click: () => setSelectedLocation(item)
              }}
            >
              <Tooltip>
                <div className="text-center">
                  <strong>{item.location}</strong><br />
                  Total Crimes: {item.totalCrimes}
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Crime Details Popup */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Crime Details - {selectedLocation.location}
            </h3>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Crimes:</span>
                  <span className="font-semibold text-red-600">{selectedLocation.totalCrimes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Years:</span>
                  <span className="font-semibold">
                    {Array.from(selectedLocation.years).sort().join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coordinates:</span>
                  <span className="font-mono text-sm">
                    {selectedLocation.coordinates[0].toFixed(4)}, {selectedLocation.coordinates[1].toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Crime Breakdown</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {Object.entries(selectedLocation.crimeBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .map(([crime, count]) => (
                    <div key={crime} className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">{crime}:</span>
                      <span className="font-semibold text-gray-900">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <AlertTriangle className="h-4 w-4" />
              <span>
                This data represents reported cases. Actual numbers may vary.
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Map Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-3">Crime Intensity Legend</h4>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>0 - {Math.round(maxCrimeCount * 0.25)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>{Math.round(maxCrimeCount * 0.25) + 1} - {Math.round(maxCrimeCount * 0.5)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span>{Math.round(maxCrimeCount * 0.5) + 1} - {Math.round(maxCrimeCount * 0.75)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>{Math.round(maxCrimeCount * 0.75) + 1} - {maxCrimeCount}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PuneCrimeMap
