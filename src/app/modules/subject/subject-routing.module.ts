import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSubjectComponent } from './list-subject/list-subject.component';
import { CreateSubjectComponent } from './create-subject/create-subject.component';
import { UpdateSubjectComponent } from './update-subject/update-subject.component';

const routes: Routes = [
  {path:'',pathMatch:'full' ,component:ListSubjectComponent},
  {path:'create',pathMatch:'full' ,component:CreateSubjectComponent},
  {path:'update/:id',pathMatch:'full' ,component:UpdateSubjectComponent},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectRoutingModule { }
