# 🚨 Pune Crime Analytics Dashboard

A comprehensive web application for visualizing and analyzing women-related crime data in Pune city. Built with React, Tailwind CSS, and interactive mapping technologies.

## ✨ Features

### 📊 Data Visualization
- **Interactive Heatmap**: Visual representation of crime distribution across locations and crime types
- **Summary Statistics**: Key metrics including total crimes, averages, and top crime types
- **Responsive Charts**: Built with Plotly.js for smooth interactions

### 🗺️ Interactive Map
- **Pune City Map**: OpenStreetMap integration with Leaflet.js
- **Crime Heat Layer**: Color-coded markers showing crime intensity
- **Location Details**: Click markers to view detailed crime breakdowns
- **Geographic Context**: Real coordinates for major Pune areas

### 🔍 Advanced Filtering
- **Year-based Filtering**: Filter data by specific years or view all time periods
- **Crime Type Filtering**: Focus on specific crime categories
- **Real-time Updates**: Dynamic filtering with instant visual feedback
- **Statistics Panel**: Detailed breakdowns for each crime type

### 📁 Data Management
- **Multiple Formats**: Support for Excel (.xlsx, .xls) and CSV files
- **Drag & Drop**: Intuitive file upload interface
- **Data Validation**: Automatic format checking and error handling
- **Sample Dataset**: Included sample data for immediate testing

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd heatmap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📊 Data Format Requirements

Your Excel/CSV file should have the following structure:

| Location | Year | Assault | Rape | Kidnapping | Cruelty | Dowry | Harassment |
|----------|------|---------|------|------------|---------|-------|------------|
| Koregaon Park | 2023 | 15 | 8 | 3 | 12 | 5 | 18 |
| Deccan Gymkhana | 2023 | 22 | 5 | 1 | 18 | 3 | 25 |
| Viman Nagar | 2023 | 18 | 12 | 4 | 25 | 8 | 22 |

### Required Columns:
- **Location**: Police station or area name
- **Year**: Year of the crime data
- **Crime Categories**: Any number of columns with numeric crime counts

### Data Guidelines:
- Use consistent location names (they'll be mapped to coordinates)
- Ensure numeric values for crime counts
- Include at least one data row beyond headers
- File size should be under 10MB

## 🗺️ Location Mapping

The application includes pre-mapped coordinates for major Pune areas:

- **Central Areas**: Deccan Gymkhana, Camp, Bund Garden
- **North**: Yerwada, Vishrantwadi, Airport
- **East**: Viman Nagar, Kalyani Nagar, Kharadi
- **South**: Hadapsar, Wanowrie, Kondhwa
- **West**: Khadki, Hinjewadi, Baner, Aundh
- **Popular Areas**: Koregaon Park

*Note: For locations not in the predefined list, you can add coordinates in the `PUNE_LOCATIONS` object in `PuneCrimeMap.jsx`*

## 🎨 Customization

### Styling
- **Tailwind CSS**: Easy color scheme modifications
- **Custom Components**: Reusable UI components with consistent styling
- **Responsive Design**: Mobile-first approach with breakpoint optimizations

### Data Processing
- **Flexible Parsing**: Easy to modify data processing logic
- **Extensible Filters**: Add new filter types in the sidebar
- **Chart Configuration**: Customize Plotly.js chart options

### Map Features
- **Tile Layers**: Switch between different map providers
- **Marker Styling**: Customize marker colors, sizes, and interactions
- **Popup Content**: Modify information displayed in location popups

## 🛠️ Technical Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom components
- **Charts**: Plotly.js for interactive visualizations
- **Maps**: Leaflet.js with OpenStreetMap tiles
- **File Processing**: xlsx library for Excel/CSV parsing
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full dashboard with sidebar and main content
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Stacked layout with touch-friendly interactions

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── UploadData.jsx      # File upload and parsing
│   ├── HeatmapChart.jsx    # Crime heatmap visualization
│   ├── PuneCrimeMap.jsx    # Interactive map component
│   └── SidebarFilters.jsx  # Filtering and statistics
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
└── index.css              # Global styles and Tailwind
```

### Key Components

#### UploadData
- Handles file upload via drag & drop or file picker
- Supports Excel (.xlsx, .xls) and CSV formats
- Validates file format and size
- Parses data and converts to application format

#### HeatmapChart
- Creates interactive heatmap using Plotly.js
- Displays crime distribution across locations and types
- Shows summary statistics and key metrics
- Responsive design with custom color schemes

#### PuneCrimeMap
- Interactive map using Leaflet.js
- Crime intensity visualization with color-coded markers
- Location-based crime breakdowns
- Geographic context for Pune city

#### SidebarFilters
- Year and crime type filtering
- Real-time statistics for each crime category
- Quick action buttons for common filters
- Results summary with progress indicators

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Zero-config deployment
- **Netlify**: Drag & drop deployment
- **GitHub Pages**: Static site hosting
- **AWS S3**: Scalable cloud hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

**Map not loading**: Ensure internet connection for OpenStreetMap tiles
**File upload errors**: Check file format and size (max 10MB)
**Charts not rendering**: Verify data format matches requirements

### Getting Help
- Check the browser console for error messages
- Verify your data format matches the requirements
- Ensure all dependencies are properly installed

## 🔮 Future Enhancements

- **Real-time Data**: API integration for live crime data
- **Advanced Analytics**: Statistical analysis and trend detection
- **Export Features**: Download charts and reports
- **User Authentication**: Multi-user support with data privacy
- **Mobile App**: React Native version for mobile devices
- **Data Sources**: Integration with official crime databases

---

**Built with ❤️ for better understanding and analysis of women-related crimes in Pune city.**
