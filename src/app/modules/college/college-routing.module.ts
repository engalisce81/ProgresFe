import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCollegeComponent } from './create-college/create-college.component';
import { ListCollegeComponent } from './list-college/list-college.component';
import { UpdateCollegeComponent } from './update-college/update-college.component';
import { ListGradelevelComponent } from './list-gradelevel/list-gradelevel.component';
import { CreateGradelevelComponent } from './create-gradelevel/create-gradelevel.component';
import { UpdateGradelevelComponent } from './update-gradelevel/update-gradelevel.component';

const routes: Routes = [
  {path:"",pathMatch:'full',component:ListCollegeComponent},
  {path:'create' , pathMatch:'full',component:CreateCollegeComponent},
  {path:'update/:id' , pathMatch:'full',component:UpdateCollegeComponent},
  {path:'gradelevel/:id' , pathMatch:'full',component:ListGradelevelComponent},
  {path:'gradelevel/:id/create' , pathMatch:'full',component:CreateGradelevelComponent},
  {path:'gradelevel/:id/update/:gradeId' , pathMatch:'full',component:UpdateGradelevelComponent},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeRoutingModule { }
