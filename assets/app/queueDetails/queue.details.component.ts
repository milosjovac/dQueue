import { Component, OnInit } from '@angular/core';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
var queueManager = require('../queue.manager.fronend')
var queue = require('../queue.frontend')

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

declare var $: any;
import 'rxjs/Rx'

@Component({
  selector: 'queues',
  templateUrl: './queue.details.component.html'
})
export class QueueDetailsComponent implements OnInit {
  public emailChartLegendItems: LegendItem[]
  public tableData1: TableData
  public emailChartType
  public emailChartData

  public events: string[] = []

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
    this.restartNotifications()
  }

  // Don't look at method below :D !!!
  restartNotifications () {
    var self = this
    queueManager.getAllValidQueues()
      .map((res) => {
        // for every contract take events
        var observables = []
        res.forEach(element => {
          observables.push(queue.clientAddedEvent(element.queueAdr))
          observables.push(queue.clientRemovedEvent(element.queueAdr))
        })
        Rx.Observable.merge(...observables).subscribe(
          res => {
            console.log('Next: ', res)
            var msg = "Address " + res.clientAddress + " " + res.event
            
            let haveOne = self.events.filter(elem => elem.indexOf(msg) !== -1)
            if(haveOne.length == 0){
            // if (self.events.contains() !== msg) {
              self.showNotification('top', 'left', msg)
              self.events.push(msg)
            } else {

            }
            this.restartNotifications()
          },
          err => {
            console.log('Error: ', err)
          },
          () => console.log('completed')
        )
        return Rx.Observable.empty()
      })
      .subscribe(
      res => {
        console.log('Next: ', res)
        // this.showNotification('top', 'left', JSON.stringify(res))
      },
      err => {
        console.log('Error: ', err)
      },
      () => console.log('completed')
      )


  }

  showNotification (from, align, message) {
    const type = ['', 'info', 'success', 'warning', 'danger'];
    // message: "Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for every web developer."
    var color = Math.floor((Math.random() * 4) + 1);
    $.notify({
      icon: "pe-7s-gift",
      message: message
    }, {
        type: type[color],
        timer: 1000,
        placement: {
          from: from,
          align: align
        }
      });
  }
}
