import { Injectable, EventEmitter } from '@angular/core'
import { Http, Response, Headers } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/Rx'
var queueManager = require('../queue.manager.fronend')

@Injectable()
export class QueueService {

  constructor(private http: Http) {
  }

  getAllValidQueues () {
    return queueManager.getAllValidQueues()
  }
}