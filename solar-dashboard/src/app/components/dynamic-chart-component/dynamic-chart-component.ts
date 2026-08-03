import { Component, inject, input, computed } from '@angular/core';
import { OfferUnit } from '../../interfaces/offer-unit.interface';
import { OfferUnitStore } from '../../stores/offer-unit.store';
import { ChartData, ChartType, TooltipItem, ChartOptions } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { max } from 'rxjs/internal/operators/max';
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

  priceData: (number | null)[] = [];


  barChartData(offerUnit: OfferUnit): ChartData<'bar' | 'line'> {

    this.volumeData = this.offerUnitStore.getVolumeDataPerQuarter(offerUnit);
    this.priceData = this.offerUnitStore.getPriceDataPerQuarter(offerUnit);
    const maxVolume = Math.max(
      ...this.volumeData.filter(
        (v): v is number => v != null && !isNaN(v)
      )
    );
    const chartValues = offerUnit.quarters.map(q => {
      if (q.idle) {
        return maxVolume;
      }else if (q.volume === undefined) {
        return maxVolume;
      }
      return q.volume ?? 0;
    });
    const backgroundColors = offerUnit.quarters.map(q => {
      if (q.idle) {
        return 'rgba(0,255,0,0.2)';

      }else if (q.volume === undefined) {
        return 'rgba(54,162,235,0.2)';
      }
      return 'rgba(128,128,128,0.2)';
    });
    const borderColors = offerUnit.quarters.map(q => {
      if (q.idle) {
        return 'green';
      } else if (q.volume === undefined) {
        return 'blue';
      }
      return 'black';
    });
    return {
      labels: offerUnit.quarters.map(q => `Q${q.quarter}`),
      datasets: [
        {
          label: 'Volume (MW)',
          data: chartValues,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        },
        {
          type: 'line',
          label: 'Price (€/MWh)',
          data: this.priceData,
          backgroundColor: 'transparent',
          borderColor: '#000',
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

        },
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
            const priceItem = this.priceData[context.dataIndex];
            return `MW: ${productionItem}, €/MWh: ${priceItem}`;
          },
        }
      },
    },

    scales: {
      y: {
        min: 0,
        max: 60,
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
        max: 70,

        title: {
          display: true,
          text: '€ / MWH'
        },
      }
    }
  };
}
