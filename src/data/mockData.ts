import type {
  Product,
  InventoryItem,
  Order,
  Allocation,
  PickingTask,
  PackingTask,
  QualityCheck,
  WarehouseException,
  Dispatch,
  InventoryMovement,
  Decision,
  Alert
} from '../types/warehouse';

// 1. Mock Products (20 SKUs)
export const initialProducts: Product[] = [
  { id: 'PROD-101', sku: 'WM-101', name: 'Industrial RFID Scanner X1', category: 'Electronics', supplier: 'Zebra Tech', unitPrice: 299.99 },
  { id: 'PROD-102', sku: 'WM-102', name: 'Thermal Shipping Label Roll (1000s)', category: 'Packaging', supplier: 'Avery Dennison', unitPrice: 14.50 },
  { id: 'PROD-103', sku: 'WM-103', name: 'Heavy Duty Pallet Wrap 18in', category: 'Packaging', supplier: 'Sigma Plastics', unitPrice: 42.00 },
  { id: 'PROD-104', sku: 'WM-104', name: 'Ergonomic Wireless Scanner Pro', category: 'Electronics', supplier: 'Honeywell Corp', unitPrice: 349.00 },
  { id: 'PROD-105', sku: 'WM-105', name: 'Precision Digital Crane Scale 500kg', category: 'Tools', supplier: 'Torrey Scales', unitPrice: 189.50 },
  { id: 'PROD-106', sku: 'WM-106', name: 'Heavy Duty Cargo Straps (4 Pack)', category: 'Tools', supplier: 'Kinedyne', unitPrice: 28.99 },
  { id: 'PROD-107', sku: 'WM-107', name: 'Automatic Tape Dispenser 3000', category: 'Packaging', supplier: '3M Industrial', unitPrice: 125.00 },
  { id: 'PROD-108', sku: 'WM-108', name: 'Bluetooth Label Printer Mobile', category: 'Electronics', supplier: 'Bixolon Inc', unitPrice: 210.00 },
  { id: 'PROD-109', sku: 'WM-109', name: 'Anti-Static Bubble Wrap Roll', category: 'Packaging', supplier: 'Sealed Air', unitPrice: 35.75 },
  { id: 'PROD-110', sku: 'WM-110', name: 'Safety Steel Toe Work Boots V2', category: 'Accessories', supplier: 'Timberland PRO', unitPrice: 145.00 },
  { id: 'PROD-111', sku: 'WM-111', name: 'High-Vis Safety Vest XL (Yellow)', category: 'Accessories', supplier: 'Radians', unitPrice: 18.50 },
  { id: 'PROD-112', sku: 'WM-112', name: 'Smart Warehouse Drone Sensor Pack', category: 'Electronics', supplier: 'Skydio Enterprise', unitPrice: 890.00 },
  { id: 'PROD-113', sku: 'WM-113', name: 'Hydraulic Pallet Jack 5500lb', category: 'Tools', supplier: 'Crown Equipment', unitPrice: 450.00 },
  { id: 'PROD-114', sku: 'WM-114', name: 'Corrugated Shipping Box 16x16x16', category: 'Packaging', supplier: 'Uline Corp', unitPrice: 2.20 },
  { id: 'PROD-115', sku: 'WM-115', name: 'ESD Protective Touchscreen Gloves', category: 'Accessories', supplier: 'Ansell Industrial', unitPrice: 12.00 },
  { id: 'PROD-116', sku: 'WM-116', name: 'Rechargeable Forklift Battery 24V', category: 'Electronics', supplier: 'Enersys', unitPrice: 1200.00 },
  { id: 'PROD-117', sku: 'WM-117', name: 'Barcoded Storage Tote Box 50L', category: 'Packaging', supplier: 'Akro-Mils', unitPrice: 24.99 },
  { id: 'PROD-118', sku: 'WM-118', name: 'Adjustable Warehouse Shelving Post', category: 'Tools', supplier: 'InterMetro', unitPrice: 65.00 },
  { id: 'PROD-119', sku: 'WM-119', name: 'Pneumatic Staple Gun Heavy Duty', category: 'Tools', supplier: 'Bostitch Industrial', unitPrice: 110.00 },
  { id: 'PROD-120', sku: 'WM-120', name: 'Industrial Floor Cleaning Compound', category: 'Office Supplies', supplier: 'Ecolab', unitPrice: 48.00 },
];

