import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OrdersPage } from '../OrdersPage';
import { WarehouseService } from '../../services/warehouseService';

describe('OrdersPage', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should render page title, KPI cards, search input, filter selects, and order table', () => {
    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Order Management & Priority Queue/i)).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getAllByText('ORD-1024').length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Search orders by ID, customer name, or SKU/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter orders by priority level/i)).toBeInTheDocument();
  });

  it('should filter orders when searching by customer name', () => {
    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/Search orders by ID, customer name, or SKU/i);
    fireEvent.change(searchInput, { target: { value: 'Apex Logistics' } });

    expect(screen.getAllByText('ORD-1024').length).toBeGreaterThan(0);
    expect(screen.queryByText('TechFlow Systems')).not.toBeInTheDocument();
  });

  it('should filter orders by priority dropdown selection', () => {
    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    const prioritySelect = screen.getByLabelText(/Filter orders by priority level/i);
    fireEvent.change(prioritySelect, { target: { value: 'CRITICAL' } });

    expect(screen.getAllByText('ORD-1024').length).toBeGreaterThan(0);
  });

  it('should open order detail modal when an order row or inspect button is clicked', () => {
    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    const inspectBtn = screen.getByRole('button', { name: /inspect priority assessment/i });
    fireEvent.click(inspectBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/Smart Priority & Risk Assessment/i)).toBeInTheDocument();
  });

  it('should clear filters when clear filters button is clicked', () => {
    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/Search orders by ID, customer name, or SKU/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentOrderXYZ' } });

    expect(screen.getByText(/No orders matched your search and filter criteria/i)).toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /clear all filters/i });
    fireEvent.click(clearButton);

    expect(screen.getAllByText('ORD-1024').length).toBeGreaterThan(0);
  });
});
