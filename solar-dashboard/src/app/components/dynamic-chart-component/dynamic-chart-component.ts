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

  volumeData: (number|null)[] = [];

  priceData: (number | null)[] = [];

  message = '';

  maxHeightVolume = computed(() => {
    return Math.max(...this.volumeData.filter((v): v is number => !!v)) + 5;
  });

  maxHeightPrice = computed(() => {
    return Math.max(...this.priceData.filter((v): v is number => !!v)) + 5;
  });

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
            const productionItem = this.volumeData[context.dataIndex+1];
            const priceItem = this.priceData[context.dataIndex+1];
            const idle = this.offerUnitStore.getIsIdle(this.offerUnit(), context.dataIndex + 1);
            this.message = `€/MWh: ${priceItem}`;
            if (idle) {
              this.message = `Idle is true`;
            }else{
              if(priceItem === null && (productionItem === null||productionItem === undefined)){
                this.message = `No data available`;
              }else if(priceItem === null){
                this.message = `MW: ${productionItem}, No price data`;
              }else if(productionItem === null){
                this.message = `No production data, €/MWh: ${priceItem}`;
              }else {
                this.message = `MW: ${productionItem}, €/MWh: ${priceItem}`;
              }
            }
            return this.message;
            
          },
        }
      },
    },

    scales: {
      y: {
        min: 0,
        max: this.maxHeightVolume,
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
        max: this.maxHeightPrice,

        title: {
          display: true,
          text: '€ / MWH'
        },
      }
    }
  };
}
