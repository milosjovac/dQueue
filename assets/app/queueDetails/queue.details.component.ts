import { Component, OnInit } from '@angular/core';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'queues',
  templateUrl: './queue.details.component.html'
})
export class QueueDetailsComponent implements OnInit {
  public emailChartLegendItems: LegendItem[]
  public tableData1: TableData
  public emailChartType
  public emailChartData

  constructor() { }

  ngOnInit () {
    this.emailChartType = ChartType.Pie;
    this.emailChartData = {
      labels: ['62%', '32%', '6%'],
      series: [62, 32, 6]
    };
    this.emailChartLegendItems = [
      { title: 'Processed', imageClass: 'fa fa-circle text-info' },
      { title: 'Processing', imageClass: 'fa fa-circle text-danger' },
      { title: 'Queued', imageClass: 'fa fa-circle text-warning' }
    ]
  }
}
