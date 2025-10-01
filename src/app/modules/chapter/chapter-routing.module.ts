import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListChapterComponent } from './list-chapter/list-chapter.component';
import { CreateChapterComponent } from './create-chapter/create-chapter.component';
import { UpdateChapterComponent } from './update-chapter/update-chapter.component';

const routes: Routes = [
  {path:"",pathMatch:'full',component:ListChapterComponent},
  {path:"create",pathMatch:'full',component:CreateChapterComponent},
  {path:"update/:id",pathMatch:'full',component:UpdateChapterComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChapterRoutingModule { }
