import { TestBed } from '@angular/core/testing';
import { SolarPanelService } from './solar-panel.service';

describe('SolarPanelService', () => {
  let service: SolarPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolarPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
