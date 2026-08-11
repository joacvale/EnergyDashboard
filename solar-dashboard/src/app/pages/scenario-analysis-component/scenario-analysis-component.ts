import { Component, signal, effect, inject, input, computed, AfterViewInit } from '@angular/core';
import { ViewMode } from '../../enums';
import { MatIcon } from '@angular/material/icon';
import { SolarPanelService } from '../../services/solar-panel.service';
import { DynamicTableComponent } from '../../components/dynamic-table-component/dynamic-table-component';
import { DynamicChartComponent } from '../../components/dynamic-chart-component/dynamic-chart-component';
import { OfferUnitStore } from '../../stores/offer-unit.store';
import { MatAnchor } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from '@angular/material/dialog';
import { ReloadDialogComponent } from '../../components/reload-dialog-component/reload-dialog-component';
import { untracked } from '@angular/core';


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
  editStartTime: Date | null = null;

  viewMode = signal<ViewMode>(ViewMode.TABLE);

  offerUnits = this.offerUnitStore.tableData;
  modifiedCellsCount = this.offerUnitStore.modifiedCellsCount;
  errorMessages = this.offerUnitStore.getErrorMessages;


  constructor() {
    effect(() => {
      const requestedCountry = this.solarPanelService.requestedCountry();
      const selectedCountry = this.solarPanelService.selectedCountry();

      if (!requestedCountry) {
        return;
      }
      if (requestedCountry === selectedCountry) {
        return;
      }
      untracked(() => {
        this.confirmCountryChange(requestedCountry);
      });

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
        title: 'Unsaved Changes',
        icon: 'warning',
        message:
          'You have unsaved changes. Reloading the data will discard all modifications made since the last update. Do you want to continue?',
        lastOpen:
          `(Last modification detected at ${this.offerUnitStore.lastUpdate().toLocaleTimeString('pt-PT')})`,
        cancelText: 'Keep Changes',
        confirmText: 'Reload Data'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.offerUnitStore.loadOfferUnits();
      }
    });

  }

  confirmCountryChange(country: string) {
    const hasChanges = this.modifiedCellsCount() > 0;

    if (!hasChanges) {
      this.solarPanelService.setCountry(country);
      this.offerUnitStore.loadOfferUnits();
      return;
    }

    const dialogRef = this.dialog.open(
      ReloadDialogComponent,
      {
        width: '600px',
        disableClose: true,
        data: {
          title: 'Change Country',
          icon: 'warning',
          message:
            'Changing the selected country will discard all unsaved changes in the current scenario. Do you want to continue?',
          lastOpen:
            `(Last modification detected at ${this.offerUnitStore.lastUpdate().toLocaleTimeString('en-GB')})`,
          cancelText: 'Stay on Current Country',
          confirmText: 'Change Country'
        }
      }
    );
    

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.solarPanelService.setCountry(country);
        this.offerUnitStore.loadOfferUnits();
      } else {
        this.solarPanelService.requestedCountry.set(
          this.solarPanelService.selectedCountry()
        );
      }
    });
  }

}
