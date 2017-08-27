import { Component, OnInit } from '@angular/core'
import { QueueService } from "./queues.service"
import { Observable } from 'rxjs'
import 'rxjs/Rx'
var queueManager = require('../queue.manager.fronend')

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'queues',
  templateUrl: './queues.component.html'
})
export class QueuesComponent implements OnInit {
  public tableData1: TableData;

  constructor() { }

  ngOnInit () {
    queueManager.getAllValidQueues()
      .subscribe(
      (data: any[]) => {
        debugger
        this.tableData1 = {
          headerRow: ['ID', 'Address', 'Title', 'Description', 'Owner'],
          dataRows: []
          //   ['1', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a', 'Donor queue', 'Official Serbia..', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a'],
          //   ['2', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a', 'Donor queue', 'Official Serbia..', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a'],
          //   ['3', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a', 'Donor queue', 'Official Serbia..', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a'],
          //   ['4', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a', 'Donor queue', 'Official Serbia..', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a']
          // ]
        };
        debugger
        let result = data
        let dataRows = []
        for (let i = 0; i < result.length; i++) {
          let row: any[] = []
          row.push(i)
          row.push(result[i]['queueAdr'])
          row.push(result[i]['title'])
          row.push(result[i]['description'])
          row.push(result[i]['ownerAdr'])
          dataRows.push(row)
        }
        this.tableData1.dataRows = dataRows
      },
      error => {
        debugger
        console.log(error)
      }
      )
  }

  hex2a (hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }
}
