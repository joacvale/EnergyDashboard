import { Component, signal, effect, inject, input, computed } from '@angular/core';
import { ViewMode } from '../../enums';
import { OfferUnit } from '../../interfaces/offer-unit.interface';
import { MatTableDataSource } from '@angular/material/table';
import { SolarPanelService } from '../../services/solar-panel.service';
import { DynamicTableComponent } from '../../components/dynamic-table-component/dynamic-table-component';



@Component({
  selector: 'app-scenario-analysis-component',
  standalone: true,
  imports: [DynamicTableComponent],
  templateUrl: './scenario-analysis-component.html',
  styleUrl: './scenario-analysis-component.scss',
})
export class ScenarioAnalysisComponent {
  solarPanelService = inject(SolarPanelService);

  viewMode = signal<ViewMode>(ViewMode.TABLE);


  
  constructor() {

    effect(() => {
    this.solarPanelService.selectedCountry();
    this.solarPanelService.loadOfferUnitsData();

  });

}


  offerUnits = computed(() =>
    this.solarPanelService.offerUnitData()
  );
  //showTable()
  showTable() {
    this.viewMode.set(ViewMode.TABLE);
  }
  //showChart()
  showChart() {
    this.viewMode.set(ViewMode.CHART);
  }

}