// 2. Mock Inventory Items (20 SKUs)
export const initialInventory: InventoryItem[] = [
  { id: 'INV-101', productId: 'PROD-101', sku: 'WM-101', productName: 'Industrial RFID Scanner X1', category: 'Electronics', zone: 'ZONE-A', bin: 'A-01', totalQuantity: 35, availableQuantity: 30, reservedQuantity: 5, damagedQuantity: 0, reorderLevel: 10, status: 'IN_STOCK', supplier: 'Zebra Tech' },
  { id: 'INV-102', productId: 'PROD-102', sku: 'WM-102', productName: 'Thermal Shipping Label Roll (1000s)', category: 'Packaging', zone: 'ZONE-B', bin: 'B-04', totalQuantity: 155, availableQuantity: 150, reservedQuantity: 5, damagedQuantity: 0, reorderLevel: 20, status: 'OVERSTOCKED', supplier: 'Avery Dennison' },
  { id: 'INV-103', productId: 'PROD-103', sku: 'WM-103', productName: 'Heavy Duty Pallet Wrap 18in', category: 'Packaging', zone: 'ZONE-B', bin: 'B-02', totalQuantity: 40, availableQuantity: 38, reservedQuantity: 2, damagedQuantity: 0, reorderLevel: 15, status: 'IN_STOCK', supplier: 'Sigma Plastics' },
  
  // CRITICAL DEMO INVENTORY: WM-104 has EXACTLY 7 available units!
  { id: 'INV-104', productId: 'PROD-104', sku: 'WM-104', productName: 'Ergonomic Wireless Scanner Pro', category: 'Electronics', zone: 'ZONE-A', bin: 'A-03', totalQuantity: 10, availableQuantity: 7, reservedQuantity: 2, damagedQuantity: 1, reorderLevel: 8, status: 'LOW_STOCK', supplier: 'Honeywell Corp' },

  { id: 'INV-105', productId: 'PROD-105', sku: 'WM-105', productName: 'Precision Digital Crane Scale 500kg', category: 'Tools', zone: 'ZONE-C', bin: 'C-01', totalQuantity: 18, availableQuantity: 18, reservedQuantity: 0, damagedQuantity: 0, reorderLevel: 5, status: 'IN_STOCK', supplier: 'Torrey Scales' },
  { id: 'INV-106', productId: 'PROD-106', sku: 'WM-106', productName: 'Heavy Duty Cargo Straps (4 Pack)', category: 'Tools', zone: 'ZONE-C', bin: 'C-02', totalQuantity: 60, availableQuantity: 50, reservedQuantity: 10, damagedQuantity: 0, reorderLevel: 15, status: 'IN_STOCK', supplier: 'Kinedyne' },
  { id: 'INV-107', productId: 'PROD-107', sku: 'WM-107', productName: 'Automatic Tape Dispenser 3000', category: 'Packaging', zone: 'ZONE-B', bin: 'B-01', totalQuantity: 22, availableQuantity: 20, reservedQuantity: 2, damagedQuantity: 0, reorderLevel: 8, status: 'IN_STOCK', supplier: '3M Industrial' },
  { id: 'INV-108', productId: 'PROD-108', sku: 'WM-108', productName: 'Bluetooth Label Printer Mobile', category: 'Electronics', zone: 'ZONE-A', bin: 'A-05', totalQuantity: 5, availableQuantity: 3, reservedQuantity: 2, damagedQuantity: 0, reorderLevel: 5, status: 'LOW_STOCK', supplier: 'Bixolon Inc' },
  { id: 'INV-109', productId: 'PROD-109', sku: 'WM-109', productName: 'Anti-Static Bubble Wrap Roll', category: 'Packaging', zone: 'ZONE-B', bin: 'B-03', totalQuantity: 28, availableQuantity: 25, reservedQuantity: 3, damagedQuantity: 0, reorderLevel: 10, status: 'IN_STOCK', supplier: 'Sealed Air' },
  { id: 'INV-110', productId: 'PROD-110', sku: 'WM-110', productName: 'Safety Steel Toe Work Boots V2', category: 'Accessories', zone: 'ZONE-D', bin: 'D-01', totalQuantity: 16, availableQuantity: 16, reservedQuantity: 0, damagedQuantity: 0, reorderLevel: 6, status: 'IN_STOCK', supplier: 'Timberland PRO' },
  { id: 'INV-111', productId: 'PROD-111', sku: 'WM-111', productName: 'High-Vis Safety Vest XL (Yellow)', category: 'Accessories', zone: 'ZONE-D', bin: 'D-02', totalQuantity: 45, availableQuantity: 40, reservedQuantity: 5, damagedQuantity: 0, reorderLevel: 12, status: 'IN_STOCK', supplier: 'Radians' },
  
  // OUT OF STOCK EDGE CASE
  { id: 'INV-112', productId: 'PROD-112', sku: 'WM-112', productName: 'Smart Warehouse Drone Sensor Pack', category: 'Electronics', zone: 'ZONE-A', bin: 'A-07', totalQuantity: 0, availableQuantity: 0, reservedQuantity: 0, damagedQuantity: 0, reorderLevel: 3, status: 'OUT_OF_STOCK', supplier: 'Skydio Enterprise' },
  
  { id: 'INV-113', productId: 'PROD-113', sku: 'WM-113', productName: 'Hydraulic Pallet Jack 5500lb', category: 'Tools', zone: 'ZONE-C', bin: 'C-05', totalQuantity: 8, availableQuantity: 7, reservedQuantity: 1, damagedQuantity: 0, reorderLevel: 2, status: 'IN_STOCK', supplier: 'Crown Equipment' },
  { id: 'INV-114', productId: 'PROD-114', sku: 'WM-114', productName: 'Corrugated Shipping Box 16x16x16', category: 'Packaging', zone: 'ZONE-B', bin: 'B-05', totalQuantity: 500, availableQuantity: 480, reservedQuantity: 20, damagedQuantity: 0, reorderLevel: 100, status: 'IN_STOCK', supplier: 'Uline Corp' },
  
  // DAMAGED EDGE CASE
  { id: 'INV-115', productId: 'PROD-115', sku: 'WM-115', productName: 'ESD Protective Touchscreen Gloves', category: 'Accessories', zone: 'ZONE-D', bin: 'D-03', totalQuantity: 14, availableQuantity: 10, reservedQuantity: 0, damagedQuantity: 4, reorderLevel: 8, status: 'DAMAGED', supplier: 'Ansell Industrial' },

  { id: 'INV-116', productId: 'PROD-116', sku: 'WM-116', productName: 'Rechargeable Forklift Battery 24V', category: 'Electronics', zone: 'ZONE-A', bin: 'A-09', totalQuantity: 4, availableQuantity: 4, reservedQuantity: 0, damagedQuantity: 0, reorderLevel: 2, status: 'IN_STOCK', supplier: 'Enersys' },
  { id: 'INV-117', productId: 'PROD-117', sku: 'WM-117', productName: 'Barcoded Storage Tote Box 50L', category: 'Packaging', zone: 'ZONE-B', bin: 'B-06', totalQuantity: 80, availableQuantity: 75, reservedQuantity: 5, damagedQuantity: 0, reorderLevel: 25, status: 'IN_STOCK', supplier: 'Akro-Mils' },
  { id: 'INV-118', productId: 'PROD-118', sku: 'WM-118', productName: 'Adjustable Warehouse Shelving Post', category: 'Tools', zone: 'ZONE-C', bin: 'C-04', totalQuantity: 30, availableQuantity: 30, reservedQuantity: 0, damagedQuantity: 0, reorderLevel: 10, status: 'IN_STOCK', supplier: 'InterMetro' },
  { id: 'INV-119', productId: 'PROD-119', sku: 'WM-119', productName: 'Pneumatic Staple Gun Heavy Duty', category: 'Tools', zone: 'ZONE-C', bin: 'C-03', totalQuantity: 12, availableQuantity: 10, reservedQuantity: 2, damagedQuantity: 0, reorderLevel: 4, status: 'IN_STOCK', supplier: 'Bostitch Industrial' },
  { id: 'INV-120', productId: 'PROD-120', sku: 'WM-120', productName: 'Industrial Floor Cleaning Compound', category: 'Office Supplies', zone: 'ZONE-D', bin: 'D-05', totalQuantity: 25, availableQuantity: 25, reservedQuantity: 0, damagedQuantity: 0, reorderLevel: 5, status: 'IN_STOCK', supplier: 'Ecolab' },
];

