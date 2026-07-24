import { Component, signal, effect, inject, input, computed } from '@angular/core';
import { ViewMode } from '../../enums';
import { OfferUnit } from '../../interfaces/offer-unit.interface';
import { MatTableDataSource } from '@angular/material/table';
import { SolarPanelService } from '../../services/solar-panel.service';
import { DynamicTableComponent } from '../../components/dynamic-table-component/dynamic-table-component';
import { OfferUnitStore } from '../../stores/offer-unit.store';



@Component({
  selector: 'app-scenario-analysis-component',
  standalone: true,
  imports: [DynamicTableComponent],
  templateUrl: './scenario-analysis-component.html',
  styleUrl: './scenario-analysis-component.scss',
})
export class ScenarioAnalysisComponent {
  solarPanelService = inject(SolarPanelService);
  offerUnitStore = inject(OfferUnitStore);

  viewMode = signal<ViewMode>(ViewMode.TABLE);

  offerUnits = this.offerUnitStore.tableData;
  modifiedCellsCount=this.offerUnitStore.modifiedCellsCount;


  
  constructor() {
    effect(() => {
    this.solarPanelService.selectedCountry();
    this.offerUnitStore.loadOfferUnits();

  });

}

  //showTable()
  showTable() {
    this.viewMode.set(ViewMode.TABLE);
  }
  //showChart()
  showChart() {
    this.viewMode.set(ViewMode.CHART);
  }

  

}
