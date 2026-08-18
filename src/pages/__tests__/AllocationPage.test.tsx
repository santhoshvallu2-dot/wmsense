import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AllocationPage } from '../AllocationPage';
import { WarehouseService } from '../../services/warehouseService';

describe('AllocationPage', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should render page title, conflict scenario card, KPIs, and allocation table', () => {
    render(<AllocationPage />);

    expect(screen.getByText('Smart Allocation Engine')).toBeInTheDocument();
    expect(screen.getByText(/Conflict Scenario \(WM-104\)/i)).toBeInTheDocument();
    expect(screen.getByText('Total Allocations')).toBeInTheDocument();
    expect(screen.getByText('Fully Allocated')).toBeInTheDocument();
    expect(screen.getByText('Active Allocations')).toBeInTheDocument();
  });

  it('should execute simulation when Run Smart Allocation is clicked and resolve WM-104 conflict', async () => {
    render(<AllocationPage />);

    const runButton = screen.getByRole('button', { name: /run smart allocation/i });
    expect(runButton).toBeInTheDocument();

    fireEvent.click(runButton);

    await waitFor(
      () => {
        expect(screen.getByText(/Resolution Applied/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(
      screen.getByText(/Priority Engine identified ORD-1024 as CRITICAL/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Allocation Complete')).toBeInTheDocument();
  });
});
