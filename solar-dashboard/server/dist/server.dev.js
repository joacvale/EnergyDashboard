"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var express = require('express');

var cors = require('cors');

var app = express();
var PORT = 3000; // Middleware

app.use(cors());
app.use(express.json()); // In-memory database (mock)

var panels = [{
  id: 'SP-001',
  location: 'North Sector A',
  country: 'PT',
  capacity: 250.0,
  todayProduction: 1856.5,
  status: 'Active'
}, {
  id: 'SP-002',
  location: 'South Sector B',
  country: 'ES',
  capacity: 300.0,
  todayProduction: 2234.8,
  status: 'Active'
}, {
  id: 'SP-003',
  location: 'East Sector C',
  country: 'PT',
  capacity: 200.0,
  todayProduction: 1423.2,
  status: 'Maintenance'
}, {
  id: 'SP-004',
  location: 'West Sector D',
  country: 'PT',
  capacity: 280.0,
  todayProduction: 2087.4,
  status: 'Active'
}, {
  id: 'SP-005',
  location: 'Central Sector E',
  country: 'ES',
  capacity: 320.0,
  todayProduction: 2401.6,
  status: 'Active'
}, {
  id: 'SP-006',
  location: 'South Sector F',
  country: 'ES',
  capacity: 270.0,
  todayProduction: 1998.3,
  status: 'Active'
}, {
  id: 'SP-007',
  location: 'East Sector G',
  country: 'PT',
  capacity: 240.0,
  todayProduction: 1765.8,
  status: 'Inactive'
}, {
  id: 'SP-008',
  location: 'North Sector H',
  country: 'ES',
  capacity: 290.0,
  todayProduction: 2156.7,
  status: 'Active'
}]; // Mock production data

var productionData = [{
  hour: 1,
  production: 21.25,
  type: 'production'
}, {
  hour: 2,
  production: 22.5,
  type: 'production'
}, {
  hour: 3,
  production: 23.75,
  type: 'production'
}, {
  hour: 4,
  production: 23.0,
  type: 'production'
}, {
  hour: 5,
  production: 22.0,
  type: 'production'
}, {
  hour: 6,
  production: 18.75,
  type: 'production'
}, {
  hour: 7,
  production: 6.25,
  type: 'idle'
}, {
  hour: 8,
  production: 7.5,
  type: 'idle'
}, {
  hour: 9,
  production: 17.5,
  type: 'production'
}, {
  hour: 10,
  production: 21.25,
  type: 'production'
}, {
  hour: 11,
  production: 20.5,
  type: 'production'
}, {
  hour: 12,
  production: 19.5,
  type: 'production'
}, {
  hour: 13,
  production: 8.75,
  type: 'idle'
}, {
  hour: 14,
  production: 22.0,
  type: 'production'
}, {
  hour: 15,
  production: 23.0,
  type: 'production'
}, {
  hour: 16,
  production: 16.25,
  type: 'limited'
}, {
  hour: 17,
  production: 17.5,
  type: 'limited'
}, {
  hour: 18,
  production: 17.0,
  type: 'limited'
}, {
  hour: 19,
  production: 20.0,
  type: 'production'
}, {
  hour: 20,
  production: 18.75,
  type: 'production'
}, {
  hour: 21,
  production: 10.0,
  type: 'idle'
}, {
  hour: 22,
  production: 8.75,
  type: 'idle'
}, {
  hour: 23,
  production: 7.5,
  type: 'idle'
}, {
  hour: 24,
  production: 21.25,
  type: 'production'
}];
var countryData = [{
  code: 'PT',
  name: 'Portugal'
}, {
  code: 'ES',
  name: 'Spain'
}, {
  code: 'FR',
  name: 'France'
}, {
  code: 'IT',
  name: 'Italy'
}]; //mock energy price data

var energyPriceData = [{
  hour: 1,
  country: 'PT',
  price: 28.50
}, {
  hour: 2,
  country: 'PT',
  price: 32.75
}, {
  hour: 3,
  country: 'PT',
  price: 12.30
}, {
  hour: 4,
  country: 'PT',
  price: 29.40
}, {
  hour: 5,
  country: 'PT',
  price: 34.80
}, {
  hour: 6,
  country: 'PT',
  price: 2.50
}, {
  hour: 7,
  country: 'PT',
  price: 18.20
}, {
  hour: 8,
  country: 'PT',
  price: 27.10
}, {
  hour: 9,
  country: 'PT',
  price: 15.60
}, {
  hour: 10,
  country: 'PT',
  price: 31.00
}, {
  hour: 11,
  country: 'PT',
  price: 3.10
}, //{ hour: 12, country: 'PT',price: 24.00 },
//{ hour: 13, country: 'PT',price: 30.50 },
{
  hour: 14,
  country: 'PT',
  price: 7.80
}, {
  hour: 15,
  country: 'PT',
  price: 35.20
}, {
  hour: 16,
  country: 'PT',
  price: 16.40
}, {
  hour: 17,
  country: 'PT',
  price: 21.30
}, {
  hour: 18,
  country: 'PT',
  price: 5.60
}, {
  hour: 19,
  country: 'PT',
  price: 29.90
}, {
  hour: 20,
  country: 'PT',
  price: 11.20
}, {
  hour: 21,
  country: 'PT',
  price: 25.60
}, {
  hour: 22,
  country: 'PT',
  price: 33.40
}, {
  hour: 23,
  country: 'PT',
  price: 14.80
}, {
  hour: 24,
  country: 'PT',
  price: 28.70
}]; // Helper function to generate ID

