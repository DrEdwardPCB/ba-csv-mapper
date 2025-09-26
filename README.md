# CSV Mapping Tool for Business Analysts

A powerful React-based web application designed to help Business Analysts efficiently map data between source and target CSV files. This tool provides an intuitive interface for creating complex data mappings with support for one-to-many relationships, search functionality, and export capabilities.

## 🎯 Motivation

Business Analysts often face the challenging task of mapping data between different systems, especially when dealing with CSV files that have varying structures, column names, and data formats. This tool addresses common pain points:

- **Manual Mapping Process**: Eliminates the need for complex Excel formulas or manual data matching
- **One-to-Many Relationships**: Supports mapping one source record to multiple target records and vice versa
- **Data Validation**: Provides visual feedback and validation during the mapping process
- **Export Capabilities**: Generates mapped data in CSV format for further processing
- **User-Friendly Interface**: Intuitive drag-and-drop style interface with search and filtering

## 🚀 Features

- **Three-Panel Layout**: Source data, Target data, and Mapped results
- **CSV File Upload**: Support for both source and target CSV files
- **Interactive Mapping**: Click-to-map interface with modal selection
- **Search & Filter**: Find specific records quickly in large datasets
- **One-to-Many Mapping**: Map single records to multiple targets
- **Remarks System**: Add notes and comments to mapped records
- **Export Functionality**: Download mapped data as CSV
- **Real-time Validation**: Visual indicators for mapped vs unmapped records

## 🛠️ Dependencies

This application is built with modern React and Material-UI technologies:

### Core Dependencies
- **React 19.1.1** - Modern React with latest features
- **TypeScript 4.9.2** - Type-safe JavaScript development
- **Material-UI 7.3.2** - Modern React component library
- **MUI X DataGrid Premium 8.12.1** - Advanced data grid with premium features

### Key Libraries
- **@mui/material** - Core Material-UI components
- **@mui/icons-material** - Material Design icons
- **@mui/x-data-grid-premium** - Premium data grid with advanced features
- **@mui/x-license** - MUI X licensing
- **papaparse** - CSV parsing and generation
- **emotion** - CSS-in-JS styling solution

### Development Dependencies
- **react-scripts** - Create React App build tools
- **@types/papaparse** - TypeScript definitions for papaparse

## 📋 Prerequisites

Before running this application locally, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ba-csv-mapping
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the Development Server

```bash
npm start
# or
yarn start
```

The application will open in your browser at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

## 📖 How to Use the Application

### Step 1: Upload CSV Files

1. **Upload Source CSV**: Click "Upload Source CSV" and select your source data file
2. **Upload Target CSV**: Click "Upload Target CSV" and select your target data file
3. The data will automatically appear in the respective panels

### Step 2: Create Mappings

1. **Click "Map" Button**: Click the "Map" button next to any row in either the source or target panel
2. **Select Target Records**: In the modal that opens, use checkboxes to select which records to map
3. **Search & Filter**: Use the search box to quickly find specific records
4. **Confirm Mapping**: Click "Map Selected" to create the mapping

### Step 3: Manage Mappings

1. **View Mapped Data**: All mappings appear in the bottom panel
2. **Add Remarks**: Click on the remarks column to add notes or comments
3. **Unmap Records**: Use the delete button to remove mappings
4. **Export Data**: Click "Download Excel" to export the mapped data

## 🎬 Demo Section

### Example Mapping Scenario

Let's walk through a typical mapping scenario:

#### Sample Data

**Source CSV (source.csv):**
```csv
Name,Type,Haha
XXX,string,value1
yyy,number,value2
```

**Target CSV (target.csv):**
```csv
Name,Type,Hehe
xxx,string,value3
zzz,number,value4
```

#### Mapping Process

1. **Initial State**: After uploading both files, the mapped panel shows a full outer join:
   ```
   source_Name | source_Type | source_Haha | target_Name | target_Type | target_Hehe | Remarks
   XXX         | string      | value1      |             |             |             |
   yyy         | number      | value2      |             |             |             |
               |             |             | xxx         | string      | value3      |
               |             |             | zzz         | number      | value4      |
   ```

2. **Create Mapping**: Click "Map" next to "XXX" in the source panel
3. **Select Target**: In the modal, select "xxx" and click "Map Selected"
4. **Result**: The mapping is created:
   ```
   source_Name | source_Type | source_Haha | target_Name | target_Type | target_Hehe | Remarks
   XXX         | string      | value1      | xxx         | string      | value3      |
   yyy         | number      | value2      |             |             |             |
               |             |             | zzz         | number      | value4      |
   ```

#### One-to-Many Mapping

You can also map one source record to multiple target records:

1. **Select Source**: Click "Map" next to "XXX"
2. **Select Multiple Targets**: Check both "xxx" and "zzz"
3. **Result**: Two separate mapping rows are created:
   ```
   source_Name | source_Type | source_Haha | target_Name | target_Type | target_Hehe | Remarks
   XXX         | string      | value1      | xxx         | string      | value3      |
   XXX         | string      | value1      | zzz         | number      | value4      |
   yyy         | number      | value2      |             |             |             |
   ```

### Key Features Demonstrated

- **Visual Feedback**: Mapped records are clearly distinguished from unmapped ones
- **Search Functionality**: Quickly find records using the search box
- **Remarks System**: Add contextual notes to mappings
- **Export Capability**: Download the final mapped dataset

## 🔧 Technical Architecture

### Component Structure

```
src/
├── components/
│   ├── MappedPanel.tsx      # Bottom panel for mapped data
│   └── MappingModal.tsx     # Modal for selecting mappings
├── utils/
│   └── csvParser.ts         # CSV parsing and export utilities
├── types.ts                 # TypeScript type definitions
├── App.tsx                  # Main application component
└── index.tsx               # Application entry point
```

### Key Technologies

- **React Hooks**: State management and lifecycle handling
- **Material-UI**: Consistent design system and components
- **MUI X DataGrid Premium**: Advanced data grid with selection, filtering, and export
- **PapaParse**: Robust CSV parsing and generation
- **TypeScript**: Type safety and better development experience

## 🐛 Troubleshooting

### Common Issues

1. **CSV Upload Issues**: Ensure your CSV files have proper headers and are UTF-8 encoded
2. **Mapping Not Working**: Check that your CSV files have an 'id' column or unique identifiers
3. **Export Problems**: Verify that you have mapped data before attempting to export

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Happy Mapping! 🎉**
