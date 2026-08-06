import { Component, signal, effect, inject, input, computed, AfterViewInit } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { ReloadDialogComponent } from '../../components/reload-dialog-component/reload-dialog-component';



@Component({
  selector: 'app-scenario-analysis-component',
  standalone: true,
  imports: [DynamicTableComponent, DynamicChartComponent, MatAnchor, MatIcon, MatCardModule],
  templateUrl: './scenario-analysis-component.html',
  styleUrl: './scenario-analysis-component.scss',
})
export class ScenarioAnalysisComponent implements AfterViewInit {
  solarPanelService = inject(SolarPanelService);
  offerUnitStore = inject(OfferUnitStore);
  dialog = inject(MatDialog);


  viewMode = signal<ViewMode>(ViewMode.TABLE);

  offerUnits = this.offerUnitStore.tableData;
  modifiedCellsCount = this.offerUnitStore.modifiedCellsCount;
  errorMessages = this.offerUnitStore.getErrorMessages;


  constructor() {
    effect(() => {
      this.solarPanelService.selectedCountry();
    });
  }

  ngAfterViewInit(): void {
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

    if (!hasChanges) {
      this.offerUnitStore.loadOfferUnits();
      return;
    }

    const dialogRef = this.dialog.open(ReloadDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        title: 'Alterações não guardadas',
        icon: 'warning',
        message:
          'Existem alterações não guardadas. Pretende recarregar os dados e perder essas alterações?',
        cancelText: 'Manter alterações',
        confirmText: 'Recarregar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.offerUnitStore.loadOfferUnits();
      }
    });
  }

}
