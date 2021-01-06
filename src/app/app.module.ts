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
import { PotbetinfoComponent } from './components/potbetinfo/potbetinfo.component';
import { DealerbuttonComponent } from './components/dealerbutton/dealerbutton.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { MsgdialogComponent } from './components/msgdialog/msgdialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './components/menu/menu.component';
import { ConnectionissuesComponent } from './components/connectionissues/connectionissues.component';
import { MobileinputComponent } from './components/mobileinput/mobileinput.component';


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    SeatComponent,
    CardComponent,
    TurnactionsComponent,
    MessagewindowComponent,
    AdminwindowComponent,
    CommunitycardsComponent,
    PotbetinfoComponent,
    DealerbuttonComponent,
    LobbyComponent,
    MsgdialogComponent,
    MenuComponent,
    ConnectionissuesComponent,
    MobileinputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