function generateId() {
  var existingIds = panels.map(function (p) {
    return parseInt(p.id.split('-')[1]);
  });
  var maxId = Math.max.apply(Math, _toConsumableArray(existingIds));
  return "SP-".concat(String(maxId + 1).padStart(3, '0'));
} // Routes
// GET /api/panels - Get all panels


app.get('/api/panels', function (req, res) {
  var location = req.query.location;
  var filteredPanels = panels;

  if (location) {
    filteredPanels = panels.filter(function (panel) {
      return panel.location.toLowerCase().includes(location.toLowerCase());
    });
  }

  res.json({
    success: true,
    data: filteredPanels
  });
}); // GET /api/panels/:id - Get single panel

app.get('/api/panels/:id', function (req, res) {
  var panel = panels.find(function (p) {
    return p.id === req.params.id;
  });

  if (!panel) {
    return res.status(404).json({
      success: false,
      message: 'Panel not found'
    });
  }

  res.json({
    success: true,
    data: panel
  });
}); // POST /api/panels - Create new panel

app.post('/api/panels', function (req, res) {
  var _req$body = req.body,
      location = _req$body.location,
      capacity = _req$body.capacity,
      todayProduction = _req$body.todayProduction,
      status = _req$body.status; // Validation

  if (!location || !capacity) {
    return res.status(400).json({
      success: false,
      message: 'Location and capacity are required'
    });
  }

  var newPanel = {
    id: generateId(),
    location: location,
    capacity: parseFloat(capacity),
    todayProduction: parseFloat(todayProduction) || 0,
    status: status || 'Active'
  };
  panels.push(newPanel);
  res.status(201).json({
    success: true,
    message: 'Panel created successfully',
    data: newPanel
  });
}); // PUT /api/panels/:id - Update panel

app.put('/api/panels/:id', function (req, res) {
  var index = panels.findIndex(function (p) {
    return p.id === req.params.id;
  });

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Panel not found'
    });
  }

  var _req$body2 = req.body,
      location = _req$body2.location,
      capacity = _req$body2.capacity,
      todayProduction = _req$body2.todayProduction,
      status = _req$body2.status; // Update panel

  panels[index] = _objectSpread({}, panels[index], {
    location: location || panels[index].location,
    capacity: capacity ? parseFloat(capacity) : panels[index].capacity,
    todayProduction: todayProduction ? parseFloat(todayProduction) : panels[index].todayProduction,
    status: status || panels[index].status
  });
  res.json({
    success: true,
    message: 'Panel updated successfully',
    data: panels[index]
  });
}); // DELETE /api/panels/:id - Delete panel

app["delete"]('/api/panels/:id', function (req, res) {
  var index = panels.findIndex(function (p) {
    return p.id === req.params.id;
  });

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Panel not found'
    });
  }

  var deletedPanel = panels.splice(index, 1)[0];
  res.json({
    success: true,
    message: 'Panel deleted successfully',
    data: deletedPanel
  });
}); // GET /api/production - Get production data

app.get('/api/production', function (req, res) {
  res.json({
    success: true,
    data: productionData
  });
}); // GET /api/energy-prices

app.get('/api/energy-prices', function (req, res) {
  res.json({
    success: true,
    data: energyPriceData
  });
}); // GET /api/countries

app.get('/api/countries', function (req, res) {
  res.json({
    success: true,
    data: countryData
  });
}); // GET /api/stats - Get statistics

app.get('/api/stats', function (req, res) {
  var totalProduction = panels.reduce(function (sum, p) {
    return sum + p.todayProduction;
  }, 0);
  var activePanels = panels.filter(function (p) {
    return p.status === 'Active';
  }).length;
  var totalCapacity = panels.reduce(function (sum, p) {
    return sum + p.capacity;
  }, 0);
  res.json({
    success: true,
    data: {
      totalProduction: totalProduction,
      activePanels: activePanels,
      totalPanels: panels.length,
      totalCapacity: totalCapacity,
      averageProduction: totalProduction / panels.length
    }
  });
}); // Health check

app.get('/health', function (req, res) {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
}); // Start server

app.listen(PORT, function () {
  console.log("\uD83D\uDE80 Solar Energy API running on http://localhost:".concat(PORT));
});
module.exports = app;