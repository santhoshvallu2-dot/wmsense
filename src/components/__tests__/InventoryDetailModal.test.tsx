import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InventoryDetailModal } from '../inventory/InventoryDetailModal';
import { initialInventory } from '../../data/mockData';

describe('InventoryDetailModal', () => {
  it('should render nothing when item is null', () => {
    const { container } = render(
      <InventoryDetailModal item={null} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render SKU details, bin location, quantities, and movements', () => {
    const item = initialInventory.find((i) => i.sku === 'WM-104')!;
    render(<InventoryDetailModal item={item} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Ergonomic Wireless Scanner Pro')).toBeInTheDocument();
    expect(screen.getByText('ZONE-A')).toBeInTheDocument();
    expect(screen.getByText('A-03')).toBeInTheDocument();
    expect(screen.getByText('Critical Order Conflict Detected (Demo Scenario)')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked or Escape key is pressed', () => {
    const onClose = vi.fn();
    const item = initialInventory[0];
    render(<InventoryDetailModal item={item} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close inventory details modal/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
