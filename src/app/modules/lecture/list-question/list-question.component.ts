import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LectureWithQuizzesDto, LectureService } from '@proxy/lectures';
import { QuestionService, QuestionWithAnswersDto } from '@proxy/questions';

@Component({
  selector: 'app-list-question',
  imports: [ReactiveFormsModule],
  templateUrl: './list-question.component.html',
  styleUrl: './list-question.component.scss'
})
export class ListQuestionComponent {
  lectureId!: string;
  lecture?: LectureWithQuizzesDto;
  loading = false;

  // عشان نظهر الـ confirm
  confirmDelete: { show: boolean; question?: QuestionWithAnswersDto } = { show: false };

  constructor(
    private route: ActivatedRoute,
    private lectureService: LectureService,
    private questionService: QuestionService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.lectureId = id;
        this.loadLecture();
      }
    });
  }

  loadLecture() {
    this.loading = true;
    this.lectureService.getLectureWithQuizzes(this.lectureId).subscribe({
      next: (res) => {
        this.lecture = res.data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

editQuestion(question: QuestionWithAnswersDto) {
  this.router.navigate([
    '/lectures/questions',
    this.lectureId,
    'update',
    question.id
  ]);
}


  deleteQuestion(question: QuestionWithAnswersDto) {
    this.confirmDelete = { show: true, question };
  }

  confirmDeleteYes() {
    if (!this.confirmDelete.question?.id) return;

    this.questionService.delete(this.confirmDelete.question.id).subscribe({
      next: () => {
        // حدث الليست بعد الحذف
        this.lecture!.quizzes.forEach(qz => {
          qz.questions = qz.questions.filter(q => q.id !== this.confirmDelete.question!.id);
        });
        this.confirmDelete = { show: false };
      },
      error: err => {
        console.error('Error deleting question', err);
        this.confirmDelete = { show: false };
      }
    });
  }

  confirmDeleteCancel() {
    this.confirmDelete = { show: false };
  }
}
