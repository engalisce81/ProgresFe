import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListExamComponent } from './list-exam/list-exam.component';
import { CreateExamComponent } from './create-exam/create-exam.component';
import { UpdateExamComponent } from './update-exam/update-exam.component';
import { QuestionExamComponent } from './question-exam/question-exam.component';

const routes: Routes = [
  {path:"",pathMatch:'full',component:ListExamComponent},
  {path:"create",pathMatch:'full',component:CreateExamComponent},
  {path:"update/:id",pathMatch:'full',component:UpdateExamComponent},
  {path:"updateQuestionExam/:id",pathMatch:'full',component:QuestionExamComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }
