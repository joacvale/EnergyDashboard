import { Component, signal, effect, inject, input, computed } from '@angular/core';
import { ViewMode } from '../../enums';
import { Cell, OfferUnit } from '../../interfaces/offer-unit.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { SolarPanelService } from '../../services/solar-panel.service';
import { DynamicTableComponent } from '../../components/dynamic-table-component/dynamic-table-component';
import { OfferUnitStore } from '../../stores/offer-unit.store';
import { MatAnchor } from "@angular/material/button";



@Component({
  selector: 'app-scenario-analysis-component',
  standalone: true,
  imports: [DynamicTableComponent, MatAnchor, MatIcon],
  templateUrl: './scenario-analysis-component.html',
  styleUrl: './scenario-analysis-component.scss',
})
export class ScenarioAnalysisComponent {
  solarPanelService = inject(SolarPanelService);
  offerUnitStore = inject(OfferUnitStore);

  viewMode = signal<ViewMode>(ViewMode.TABLE);

  offerUnits = this.offerUnitStore.tableData;
  modifiedCellsCount = this.offerUnitStore.modifiedCellsCount;
  errorMessages = this.offerUnitStore.getErrorMessages;



  
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

showError(cellId: string) {
  const element = document.getElementById(cellId);

  if (!element) {
    return;
  }

  element.classList.add('focused-error');
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });

  setTimeout(() => {
    element.classList.remove('focused-error');

  }, 3000);
}



}
