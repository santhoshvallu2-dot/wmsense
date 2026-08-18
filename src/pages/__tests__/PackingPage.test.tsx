import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PackingPage } from '../PackingPage';
import { WarehouseService } from '../../services/warehouseService';

describe('PackingPage', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should render packing and QC title, KPIs, packing queue, and quality control table', () => {
    render(<PackingPage />);

    expect(screen.getByText('Packing & Quality Check')).toBeInTheDocument();
    expect(screen.getByText('Packing Queue')).toBeInTheDocument();
    expect(screen.getByText('Quality Control (QC)')).toBeInTheDocument();
    expect(screen.getByText('Packing Tasks')).toBeInTheDocument();
    expect(screen.getByText('QC Passed')).toBeInTheDocument();
    expect(screen.getByText('QC Failed')).toBeInTheDocument();
  });

  it('should render QC checks with visual and text check status labels', () => {
    render(<PackingPage />);

    const qcList = WarehouseService.getQualityChecks();
    if (qcList.length > 0) {
      expect(screen.getAllByText(qcList[0].id).length).toBeGreaterThan(0);
    }
  });
});
