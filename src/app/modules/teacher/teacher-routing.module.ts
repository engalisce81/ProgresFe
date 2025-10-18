import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTeacherComponent } from './list-teacher/list-teacher.component';
import { CreateTeacherComponent } from './create-teacher/create-teacher.component';
import { UpdateTeacherComponent } from './update-teacher/update-teacher.component';

const routes: Routes = [
  {path:"" , pathMatch:'full' ,component:ListTeacherComponent},
  {path:"create" , pathMatch:'full' ,component:CreateTeacherComponent},
  {path:"update:id" , pathMatch:'full' ,component:UpdateTeacherComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
