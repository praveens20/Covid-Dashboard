import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitiesComponent } from './components/cities/cities.component';
import { DetailsComponent } from './components/details/details.component';


const routes: Routes = [
  {path:'',          redirectTo:'cities',             pathMatch:'full'},
  {path:'cities' ,   component:CitiesComponent},
  {path:'details' ,  component:DetailsComponent},
  {path:'**',         redirectTo:'cities'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