const getDeadline = (hoursFromNow: number) => {
  const d = new Date();
  d.setHours(d.getHours() + hoursFromNow);
  return d.toISOString();
};

// 3. Mock Orders (15 Orders)
export const initialOrders: Order[] = [
  // REQUIRED DEMO CRITICAL ORDER: ORD-1024
  {
    id: 'ORD-1024',
    customer: 'Apex Logistics Corp',
    orderDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    dispatchDeadline: getDeadline(2),
    priority: 'CRITICAL',
    priorityScore: 98,
    priorityReason: 'Critical deadline risk + High SLA customer contract. Requires 10 units of WM-104.',
    status: 'PROCESSING',
    riskLevel: 'CRITICAL',
    allocationStatus: 'WAITING',
    totalAmount: 3490.00,
    items: [
      { id: 'OI-1024-1', orderId: 'ORD-1024', sku: 'WM-104', productId: 'PROD-104', productName: 'Ergonomic Wireless Scanner Pro', quantity: 10, allocatedQuantity: 0, pickedQuantity: 0, unitPrice: 349.00 }
    ]
  },
  // REQUIRED DEMO NORMAL ORDER: ORD-1025
  {
    id: 'ORD-1025',
    customer: 'TechFlow Systems',
    orderDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    dispatchDeadline: getDeadline(24),
    priority: 'NORMAL',
    priorityScore: 55,
    priorityReason: 'Standard order SLA. Competing for WM-104 inventory.',
    status: 'NEW',
    riskLevel: 'LOW',
    allocationStatus: 'WAITING',
    totalAmount: 1745.00,
    items: [
      { id: 'OI-1025-1', orderId: 'ORD-1025', sku: 'WM-104', productId: 'PROD-104', productName: 'Ergonomic Wireless Scanner Pro', quantity: 5, allocatedQuantity: 0, pickedQuantity: 0, unitPrice: 349.00 }
    ]
  },
  {
    id: 'ORD-1026',
    customer: 'Global Freight Partners',
    orderDate: new Date(Date.now() - 3600000 * 6).toISOString(),
    dispatchDeadline: getDeadline(4),
    priority: 'HIGH',
    priorityScore: 88,
    priorityReason: 'High priority customer with urgent dispatch deadline.',
    status: 'ALLOCATED',
    riskLevel: 'HIGH',
    allocationStatus: 'FULL',
    totalAmount: 1499.95,
    items: [
      { id: 'OI-1026-1', orderId: 'ORD-1026', sku: 'WM-101', productId: 'PROD-101', productName: 'Industrial RFID Scanner X1', quantity: 5, allocatedQuantity: 5, pickedQuantity: 0, unitPrice: 299.99 }
    ]
  },
  {
    id: 'ORD-1027',
    customer: 'Metro Retail Distribution',
    orderDate: new Date(Date.now() - 3600000 * 8).toISOString(),
    dispatchDeadline: getDeadline(6),
    priority: 'HIGH',
    priorityScore: 82,
    priorityReason: 'Multi-item order currently in picking sequence.',
    status: 'PICKING',
    riskLevel: 'MEDIUM',
    allocationStatus: 'FULL',
    totalAmount: 420.00,
    items: [
      { id: 'OI-1027-1', orderId: 'ORD-1027', sku: 'WM-103', productId: 'PROD-103', productName: 'Heavy Duty Pallet Wrap 18in', quantity: 10, allocatedQuantity: 10, pickedQuantity: 6, unitPrice: 42.00 }
    ]
  },
  {
    id: 'ORD-1028',
    customer: 'NexGen Warehouse Solutions',
    orderDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    dispatchDeadline: getDeadline(3),
    priority: 'HIGH',
    priorityScore: 85,
    priorityReason: 'Quality control failure detected during packaging inspection.',
    status: 'EXCEPTION',
    riskLevel: 'HIGH',
    allocationStatus: 'FULL',
    totalAmount: 947.50,
    items: [
      { id: 'OI-1028-1', orderId: 'ORD-1028', sku: 'WM-105', productId: 'PROD-105', productName: 'Precision Digital Crane Scale 500kg', quantity: 5, allocatedQuantity: 5, pickedQuantity: 5, unitPrice: 189.50 }
    ]
  },
  {
    id: 'ORD-1029',
    customer: 'Pinnacle Supply Chain',
    orderDate: new Date(Date.now() - 3600000 * 14).toISOString(),
    dispatchDeadline: getDeadline(5),
    priority: 'NORMAL',
    priorityScore: 62,
    priorityReason: 'Items picked and currently at packing station PACK-01.',
    status: 'PACKING',
    riskLevel: 'LOW',
    allocationStatus: 'FULL',
    totalAmount: 579.80,
    items: [
      { id: 'OI-1029-1', orderId: 'ORD-1029', sku: 'WM-106', productId: 'PROD-106', productName: 'Heavy Duty Cargo Straps (4 Pack)', quantity: 20, allocatedQuantity: 20, pickedQuantity: 20, unitPrice: 28.99 }
    ]
  },
  {
    id: 'ORD-1030',
    customer: 'Swift Express Line',
    orderDate: new Date(Date.now() - 3600000 * 18).toISOString(),
    dispatchDeadline: getDeadline(1),
    priority: 'CRITICAL',
    priorityScore: 95,
    priorityReason: 'Critical deadline approaching. Fully packed and verified.',
    status: 'READY',
    riskLevel: 'CRITICAL',
    allocationStatus: 'FULL',
    totalAmount: 1250.00,
    items: [
      { id: 'OI-1030-1', orderId: 'ORD-1030', sku: 'WM-107', productId: 'PROD-107', productName: 'Automatic Tape Dispenser 3000', quantity: 10, allocatedQuantity: 10, pickedQuantity: 10, unitPrice: 125.00 }
    ]
  },
  {
    id: 'ORD-1031',
    customer: 'Horizon Industrial Supplies',
    orderDate: new Date(Date.now() - 3600000 * 24).toISOString(),
    dispatchDeadline: getDeadline(-2),
    priority: 'NORMAL',
    priorityScore: 50,
    priorityReason: 'Order successfully loaded onto carrier truck.',
    status: 'DISPATCHED',
    riskLevel: 'LOW',
    allocationStatus: 'FULL',
    totalAmount: 1450.00,
    items: [
      { id: 'OI-1031-1', orderId: 'ORD-1031', sku: 'WM-110', productId: 'PROD-110', productName: 'Safety Steel Toe Work Boots V2', quantity: 10, allocatedQuantity: 10, pickedQuantity: 10, unitPrice: 145.00 }
    ]
  },
  {
    id: 'ORD-1032',
    customer: 'Vanguard Freight Direct',
    orderDate: new Date(Date.now() - 3600000 * 1).toISOString(),
    dispatchDeadline: getDeadline(36),
    priority: 'LOW',
    priorityScore: 35,
    priorityReason: 'Low priority order with ample dispatch buffer time.',
    status: 'NEW',
    riskLevel: 'LOW',
    allocationStatus: 'WAITING',
    totalAmount: 370.00,
    items: [
      { id: 'OI-1032-1', orderId: 'ORD-1032', sku: 'WM-111', productId: 'PROD-111', productName: 'High-Vis Safety Vest XL (Yellow)', quantity: 20, allocatedQuantity: 0, pickedQuantity: 0, unitPrice: 18.50 }
    ]
  },
  {
    id: 'ORD-1033',
    customer: 'AeroSpace Components LLC',
    orderDate: new Date(Date.now() - 3600000 * 3).toISOString(),
    dispatchDeadline: getDeadline(8),
    priority: 'HIGH',
    priorityScore: 78,
    priorityReason: 'High order value electronics shipment.',
    status: 'NEW',
    riskLevel: 'MEDIUM',
    allocationStatus: 'WAITING',
    totalAmount: 2670.00,
    items: [
      { id: 'OI-1033-1', orderId: 'ORD-1033', sku: 'WM-112', productId: 'PROD-112', productName: 'Smart Warehouse Drone Sensor Pack', quantity: 3, allocatedQuantity: 0, pickedQuantity: 0, unitPrice: 890.00 }
    ]
  },
  {
    id: 'ORD-1034',
    customer: 'Titan Heavy Machinery',
    orderDate: new Date(Date.now() - 3600000 * 5).toISOString(),
    dispatchDeadline: getDeadline(12),
    priority: 'NORMAL',
    priorityScore: 58,
    priorityReason: 'Standard tools shipment in preparation.',
    status: 'ALLOCATED',
    riskLevel: 'LOW',
    allocationStatus: 'FULL',
    totalAmount: 900.00,
    items: [
      { id: 'OI-1034-1', orderId: 'ORD-1034', sku: 'WM-113', productId: 'PROD-113', productName: 'Hydraulic Pallet Jack 5500lb', quantity: 2, allocatedQuantity: 2, pickedQuantity: 0, unitPrice: 450.00 }
    ]
  },
  {
    id: 'ORD-1035',
    customer: 'OmniPack Distributors',
    orderDate: new Date(Date.now() - 3600000 * 7).toISOString(),
    dispatchDeadline: getDeadline(15),
    priority: 'LOW',
    priorityScore: 40,
    priorityReason: 'Bulk packaging materials order.',
    status: 'PROCESSING',
    riskLevel: 'LOW',
    allocationStatus: 'FULL',
    totalAmount: 440.00,
    items: [
      { id: 'OI-1035-1', orderId: 'ORD-1035', sku: 'WM-114', productId: 'PROD-114', productName: 'Corrugated Shipping Box 16x16x16', quantity: 200, allocatedQuantity: 200, pickedQuantity: 0, unitPrice: 2.20 }
    ]
  },
  {
    id: 'ORD-1036',
    customer: 'Beacon Industrial Tech',
    orderDate: new Date(Date.now() - 3600000 * 9).toISOString(),
    dispatchDeadline: getDeadline(3),
    priority: 'HIGH',
    priorityScore: 84,
    priorityReason: 'Damaged item reported during pick step.',
    status: 'EXCEPTION',
    riskLevel: 'HIGH',
    allocationStatus: 'FULL',
    totalAmount: 240.00,
    items: [
      { id: 'OI-1036-1', orderId: 'ORD-1036', sku: 'WM-115', productId: 'PROD-115', productName: 'ESD Protective Touchscreen Gloves', quantity: 20, allocatedQuantity: 20, pickedQuantity: 16, unitPrice: 12.00 }
    ]
  },
  {
    id: 'ORD-1037',
    customer: 'Prime Logistics Hub',
    orderDate: new Date(Date.now() - 3600000 * 10).toISOString(),
    dispatchDeadline: getDeadline(4),
    priority: 'NORMAL',
    priorityScore: 60,
    priorityReason: 'Order ready at staging dock 3.',
    status: 'READY',
    riskLevel: 'LOW',
    allocationStatus: 'FULL',
    totalAmount: 2400.00,
    items: [
      { id: 'OI-1037-1', orderId: 'ORD-1037', sku: 'WM-116', productId: 'PROD-116', productName: 'Rechargeable Forklift Battery 24V', quantity: 2, allocatedQuantity: 2, pickedQuantity: 2, unitPrice: 1200.00 }
    ]
  },
  {
    id: 'ORD-1038',
    customer: 'United Supply Co',
    orderDate: new Date(Date.now() - 3600000 * 15).toISOString(),
    dispatchDeadline: getDeadline(18),
    priority: 'LOW',
    priorityScore: 30,
    priorityReason: 'Routine supply order.',
    status: 'NEW',
    riskLevel: 'LOW',
    allocationStatus: 'WAITING',
    totalAmount: 624.75,
    items: [
      { id: 'OI-1038-1', orderId: 'ORD-1038', sku: 'WM-117', productId: 'PROD-117', productName: 'Barcoded Storage Tote Box 50L', quantity: 25, allocatedQuantity: 0, pickedQuantity: 0, unitPrice: 24.99 }
    ]
  }
];

