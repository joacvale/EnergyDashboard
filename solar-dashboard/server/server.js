const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (mock)
let panels = [
  {
    id: 'SP-001',
    location: 'North Sector A',
    country: 'PT',
    capacity: 250.0,
    todayProduction: 1856.5,
    status: 'Active',
  },
  {
    id: 'SP-002',
    location: 'South Sector B',
    country: 'ES',
    capacity: 300.0,
    todayProduction: 2234.8,
    status: 'Active',
  },
  {
    id: 'SP-003',
    location: 'East Sector C',
    country: 'PT',
    capacity: 200.0,
    todayProduction: 1423.2,
    status: 'Maintenance',
  },
  {
    id: 'SP-004',
    location: 'West Sector D',
    country: 'PT',
    capacity: 280.0,
    todayProduction: 2087.4,
    status: 'Active',
  },
  {
    id: 'SP-005',
    location: 'Central Sector E',
    country: 'ES',
    capacity: 320.0,
    todayProduction: 2401.6,
    status: 'Active',
  },
  {
    id: 'SP-006',
    location: 'South Sector F',
    country: 'ES',
    capacity: 270.0,
    todayProduction: 1998.3,
    status: 'Active',
  },
  {
    id: 'SP-007',
    location: 'East Sector G',
    country: 'PT',
    capacity: 240.0,
    todayProduction: 1765.8,
    status: 'Inactive',
  },
  {
    id: 'SP-008',
    location: 'North Sector H',
    country: 'ES',
    capacity: 290.0,
    todayProduction: 2156.7,
    status: 'Active',
  },
];

// Mock production data
const productionData = [
  { hour: 1, production: 21.25, country: 'PT', type: 'production' },
  { hour: 2, production: 22.5, country: 'PT', type: 'production' },
  { hour: 3, production: 23.75, country: 'PT', type: 'production' },
  { hour: 4, production: 23.0, country: 'PT', type: 'production' },
  { hour: 5, production: 22.0, country: 'PT', type: 'production' },
  { hour: 6, production: 18.75, country: 'PT', type: 'production' },
  { hour: 7, production: 6.25, country: 'PT', type: 'idle' },
  { hour: 8, production: 7.5, country: 'PT', type: 'idle' },
  { hour: 9, production: 17.5, country: 'PT', type: 'production' },
  { hour: 10, production: 21.25, country: 'PT', type: 'production' },
  { hour: 11, production: 20.5, country: 'ES', type: 'production' },
  { hour: 12, production: 19.5, country: 'ES', type: 'production' },
  { hour: 13, production: 8.75, country: 'PT', type: 'idle' },
  { hour: 14, production: 22.0, country: 'PT', type: 'production' },
  { hour: 15, production: 23.0, country: 'PT', type: 'production' },
  { hour: 16, production: 16.25, country: 'PT', type: 'limited' },
  { hour: 17, production: 17.5, country: 'PT', type: 'limited' },
  { hour: 18, production: 17.0, country: 'PT', type: 'limited' },
  { hour: 19, production: 20.0, country: 'PT', type: 'production' },
  { hour: 20, production: 18.75, country: 'PT', type: 'production' },
  { hour: 21, production: 10.0, country: 'PT', type: 'idle' },
  { hour: 22, production: 8.75, country: 'PT', type: 'idle' },
  { hour: 23, production: 7.5, country: 'PT', type: 'idle' },
  { hour: 24, production: 21.25, country: 'PT', type: 'production' },
];

const countryData = [
  { code: 'PT',name: 'Portugal'},
  { code: 'ES', name: 'Spain'},
  { code: 'FR', name: 'France'},
  { code: 'IT', name: 'Italy'}
];

