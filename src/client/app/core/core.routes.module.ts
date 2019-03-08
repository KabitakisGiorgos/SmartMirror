import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';

const coreRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'menu', component: MenuComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(coreRoutes)
  ],
  exports: [RouterModule]
})
export class CoreRoutingModule { }