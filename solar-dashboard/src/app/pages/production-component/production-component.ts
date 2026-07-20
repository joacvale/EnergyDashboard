import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SolarPanelService } from '../../services/solar-panel.service';
import { SolarPanel, ProductionData, EnergyPriceData } from '../../interfaces/solar-panel.interface';
import { PanelDialogComponent } from '../../components/panel-dialog-component/panel-dialog-component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { computed, effect, signal, Component, inject, AfterViewInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { PageStateComponent } from "../../components/page-state-component/page-state-component";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ViewMode, DialogMode } from '../../enums';

import {
  ChartData,
  ChartType,
  TooltipItem
} from 'chart.js';


@Component({
  selector: 'app-production-component',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatTableModule, MatPaginatorModule, MatIconModule, MatChipsModule, MatDialogModule, BaseChartDirective, PageStateComponent, MatSnackBarModule],

  templateUrl: './production-component.html',
  styleUrl: './production-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductionComponent {
  solarPanelService = inject(SolarPanelService);
  dialog = inject(MatDialog);
  viewMode = signal<ViewMode>(ViewMode.TABLE);
  filter = "";
  panelsDataSource = new MatTableDataSource<SolarPanel>();
  snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator)
  set matPaginator(paginator: MatPaginator) {

    if (paginator) {
      this.panelsDataSource.paginator = paginator;
    }
  }

  constructor() {
    effect(() => {
      this.panelsDataSource.data = this.solarPanelService.panels();
    });
  }


  showTable() {
    this.viewMode.set(ViewMode.TABLE);
  }

  showChart() {
    this.viewMode.set(ViewMode.CHART);
  }

  deletePanel(panel: SolarPanel) {
    const dialogRef = this.dialog.open(PanelDialogComponent, {
      width: '500px',
      data: {
        mode: DialogMode.DELETE,
        panel
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Painel apagado com sucesso', 'Fechar', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }

  addPanel() {
    const dialogRef = this.dialog.open(PanelDialogComponent, {
      width: '500px',
      data: {
        mode: DialogMode.ADD,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Painel criado com sucesso', 'Fechar', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }

  updatePanel(panel: SolarPanel) {
    const dialogRef = this.dialog.open(PanelDialogComponent, {
      width: '500px',
      data: {
        mode: DialogMode.EDIT,
        panel
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Painel atualizado com sucesso', 'Fechar', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }

  totalToday = computed(() =>
    this.solarPanelService
      .productionData()
      .reduce(
        (total, item) => total + item.production,
        0
      )
  );

  peakHour = computed(() => {
    const data = this.solarPanelService.productionData();
    if (!data.length) { return '-'; }

    const peak = data.reduce(
      (max, current) =>
        current.production > max.production
          ? current
          : max
    );

    return `H${peak.hour}`;
  });

  filteredSolarPanels(location: string) {
    const panels = this.solarPanelService.panels();

    const filteredPanels = panels.filter(panel => panel.location.toLowerCase().includes(location.toLowerCase()));
    this.panelsDataSource.data = filteredPanels;
  }

  priceLineData = computed(() =>
    this.solarPanelService.energyPriceData().map(item => item.price)
  );


  barChartData = computed<ChartData<any>>(() => {
    const productionData = this.solarPanelService.productionData();
    const energyPrices = this.solarPanelService.energyPriceData();
    const priceData = productionData.map(hour => {
      const energyPrice = energyPrices.find(price => price.hour === hour.hour);
      return energyPrice ? energyPrice.price : null;
    });

    return {
      labels: productionData.map(item => `H${item.hour}`),

      datasets: [
        {
          label: 'Production',
          data: productionData.map(item =>
            item.type === 'production' ? item.production : null
          ),
          backgroundColor: 'rgba(39, 174, 96, 0.8)',
        },
        {
          label: 'Limited',
          data: productionData.map(item =>
            item.type === 'limited' ? item.production : null
          ),
          backgroundColor: 'rgba(155, 89, 182, 0.8)',
        },
        {
          label: 'Idle',
          data: productionData.map(item =>
            item.type === 'idle' ? item.production : null
          ),
          backgroundColor: 'rgba(52, 152, 219, 0.8)',
        },
        {
          type: 'line',
          label: 'Energy Price',
          data: priceData,
          borderColor: '#000000',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          pointRadius: 1.5,
          tension: 0.1,
          yAxisID: 'yPrice',
          spanGaps: true,

          segment: {
            borderDash: (ctx: any) =>
              ctx.p0.skip || ctx.p1.skip //if previous point or next point is null - skip. if skip 6px draw, 6 px space. else normal line
                ? [6, 6]
                : []
          }
        }
      ]
    };

  });

  barChartType: ChartType = 'bar';

  barChartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<any>) => {
            const productionItem = this.solarPanelService.productionData()[context.dataIndex];
            const priceItem = this.solarPanelService.energyPriceData().find(p => p.hour === productionItem.hour)?.price;
            return `${productionItem.type}: ${productionItem.production} MW : ${priceItem} $ pMWH`;
          },
        }
      },
    },

    scales: {
      y: {
        min: 0,
        max: 25,
        title: {
          display: true,
          text: 'MW',
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      },

      yPrice: {
        position: 'right',
        min: 0,
        max: 40,

        title: {
          display: true,
          text: '€ / MWH'
        },

      }
    }
  };

  columnsToDisplay = [
    'id',
    'location',
    'capacity',
    'todayProduction',
    'status',
    'actions'
  ];
}
