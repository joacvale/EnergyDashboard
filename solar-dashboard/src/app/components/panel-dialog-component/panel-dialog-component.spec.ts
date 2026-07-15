import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelDialogComponent } from './panel-dialog-component';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SolarPanelService } from '../../services/solar-panel.service';
import { vi } from 'vitest';

describe('PanelDialogComponent', () => {
  let component: PanelDialogComponent;
  let fixture: ComponentFixture<PanelDialogComponent>;

  const mockDialogRef = {close: vi.fn()};
  const mockSolarPanelService = {
    addPanel: vi.fn(),
    updatePanel: vi.fn(),
    deletePanel: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: SolarPanelService,
          useValue: mockSolarPanelService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(
      PanelDialogComponent
    );

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when form is valid', () => {
    component.formData = {
      id: '',
      location: 'Roof A',
      capacity: 100,
      todayProduction: 50,
      status: 'Active'
    };
    expect(component.isValid()).toBe(true);
  });

  it('should return false when form is invalid', () => {
    component.formData = {
      id: '',
      location: 'A',
      capacity: 0,
      todayProduction: 0,
      status: 'Active'
    };
    expect(component.isValid()).toBe(false);
  });

  it('should call addPanel', () => {
    component.formData = {
      id: '',
      location: 'Roof A',
      capacity: 100,
      todayProduction: 20,
      status: 'Active'
    };

    component.isEdit = false;
    component.isDelete = false;
    component.formsAction();
    expect(mockSolarPanelService.addPanel).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call updatePanel', () => {
    component.isEdit = true;
    component.isDelete = false;
    component.data = {
      panel: {
        id: '1'
      }
    };

    component.formData = {
      id: '',
      location: 'Updated Location',
      capacity: 200,
      todayProduction: 75,
      status: 'Active'
    };

    component.formsAction();

    expect(mockSolarPanelService.updatePanel).toHaveBeenCalled();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call deletePanel', () => {
    component.isDelete = true;
    component.data = {
      panel: {
        id: '1'
      }
    };

    component.formsAction();
    expect(mockSolarPanelService.deletePanel).toHaveBeenCalledWith('1');

    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should initialize delete mode', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PanelDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            mode: 'delete',
            panel: {
              id: '1',
              location: 'Roof A',
              capacity: 100,
              todayProduction: 10,
                   status: 'Active'
            }
          }
        },
        {
          provide: SolarPanelService,
          useValue: mockSolarPanelService
        }
      ]
    });

    const deleteFixture =
      TestBed.createComponent(PanelDialogComponent);

    const deleteComponent =
      deleteFixture.componentInstance;

    expect(deleteComponent.isDelete).toBe(true);
    expect(deleteComponent.title).toBe('Delete');
  });

})