//mock energy price data
const energyPriceData = [
  { hour: 1, country: 'PT',price: 28.50 },
  { hour: 2, country: 'PT',price: 32.75 },
  { hour: 3, country: 'PT',price: 12.30 },
  { hour: 4, country: 'PT',price: 29.40 },
  { hour: 5, country: 'PT',price: 34.80 },
  { hour: 6, country: 'PT',price: 2.50 },
  { hour: 7, country: 'PT',price: 18.20 },
  { hour: 8, country: 'PT',price: 27.10 },
  { hour: 9, country: 'PT',price: 15.60 },
  { hour: 10, country: 'PT',price: 31.00 },
  { hour: 11, country: 'PT',price: 3.10 },
  { hour: 12, country: 'ES',price: 24.00 },
  { hour: 13, country: 'ES',price: 30.50 },
  { hour: 14, country: 'PT',price: 7.80 },
  { hour: 15, country: 'PT',price: 35.20 },
  { hour: 16, country: 'PT',price: 16.40 },
  { hour: 17, country: 'PT',price: 21.30 },
  { hour: 18, country: 'PT',price: 5.60 },
  { hour: 19, country: 'PT',price: 29.90 },
  { hour: 20, country: 'PT',price: 11.20 },
  { hour: 21, country: 'PT',price: 25.60 },
  { hour: 22, country: 'PT',price: 33.40 },
  { hour: 23, country: 'PT',price: 14.80 },
  { hour: 24, country: 'PT',price: 28.70 },
];


