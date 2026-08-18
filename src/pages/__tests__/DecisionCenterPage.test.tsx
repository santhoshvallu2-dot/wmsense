import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DecisionCenterPage } from '../DecisionCenterPage';
import { WarehouseService } from '../../services/warehouseService';

describe('DecisionCenterPage', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should render decision showcase, health score gauge, intelligence pipeline, conflict spotlight, and decision audit trail', () => {
    render(
      <MemoryRouter>
        <DecisionCenterPage />
      </MemoryRouter>
    );

    expect(screen.getByText('WMSense Decision Center')).toBeInTheDocument();
    expect(screen.getByText('Warehouse Health')).toBeInTheDocument();
    expect(screen.getByText('Intelligence Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Conflict Resolution Spotlight')).toBeInTheDocument();
    expect(screen.getByText('Decision Audit Trail')).toBeInTheDocument();
  });
});
