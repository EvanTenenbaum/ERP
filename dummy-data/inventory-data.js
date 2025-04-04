/**
 * Dummy inventory data for the ERP system
 * 
 * This file contains sample data for products, locations, and inventory records
 * to populate the inventory management section of the application.
 */

// Create dummy locations
const locations = [
  {
    id: 'loc_001',
    name: 'Main Warehouse',
    address: {
      street: '123 Storage Ave',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      country: 'USA',
    },
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'loc_002',
    name: 'Downtown Store',
    address: {
      street: '456 Retail Blvd',
      city: 'Portland',
      state: 'OR',
      zip: '97204',
      country: 'USA',
    },
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'loc_003',
    name: 'East Side Facility',
    address: {
      street: '789 Distribution Dr',
      city: 'Gresham',
      state: 'OR',
      zip: '97030',
      country: 'USA',
    },
    isActive: true,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: 'loc_004',
    name: 'South Storage',
    address: {
      street: '321 Backup Lane',
      city: 'Tigard',
      state: 'OR',
      zip: '97223',
      country: 'USA',
    },
    isActive: false,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-15'),
  },
];

// Create dummy products
const products = [
  // Indoor Category
  {
    id: 'prod_001',
    sku: 'IND-001',
    name: 'Premium Indoor Flower - OG Kush',
    description: 'Top-shelf indoor-grown OG Kush flower, known for its earthy pine and sour lemon scent with woody undertones.',
    category: 'indoor',
    strainType: 'hybrid',
    vendorId: 'vend_001',
    vendorCode: 'FARM001',
    locations: ['loc_001', 'loc_002'],
    price: 1200.00, // $1200 per pound
    costPrice: 800.00,
    quantity: 25,
    unit: 'lb',
    images: ['https://example.com/images/og-kush.jpg'],
    batchNumber: 'BATCH-IND-2024-001',
    notes: 'Award-winning strain, consistently high demand',
    customFields: {
      thcPercentage: '18%',
      cbdPercentage: '0.1%',
      harvestDate: '2024-01-10',
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'prod_002',
    sku: 'IND-002',
    name: 'Premium Indoor Flower - Blue Dream',
    description: 'High-quality indoor-grown Blue Dream, a sativa-dominant hybrid with a sweet berry aroma.',
    category: 'indoor',
    strainType: 'sativa',
    vendorId: 'vend_002',
    vendorCode: 'FARM002',
    locations: ['loc_001'],
    price: 1150.00,
    costPrice: 750.00,
    quantity: 30,
    unit: 'lb',
    images: ['https://example.com/images/blue-dream.jpg'],
    batchNumber: 'BATCH-IND-2024-002',
    notes: 'Popular strain with consistent quality',
    customFields: {
      thcPercentage: '19%',
      cbdPercentage: '0.2%',
      harvestDate: '2024-01-15',
    },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'prod_003',
    sku: 'IND-003',
    name: 'Premium Indoor Flower - Wedding Cake',
    description: 'Exceptional indoor-grown Wedding Cake, an indica-dominant hybrid with a rich and tangy flavor profile.',
    category: 'indoor',
    strainType: 'indica',
    vendorId: 'vend_001',
    vendorCode: 'FARM001',
    locations: ['loc_001', 'loc_002'],
    price: 1300.00,
    costPrice: 850.00,
    quantity: 20,
    unit: 'lb',
    images: ['https://example.com/images/wedding-cake.jpg'],
    batchNumber: 'BATCH-IND-2024-003',
    notes: 'Premium quality, high demand strain',
    customFields: {
      thcPercentage: '22%',
      cbdPercentage: '0.1%',
      harvestDate: '2024-01-20',
    },
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
  },

  // Outdoor Category
  {
    id: 'prod_004',
    sku: 'OUT-001',
    name: 'Outdoor Flower - Sour Diesel',
    description: 'Sun-grown Sour Diesel with a pungent, diesel-like aroma and energizing effects.',
    category: 'outdoor',
    strainType: 'sativa',
    vendorId: 'vend_003',
    vendorCode: 'FARM003',
    locations: ['loc_001', 'loc_003'],
    price: 800.00,
    costPrice: 500.00,
    quantity: 50,
    unit: 'lb',
    images: ['https://example.com/images/sour-diesel.jpg'],
    batchNumber: 'BATCH-OUT-2024-001',
    notes: 'Excellent outdoor quality, fall harvest',
    customFields: {
      thcPercentage: '17%',
      cbdPercentage: '0.2%',
      harvestDate: '2023-10-15',
    },
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: 'prod_005',
    sku: 'OUT-002',
    name: 'Outdoor Flower - Jack Herer',
    description: 'Sun-grown Jack Herer, a sativa-dominant strain named after the cannabis activist and author.',
    category: 'outdoor',
    strainType: 'sativa',
    vendorId: 'vend_002',
    vendorCode: 'FARM002',
    locations: ['loc_001'],
    price: 850.00,
    costPrice: 550.00,
    quantity: 40,
    unit: 'lb',
    images: ['https://example.com/images/jack-herer.jpg'],
    batchNumber: 'BATCH-OUT-2024-002',
    notes: 'Award-winning outdoor grow',
    customFields: {
      thcPercentage: '18%',
      cbdPercentage: '0.3%',
      harvestDate: '2023-10-20',
    },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },

  // Light Dep Category
  {
    id: 'prod_006',
    sku: 'LD-001',
    name: 'Light Dep Flower - Gelato',
    description: 'Light deprivation grown Gelato, known for its dessert-like aroma and balanced effects.',
    category: 'light dep',
    strainType: 'hybrid',
    vendorId: 'vend_004',
    vendorCode: 'FARM004',
    locations: ['loc_001', 'loc_003'],
    price: 1000.00,
    costPrice: 650.00,
    quantity: 35,
    unit: 'lb',
    images: ['https://example.com/images/gelato.jpg'],
    batchNumber: 'BATCH-LD-2024-001',
    notes: 'Early season light dep, excellent quality',
    customFields: {
      thcPercentage: '20%',
      cbdPercentage: '0.1%',
      harvestDate: '2024-02-01',
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'prod_007',
    sku: 'LD-002',
    name: 'Light Dep Flower - Purple Punch',
    description: 'Light deprivation grown Purple Punch, an indica-dominant hybrid with a sweet, grape-like aroma.',
    category: 'light dep',
    strainType: 'indica',
    vendorId: 'vend_003',
    vendorCode: 'FARM003',
    locations: ['loc_001'],
    price: 950.00,
    costPrice: 600.00,
    quantity: 30,
    unit: 'lb',
    images: ['https://example.com/images/purple-punch.jpg'],
    batchNumber: 'BATCH-LD-2024-002',
    notes: 'Popular strain with vibrant purple coloration',
    customFields: {
      thcPercentage: '19%',
      cbdPercentage: '0.2%',
      harvestDate: '2024-02-05',
    },
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },

  // Concentrate Category
  {
    id: 'prod_008',
    sku: 'CON-001',
    name: 'Live Resin - OG Kush',
    description: 'High-terpene full-spectrum extract made from fresh frozen OG Kush flower.',
    category: 'concentrate',
    strainType: 'hybrid',
    vendorId: 'vend_005',
    vendorCode: 'EXTRACT001',
    locations: ['loc_002'],
    price: 15.00, // $15 per gram
    costPrice: 8.00,
    quantity: 500,
    unit: 'g',
    images: ['https://example.com/images/og-kush-live-resin.jpg'],
    batchNumber: 'BATCH-CON-2024-001',
    notes: 'Premium concentrate with exceptional terpene profile',
    customFields: {
      thcPercentage: '75%',
      cbdPercentage: '0.5%',
      extractionDate: '2024-02-10',
    },
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25'),
  },
  {
    id: 'prod_009',
    sku: 'CON-002',
    name: 'Shatter - Blue Dream',
    description: 'Glass-like concentrate with high potency made from Blue Dream strain.',
    category: 'concentrate',
    strainType: 'sativa',
    vendorId: 'vend_005',
    vendorCode: 'EXTRACT001',
    locations: ['loc_002'],
    price: 12.00,
    costPrice: 6.00,
    quantity: 600,
    unit: 'g',
    images: ['https://example.com/images/blue-dream-shatter.jpg'],
    batchNumber: 'BATCH-CON-2024-002',
    notes: 'Clear amber color with excellent stability',
    customFields: {
      thcPercentage: '80%',
      cbdPercentage: '0.3%',
      extractionDate: '2024-02-15',
    },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },

  // Vape Category
  {
    id: 'prod_010',
    sku: 'VAP-001',
    name: 'Vape Cartridge - Sour Diesel',
    description: '1g vape cartridge filled with Sour Diesel distillate and cannabis-derived terpenes.',
    category: 'vape',
    strainType: 'sativa',
    vendorId: 'vend_006',
    vendorCode: 'VAPE001',
    locations: ['loc_002', 'loc_003'],
    price: 25.00,
    costPrice: 12.00,
    quantity: 200,
    unit: 'cart',
    images: ['https://example.com/images/sour-diesel-vape.jpg'],
    batchNumber: 'BATCH-VAP-2024-001',
    notes: 'Ceramic coil cartridge with full-spectrum oil',
    customFields: {
      thcPercentage: '85%',
      cbdPercentage: '0.2%',
      manufacturingDate: '2024-02-20',
    },
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: 'prod_011',
    sku: 'VAP-002',
    name: 'Vape Cartridge - Wedding Cake',
    description: '1g vape cartridge filled with Wedding Cake distillate and cannabis-derived terpenes.',
    category: 'vape',
    strainType: 'indica',
    vendorId: 'vend_006',
    vendorCode: 'VAPE001',
    locations: ['loc_002'],
    price: 25.00,
    costPrice: 12.00,
    quantity: 150,
    unit: 'cart',
    images: ['https://example.com/images/wedding-cake-vape.jpg'],
    batchNumber: 'BATCH-VAP-2024-002',
    notes: 'Ceramic coil cartridge with full-spectrum oil',
    customFields: {
      thcPercentage: '87%',
      cbdPercentage: '0.1%',
      manufacturingDate: '2024-02-25',
    },
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },

  // Other Category
  {
    id: 'prod_012',
    sku: 'OTH-001',
    name: 'CBD Tincture - 1000mg',
    description: 'Full-spectrum CBD tincture with 1000mg of CBD in a 30ml bottle.',
    category: 'other',
    strainType: 'hybrid',
    vendorId: 'vend_007',
    vendorCode: 'CBD001',
    locations: ['loc_002', 'loc_003'],
    price: 50.00,
    costPrice: 25.00,
    quantity: 100,
    unit: 'bottle',
    images: ['https://example.com/images/cbd-tincture.jpg'],
    batchNumber: 'BATCH-OTH-2024-001',
    notes: 'MCT oil-based tincture with full-spectrum extract',
    customFields: {
      cbdPercentage: '3.3%',
      thcPercentage: '0.2%',
      manufacturingDate: '2024-03-01',
    },
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: 'prod_013',
    sku: 'OTH-002',
    name: 'Hemp Pre-Rolls - 5 Pack',
    description: 'Pack of 5 pre-rolled hemp joints, 0.7g each, made with premium CBD flower.',
    category: 'other',
    strainType: 'hybrid',
    vendorId: 'vend_007',
    vendorCode: 'CBD001',
    locations: ['loc_002'],
    price: 20.00,
    costPrice: 10.00,
    quantity: 80,
    unit: 'pack',
    images: ['https://example.com/images/hemp-prerolls.jpg'],
    batchNumber: 'BATCH-OTH-2024-002',
    notes: 'Made with organic hemp flower, no additives',
    customFields: {
      cbdPercentage: '15%',
      thcPercentage: '0.3%',
      manufacturingDate: '2024-03-05',
    },
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
  },
];

// Create dummy inventory records
const inventoryRecords = [];

// Generate inventory records for each product at each of its locations
products.forEach(product => {
  product.locations.forEach(locationId => {
    // Distribute the total quantity across locations
    const locationQuantity = Math.floor(product.quantity / product.locations.length);
    
    inventoryRecords.push({
      id: `inv_${product.id}_${locationId}`,
      productId: product.id,
      locationId: locationId,
      quantity: locationQuantity,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  });
});

module.exports = {
  locations,
  products,
  inventoryRecords,
};
