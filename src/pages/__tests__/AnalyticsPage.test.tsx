import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AnalyticsPage } from '../AnalyticsPage';
import { WarehouseService } from '../../services/warehouseService';

describe('AnalyticsPage', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should render analytics control tower, bottleneck detection, and risk tables', () => {
    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Operational Analytics & Bottleneck Detection')).toBeInTheDocument();
    expect(screen.getByText('Control Tower')).toBeInTheDocument();
    expect(screen.getByText('Fulfillment Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Bottleneck Detection')).toBeInTheDocument();
    expect(screen.getByText('Inventory Risk Analysis')).toBeInTheDocument();
    expect(screen.getByText('Operational Insights')).toBeInTheDocument();
    expect(screen.getByText('Recommended Actions')).toBeInTheDocument();
  });
});