// 4. Mock Allocations
export const initialAllocations: Allocation[] = [
  { id: 'ALLOC-101', orderId: 'ORD-1026', customerName: 'Global Freight Partners', priority: 'HIGH', sku: 'WM-101', requestedQuantity: 5, allocatedQuantity: 5, shortageQuantity: 0, status: 'FULL', reason: 'Full stock available in ZONE-A Bin A-01.', allocatedAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'ALLOC-102', orderId: 'ORD-1027', customerName: 'Metro Retail Distribution', priority: 'HIGH', sku: 'WM-103', requestedQuantity: 10, allocatedQuantity: 10, shortageQuantity: 0, status: 'FULL', reason: 'Stock reserved from ZONE-B Bin B-02.', allocatedAt: new Date(Date.now() - 3600000 * 7).toISOString() },
  { id: 'ALLOC-103', orderId: 'ORD-1028', customerName: 'NexGen Warehouse Solutions', priority: 'HIGH', sku: 'WM-105', requestedQuantity: 5, allocatedQuantity: 5, shortageQuantity: 0, status: 'FULL', reason: 'Stock allocated from ZONE-C Bin C-01.', allocatedAt: new Date(Date.now() - 3600000 * 11).toISOString() },
];

// 5. Mock Picking Tasks
export const initialPickingTasks: PickingTask[] = [
  { id: 'PICK-101', orderId: 'ORD-1027', priority: 'HIGH', zone: 'ZONE-B', bin: 'B-02', sku: 'WM-103', productName: 'Heavy Duty Pallet Wrap 18in', quantity: 10, picker: 'Dave Miller', status: 'IN_PROGRESS', startedAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'PICK-102', orderId: 'ORD-1026', priority: 'HIGH', zone: 'ZONE-A', bin: 'A-01', sku: 'WM-101', productName: 'Industrial RFID Scanner X1', quantity: 5, picker: 'Sarah Chen', status: 'NOT_STARTED' },
  { id: 'PICK-103', orderId: 'ORD-1036', priority: 'HIGH', zone: 'ZONE-D', bin: 'D-03', sku: 'WM-115', productName: 'ESD Protective Touchscreen Gloves', quantity: 20, picker: 'Marcus Vance', status: 'EXCEPTION', startedAt: new Date(Date.now() - 3600000).toISOString() },
];

