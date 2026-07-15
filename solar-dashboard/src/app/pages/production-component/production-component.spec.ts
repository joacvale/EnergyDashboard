import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, computed } from '@angular/core';
import { of } from 'rxjs';
import { ProductionComponent } from './production-component';
import { SolarPanelService } from '../../services/solar-panel.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ProductionData,SolarPanel} from '../../interfaces/solar-panel.interface';
import { ViewMode } from '../../enums';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';

describe('ProductionComponent', () => {
  let component: ProductionComponent;
  let fixture: ComponentFixture<ProductionComponent>;


  const mockSolarPanelService = {
    panels: signal<SolarPanel[]>([]),
    productionData: signal<ProductionData[]>([]),
    loading: signal(false),
    error: signal<string | null>(null),
    getTotalProduction: computed(() => 0),
    getActivePanelsCount: computed(() => 0)
  };

  const mockDialog = {
    open: vi.fn(() => ({
      afterClosed: () => of(false)
    }))
  };

  const mockSnackBar = {
    open: vi.fn(() => ({
      afterClosed: () => of(false)
    }))
  };

  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionComponent],
      providers: [
        provideRouter([]),
        {
          provide: SolarPanelService,
          useValue: mockSolarPanelService
        },
        {
          provide: MatDialog,
          useValue: mockDialog
        },
        {
          provide: MatSnackBar,
          useValue: mockSnackBar
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductionComponent);
    component = fixture.componentInstance;

    component.dialog = mockDialog as any;
    component.snackBar = mockSnackBar as any;

    fixture.detectChanges();

  });

  
  //#1
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //#2
  it('should switch to table view', () => {
    component.showTable();
    expect(component.viewMode()).toBe(ViewMode.TABLE);
  });

  //#3
  it('should switch to chart view', () => {
    component.showChart();
    expect(component.viewMode()).toBe(ViewMode.CHART);
  });

  //#4
  it('should calculate totalToday', () => {
    mockSolarPanelService.productionData.set([
      {
        hour: 1,
        production: 10,
        type: 'production'
      },
      {
        hour: 2,
        production: 20,
        type: 'production'
      }
    ]);

    expect(component.totalToday()).toBe(30);
  });

  //#5
  it('should calculate peak hour', () => {
    mockSolarPanelService.productionData.set([
      {
        hour: 1,
        production: 10,
        type: 'production'
      },
      {
        hour: 5,
        production: 25,
        type: 'production'
      }
    ]);

    expect(component.peakHour()).toBe('H5');
  });

  //#6
  it('should return dash when there is no production data', () => {
    mockSolarPanelService.productionData.set([]);
    expect(component.peakHour()).toBe('-');
  });

  //#7
  it('should filter panels by location', () => {
    mockSolarPanelService.panels.set([
      {
        id: '1',
        location: 'North Sector',
        capacity: 100,
        todayProduction: 50,
        status: 'Active'
      },
      {
        id: '2',
        location: 'South Sector',
        capacity: 100,
        todayProduction: 50,
        status: 'Active'
      }
    ]);

    component.filteredSolarPanels('north');
    expect(component.dataSource.data.length).toBe(1);
  });

  //#8
  it('should generate chart labels', () => {
    mockSolarPanelService.productionData.set([
      {
        hour: 1,
        production: 10,
        type: 'production'
      }
    ]);

    expect(component.barChartData().labels)
      .toEqual(['H1']);
  });

  //#9
  it('should generate production dataset correctly', () => {
    mockSolarPanelService.productionData.set([
      {
        hour: 1,
        production: 10,
        type: 'production'
      },
      {
        hour: 2,
        production: 20,
        type: 'idle'
      }
    ]);

    const dataset = component.barChartData().datasets[0];
    expect(dataset.data).toEqual([10, null]);
  });

  //#10
  it('should open add panel dialog', () => {
    mockDialog.open.mockReturnValue({
      afterClosed: () => of(false)
    });

    component.addPanel();
    expect(mockDialog.open).toHaveBeenCalledTimes(1);
  });

  //#11
  it('should open delete panel dialog', () => {
    const panel: SolarPanel = {
      id: '1',
      location: 'North',
      capacity: 100,
      todayProduction: 50,
      status: 'Active'
    };

    mockDialog.open.mockReturnValue({
      afterClosed: () => of(false)
    });
    component.deletePanel(panel);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  //#12
  it('should show snackbar when add panel is successful', () => {
    mockDialog.open.mockReturnValue({
      afterClosed: () => of(true)
    });
    component.addPanel();
    expect(mockSnackBar.open).toHaveBeenCalled();
  });

});