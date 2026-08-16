# WMSense — Smart Warehouse Operations & Autonomous Decision Platform

> **"Smart Decisions. Faster Fulfillment."**  
> An explainable, intelligence-first warehouse operations management system built for high-throughput logistics, proactive risk mitigation, and automated bottleneck resolution.

---

## 🌟 Executive Summary

Modern warehouse management systems often overwhelm operators with raw data and static charts without guiding operational decisions. **WMSense** bridges this gap by implementing an autonomous, deterministic intelligence pipeline:

$$\mathbf{DATA} \longrightarrow \mathbf{DETECTION} \longrightarrow \mathbf{RISK\ ANALYSIS} \longrightarrow \mathbf{DECISION} \longrightarrow \mathbf{RECOMMENDED\ ACTION} \longrightarrow \mathbf{EXPECTED\ IMPACT}$$

Every recommendation across allocation, picking, packing, exception resolution, and dispatch provides **human-readable rationale** explaining *why* an action is recommended, *what* impact it creates, and *how* it protects critical customer SLAs.

---

## 🚀 Key Functional Modules

| Module | Route | Purpose & Key Features |
| :--- | :--- | :--- |
| **Operational Dashboard** | `/dashboard` | Executive KPI control center, live SLA risk monitor, inventory health donut chart, and instant critical alerts. |
| **Order Management** | `/orders` | 15-order real-time ledger with multi-criteria filtering, customer contract tiers, and Priority Engine scoring. |
| **Inventory Ledger** | `/inventory` | 20-SKU multi-zone catalog tracking available, reserved, and damaged stock with reorder threshold monitors. |
| **Smart Allocation** | `/allocation` | Deterministic priority-based reservation engine preventing stock starvation for critical contract tiers. |
| **Smart Picking** | `/picking` | Zone/bin optimized pick queues (`ZONE-A` through `ZONE-D`) with wave progress tracking and picker assignment. |
| **Packing & QC** | `/packing` | Packing station workflows paired with a 4-point Quality Control checklist (SKU, Qty, Damage, Packaging). |
| **Exception Center** | `/exceptions` | Severity-graded exception resolution hub with automated triage and root-cause logging. |
| **Dispatch Logistics** | `/dispatch` | Carrier staging bay with tracking integration (FedEx, DHL), delivery tracking, and ready-order verification. |
| **Control Tower Analytics** | `/analytics` | 7-stage operational throughput funnel, inventory risk matrix, and algorithmic bottleneck ranking (0–100). |
| **Decision Center** | `/decision-center` | **Showcase Feature**: Real-time Warehouse Health Score (0–100), explainable decision audit trail, and scenario spotlight. |

---

## 🏆 Featured Hackathon Demonstration Scenario

### Conflict Resolution: SKU `WM-104` (Ergonomic Wireless Scanner Pro)
The core demonstration highlights how WMSense resolves critical resource contention:
1. **Initial State**:
   - `WM-104` has **7 available units** (Safety Reorder Level = 8).
   - `ORD-1024` (Apex Logistics Corp) requires **10 units** (Priority: `CRITICAL`, SLA window: 2 hours).
   - `ORD-1025` (TechFlow Systems) requires **5 units** (Priority: `NORMAL`, SLA window: 24 hours).
   - Total demand = 15 units vs. 7 available (8-unit overall shortage).
2. **Autonomous Assessment**:
   - `PriorityEngine` evaluates `ORD-1024` with a Risk Score of **98/100 (`CRITICAL`)** due to contract tier, overdue SLA deadline, and inventory shortage.
   - `AllocationEngine` allocates all **7 available units** to `ORD-1024` (`PARTIAL` allocation) and safely blocks `ORD-1025` (`BLOCKED` status, yielded to critical order).
3. **Downstream Intelligence**:
   - `AnalyticsEngine` flags `INVENTORY` and `ALLOCATION` as top warehouse bottlenecks.
   - `DecisionEngine` records explainable audit decisions: *"Prioritized ORD-1024 to CRITICAL rank"* and *"Flagged WM-104 for Reorder Recommendation (15 units to Honeywell Corp)"*.
   - `DecisionCenterPage` updates the live **Warehouse Health Score** reflecting the managed shortage.

---

## 🧠 Core Intelligence Engines