// 6. Mock Packing Tasks
export const initialPackingTasks: PackingTask[] = [
  { id: 'PACK-101', orderId: 'ORD-1029', priority: 'NORMAL', customerName: 'Pinnacle Supply Chain', packingStation: 'PACK-01', status: 'IN_PROGRESS', startedAt: new Date(Date.now() - 1200000).toISOString() },
  { id: 'PACK-102', orderId: 'ORD-1030', priority: 'CRITICAL', customerName: 'Swift Express Line', packingStation: 'PACK-02', status: 'PACKED', startedAt: new Date(Date.now() - 4000000).toISOString(), completedAt: new Date(Date.now() - 2000000).toISOString() },
];

// 7. Mock Quality Checks
export const initialQualityChecks: QualityCheck[] = [
  { id: 'QC-301', orderId: 'ORD-1030', skuCheck: true, quantityCheck: true, damageCheck: true, packagingCheck: true, status: 'PASS', inspector: 'QC-Lead Rob', checkedAt: new Date(Date.now() - 1800000).toISOString(), notes: 'All items verified and sealed.' },
  { id: 'QC-302', orderId: 'ORD-1028', skuCheck: true, quantityCheck: false, damageCheck: false, packagingCheck: true, status: 'FAIL', inspector: 'QC-Lead Rob', checkedAt: new Date(Date.now() - 3000000).toISOString(), notes: 'Quantity mismatch: expected 5, found 4 with 1 unit damaged.' },
];

