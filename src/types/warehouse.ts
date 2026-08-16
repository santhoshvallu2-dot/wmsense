export type OrderStatus =
  | 'NEW'
  | 'PROCESSING'
  | 'ALLOCATED'
  | 'PARTIALLY_ALLOCATED'
  | 'PICKING'
  | 'PACKING'
  | 'QUALITY_CHECK'
  | 'READY'
  | 'DISPATCHED'
  | 'EXCEPTION';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AllocationStatus = 'FULL' | 'PARTIAL' | 'WAITING' | 'BLOCKED';

export type InventoryStatus =
  | 'IN_STOCK'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'DAMAGED'
  | 'OVERSTOCKED';

export type PickingStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PICKED' | 'EXCEPTION';

export type PackingStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PACKED';

export type ExceptionStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';

export type ExceptionType =
  | 'MISSING_ITEM'
  | 'DAMAGED_ITEM'
  | 'STOCK_SHORTAGE'
  | 'PICKING_DELAY'
  | 'QUALITY_FAILURE'
  | 'PACKING_ISSUE'
  | 'DISPATCH_DELAY';

export type DispatchStatus = 'READY' | 'DISPATCHED' | 'DELIVERED';

export type MovementType =
  | 'RECEIVED'
  | 'RESERVED'
  | 'ALLOCATED'
  | 'PICKED'
  | 'DAMAGED'
  | 'ADJUSTED'
  | 'DISPATCHED';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  supplier: string;
  unitPrice: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  category: string;
  zone: string;
  bin: string;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  reorderLevel: number;
  status: InventoryStatus;
  supplier: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  sku: string;
  productId: string;
  productName: string;
  quantity: number;
  allocatedQuantity: number;
  pickedQuantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customer: string;
  orderDate: string;
  dispatchDeadline: string;
  items: OrderItem[];
  priority: PriorityLevel;
  priorityScore: number;
  priorityReason: string;
  status: OrderStatus;
  riskLevel: RiskLevel;
  allocationStatus: AllocationStatus;
  totalAmount: number;
}

export interface Allocation {
  id: string;
  orderId: string;
  customerName: string;
  priority: PriorityLevel;
  sku: string;
  requestedQuantity: number;
  allocatedQuantity: number;
  shortageQuantity: number;
  status: AllocationStatus;
  reason: string;
  allocatedAt: string;
}

export interface PickingTask {
  id: string;
  orderId: string;
  priority: PriorityLevel;
  zone: string;
  bin: string;
  sku: string;
  productName: string;
  quantity: number;
  picker: string;
  status: PickingStatus;
  startedAt?: string;
  completedAt?: string;
}

export interface PackingTask {
  id: string;
  orderId: string;
  priority: PriorityLevel;
  customerName: string;
  packingStation: string;
  status: PackingStatus;
  startedAt?: string;
  completedAt?: string;
}

export interface QualityCheck {
  id: string;
  orderId: string;
  skuCheck: boolean;
  quantityCheck: boolean;
  damageCheck: boolean;
  packagingCheck: boolean;
  status: 'PASS' | 'FAIL';
  inspector: string;
  checkedAt: string;
  notes?: string;
}

export interface WarehouseException {
  id: string;
  orderId: string;
  sku?: string;
  type: ExceptionType;
  severity: RiskLevel;
  description: string;
  recommendedAction: string;
  status: ExceptionStatus;
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface Dispatch {
  id: string;
  orderId: string;
  customerName: string;
  carrier: string;
  trackingNumber: string;
  status: DispatchStatus;
  readyAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  itemsCount: number;
}

export interface InventoryMovement {
  id: string;
  sku: string;
  type: MovementType;
  quantity: number;
  orderId?: string;
  timestamp: string;
  reason: string;
  performedBy: string;
}

export interface Decision {
  id: string;
  type: 'ALLOCATION' | 'PRIORITY' | 'EXCEPTION' | 'REORDER' | 'BOTTLENECK';
  title: string;
  reason: string;
  impact: string;
  recommendedAction: string;
  createdAt: string;
  relatedOrderId?: string;
  relatedSku?: string;
}

export interface Alert {
  id: string;
  type: 'ORDER_RISK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXCEPTION' | 'BOTTLENECK';
  severity: RiskLevel;
  title: string;
  message: string;
  relatedOrderId?: string;
  relatedSku?: string;
  createdAt: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'DISMISSED';
}