### 1. Priority & Risk Scoring Engine (`PriorityEngine.ts`)
Evaluates orders on a deterministic 0–100 scale using 4 weighted operational drivers:
- **Base Customer Contract Tier** (Max 40 pts): `CRITICAL` (+40), `HIGH` (+30), `NORMAL` (+20), `LOW` (+10).
- **Dispatch Deadline SLA Urgency** (Max 25 pts): Overdue (+25), $\le 3\text{h}$ (+25), $\le 6\text{h}$ (+18), $\le 12\text{h}$ (+10).
- **Inventory Shortage & Stock Health** (Max 20 pts): Active shortage (+20), Low safety stock (+15).
- **Fulfillment Stage & Exception State** (Max 15 pts): `EXCEPTION` (+15), `PARTIALLY_ALLOCATED` (+12), `PROCESSING` (+10).

### 2. Operational Bottleneck Detection Engine (`AnalyticsEngine.ts`)
Calculates stage-specific friction scores across 7 lifecycle stages:
$$\text{BottleneckScore} = (\text{PendingImpact} \times 10) + (\text{BlockedImpact} \times 20) + (\text{ExceptionImpact} \times 25) + (\text{CriticalPriorityImpact} \times 30)$$

### 3. Warehouse Health Score Model (`AnalyticsEngine.ts`)
Computes an explainable 0–100 health gauge combining fulfillment rates, exception penalties, inventory risks, and active bottleneck drag.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19 (`react`, `react-dom`, `react-router-dom` v7)
- **Language**: TypeScript 6 (`strict: true`, `verbatimModuleSyntax: true`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Visualizations**: Recharts (`PieChart`, `Pie`, `Cell`, `ResponsiveContainer`) & CSS Data Visualizations
- **Icons**: Lucide React (`lucide-react`)
- **Build Tooling**: Vite 8 (`@vitejs/plugin-react`)
- **State & Storage**: `localStorage` persistence with seed fallback (`WarehouseService.ts`)

---

## 📦 Installation & Local Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Steps
```bash
# 1. Clone the repository
git clone <repository-url>
cd wmsense

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Production build & type validation
npm run build

# 5. Preview production build
npm run preview
```

---

## 📁 Project Architecture

```
wmsense/
├── src/
│   ├── components/
│   │   ├── inventory/      # InventoryDetailModal
│   │   ├── layout/         # MainLayout, Sidebar, TopHeader
│   │   └── orders/         # OrderDetailModal
│   ├── data/
│   │   └── mockData.ts     # Seed datasets (20 SKUs, 15 orders, tasks, exceptions)
│   ├── pages/
│   │   ├── AllocationPage.tsx       # Smart Allocation Workstation
│   │   ├── AnalyticsPage.tsx        # Control Tower & Bottlenecks
│   │   ├── DashboardPage.tsx        # Operational Dashboard
│   │   ├── DecisionCenterPage.tsx   # Showcase Decision Center
│   │   ├── DispatchPage.tsx         # Carrier Staging & Dispatch
│   │   ├── ExceptionsPage.tsx       # Exception Management Hub
│   │   ├── InventoryPage.tsx        # SKU Inventory Ledger
│   │   ├── NotFoundPage.tsx         # 404 Route
│   │   ├── OrdersPage.tsx           # Order Management Center
│   │   ├── PackingPage.tsx          # Packing & QC Station
│   │   └── PickingPage.tsx          # Picking Route Queue
│   ├── services/
│   │   ├── analyticsEngine.ts       # KPIs, Bottleneck Detection, Health Score
│   │   ├── decisionEngine.ts        # Explainable Decision Audit Trail
│   │   ├── priorityEngine.ts        # Order SLA & Risk Scoring
│   │   └── warehouseService.ts      # LocalStorage CRUD & Data Consistency
│   ├── types/
│   │   └── warehouse.ts             # Domain Types & Interfaces
│   ├── App.tsx                      # Root Router
│   ├── index.css                    # Design Tokens & Styles
│   └── main.tsx                     # Entry Point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔒 Security & Quality Standards

- **Zero Secrets**: No API keys, passwords, or credentials stored in repository.
- **Zero-Data Safety**: Safe mathematics on division, clean fallbacks for empty queues and unassigned records.
- **Clean Compilation**: 100% type-safe build (`tsc -b && vite build` — 0 errors).
- **Lightweight Repository**: Total source code < 2 MB (well under the 10 MB limit).