// 8. Mock Exceptions
export const initialExceptions: WarehouseException[] = [
  { id: 'EXP-501', orderId: 'ORD-1028', sku: 'WM-105', type: 'QUALITY_FAILURE', severity: 'HIGH', description: 'QC inspection failed for ORD-1028 due to physical casing damage on crane scale.', recommendedAction: 'Move damaged unit to quarantine stock and trigger replacement pick from ZONE-C Bin C-01.', status: 'OPEN', createdAt: new Date(Date.now() - 3000000).toISOString() },
  { id: 'EXP-502', orderId: 'ORD-1036', sku: 'WM-115', type: 'DAMAGED_ITEM', severity: 'MEDIUM', description: 'Picker reported 4 water-damaged boxes in Bin D-03.', recommendedAction: 'Update damaged inventory count (+4) and adjust available quantity.', status: 'INVESTIGATING', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'EXP-503', orderId: 'ORD-1033', sku: 'WM-112', type: 'STOCK_SHORTAGE', severity: 'HIGH', description: 'Total stock for WM-112 is 0 units while 3 units are required.', recommendedAction: 'Trigger urgent supplier purchase order to Honeywell/Skydio.', status: 'OPEN', createdAt: new Date(Date.now() - 7200000).toISOString() },
];

// 9. Mock Dispatches
export const initialDispatches: Dispatch[] = [
  { id: 'DSP-801', orderId: 'ORD-1030', customerName: 'Swift Express Line', carrier: 'FedEx Freight', trackingNumber: 'FX-9948201-US', status: 'READY', readyAt: new Date(Date.now() - 1800000).toISOString(), itemsCount: 10 },
  { id: 'DSP-802', orderId: 'ORD-1031', customerName: 'Horizon Industrial Supplies', carrier: 'DHL Express', trackingNumber: 'DHL-3382910-US', status: 'DISPATCHED', readyAt: new Date(Date.now() - 14000000).toISOString(), dispatchedAt: new Date(Date.now() - 7200000).toISOString(), itemsCount: 10 },
];

