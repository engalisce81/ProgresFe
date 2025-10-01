import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUniversityComponent } from './list-university/list-university.component';
import { CreateUniversityComponent } from './create-university/create-university.component';
import { UpdateUniversityComponent } from './update-university/update-university.component';

const routes: Routes = [
  {path:'',pathMatch:"full",component:ListUniversityComponent},
  {path:'create',pathMatch:"full",component:CreateUniversityComponent},
  {path:'update/:id',pathMatch:"full",component:UpdateUniversityComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniversityRoutingModule { }
