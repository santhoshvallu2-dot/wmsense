import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../DashboardPage';
import { WarehouseService } from '../../services/warehouseService';

describe('DashboardPage', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should render warehouse control center banner and operational KPIs', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Warehouse Operations Dashboard')).toBeInTheDocument();
    expect(screen.getByText('WAREHOUSE ONLINE')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Orders At Risk')).toBeInTheDocument();
    expect(screen.getByText('Critical Inventory Shortage Detected')).toBeInTheDocument();
    expect(screen.getByText('Order Fulfillment Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Inventory Health Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Recommended Actions')).toBeInTheDocument();
  });
});
