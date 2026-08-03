import { Component, inject, input } from '@angular/core';
import { OfferUnit } from '../../interfaces/offer-unit.interface';
import { OfferUnitStore } from '../../stores/offer-unit.store';
import {ChartData,ChartType,TooltipItem, ChartOptions} from 'chart.js';
import { MatCardModule } from '@angular/material/card';   
import {BaseChartDirective} from 'ng2-charts';
@Component({
  selector: 'app-dynamic-chart-component',
  imports: [MatCardModule, BaseChartDirective],
  standalone: true,
  templateUrl: './dynamic-chart-component.html',
  styleUrl: './dynamic-chart-component.scss',
})
export class DynamicChartComponent {
  offerUnitStore = inject(OfferUnitStore);
  offerUnit = input.required<OfferUnit>();  

  volumeData: number[] = [];

  barChartData(offerUnit: OfferUnit) {
    this.volumeData = this.offerUnitStore.getVolumeDataPerQuarter(offerUnit);
    return {
      labels: offerUnit.quarters.map(q => `Q${q.quarter}`),
      datasets: [
        {
          label: 'Production',
          data: this.volumeData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  barChartType: ChartType = 'bar';
  barChartOptions: ChartOptions<any> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<any>) => {
              const productionItem = this.volumeData[context.dataIndex];
              return `MW: ${productionItem}`;
            },
          }
        },
      },
  
      scales: {
        y: {
          min: 25,
          max: 60,
          title: {
            display: true,
            text: 'MW',
          },
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        },

      }
    };
}
