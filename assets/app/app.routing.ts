import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { TablesComponent } from './tables/tables.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { QueuesComponent } from "./queues/queues.component";
import { QueueDetailsComponent } from "./queueDetails/queue.details.component";

const routes: Routes = [
  { path: 'queues', component: QueuesComponent },
  { path: 'queue/:address', component: QueueDetailsComponent },
  { path: 'dashboard', component: HomeComponent },
  { path: 'user', component: UserComponent },
  { path: 'table', component: TablesComponent },
  { path: 'icons', component: IconsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
