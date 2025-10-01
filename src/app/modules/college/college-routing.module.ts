import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCollegeComponent } from './create-college/create-college.component';
import { ListCollegeComponent } from './list-college/list-college.component';
import { UpdateCollegeComponent } from './update-college/update-college.component';

const routes: Routes = [
  {path:"",pathMatch:'full',component:ListCollegeComponent},
  {path:'create' , pathMatch:'full',component:CreateCollegeComponent},
  {path:'update/:id' , pathMatch:'full',component:UpdateCollegeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeRoutingModule { }
