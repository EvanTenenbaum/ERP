/**
 * Data loader for the ERP system
 * 
 * This file loads dummy data into the application's localStorage database.
 * It imports the dummy data from the respective files and uses the database
 * adapter to populate the collections.
 */

// Import database adapter
const db = require('../lib/database');

// Import dummy data
const { locations, products, inventoryRecords } = require('./inventory-data');
const { customers } = require('./customer-data');
const { sales } = require('./sales-data');

// Function to load all dummy data
async function loadDummyData() {
  console.log('Starting to load dummy data...');
  
  try {
    // Load locations
    console.log(`Loading ${locations.length} locations...`);
    for (const location of locations) {
      await db.locations.create(location);
    }
    
    // Load products
    console.log(`Loading ${products.length} products...`);
    for (const product of products) {
      await db.products.create(product);
    }
    
    // Load inventory records
    console.log(`Loading ${inventoryRecords.length} inventory records...`);
    for (const record of inventoryRecords) {
      await db.inventoryRecords.create(record);
    }
    
    // Load customers
    console.log(`Loading ${customers.length} customers...`);
    for (const customer of customers) {
      await db.customers.create(customer);
    }
    
    // Load sales
    console.log(`Loading ${sales.length} sales/orders...`);
    for (const sale of sales) {
      await db.sales.create(sale);
    }
    
    console.log('Dummy data loaded successfully!');
    return { success: true, message: 'All dummy data loaded successfully!' };
  } catch (error) {
    console.error('Error loading dummy data:', error);
    return { success: false, message: `Error loading data: ${error.message}` };
  }
}

// Export the loader function
module.exports = {
  loadDummyData,
};
