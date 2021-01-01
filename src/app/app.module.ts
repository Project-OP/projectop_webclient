import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './pages/table/table.component';
import { HttpClientModule } from '@angular/common/http';
import { SeatComponent } from './components/seat/seat.component';
import { CardComponent } from './components/card/card.component';
import { TurnactionsComponent } from './components/turnactions/turnactions.component';
import { MessagewindowComponent } from './components/messagewindow/messagewindow.component';
import { AdminwindowComponent } from './components/adminwindow/adminwindow.component';
import { CommunitycardsComponent } from './components/communitycards/communitycards.component';


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    SeatComponent,
    CardComponent,
    TurnactionsComponent,
    MessagewindowComponent,
    AdminwindowComponent,
    CommunitycardsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
