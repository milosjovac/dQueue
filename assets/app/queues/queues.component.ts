import { Component, OnInit } from '@angular/core';

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
    this.tableData1 = {
      headerRow: ['ID', 'Address', 'Title', 'Description', 'Owner'],
      dataRows: [
        ['1', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a', 'Donor queue', 'Official Serbia..', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a'],
        ['2', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a', 'Donor queue', 'Official Serbia..', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a'],
        ['3', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a', 'Donor queue', 'Official Serbia..', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a'],
        ['4', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a', 'Donor queue', 'Official Serbia..', '0x28dd7d6f41331e5013ee6c802641cc63b06c238a']
      ]
    };
  }
}
