import { Component, inject, input, computed } from '@angular/core';
import { OfferUnit } from '../../interfaces/offer-unit.interface';
import { OfferUnitStore } from '../../stores/offer-unit.store';
import { ChartData, ChartType, TooltipItem, ChartOptions } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts'; import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart } from 'chart.js';


Chart.register(annotationPlugin);

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

  volumeData: (number | null)[] = [];
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

    this.barChartOptions.plugins!.annotation = { annotations: this.getIdleAnnotations(offerUnit) };
    const maxVolume = Math.max(
      ...this.volumeData.filter(
        (v): v is number => v != null && !isNaN(v)
      )
    );

    const chartValues = offerUnit.quarters.map(q => {
      if (q.idle) {
        return maxVolume;
      } else if (q.volume === undefined) {
        return maxVolume;
      }
      return q.volume ?? 0;
    });
    const backgroundColors = offerUnit.quarters.map(q => {
      if (q.idle) {
        return 'transparent';

      } else if (q.volume === undefined) {
        return 'transparent';
      }
      return 'rgba(128,128,128,1)';
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
      labels: offerUnit.quarters.map(q => q.quarter.toString()),
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
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: TooltipItem<any>[]) => {
            const quarterIndex = tooltipItems[0].dataIndex + 1;

            const hour = Math.ceil(quarterIndex / 4);
            const quarter = ((quarterIndex - 1) % 4) + 1;

            return `${quarterIndex} / Q${quarter}H${hour}`;
          },
          label: (context: TooltipItem<any>) => {
            const productionItem = this.volumeData[context.dataIndex + 1];
            const priceItem = this.priceData[context.dataIndex + 1];
            const idle = this.offerUnitStore.getIsIdle(this.offerUnit(), context.dataIndex + 1);
            this.message = `€/MWh: ${priceItem}`;
            if (idle && priceItem === null) {
              this.message = `Idle is true`;
            } else if (idle && priceItem !== null) {
              this.message = `Idle is true, €/MWh: ${priceItem}`;
            }
            else if (!idle && priceItem === null && (productionItem === null || productionItem === undefined)) {
              this.message = `MW: StartAppShutdown; €/MWh: No data for price`;
            } else if (!idle && priceItem !== null && (productionItem === null || productionItem === undefined)) {
              this.message = `MW:StartAppShutdown; €/MWh: ${priceItem}`;
            } else if (!idle && priceItem === null && productionItem !== null && productionItem !== undefined) {
              this.message = `MW: ${productionItem}, €/MWh: No data for price`;
            } else {
              this.message = `MW: ${productionItem}, €/MWh: ${priceItem}`;
            }
            return this.message;

          },
        },

      },
    },

    scales: {
      x: {
        position: 'top',

        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,

          callback: (index: number) => {
            return (index - 1) % 4 === 0
              ? `    H${(index - 1) / 4 + 1}`
              : '';
          }
        },

        grid: {
          drawTicks: false,

          color: (ctx:any) =>  '#999',

          lineWidth: (ctx:any) => {
            return ctx.index % 4 === 0
              ? 2
              : 0.5;
          }
        }
      },
      y: {
        min: 0,
        max: this.maxHeightVolume,
        title: {
          display: true,
          text: 'MW',
        },
        grid: {
          lineWidth: 0,
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
        grid: {
          lineWidth: 0,
        }
      }
    }
  };

  getIdleAnnotations(offerUnit: OfferUnit) {
    const annotations: any = {};
    offerUnit.quarters.forEach((q, index) => {
      if (q.idle) {
        annotations[`idle-${index}`] = {
          type: 'label',
          xValue: index,
          yValue: this.maxHeightVolume() - 3,
          content: ['i'],
          color: 'green',
          padding: 4,
          font: {
            size: 20,
            weight: 'bold'
          }
        };
      }
    });

    return annotations;
  }

}