const offerUnitData = [
  {
    id: 'OU-001',
    name: 'Portugal Solar North',
    country: 'PT',
quarters: [
  { quarter: 1, volume: 42.5, price: 58.2, netPosition: 12.8, damPrice: 59.0, idle: false },
  { quarter: 2, volume: 40.8, price: 57.9, idle: false },
  { quarter: 3, volume: 44.1, damPrice: 58.8, idle: false },
  { quarter: 4, idle: true },
  { quarter: 5, volume: 39.2, price: 56.3, netPosition: 11.5, damPrice: 57.2, idle: false },
  { quarter: 6, volume: 35.7, price: 55.8, idle: false },
  { quarter: 7 },
  { quarter: 8, volume: 32.4, netPosition: 9.1 },
  { quarter: 9, price: 54.4, damPrice: 55.1 },
  { quarter: 10, volume: 30.5, price: 54.1, netPosition: 8.8 },
  { quarter: 11, idle: true },
  { quarter: 12, volume: 29.7 },
  { quarter: 13, volume: 31.3, price: 54.7, netPosition: 9.2, damPrice: 55.6 },
  { quarter: 14, volume: 33.9, price: 55.0 },
  { quarter: 15, damPrice: 56.0 },
  { quarter: 16, volume: 38.1, idle: false },
  { quarter: 17, volume: 40.2, price: 56.8, netPosition: 11.0, damPrice: 57.4 },
  { quarter: 18 },
  { quarter: 19, volume: 43.6, price: 58.2 },
  { quarter: 20, idle: true },
  { quarter: 21, volume: 47.3, price: 59.1, netPosition: 13.2 },
  { quarter: 22, volume: 48.1, damPrice: 60.2 },
  { quarter: 23, price: 60.1 },
  { quarter: 24, volume: 49.5, price: 60.4, netPosition: 14.5, damPrice: 61.0 },
  { quarter: 25, volume: 50.2 },
  { quarter: 26, idle: true },
  { quarter: 27, volume: 51.1, price: 61.0 },
  { quarter: 28, volume: 52.4, price: 61.8, netPosition: 15.6 },
  { quarter: 29, damPrice: 62.3 },
  { quarter: 30, volume: 53.8, price: 62.4, netPosition: 16.0, damPrice: 63.0 },
  { quarter: 31 },
  { quarter: 32, volume: 54.1, idle: false },
  { quarter: 33, volume: 53.5, price: 62.1 },
  { quarter: 34, volume: 52.8, netPosition: 15.4 },
  { quarter: 35, idle: true },
  { quarter: 36, volume: 51.4, price: 61.0, damPrice: 61.8 },
  { quarter: 37 },
  { quarter: 38, volume: 49.2 },
  { quarter: 39, price: 59.8 },
  { quarter: 40, volume: 47.5, price: 59.1, netPosition: 13.3 },
  { quarter: 41, idle: true },
  { quarter: 42, volume: 29.7 },
  { quarter: 43, volume: 31.3, price: 54.7, netPosition: 9.2, damPrice: 55.6 },
  { quarter: 44, volume: 33.9, price: 55.0 },
  { quarter: 45, damPrice: 56.0 },
  { quarter: 46, volume: 38.1, idle: false },
  { quarter: 47, volume: 40.2, price: 56.8, netPosition: 11.0, damPrice: 57.4 },
  { quarter: 48 },
  { quarter: 49, volume: 43.6, price: 58.2 },
  { quarter: 50, idle: true },
  { quarter: 51, volume: 42.5, price: 58.2, netPosition: 12.8, damPrice: 59.0, idle: false },
  { quarter: 52, volume: 40.8, price: 57.9, idle: false },
  { quarter: 53, volume: 44.1, damPrice: 58.8, idle: false },
  { quarter: 54, idle: true },
  { quarter: 55, volume: 39.2, price: 56.3, netPosition: 11.5, damPrice: 57.2, idle: false },
  { quarter: 56, volume: 35.7, price: 55.8, idle: false },
  { quarter: 57 },
  { quarter: 58, volume: 32.4, netPosition: 9.1 },
  { quarter: 59, price: 54.4, damPrice: 55.1 },
  { quarter: 60, volume: 30.5, price: 54.1, netPosition: 8.8 },
  { quarter: 61, idle: true },
  { quarter: 62, volume: 29.7 },
  { quarter: 63, volume: 31.3, price: 54.7, netPosition: 9.2, damPrice: 55.6 },
  { quarter: 64, volume: 33.9, price: 55.0 },
  { quarter: 65, damPrice: 56.0 },
  { quarter: 66, volume: 38.1, idle: false },
  { quarter: 67, volume: 40.2, price: 56.8, netPosition: 11.0, damPrice: 57.4 },
  { quarter: 68 },
  { quarter: 69, volume: 43.6, price: 58.2 },
  { quarter: 70, idle: true },
  { quarter: 71, volume: 47.3, price: 59.1, netPosition: 13.2 },
  { quarter: 72, volume: 48.1, damPrice: 60.2 },
  { quarter: 73, price: 60.1 },
  { quarter: 74, volume: 49.5, price: 60.4, netPosition: 14.5, damPrice: 61.0 },
  { quarter: 75, volume: 50.2 },
  { quarter: 76, idle: true },
  { quarter: 77, volume: 51.1, price: 61.0 },
  { quarter: 78, volume: 52.4, price: 61.8, netPosition: 15.6 },
  { quarter: 79, damPrice: 62.3 },
  { quarter: 80, volume: 53.8, price: 62.4, netPosition: 16.0, damPrice: 63.0 },
  { quarter: 81 },
  { quarter: 82, volume: 54.1, idle: false },
  { quarter: 83, volume: 53.5, price: 62.1 },
  { quarter: 84, volume: 52.8, netPosition: 15.4 },
  { quarter: 85, idle: true },
  { quarter: 86, volume: 51.4, price: 61.0, damPrice: 61.8 },
  { quarter: 87 },
  { quarter: 88, volume: 49.2 },
  { quarter: 89, price: 59.8 },
  { quarter: 90, volume: 53.8, price: 62.4, netPosition: 16.0, damPrice: 63.0 },
  { quarter: 91 },
  { quarter: 92, volume: 54.1, idle: false },
  { quarter: 93, volume: 53.5, price: 62.1 },
  { quarter: 94, volume: 52.8, netPosition: 15.4 },
  { quarter: 95, idle: true },
  { quarter: 96, volume: 51.4, price: 61.0, damPrice: 61.8 },
  
]},
 {
    id: 'OU-002',
    name: 'Portugal Solar South',
    country: 'PT',
quarters: [
  { quarter: 1, volume: 42.5, price: 58.2, netPosition: 12.8, damPrice: 59.0, idle: false },
  { quarter: 2, volume: 40.8, price: 57.9, idle: false },
  { quarter: 3, volume: 44.1, damPrice: 58.8, idle: false },
  { quarter: 4, idle: true },
  { quarter: 5, volume: 39.2, price: 56.3, netPosition: 11.5, damPrice: 57.2, idle: false },
  { quarter: 6, volume: 35.7, price: 55.8, idle: false },
  { quarter: 7 },
  { quarter: 8, volume: 32.4, netPosition: 9.1 },
  { quarter: 9, price: 54.4, damPrice: 55.1 },
  { quarter: 10, volume: 30.5, price: 54.1, netPosition: 8.8 },
  { quarter: 11, idle: true },
  { quarter: 12, volume: 29.7 },
  { quarter: 13, volume: 31.3, price: 54.7, netPosition: 9.2, damPrice: 55.6 },
  { quarter: 14, volume: 33.9, price: 55.0 },
  { quarter: 15, damPrice: 56.0 },
  { quarter: 16, volume: 38.1, idle: false },
  { quarter: 17, volume: 40.2, price: 56.8, netPosition: 11.0, damPrice: 57.4 },
  { quarter: 18 },
  { quarter: 19, volume: 43.6, price: 58.2 },
  { quarter: 20, idle: true },
  { quarter: 21, volume: 47.3, price: 59.1, netPosition: 13.2 },
  { quarter: 22, volume: 48.1, damPrice: 60.2 },
  { quarter: 23, price: 60.1 },
  { quarter: 24, volume: 49.5, price: 60.4, netPosition: 14.5, damPrice: 61.0 },
  { quarter: 25, volume: 50.2 },
  { quarter: 26, idle: true },
  { quarter: 27, volume: 51.1, price: 61.0 },
  { quarter: 28, volume: 52.4, price: 61.8, netPosition: 15.6 },
  { quarter: 29, damPrice: 62.3 },
  { quarter: 30, volume: 53.8, price: 62.4, netPosition: 16.0, damPrice: 63.0 },
  { quarter: 31 },
  { quarter: 32, volume: 54.1, idle: false },
  { quarter: 33, volume: 53.5, price: 62.1 },
  { quarter: 34, volume: 52.8, netPosition: 15.4 },
  { quarter: 35, idle: true },
  { quarter: 36, volume: 51.4, price: 61.0, damPrice: 61.8 },
  { quarter: 37 },
  { quarter: 38, volume: 49.2 },
  { quarter: 39, price: 59.8 },
  { quarter: 40, volume: 47.5, price: 59.1, netPosition: 13.3 },
  { quarter: 41, idle: true },
  { quarter: 42, volume: 29.7 },
  { quarter: 43, volume: 31.3, price: 54.7, netPosition: 9.2, damPrice: 55.6 },
  { quarter: 44, volume: 33.9, price: 55.0 },
  { quarter: 45, damPrice: 56.0 },
  { quarter: 46, volume: 38.1, idle: false },
  { quarter: 47, volume: 40.2, price: 56.8, netPosition: 11.0, damPrice: 57.4 },
  { quarter: 48 },
  { quarter: 49, volume: 43.6, price: 58.2 },
  { quarter: 50, idle: true },
  { quarter: 51, volume: 42.5, price: 58.2, netPosition: 12.8, damPrice: 59.0, idle: false },
  { quarter: 52, volume: 40.8, price: 57.9, idle: false },
  { quarter: 53, volume: 44.1, damPrice: 58.8, idle: false },
  { quarter: 54, idle: true },
  { quarter: 55, volume: 39.2, price: 56.3, netPosition: 11.5, damPrice: 57.2, idle: false },
  { quarter: 56, volume: 35.7, price: 55.8, idle: false },
  { quarter: 57 },
  { quarter: 58, volume: 32.4, netPosition: 9.1 },
  { quarter: 59, price: 54.4, damPrice: 55.1 },
  { quarter: 60, volume: 30.5, price: 54.1, netPosition: 8.8 },
  { quarter: 61, idle: true },
  { quarter: 62, volume: 29.7 },
  { quarter: 63, volume: 31.3, price: 54.7, netPosition: 9.2, damPrice: 55.6 },
  { quarter: 64, volume: 33.9, price: 55.0 },
  { quarter: 65, damPrice: 56.0 },
  { quarter: 66, volume: 38.1, idle: false },
  { quarter: 67, volume: 40.2, price: 56.8, netPosition: 11.0, damPrice: 57.4 },
  { quarter: 68 },
  { quarter: 69, volume: 43.6, price: 58.2 },
  { quarter: 70, idle: true },
  { quarter: 71, volume: 47.3, price: 59.1, netPosition: 13.2 },
  { quarter: 72, volume: 48.1, damPrice: 60.2 },
  { quarter: 73, price: 60.1 },
  { quarter: 74, volume: 49.5, price: 60.4, netPosition: 14.5, damPrice: 61.0 },
  { quarter: 75, volume: 50.2 },
  { quarter: 76, idle: true },
  { quarter: 77, volume: 51.1, price: 61.0 },
  { quarter: 78, volume: 52.4, price: 61.8, netPosition: 15.6 },
  { quarter: 79, damPrice: 62.3 },
  { quarter: 80, volume: 53.8, price: 62.4, netPosition: 16.0, damPrice: 63.0 },
  { quarter: 81 },
  { quarter: 82, volume: 54.1, idle: false },
  { quarter: 83, volume: 53.5, price: 62.1 },
  { quarter: 84, volume: 52.8, netPosition: 15.4 },
  { quarter: 85, idle: true },
  { quarter: 86, volume: 51.4, price: 61.0, damPrice: 61.8 },
  { quarter: 87 },
  { quarter: 88, volume: 49.2 },
  { quarter: 89, price: 59.8 },
  { quarter: 90, volume: 53.8, price: 62.4, netPosition: 16.0, damPrice: 63.0 },
  { quarter: 91 },
  { quarter: 92, volume: 54.1, idle: false },
  { quarter: 93, volume: 53.5, price: 62.1 },
  { quarter: 94, volume: 52.8, netPosition: 15.4 },
  { quarter: 95, idle: true },
  { quarter: 96, volume: 51.4, price: 61.0, damPrice: 61.8 },
  
]}
]