// 10. Mock Inventory Movements
export const initialMovements: InventoryMovement[] = [
  { id: 'MOV-1001', sku: 'WM-104', type: 'RESERVED', quantity: 2, orderId: 'ORD-1024', timestamp: new Date(Date.now() - 7200000).toISOString(), reason: 'Initial order reservation attempt', performedBy: 'System Auto-Reserve' },
  { id: 'MOV-1002', sku: 'WM-101', type: 'ALLOCATED', quantity: 5, orderId: 'ORD-1026', timestamp: new Date(Date.now() - 5400000).toISOString(), reason: 'Order allocation confirmed', performedBy: 'WMSense Allocator' },
  { id: 'MOV-1003', sku: 'WM-115', type: 'DAMAGED', quantity: 4, orderId: 'ORD-1036', timestamp: new Date(Date.now() - 3600000).toISOString(), reason: 'Picker damage report Bin D-03', performedBy: 'Marcus Vance' },
];

// 11. Mock Decisions
export const initialDecisions: Decision[] = [
  { id: 'DEC-901', type: 'PRIORITY', title: 'Prioritized ORD-1024 to CRITICAL rank', reason: 'Order dispatch deadline is in less than 2 hours and customer has SLA tier 1 contract.', impact: 'Pushed ORD-1024 to top position in fulfillment queue.', recommendedAction: 'Execute Smart Allocation to evaluate stock availability.', createdAt: new Date(Date.now() - 3600000).toISOString(), relatedOrderId: 'ORD-1024', relatedSku: 'WM-104' },
  { id: 'DEC-902', type: 'REORDER', title: 'Flagged WM-104 for Reorder Recommendation', reason: 'Available quantity (7 units) fell below reorder threshold (8 units).', impact: 'Triggered low stock alert on dashboard.', recommendedAction: 'Issue purchase order for 15 units to Honeywell Corp.', createdAt: new Date(Date.now() - 5400000).toISOString(), relatedSku: 'WM-104' },
  { id: 'DEC-903', type: 'BOTTLENECK', title: 'Detected Picking Zone B Bottleneck', reason: 'Average pick duration increased by 35% in Zone B due to pallet wrap staging delay.', impact: '3 orders delayed by ~15 minutes.', recommendedAction: 'Reassign 1 picker from Zone D to Zone B.', createdAt: new Date(Date.now() - 7200000).toISOString() },
];

