import { Component, OnInit, ApplicationRef } from '@angular/core';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import { ActivatedRoute } from "@angular/router";
var queue = require('../queue.frontend')
var queueManager = require('../queue.manager.fronend')

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
  public address
  public title
  public description
  public owner
  public clientCount


  constructor(private route: ActivatedRoute) { }

  ngOnInit () {
    this.myInit()
  }

  public myInit () {
    debugger
    this.address = this.route.params['value']['address']
    queue.getAllClientsForContract(this.address)
      .flatMap(data => {
        let tableData = {
          headerRow: ['ID', 'Address', 'Added'],
          dataRows: []
        };
        let result = data
        this.clientCount = data.length
        let dataRows = []
        for (let i = 0; i < result.length; i++) {
          let row: any[] = []
          row.push(i)
          row.push(result[i]['address'])
          row.push(new Date(result[i]['date'] * 1000).toISOString())
          dataRows.push(row)
        }
        tableData.dataRows = dataRows
        this.tableData1 = tableData

        return queueManager.getAllValidQueues()
      })
      .flatMap(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i]['queueAdr'] === this.address) {
            debugger
            this.title = data[i]['title']
            this.description = data[i]['descrition']
            this.owner = data[i]['ownerAdr']
            break
          }
        }

        return Rx.Observable.empty()
      })
      .subscribe(
      (data: any[]) => {

      },
      error => {
        debugger
        console.log(error)
      }
      )

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

  public appendQueue (name, desc) {
    debugger
    queue.doPushClient(this.address, { name: name, desc: desc })
      .subscribe(
      (data: any[]) => {
        this.myInit()
      },
      error => {
        debugger
        console.log(error)
      }
      )
  }

  public popQueue () {
    debugger
    queue.popClient(this.address)
      .subscribe(
      (data: any[]) => {
        this.myInit()
        console.log(data)
      },
      error => {
        debugger
        console.log(error)
      }
      )
  }
}