// Helper function to generate ID
function generateId() {
  const existingIds = panels.map((p) => parseInt(p.id.split('-')[1]));
  const maxId = Math.max(...existingIds);
  return `SP-${String(maxId + 1).padStart(3, '0')}`;
}

// Routes

// GET /api/panels - Get all panels
app.get('/api/panels', (req, res) => {
  const {location} = req.query;
  let filteredPanels = panels;

  if(location){
    filteredPanels=panels.filter(panel=>panel.location.toLowerCase().includes(location.toLowerCase()));
  }
  res.json({
    success: true,
    data: filteredPanels,
  });
  
});

// GET /api/panels/:id - Get single panel
app.get('/api/panels/:id', (req, res) => {
  const panel = panels.find((p) => p.id === req.params.id);

  if (!panel) {
    return res.status(404).json({
      success: false,
      message: 'Panel not found',
    });
  }

  res.json({
    success: true,
    data: panel,
  });
});

// POST /api/panels - Create new panel
app.post('/api/panels', (req, res) => {
  const { location, capacity, todayProduction, status } = req.body;

  // Validation
  if (!location || !capacity) {
    return res.status(400).json({
      success: false,
      message: 'Location and capacity are required',
    });
  }

  const newPanel = {
    id: generateId(),
    location,
    capacity: parseFloat(capacity),
    todayProduction: parseFloat(todayProduction) || 0,
    status: status || 'Active',
  };

  panels.push(newPanel);

  res.status(201).json({
    success: true,
    message: 'Panel created successfully',
    data: newPanel,
  });
});

