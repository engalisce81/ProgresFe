import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListQuestionbankComponent } from './list-questionbank/list-questionbank.component';
import { CreateQuestionComponent } from '../lecture/create-question/create-question.component';
import { CreatQuestionbankComponent } from './creat-questionbank/creat-questionbank.component';
import { UpdateQuestionbankComponent } from './update-questionbank/update-questionbank.component';

const routes: Routes = [
  {path:'',pathMatch:"full", component:ListQuestionbankComponent},
  {path:'create',pathMatch:"full", component:CreatQuestionbankComponent},
  {path:'update/:id',pathMatch:"full", component:UpdateQuestionbankComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionbankRoutingModule { }
