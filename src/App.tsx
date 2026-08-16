import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { InventoryPage } from './pages/InventoryPage';
import { AllocationPage } from './pages/AllocationPage';
import { PickingPage } from './pages/PickingPage';
import { PackingPage } from './pages/PackingPage';
import { ExceptionsPage } from './pages/ExceptionsPage';
import { DispatchPage } from './pages/DispatchPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DecisionCenterPage } from './pages/DecisionCenterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="allocation" element={<AllocationPage />} />
          <Route path="picking" element={<PickingPage />} />
          <Route path="packing" element={<PackingPage />} />
          <Route path="exceptions" element={<ExceptionsPage />} />
          <Route path="dispatch" element={<DispatchPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="decision-center" element={<DecisionCenterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
