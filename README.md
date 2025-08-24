# Maharashtra Crime Analytics Dashboard

A comprehensive web application for visualizing and analyzing women-related crime data across Maharashtra state, with a focus on Pune city and the broader state perspective.

## Features

### 🏙️ Pune City View
- **Crime Heatmap**: Interactive heatmap visualization of crime patterns
- **Interactive Map**: Geographic representation of crime incidents
- **Data Filters**: Filter by year and crime type
- **Real-time Updates**: Dynamic data filtering and visualization

### 🌍 Maharashtra State View
- **State-wide Analysis**: Comprehensive crime data across 30 districts
- **Regional Breakdown**: Crime statistics by geographic regions (Konkan, Western Maharashtra, Vidarbha, Marathwada, Northern Maharashtra)
- **District Comparison**: Top districts by crime rate analysis
- **Interactive Map**: Simplified map visualization with district markers
- **Trend Analysis**: Year-over-year crime trend indicators

### 📊 Crime Categories
- **Assault on Women (354)**: Physical assault incidents
- **Rape (376/511)**: Sexual assault cases
- **Kidnapping/Abduction (336&364)**: Abduction incidents
- **Cruelty by Husband/Relatives (498-A)**: Domestic violence cases

### 🔍 Data Coverage
- **Time Period**: 2015, 2017, 2018, 2019, 2020
- **Geographic Coverage**: 30 districts across Maharashtra
- **Data Source**: Official crime statistics

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:5173`

### Using the Dashboard

#### Uploading Data
1. Use the upload interface to load your CSV file
2. Ensure your CSV has the following columns:
   - `Location`: District name
   - `Year`: Year of data
   - `Assault on Women (354)`: Assault incidents count
   - `Rape (376/511)`: Rape cases count
   - `Kidnapping/Abduction (336&364)`: Abduction count
   - `Cruelty by Husband/Relatives (498-A)`: Domestic violence count

#### Switching Between Views
- **Pune City Tab**: Focused analysis of Pune city crime data
- **Maharashtra State Tab**: State-wide analysis across all districts

#### Filtering Data
- **Year Filter**: Select specific years or view all years
- **Crime Type Filter**: Focus on specific crime categories
- **Real-time Updates**: Filters apply immediately to all visualizations

## Data Structure

The application expects CSV data with the following format:

```csv
Location,Year,Assault on Women (354),Rape (376/511),Kidnapping/Abduction (336&364),Cruelty by Husband/Relatives (498-A)
Mumbai,2015,48,22,26,24
Pune,2015,28,13,14,12
...
```

## Features in Detail

### Maharashtra State Analysis
- **District Markers**: Interactive markers showing crime intensity
- **Regional Classification**: Districts grouped by geographic regions
- **Statistics Dashboard**: Key metrics including total crimes, district count, and regional breakdown
- **Top Districts Table**: Ranking of districts by total crime count
- **District Details**: Click on any district to view detailed crime breakdown

### Interactive Elements
- **Hover Effects**: District markers show crime counts on hover
- **Click Interactions**: Select districts for detailed analysis
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Framer Motion animations for enhanced UX

## Technical Stack

- **Frontend**: React.js with JSX
- **Styling**: Tailwind CSS with custom utilities
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## File Structure

```
src/
├── components/
│   ├── MaharashtraCrimeMap.jsx    # Maharashtra state analysis
│   ├── PuneCrimeMap.jsx           # Pune city map
│   ├── HeatmapChart.jsx           # Crime heatmap
│   ├── SidebarFilters.jsx         # Data filters
│   └── UploadData.jsx             # Data upload interface
├── App.jsx                        # Main application component
└── index.css                      # Custom styles and utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.
