import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InventoryPage } from '../InventoryPage';
import { WarehouseService } from '../../services/warehouseService';

describe('InventoryPage', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should render page title, KPI cards, search input, and SKU catalog table', () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Smart Inventory Management')).toBeInTheDocument();
    expect(screen.getByText('Total SKUs')).toBeInTheDocument();
    expect(screen.getByText('WM-101')).toBeInTheDocument();
    expect(screen.getAllByText('WM-104').length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Search inventory by SKU, product name, or category/i)).toBeInTheDocument();
  });

  it('should filter items by search query', () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/Search inventory by SKU, product name, or category/i);
    fireEvent.change(searchInput, { target: { value: 'WM-104' } });

    expect(screen.getAllByText('WM-104').length).toBeGreaterThan(0);
    expect(screen.queryByText('WM-101')).not.toBeInTheDocument();
  });

  it('should open inventory detail modal when clicking view detail button', () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    );

    const detailBtn = screen.getByRole('button', { name: /view wm-104 detail/i });
    fireEvent.click(detailBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Ergonomic Wireless Scanner Pro')).toBeInTheDocument();
  });
});
