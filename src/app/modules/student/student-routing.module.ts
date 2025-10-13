import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListStudentComponent } from './list-student/list-student.component';
import { CreateStudentComponent } from './create-student/create-student.component';
import { UpdateStudentComponent } from './update-student/update-student.component';

const routes: Routes = [
  {path:"" ,pathMatch:'full',component:ListStudentComponent},
  {path:"create" ,pathMatch:'full',component:CreateStudentComponent},
  {path:"update/:id" ,pathMatch:'full',component:UpdateStudentComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
