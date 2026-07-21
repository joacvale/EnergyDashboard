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
    quarters: Array.from({ length: 96 }, (_, i) => {
      const quarter = i + 1;
      const daytimeFactor = Math.max(0, Math.sin((quarter - 20) * Math.PI / 56));
      const volume = Number((daytimeFactor * 65).toFixed(1));
      const price = Number((55 + daytimeFactor * 15).toFixed(1));
      const netPosition = Number((volume * 0.3).toFixed(1));
      const damPrice = Number((price + 0.8).toFixed(1));

      return volume < 8
        ? {
            quarter,
            idle: true,
          }
        : {
            quarter,
            volume,
            price,
            netPosition,
            damPrice,
            idle: false,
          };
    })
  },

  {
    id: 'OU-002',
    name: 'Spain Wind South',
    country: 'ES',
    quarters: Array.from({ length: 96 }, (_, i) => {
      const quarter = i + 1;
      const daytimeFactor = Math.max(0, Math.sin((quarter - 16) * Math.PI / 60));
      const volume = Number((daytimeFactor * 80).toFixed(1));
      const price = Number((50 + daytimeFactor * 18).toFixed(1));
      const netPosition = Number((volume * 0.35).toFixed(1));
      const damPrice = Number((price + 1.2).toFixed(1));

      return volume < 10
        ? {
            quarter,
            idle: true,
          }
        : {
            quarter,
            volume,
            price,
            netPosition,
            damPrice,
            idle: false,
          };
    })
  },

  {
    id: 'OU-003',
    name: 'Italy Hybrid Asset',
    country: 'IT',
    quarters: Array.from({ length: 96 }, (_, i) => {
      const quarter = i + 1;
      const daytimeFactor =Math.max(0, Math.sin((quarter - 22) * Math.PI / 58));
      const volume = Number((daytimeFactor * 55).toFixed(1));
      const price = Number((58 + daytimeFactor * 12).toFixed(1));
      const netPosition = Number((volume * 0.25).toFixed(1));
      const damPrice = Number((price + 0.6).toFixed(1));

      return volume < 7
        ? {
            quarter,
            idle: true,
          }
        : {
            quarter,
            volume,
            price,
            netPosition,
            damPrice,
            idle: false,
          };
    })
  }
];

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
 