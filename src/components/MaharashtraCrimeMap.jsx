import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MaharashtraCrimeMap = ({ data }) => {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedCrimeType, setSelectedCrimeType] = useState('all')
  const [maharashtraData, setMaharashtraData] = useState(null)
  const [map, setMap] = useState(null)
  const [mapContainer, setMapContainer] = useState(null)

  // Maharashtra districts with approximate coordinates for visualization (36 districts)
  // Updated to match exact CSV location names for proper data matching
  const maharashtraDistricts = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, region: 'Konkan' },
    { name: 'Thane', lat: 19.2183, lng: 72.9781, region: 'Konkan' },
    { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297, region: 'Konkan' },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, region: 'Western Maharashtra' },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882, region: 'Vidarbha' },
    { name: 'Nashik', lat: 19.9975, lng: 73.7898, region: 'Northern Maharashtra' },
    { name: 'Aurangabad', lat: 19.8762, lng: 75.3433, region: 'Marathwada' },
    { name: 'Solapur', lat: 17.6599, lng: 75.9064, region: 'Western Maharashtra' },
    { name: 'Kolhapur', lat: 16.7050, lng: 74.2433, region: 'Western Maharashtra' },
    { name: 'Amravati', lat: 20.9374, lng: 77.7796, region: 'Vidarbha' },
    { name: 'Akola', lat: 20.7081, lng: 77.0016, region: 'Vidarbha' },
    { name: 'Jalgaon', lat: 21.0489, lng: 75.5601, region: 'Northern Maharashtra' },
    { name: 'Sangli', lat: 16.8661, lng: 74.5654, region: 'Western Maharashtra' },
    { name: 'Dhule', lat: 20.9024, lng: 74.7733, region: 'Northern Maharashtra' },
    { name: 'Nanded', lat: 19.1383, lng: 77.3210, region: 'Marathwada' },
    { name: 'Latur', lat: 18.4088, lng: 76.5604, region: 'Marathwada' },
    { name: 'Ahmednagar', lat: 19.0952, lng: 74.7499, region: 'Western Maharashtra' },
    { name: 'Chandrapur', lat: 19.9615, lng: 79.2961, region: 'Vidarbha' },
    { name: 'Beed', lat: 18.9894, lng: 75.7564, region: 'Marathwada' },
    { name: 'Jalna', lat: 19.8413, lng: 75.8860, region: 'Marathwada' },
    { name: 'Parbhani', lat: 19.2183, lng: 76.7788, region: 'Marathwada' },
    { name: 'Satara', lat: 17.6868, lng: 74.0069, region: 'Western Maharashtra' },
    { name: 'Ratnagiri', lat: 16.9902, lng: 73.3120, region: 'Konkan' },
    { name: 'Raigad', lat: 18.2823, lng: 73.3619, region: 'Konkan' },
    { name: 'Yavatmal', lat: 20.3888, lng: 78.1204, region: 'Vidarbha' },
    { name: 'Buldhana', lat: 20.5314, lng: 76.1833, region: 'Vidarbha' },
    { name: 'Wardha', lat: 20.7453, lng: 78.6022, region: 'Vidarbha' },
    { name: 'Gondia', lat: 21.4602, lng: 80.1920, region: 'Vidarbha' },
    { name: 'Bhandara', lat: 21.1702, lng: 79.6489, region: 'Vidarbha' },
    { name: 'Gadchiroli', lat: 20.1809, lng: 80.0039, region: 'Vidarbha' },
    { name: 'Hingoli', lat: 19.7156, lng: 77.1404, region: 'Marathwada' },
    { name: 'Osmanabad', lat: 18.1667, lng: 76.0500, region: 'Marathwada' },
    { name: 'Washim', lat: 20.1000, lng: 77.1500, region: 'Vidarbha' },
    { name: 'Palghar', lat: 19.6969, lng: 72.7674, region: 'Konkan' },
    { name: 'Bhiwandi', lat: 19.2969, lng: 73.0625, region: 'Konkan' },
    { name: 'Kalyan', lat: 19.2433, lng: 73.1305, region: 'Konkan' },
    { name: 'Ulhasnagar', lat: 19.2183, lng: 73.1633, region: 'Konkan' },
    { name: 'Mira-Bhayandar', lat: 19.2957, lng: 72.8544, region: 'Konkan' },
    { name: 'Vasai-Virar', lat: 19.4259, lng: 72.8224, region: 'Konkan' },
    { name: 'Panvel', lat: 18.9881, lng: 73.1103, region: 'Konkan' },
    { name: 'Karjat', lat: 18.9107, lng: 73.3236, region: 'Konkan' },
    { name: 'Alibag', lat: 18.6414, lng: 72.8722, region: 'Konkan' },
    { name: 'Pen', lat: 18.7379, lng: 73.0960, region: 'Konkan' },
    { name: 'Mangaon', lat: 18.2333, lng: 73.2833, region: 'Konkan' },
    { name: 'Mahad', lat: 18.0833, lng: 73.4167, region: 'Konkan' },
    { name: 'Mhasla', lat: 18.1333, lng: 73.1167, region: 'Konkan' },
    { name: 'Shrivardhan', lat: 18.0333, lng: 72.9833, region: 'Konkan' },
    { name: 'Murud', lat: 18.1167, lng: 72.9667, region: 'Konkan' },
    { name: 'Dapoli', lat: 17.7500, lng: 73.1833, region: 'Konkan' },
    { name: 'Guhagar', lat: 17.4667, lng: 73.2000, region: 'Konkan' },
    { name: 'Chiplun', lat: 17.5333, lng: 73.5167, region: 'Konkan' },
    { name: 'Sangameshwar', lat: 16.8500, lng: 73.5500, region: 'Konkan' },
    { name: 'Khed', lat: 17.7167, lng: 73.3833, region: 'Konkan' },
    { name: 'Mahabaleshwar', lat: 17.9333, lng: 73.6500, region: 'Western Maharashtra' },
    { name: 'Wai', lat: 17.9500, lng: 73.8833, region: 'Western Maharashtra' },
    { name: 'Phaltan', lat: 17.9833, lng: 74.4333, region: 'Western Maharashtra' },
    { name: 'Baramati', lat: 18.1500, lng: 74.5833, region: 'Western Maharashtra' },
    { name: 'Indapur', lat: 18.1167, lng: 75.0167, region: 'Western Maharashtra' },
    { name: 'Daund', lat: 18.4667, lng: 74.6000, region: 'Western Maharashtra' },
    { name: 'Purandar', lat: 18.4667, lng: 73.9833, region: 'Western Maharashtra' },
    { name: 'Bhor', lat: 18.1667, lng: 73.8500, region: 'Western Maharashtra' },
    { name: 'Velhe', lat: 18.0833, lng: 73.9500, region: 'Western Maharashtra' },
    { name: 'Mulshi', lat: 18.5167, lng: 73.6500, region: 'Western Maharashtra' },
    { name: 'Maval', lat: 18.7500, lng: 73.4167, region: 'Western Maharashtra' },
    { name: 'Junnar', lat: 19.2000, lng: 73.8833, region: 'Western Maharashtra' },
    { name: 'Ambegaon', lat: 19.1167, lng: 73.7167, region: 'Western Maharashtra' },
    { name: 'Shirur', lat: 18.9833, lng: 74.3667, region: 'Western Maharashtra' },
    { name: 'Haveli', lat: 18.5167, lng: 73.8500, region: 'Western Maharashtra' },
    { name: 'Pimpri-Chinchwad', lat: 18.6298, lng: 73.7997, region: 'Western Maharashtra' },
    { name: 'Talegaon', lat: 18.7333, lng: 73.6833, region: 'Western Maharashtra' },
    { name: 'Lonavala', lat: 18.7500, lng: 73.4167, region: 'Western Maharashtra' },
    { name: 'Khandala', lat: 18.7833, lng: 73.3667, region: 'Western Maharashtra' },
    { name: 'Matheran', lat: 18.9833, lng: 73.2667, region: 'Konkan' },
    { name: 'Badlapur', lat: 19.1500, lng: 73.2667, region: 'Konkan' },
    { name: 'Ambernath', lat: 19.2167, lng: 73.1833, region: 'Konkan' },
    { name: 'Dombivli', lat: 19.2167, lng: 73.0833, region: 'Konkan' },
    { name: 'Kopar Khairane', lat: 19.1000, lng: 73.0167, region: 'Konkan' },
    { name: 'Sanpada', lat: 19.0667, lng: 73.0167, region: 'Konkan' },
    { name: 'Nerul', lat: 19.0333, lng: 73.0167, region: 'Konkan' },
    { name: 'Belapur', lat: 19.0333, lng: 73.0333, region: 'Konkan' },
    { name: 'Taloja', lat: 19.0167, lng: 73.0667, region: 'Konkan' },
    { name: 'Kharghar', lat: 19.0333, lng: 73.0667, region: 'Konkan' },
    { name: 'Kamothe', lat: 19.0167, lng: 73.0833, region: 'Konkan' },
    { name: 'New Panvel', lat: 18.9833, lng: 73.1000, region: 'Konkan' },
    { name: 'Uran', lat: 18.8833, lng: 72.9500, region: 'Konkan' },
    { name: 'Dronagiri', lat: 18.8167, lng: 72.9500, region: 'Konkan' },
    { name: 'JNPT', lat: 18.9500, lng: 72.9500, region: 'Konkan' },
    { name: 'Sheva', lat: 18.8167, lng: 72.9500, region: 'Konkan' },
    { name: 'Rewas', lat: 18.8167, lng: 72.9500, region: 'Konkan' },
    { name: 'Mandwa', lat: 18.8167, lng: 72.9500, region: 'Konkan' }
  ]

  const crimeTypes = [
    { key: 'Assault on Women (354)', label: 'Assault on Women', color: '#ef4444' },
    { key: 'Rape (376/511)', label: 'Rape', color: '#dc2626' },
    { key: 'Kidnapping/Abduction (336&364)', label: 'Kidnapping/Abduction', color: '#ea580c' },
    { key: 'Cruelty by Husband/Relatives (498-A)', label: 'Cruelty by Husband/Relatives', color: '#d97706' }
  ]

  const years = [2015, 2017, 2018, 2019, 2020]

  // Auto-load Maharashtra data from CSV when component mounts
  useEffect(() => {
    const loadMaharashtraData = async () => {
      try {
        // Load data from the CSV file
        const response = await fetch('/maharashtra_crime_data.csv')
        const csvText = await response.text()
        
        // Parse CSV data
        const lines = csvText.split('\n')
        const headers = lines[0].split(',')
        const parsedData = []
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',')
            const row = {}
            headers.forEach((header, index) => {
              if (values[index]) {
                row[header.trim()] = values[index].trim()
              }
            })
            parsedData.push(row)
          }
        }
        
        setMaharashtraData(parsedData)
      } catch (error) {
        console.error('Error loading Maharashtra CSV data:', error)
        // Fallback to hardcoded data if CSV fails
        const fallbackData = [
          { Location: 'Mumbai', Year: '2015', 'Assault on Women (354)': '48', 'Rape (376/511)': '22', 'Kidnapping/Abduction (336&364)': '26', 'Cruelty by Husband/Relatives (498-A)': '24' },
          { Location: 'Thane', Year: '2015', 'Assault on Women (354)': '24', 'Rape (376/511)': '18', 'Kidnapping/Abduction (336&364)': '10', 'Cruelty by Husband/Relatives (498-A)': '8' },
          { Location: 'Pune', Year: '2015', 'Assault on Women (354)': '28', 'Rape (376/511)': '13', 'Kidnapping/Abduction (336&364)': '14', 'Cruelty by Husband/Relatives (498-A)': '12' },
          { Location: 'Nagpur', Year: '2015', 'Assault on Women (354)': '42', 'Rape (376/511)': '9', 'Kidnapping/Abduction (336&364)': '27', 'Cruelty by Husband/Relatives (498-A)': '25' },
          { Location: 'Ratnagiri', Year: '2015', 'Assault on Women (354)': '136', 'Rape (376/511)': '15', 'Kidnapping/Abduction (336&364)': '76', 'Cruelty by Husband/Relatives (498-A)': '78' },
          { Location: 'Yavatmal', Year: '2015', 'Assault on Women (354)': '132', 'Rape (376/511)': '9', 'Kidnapping/Abduction (336&364)': '68', 'Cruelty by Husband/Relatives (498-A)': '67' },
          { Location: 'Mumbai', Year: '2017', 'Assault on Women (354)': '16', 'Rape (376/511)': '8', 'Kidnapping/Abduction (336&364)': '16', 'Cruelty by Husband/Relatives (498-A)': '10' },
          { Location: 'Pune', Year: '2017', 'Assault on Women (354)': '9', 'Rape (376/511)': '1', 'Kidnapping/Abduction (336&364)': '2', 'Cruelty by Husband/Relatives (498-A)': '1' }
        ]
        setMaharashtraData(fallbackData)
      }
    }

    loadMaharashtraData()
  }, [])

  // Initialize Leaflet map
  useEffect(() => {
    if (mapContainer && !map) {
      const newMap = L.map(mapContainer).setView([20.5937, 78.9629], 7)
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(newMap)
      
      setMap(newMap)
    }

    return () => {
      if (map) {
        map.remove()
        setMap(null)
      }
    }
  }, [mapContainer, map])

  // Add markers to map when data changes
  useEffect(() => {
    if (map && maharashtraData) {
      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      // Add markers for each district
      maharashtraDistricts.forEach((district) => {
        // Find data for this district (case-insensitive matching)
        const districtData = maharashtraData.filter(item => 
          item.Location && item.Location.toLowerCase() === district.name.toLowerCase()
        )
        
        if (districtData.length > 0) {
          const totalCrimes = crimeTypes.reduce((sum, crimeType) => {
            return sum + districtData.reduce((districtSum, item) => {
              return districtSum + (parseInt(item[crimeType.key]) || 0)
            }, 0)
          }, 0)

          // Create custom icon based on crime intensity
          const markerColor = totalCrimes > 100 ? '#dc2626' : 
                             totalCrimes > 50 ? '#ea580c' : 
                             totalCrimes > 20 ? '#d97706' : '#16a34a'
          
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })

          const marker = L.marker([district.lat, district.lng], { icon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #1f2937; font-weight: bold;">${district.name}</h3>
                <p style="margin: 5px 0; color: #6b7280; font-size: 12px;">Region: ${district.region}</p>
                <p style="margin: 5px 0; color: #dc2626; font-weight: bold;">Total Crimes: ${totalCrimes}</p>
                <button onclick="window.selectDistrict('${district.name}')" style="background: #dc2626; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">View Details</button>
              </div>
            `)

          // Add click handler
          marker.on('click', () => {
            setSelectedLocation(district.name)
          })
        }
      })
    }
  }, [map, maharashtraData])

  // Use either uploaded data or auto-loaded data
  const workingData = data || maharashtraData

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    if (!workingData) return []
    
    let filtered = [...workingData]
    
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.Year === selectedYear.toString())
    }
    
    if (selectedCrimeType !== 'all') {
      filtered = filtered.filter(item => parseInt(item[selectedCrimeType]) > 0)
    }
    
    return filtered
  }, [workingData, selectedYear, selectedCrimeType])

  // Calculate crime statistics
  const crimeStats = useMemo(() => {
    if (!filteredData.length) return null
    
    const stats = {
      totalCrimes: 0,
      crimeTypeBreakdown: {},
      yearBreakdown: {},
      regionBreakdown: {},
      topDistricts: []
    }

    filteredData.forEach(item => {
      crimeTypes.forEach(crimeType => {
        const count = parseInt(item[crimeType.key]) || 0
        stats.totalCrimes += count
        
        if (!stats.crimeTypeBreakdown[crimeType.key]) {
          stats.crimeTypeBreakdown[crimeType.key] = 0
        }
        stats.crimeTypeBreakdown[crimeType.key] += count
      })

      if (!stats.yearBreakdown[item.Year]) {
        stats.yearBreakdown[item.Year] = 0
      }
      crimeTypes.forEach(crimeType => {
        stats.yearBreakdown[item.Year] += parseInt(item[crimeType.key]) || 0
      })

      const district = maharashtraDistricts.find(d => 
        d.name.toLowerCase() === item.Location.toLowerCase()
      )
      if (district) {
        if (!stats.regionBreakdown[district.region]) {
          stats.regionBreakdown[district.region] = 0
        }
        crimeTypes.forEach(crimeType => {
          stats.regionBreakdown[district.region] += parseInt(item[crimeType.key]) || 0
        })
      }
    })

    // Calculate top districts by total crimes
    const districtTotals = {}
    filteredData.forEach(item => {
      const locationKey = item.Location ? item.Location.toLowerCase() : ''
      if (!districtTotals[locationKey]) {
        districtTotals[locationKey] = 0
      }
      crimeTypes.forEach(crimeType => {
        districtTotals[locationKey] += parseInt(item[crimeType.key]) || 0
      })
    })

    stats.topDistricts = Object.entries(districtTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ 
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        count 
      }))

    return stats
  }, [filteredData])

  const getDistrictData = (districtName) => {
    if (!workingData) return null
    return workingData.filter(item => 
      item.Location && item.Location.toLowerCase() === districtName.toLowerCase()
    )
  }

  // Global function for popup buttons
  useEffect(() => {
    window.selectDistrict = setSelectedLocation
    return () => {
      delete window.selectDistrict
    }
  }, [])

  if (!workingData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Loading Maharashtra data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - No upload needed */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <MapPin className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Maharashtra Crime Data</h3>
            <p className="text-sm text-blue-700">Data loaded from maharashtra_crime_data.csv - 36 Districts - No file upload required</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Crime Type</label>
          <select
            value={selectedCrimeType}
            onChange={(e) => setSelectedCrimeType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Crimes</option>
            {crimeTypes.map(crimeType => (
              <option key={crimeType.key} value={crimeType.key}>{crimeType.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      {crimeStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Crimes</p>
                <p className="text-2xl font-bold text-gray-900">{crimeStats.totalCrimes}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Districts</p>
                <p className="text-2xl font-bold text-gray-900">36</p>
              </div>
              <MapPin className="h-8 w-8 text-primary-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Regions</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(crimeStats.regionBreakdown).length}</p>
              </div>
              <PieChart className="h-8 w-8 text-primary-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Years</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(crimeStats.yearBreakdown).length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Leaflet Map */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Maharashtra Crime Distribution Map</h3>
        
        <div 
          ref={setMapContainer}
          className="h-96 rounded-lg border border-gray-200"
          style={{ zIndex: 1 }}
        />
        
        {/* Map Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span>High Crime (100+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Medium Crime (50-99)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Low Crime (20-49)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>Very Low Crime (&lt;20)</span>
          </div>
        </div>
      </div>

      {/* District Details */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedLocation} Crime Details
            </h3>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {crimeTypes.map(crimeType => {
              const districtData = getDistrictData(selectedLocation)
              if (!districtData) return null

              const crimeData = districtData.map(item => ({
                year: item.Year,
                count: parseInt(item[crimeType.key]) || 0
              }))

              const totalCount = crimeData.reduce((sum, item) => sum + item.count, 0)
              const trend = crimeData.length > 1 
                ? crimeData[crimeData.length - 1].count - crimeData[0].count
                : 0

              return (
                <div key={crimeType.key} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{crimeType.label}</h4>
                    <div className="flex items-center space-x-1">
                      {trend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : trend < 0 ? (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                  <p className="text-sm text-gray-500">
                    {trend > 0 ? `+${trend}` : trend < 0 ? trend : 'No change'} from 2015-2020
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Top Districts Table */}
      {/* {crimeStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Districts by Crime Rate</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Crimes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {crimeStats.topDistricts.map((district, index) => {
                  const districtInfo = maharashtraDistricts.find(d => d.name === district.name)
                  return (
                    <tr key={district.name} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLocation(district.name)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {district.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {district.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {districtInfo?.region || 'N/A'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )} */}

      {/* All Districts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Maharashtra Districts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {maharashtraDistricts.map((district) => {
            const districtData = getDistrictData(district.name)
            const totalCrimes = districtData ? crimeTypes.reduce((sum, crimeType) => {
              return sum + districtData.reduce((districtSum, item) => {
                return districtSum + (parseInt(item[crimeType.key]) || 0)
              }, 0)
            }, 0) : 0

            return (
              <div 
                key={district.name}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                onClick={() => setSelectedLocation(district.name)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{district.name}</h4>
                    <p className="text-sm text-gray-500">{district.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{totalCrimes}</p>
                    <p className="text-xs text-gray-500">crimes</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

export default MaharashtraCrimeMap