// PUT /api/panels/:id - Update panel
app.put('/api/panels/:id', (req, res) => {
  const index = panels.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Panel not found',
    });
  }

  const { location, capacity, todayProduction, status } = req.body;

  // Update panel
  panels[index] = {
    ...panels[index],
    location: location || panels[index].location,
    capacity: capacity ? parseFloat(capacity) : panels[index].capacity,
    todayProduction: todayProduction
      ? parseFloat(todayProduction)
      : panels[index].todayProduction,
    status: status || panels[index].status,
  };

  res.json({
    success: true,
    message: 'Panel updated successfully',
    data: panels[index],
  });
});

// DELETE /api/panels/:id - Delete panel
app.delete('/api/panels/:id', (req, res) => {
  const index = panels.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Panel not found',
    });
  }

  const deletedPanel = panels.splice(index, 1)[0];

  res.json({
    success: true,
    message: 'Panel deleted successfully',
    data: deletedPanel,
  });
});

// GET /api/production - Get production data
app.get('/api/production', (req, res) => {
  res.json({
    success: true,
    data: productionData,
  });
});

// GET /api/energy-prices
app.get('/api/energy-prices', (req, res) => {
  res.json({
    success: true,
    data: energyPriceData,
  });
});

// GET /api/countries
app.get('/api/countries', (req, res) => {
  res.json({
    success: true,
    data: countryData,
  });
});

// GET /api/offerunits
app.get('/api/offerunits', (req, res) => {
  res.json({
    success: true,
    data: offerUnitData,
  });
});
// GET /api/stats - Get statistics
app.get('/api/stats', (req, res) => {
  const totalProduction = panels.reduce((sum, p) => sum + p.todayProduction, 0);
  const activePanels = panels.filter((p) => p.status === 'Active').length;
  const totalCapacity = panels.reduce((sum, p) => sum + p.capacity, 0);

  res.json({
    success: true,
    data: {
      totalProduction,
      activePanels,
      totalPanels: panels.length,
      totalCapacity,
      averageProduction: totalProduction / panels.length,
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Solar Energy API running on http://localhost:${PORT}`);
});

module.exports = app;
 