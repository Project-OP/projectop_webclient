import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { TableComponent } from './pages/table/table.component';


const routes: Routes = [
  { path: '',   redirectTo: '/lobby', pathMatch: 'full' }, 
  { path: 'table', component: TableComponent },
  { path: 'lobby', component: LobbyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
