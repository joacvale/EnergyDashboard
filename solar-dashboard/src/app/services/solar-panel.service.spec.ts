import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SolarPanelService } from './solar-panel.service';
import { ProductionData, SolarPanel } from '../interfaces/solar-panel.interface';
import { provideRouter } from '@angular/router';


describe('SolarPanelService', () => {
  let service: SolarPanelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SolarPanelService, provideRouter([])],
    });
    service = TestBed.inject(SolarPanelService);
    httpMock = TestBed.inject(HttpTestingController);
    const panelsReq = httpMock.expectOne('http://localhost:3000/api/panels');
    panelsReq.flush({ success: true, data: [] });
    const productionReq = httpMock.expectOne('http://localhost:3000/api/production');
    productionReq.flush({ success: true, data: [] });
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('loadPanels', () => {
    //#1
    it('should load panels successfully', async () => {
      const mockPanels: SolarPanel[] = [
        {
          id: '1',
          location: 'Roof A',
          capacity: 100,
          todayProduction: 50,
          status: 'Active',
        },
      ];

      const loadPromise = service.loadPanels();
      const req = httpMock.expectOne('http://localhost:3000/api/panels');
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockPanels });

      await loadPromise;
      expect(service.panels()).toEqual(mockPanels);
      expect(service.error()).toBeNull();
      expect(service.loading()).toBeFalsy();
    });

    //#2
    it('should handle error when loading panels', async () => {
      const loadPromise = service.loadPanels();
      const req = httpMock.expectOne('http://localhost:3000/api/panels');
      req.error(new ErrorEvent('Network error'));

      await loadPromise;
      expect(service.error()).toBeTruthy();
      expect(service.loading()).toBeFalsy();
    });
  });

  //production data
  //#4
  describe('loadProductionData', () => {
    it('should load production data successfuly', async () => {
      const mockProductionData: ProductionData[] = [
        { hour: 1, production: 21.25, country: 'ES', type: 'production' },
        { hour: 2, production: 22.5, country: 'ES', type: 'production' },
      ]
      const loadPromise = service.loadProductionData();
      const req = httpMock.expectOne('http://localhost:3000/api/production');
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockProductionData });

      await loadPromise;
      expect(service.productionData()).toEqual(mockProductionData);
      expect(service.error()).toBeNull();
      expect(service.loading()).toBeFalsy();
    });
    //#5
    it('should handle error when loading production data', async () => {
      const loadPromise = service.loadProductionData();
      const req = httpMock.expectOne('http://localhost:3000/api/production');
      req.error(new ErrorEvent('Network error'));

      await loadPromise;
      expect(service.error()).toBeTruthy();
      expect(service.loading()).toBeFalsy();
    });
  });

  //describe add panel
  //#6 it should add panel
  describe('addPanel', () => {
    it('should add panel successfully', async () => {
      const newPanel: Omit<SolarPanel, 'id'> =
      {
        location: 'Roof B',
        capacity: 500,
        todayProduction: 25,
        status: 'Maintenance',
      };
      const createdPanel: SolarPanel =
      {
        id: 'SP-001',
        ...newPanel,
      };

      vi.spyOn(service, 'loadPanels').mockResolvedValue(undefined);
      const addPromise = service.addPanel(newPanel);

      const postReq = httpMock.expectOne('http://localhost:3000/api/panels');
      postReq.flush(createdPanel);

      await addPromise;

      expect(service.panels().length).toBe(1);
      expect(service.error()).toBeNull();
      expect(service.loading()).toBeFalsy();
    });
    //#7
    it('should handle errors when adding panels', async () => {
      const newPanel: Omit<SolarPanel, 'id'> =
      {
        location: 'Roof B',
        capacity: 500,
        todayProduction: 25,
        status: 'Maintenance',
      };

      const addPromise = service.addPanel(newPanel);
      const req = httpMock.expectOne('http://localhost:3000/api/panels');
      expect(req.request.method).toBe('POST');

      req.error(new ErrorEvent('Network error'));

      await addPromise;
      expect(service.error()).toBeTruthy();
      expect(service.loading()).toBeFalsy();
    });
  });

  //updatePanel
  //#8
  describe('updatePanel', () => {
    it('should update panel successfully', async () => {
      vi.spyOn(service, 'loadPanels').mockResolvedValue(undefined);
      const updatedPanel: SolarPanel = {
        id: 'SP-001',
        location: 'Roof A Updated',
        capacity: 200,
        todayProduction: 75,
        status: 'Active',
      };
      const updatePromise = service.updatePanel(updatedPanel);
      const putReq = httpMock.expectOne('http://localhost:3000/api/panels/SP-001');
      putReq.flush(updatedPanel);
      await updatePromise;
      expect(service.error()).toBeNull();
    });

    //#9
    it('should handle errors when updating panel', async () => {
      vi.spyOn(service, 'loadPanels').mockResolvedValue(undefined);
      const updatedPanel: SolarPanel = {
        id: 'SP-001',
        location: 'Roof A Updated',
        capacity: 200,
        todayProduction: 75,
        status: 'Active',
      };
      const updatePromise = service.updatePanel(updatedPanel);
      const req = httpMock.expectOne('http://localhost:3000/api/panels/SP-001');
      req.error(new ErrorEvent('Network error'));

      await updatePromise;
      expect(service.error()).toBeTruthy();
      expect(service.loading()).toBeFalsy();
    });

  });

  //delete panel
  //#10 - should delete panel
  describe('deletePanel', () => {
    it('should delete panel successfully', async () => {
      vi.spyOn(service, 'loadPanels').mockResolvedValue(undefined);
      const deletePromise =service.deletePanel('SP-001');
      const req = httpMock.expectOne('http://localhost:3000/api/panels/SP-001');

      req.flush({});
      await deletePromise;
      expect(service.error()).toBeNull();
    });
    //#11
    it('should handle errors when deleting panel', async () => {
      vi.spyOn(service, 'loadPanels').mockResolvedValue(undefined);

      const deletePromise = service.deletePanel('SP-001');
      const req = httpMock.expectOne('http://localhost:3000/api/panels/SP-001');
      expect(req.request.method).toBe('DELETE');
      req.error(new ErrorEvent('Network error'));

      await deletePromise;
      expect(service.error()).toBeTruthy();
      expect(service.loading()).toBeFalsy();
    });
  });

  //utility methods
  //#12
  describe('getTotalProduction', () => {
    it('should compute total production', () => {
      service.panels.set([
        { id: '1', location: 'A', capacity: 100, todayProduction: 50, status: 'Active' },
        { id: '2', location: 'B', capacity: 100, todayProduction: 30, status: 'Active' },
      ]);
      expect(service.getTotalProduction()).toBe(80);
    });
  });

  //#13 
  describe('getActivePanelsCount', () => {
    it('should compute total active panels', () => {
      service.panels.set([
        { id: '1', location: 'A', capacity: 100, todayProduction: 50, status: 'Active' },
        { id: '2', location: 'B', capacity: 100, todayProduction: 30, status: 'Active' },
      ]);
      expect(service.getActivePanelsCount()).toBe(2);
    })
  });
});