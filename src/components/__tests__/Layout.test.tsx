import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from '../layout/Sidebar';
import { TopHeader } from '../layout/TopHeader';

describe('Layout Components', () => {
  it('should render Sidebar with brand and navigation links', () => {
    render(
      <MemoryRouter>
        <Sidebar mobileOpen={false} setMobileOpen={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('WMSense')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /sidebar navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /orders/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /inventory/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /smart allocation/i })).toBeInTheDocument();
  });

  it('should render TopHeader with title, warehouse status, and accessible notifications button', () => {
    render(
      <MemoryRouter initialEntries={['/orders']}>
        <TopHeader setMobileOpen={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('Order Queue & Risk Scoring')).toBeInTheDocument();
    expect(screen.getByText('Warehouse Online')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /system notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open sidebar menu/i })).toBeInTheDocument();
  });
});
