import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import * as Highcharts from 'highcharts';
import sonification from 'highcharts/modules/sonification'
import {CurveService} from "../curve.service";
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-curve-highchart',
  templateUrl: './curve-high-chart.component.html',
  styleUrls: ['./curve-high-chart.component.scss']
})
export class CurveHighChartComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
    },
    legend: {
      align: 'center',
    },
    tooltip: {
      enabled: true,
      shared: true,
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: false,
        },
        sonifyButton: {
          text: 'Sonify',
          onclick: () => {
            this.chartObject.sonify();
          },
        }
      }
    },
    sonification: {
      enabled: true,
      events: {
        onSeriesStart: (e: any) => {
          this.chartObject.sonification?.speak(
            `Series ${e['series']['name']}`)
        }
      }
    }
  };
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: CurveService) {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
    sonification(Highcharts);
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;

  }

  ngAfterViewInit(): void {
    this.setChartSeries();
    this.service.setHighChart(this.chartObject);
    this.service.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartYAxis();
      this.setChartXAxis();
      this.setChartTitle();
      this.updateChart();
    });
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      this.updateChartSeries();
      this.updateChart();
    });
    this.service.interface$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.reverseYAxis();
      this.updateChart();
    });
    this.service.dataKeys$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateChartSeries();
      this.updateChart();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = {text: this.service.getChartTitle()};
  }

  private setChartSeries(): void {
    for (let count = 0; count < 4; count++) {
      this.chartObject.addSeries({
        name: this.service.getDataLabelArray()[count + 1],
        type: 'line',
        data: this.processData(this.service.getDataArray()[count]),
      });
    }
  }

  private updateChartSeries(): void {
    const name = this.service.getDataLabelArray();
    const data = this.service.getDataArray();
    for (let count = 0; count < 4; count++) {
      const processedData = this.processData(data[count]);
      this.chartObject.series[count].update({
        name: name[count + 1],
        data: processedData,
        type: 'line',
        visible: count < this.service.getCurveCount(),
      })
    }
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: {text: this.service.getXAxisLabel()}
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: {text: this.service.getYAxisLabel()}
    };
  }

  private reverseYAxis(): void {
    this.chartObject.yAxis[0].update({reversed: this.service.getIsMagnitudeOn()});
  }

  private processData(data: number[][]): number[][] {
    return data.filter((value: number[]) => {
      // return true;
      return (value[0] !== null);
    }).sort((a: number[], b: number[]) => {
      return a[0] - b[0];
    });
  }
}
