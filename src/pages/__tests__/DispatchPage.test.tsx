import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DispatchPage } from '../DispatchPage';
import { WarehouseService } from '../../services/warehouseService';

describe('DispatchPage', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should render dispatch staging, KPIs, and shipment queue table', () => {
    render(<DispatchPage />);

    expect(screen.getByText('Dispatch & Carrier Staging')).toBeInTheDocument();
    expect(screen.getByText('Ready for Dispatch')).toBeInTheDocument();
    expect(screen.getByText('Shipment Queue')).toBeInTheDocument();
  });
});
