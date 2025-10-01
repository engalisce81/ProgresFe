import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCourseComponent } from './list-course/list-course.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { UpdateCourseComponent } from './update-course/update-course.component';
import { ListSubscriberComponent } from './list-subscriber/list-subscriber.component';
import { ListRequestjoinComponent } from './list-requestjoin/list-requestjoin.component';

const routes: Routes = [
  {path:'',pathMatch:'full',component:ListCourseComponent},
  {path:'create',pathMatch:'full',component:CreateCourseComponent},
  {path:'update/:id',pathMatch:'full',component:UpdateCourseComponent},
  {path:'subscriber/:id',pathMatch:'full',component:ListSubscriberComponent},
  {path:'requestjoin/:id',pathMatch:'full',component:ListRequestjoinComponent},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
