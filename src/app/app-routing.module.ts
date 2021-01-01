import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableComponent } from './pages/table/table.component';


const routes: Routes = [
  { path: '',   redirectTo: '/table', pathMatch: 'full' }, 
  { path: 'table', component: TableComponent },
  //{ path: 'lobby', component: SecondComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
