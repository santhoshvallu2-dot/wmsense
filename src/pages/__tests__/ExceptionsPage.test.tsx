import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExceptionsPage } from '../ExceptionsPage';
import { WarehouseService } from '../../services/warehouseService';

describe('ExceptionsPage', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should render exception management center, KPI cards, and exception logs table', () => {
    render(<ExceptionsPage />);

    expect(screen.getByText('Exception Management Center')).toBeInTheDocument();
    expect(screen.getByText('Total Exceptions')).toBeInTheDocument();
    expect(screen.getByText('Exception Logs')).toBeInTheDocument();
    expect(screen.getByText('EXP-501')).toBeInTheDocument();
  });
});