// 12. Mock Alerts
export const initialAlerts: Alert[] = [
  { id: 'ALT-401', type: 'ORDER_RISK', severity: 'CRITICAL', title: 'Urgent Order At Risk: ORD-1024', message: 'ORD-1024 requires 10 units of WM-104 but only 7 are available in stock!', relatedOrderId: 'ORD-1024', relatedSku: 'WM-104', createdAt: new Date(Date.now() - 3600000).toISOString(), status: 'ACTIVE' },
  { id: 'ALT-402', type: 'LOW_STOCK', severity: 'HIGH', title: 'Low Stock Alert: WM-104', message: 'Ergonomic Wireless Scanner Pro available count (7) is below reorder level (8).', relatedSku: 'WM-104', createdAt: new Date(Date.now() - 5400000).toISOString(), status: 'ACTIVE' },
  { id: 'ALT-403', type: 'OUT_OF_STOCK', severity: 'HIGH', title: 'Out of Stock: WM-112', message: 'Smart Warehouse Drone Sensor Pack stock reached 0 units.', relatedSku: 'WM-112', createdAt: new Date(Date.now() - 7200000).toISOString(), status: 'ACTIVE' },
  { id: 'ALT-404', type: 'EXCEPTION', severity: 'MEDIUM', title: 'QC Failure: ORD-1028', message: 'Quality check failed for ORD-1028 due to unit damage.', relatedOrderId: 'ORD-1028', createdAt: new Date(Date.now() - 3000000).toISOString(), status: 'ACTIVE' },
];
