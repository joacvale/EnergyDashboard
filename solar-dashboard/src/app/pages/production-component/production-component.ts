import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SolarPanelService } from '../../services/solar-panel.service';
import { SolarPanel } from '../../interfaces/solar-panel.interface';
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


@Component({
  selector: 'app-production-component',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,MatButtonModule,MatCardModule,MatTableModule,MatPaginatorModule,MatIconModule,MatChipsModule,MatDialogModule,BaseChartDirective,PageStateComponent,MatSnackBarModule],

  templateUrl: './production-component.html',
  styleUrl: './production-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductionComponent implements AfterViewInit {
  solarPanelService = inject(SolarPanelService);
  dialog = inject(MatDialog);
  viewMode = signal<'table' | 'chart'>('table');
  filter = "";
  dataSource = new MatTableDataSource<SolarPanel>();
  snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.solarPanelService.panels();
    });
  }

  showTable() {
    this.viewMode.set('table');
  }

  showChart() {
    this.viewMode.set('chart');
  }

  deletePanel(panel: SolarPanel) {
      const dialogRef = this.dialog.open(PanelDialogComponent, {
        width: '500px',
        data: {
          mode: 'delete',
          panel
        }
      });
      dialogRef.afterClosed().subscribe((result)=>{
        if(result){
          this.snackBar.open('Painel apagado com sucesso','Fechar',{ duration: 3000, verticalPosition:'top'});
        }
      });
  }

  addPanel() {
      const dialogRef = this.dialog.open(PanelDialogComponent, {
        width: '500px',
        data: {
          mode: 'add',
        }
      });
      dialogRef.afterClosed().subscribe((result)=>{
        if(result){
          this.snackBar.open('Painel criado com sucesso','Fechar',{ duration: 3000, verticalPosition:'top'});
        }
      });
  }

  updatePanel(panel: SolarPanel) {
      const dialogRef = this.dialog.open(PanelDialogComponent, {
        width: '500px',
        data: {
          mode: 'update',
          panel
        }
      });
      dialogRef.afterClosed().subscribe((result)=>{
        if(result){
          this.snackBar.open('Painel atualizado com sucesso','Fechar',{ duration: 3000 , verticalPosition:'top'});
        }
      });
  }




  barChartData = computed(() => {
    const data = this.solarPanelService.productionData();

    return {
      labels: data.map(item => `H${item.hour}`),

      datasets: [
        {
          label: 'Production',
          data: data.map(item => 
            item.type==='production'
            ? item.production : null
          ),
          backgroundColor: 'rgba(39, 174, 96, 0.8)',
        },
        {
          label: 'Limited',
          data: data.map(item => 
            item.type==='limited'
            ? item.production : null
          ),
          backgroundColor: 'rgba(155, 89, 182, 0.8)',
        },
        {
          label: 'Idle',
          data: data.map(item => 
            item.type==='idle'
            ? item.production : null
          ),
          backgroundColor: 'rgba(52, 152, 219, 0.8)',
        }
      ]
    };
  });

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

    if (!data.length) {
      return '-';
    }

    const peak = data.reduce(
      (max, current) =>
        current.production > max.production
          ? current
          : max
    );

    return `H${peak.hour}`;

  });
  
  
  filteredSolarPanels(location : string){
    const panels = this.solarPanelService.panels();
    const filteredPanels = panels.filter(panel=>panel.location.toLowerCase().includes(location.toLowerCase()));
    this.dataSource.data = filteredPanels;
  }

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {

        callbacks: {
          label: (context) => {
            const item = this.solarPanelService.productionData()[context.dataIndex];

            return `${item.type}: ${item.production} MW`;
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
      }
    }
  }

  barChartType: 'bar' = 'bar';

  columnsToDisplay = [
    'id',
    'location',
    'capacity',
    'todayProduction',
    'status',
    'actions'
  ];
}
