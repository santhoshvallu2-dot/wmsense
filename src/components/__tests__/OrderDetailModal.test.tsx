import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderDetailModal } from '../orders/OrderDetailModal';
import { initialOrders } from '../../data/mockData';

describe('OrderDetailModal', () => {
  it('should render nothing when order is null', () => {
    const { container } = render(
      <OrderDetailModal order={null} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render order details, customer, and priority assessment for ORD-1024', () => {
    const ord1024 = initialOrders.find((o) => o.id === 'ORD-1024')!;
    render(<OrderDetailModal order={ord1024} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('ORD-1024')).toBeInTheDocument();
    expect(screen.getByText('Apex Logistics Corp')).toBeInTheDocument();
    expect(screen.getByText(/Smart Priority & Risk Assessment/i)).toBeInTheDocument();
    expect(screen.getByText('Requested Order Items')).toBeInTheDocument();
    expect(screen.getByText('Ergonomic Wireless Scanner Pro')).toBeInTheDocument();
  });

  it('should call onClose when close icon button or Close Detail button is clicked', () => {
    const onClose = vi.fn();
    const order = initialOrders[0];
    render(<OrderDetailModal order={order} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close order details modal/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);

    const bottomCloseButton = screen.getByRole('button', { name: /close detail/i });
    fireEvent.click(bottomCloseButton);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('should call onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    const order = initialOrders[0];
    render(<OrderDetailModal order={order} onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should display shortage alert when order requires more units than available in stock', () => {
    const ord1024 = initialOrders.find((o) => o.id === 'ORD-1024')!;
    render(<OrderDetailModal order={ord1024} onClose={vi.fn()} />);

    expect(screen.getByText(/Inventory Shortage Alert/i)).toBeInTheDocument();
    expect(screen.getByText(/Shortage =/i)).toBeInTheDocument();
  });
});
