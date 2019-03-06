import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceXComponent } from './serviceX.component';

const serviceXRoutes: Routes = [
  { path: 'serviceX', component: ServiceXComponent },
];

@NgModule({
    imports: [
      RouterModule.forChild(serviceXRoutes)
    ],
    exports: [RouterModule]
})
export class ServiceXRoutingModule {}
