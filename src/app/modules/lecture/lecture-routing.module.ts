import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateLectureComponent } from 'src/app/modules/lecture/update-lecture/update-lecture.component';
import { ListLectureComponent } from './list-lecture/list-lecture.component';
import { CreateLectureComponent } from './create-lecture/create-lecture.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { ListQuestionComponent } from './list-question/list-question.component';
import { UpdateQuestionComponent } from './update-question/update-question.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { UpdateQuizComponent } from './update-quiz/update-quiz.component';

const routes: Routes = [
  {path:'',pathMatch:'full',component:ListLectureComponent},
  {path:'create',pathMatch:'full',component:CreateLectureComponent},
  {path:'update/:id',pathMatch:'full',component:UpdateLectureComponent},
  {path:'createquestion/:id',pathMatch:'full',component:CreateQuestionComponent},
  {path:'questions/:id',pathMatch:'full',component:ListQuestionComponent},
  { path: 'questions/:id/update/:qid',pathMatch:'full',component: UpdateQuestionComponent },
  {path:'questions/:id/quiz',pathMatch:'full',component:CreateQuizComponent},
  {path:'questions/:id/quiz/:quizid',pathMatch:'full',component:UpdateQuizComponent},
  {path:'questions/:id/create/:quizid',pathMatch:'full',component:CreateQuestionComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LectureRoutingModule { }
