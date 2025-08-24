import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'

const UploadData = ({ onDataUpload, onError, loading, setLoading }) => {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ]
    
    if (!validTypes.includes(file.type)) {
      onError('Please upload a valid Excel file (.xlsx, .xls) or CSV file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('File size must be less than 10MB')
      return
    }

    setLoading(true)
    setFileName(file.name)
    setFileSize(formatFileSize(file.size))

    try {
      const data = await parseFile(file)
      onDataUpload(data)
    } catch (error) {
      console.error('Error parsing file:', error)
      onError('Error parsing file. Please check if the file format is correct.')
    } finally {
      setLoading(false)
    }
  }

  const parseFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = e.target.result
          let workbook
          
          if (file.type === 'text/csv') {
            // Handle CSV files
            const lines = data.split('\n')
            const headers = lines[0].split(',').map(h => h.trim())
            const rows = lines.slice(1).filter(line => line.trim())
            
            const parsedData = rows.map(line => {
              const values = line.split(',').map(v => v.trim())
              const row = {}
              headers.forEach((header, index) => {
                let value = values[index] || ''
                // Try to convert numeric values
                if (!isNaN(value) && value !== '') {
                  value = parseFloat(value)
                }
                row[header] = value
              })
              return row
            })
            
            resolve(parsedData)
          } else {
            // Handle Excel files
            workbook = XLSX.read(data, { type: 'binary' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            
            if (jsonData.length < 2) {
              reject(new Error('File must contain at least headers and one data row'))
              return
            }
            
            const headers = jsonData[0]
            const rows = jsonData.slice(1)
            
            const parsedData = rows.map(row => {
              const rowData = {}
              headers.forEach((header, index) => {
                let value = row[index] || ''
                // Try to convert numeric values
                if (typeof value === 'string' && !isNaN(value) && value !== '') {
                  value = parseFloat(value)
                }
                rowData[header] = value
              })
              return rowData
            })
            
            resolve(parsedData)
          }
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Error reading file'))
      
      if (file.type === 'text/csv') {
        reader.readAsText(file)
      } else {
        reader.readAsBinaryString(file)
      }
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4"
        >
          <FileSpreadsheet className="h-10 w-10 text-primary-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Your Crime Dataset
        </h2>
        <p className="text-gray-600">
          Upload an Excel file (.xlsx, .xls) or CSV file containing women-related crime data for Pune city
        </p>
      </div>

      <div className="card">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            dragActive
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {loading ? (
            <div className="space-y-4">
              <Loader2 className="mx-auto h-12 w-12 text-primary-600 animate-spin" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Processing your file...
                </h3>
                <p className="text-sm text-gray-500">
                  Please wait while we parse your dataset
                </p>
              </div>
            </div>
          ) : fileName ? (
            <div className="space-y-4">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  File uploaded successfully!
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">{fileName}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Size: {fileSize}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your file here
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse files
                </p>
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="btn-primary"
                >
                  Choose File
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Supports .xlsx, .xls, and .csv files up to 10MB
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInput}
        />

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Expected Data Format:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Location</strong> - Police station or area name</li>
            <li>• <strong>Year</strong> - Year of the crime data</li>
            <li>• <strong>Crime Categories</strong> - Columns for different crime types (e.g., Assault, Rape, Kidnapping)</li>
            <li>• <strong>Values</strong> - Numeric counts for each crime category</li>
          </ul>
        </div>

        {/* Sample Data Preview */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Sample Data Structure:</h4>
          <div className="text-xs text-gray-600 font-mono bg-white p-3 rounded border overflow-x-auto">
            <div>Location,Year,Assault,Rape,Kidnapping,Cruelty</div>
            <div>Koregaon Park,2023,15,8,3,12</div>
            <div>Deccan Gymkhana,2023,22,5,1,18</div>
            <div>Viman Nagar,2023,18,12,4,25</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default UploadData
