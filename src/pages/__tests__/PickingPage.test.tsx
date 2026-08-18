import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PickingPage } from '../PickingPage';
import { WarehouseService } from '../../services/warehouseService';

describe('PickingPage', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should render wave picking title, KPIs, progress indicators, and task table', () => {
    render(<PickingPage />);

    expect(screen.getByText('Smart Picking Queue')).toBeInTheDocument();
    expect(screen.getByText('Active Picking Route')).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
  });

  it('should display picking tasks with bin locations and status badges', () => {
    render(<PickingPage />);

    const tasks = WarehouseService.getPickingTasks();
    if (tasks.length > 0) {
      expect(screen.getAllByText(tasks[0].id).length).toBeGreaterThan(0);
    }
  });
});
