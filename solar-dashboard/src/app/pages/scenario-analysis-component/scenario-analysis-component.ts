import { Component, signal, effect, inject, input, computed } from '@angular/core';
import { ViewMode } from '../../enums';
import { Cell, OfferUnit } from '../../interfaces/offer-unit.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { SolarPanelService } from '../../services/solar-panel.service';
import { DynamicTableComponent } from '../../components/dynamic-table-component/dynamic-table-component';
import { DynamicChartComponent } from '../../components/dynamic-chart-component/dynamic-chart-component';
import { OfferUnitStore } from '../../stores/offer-unit.store';
import { MatAnchor } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";



@Component({
  selector: 'app-scenario-analysis-component',
  standalone: true,
  imports: [DynamicTableComponent, DynamicChartComponent, MatAnchor, MatIcon, MatCardModule],
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
    });
    this.reloadData();

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
    setTimeout(() => { element.classList.remove('focused-error'); }, 3000);
  }

  reloadData() {
    const hasChanges = this.modifiedCellsCount() > 0;
    if (hasChanges) {
      const reload = confirm('Existem alterações não guardadas. Pretende recarregar os dados e perder essas alterações?');

      if (!reload) {
        return;
      }
    }

    this.offerUnitStore.loadOfferUnits();
  }



}
