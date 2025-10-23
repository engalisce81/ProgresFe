import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BaseCoreModule } from "@abp/ng.core";
import { LectureWithQuizzesDto, LectureService, QuizService } from '@proxy/dev/acadmy/lectures';
import { QuestionService, QuestionWithAnswersDto } from '@proxy/dev/acadmy/questions';

@Component({
  selector: 'app-list-question',
  imports: [ReactiveFormsModule, BaseCoreModule ,RouterLink],
  templateUrl: './list-question.component.html',
  styleUrl: './list-question.component.scss'
})
export class ListQuestionComponent {
  lectureId!: string;
  lecture?: LectureWithQuizzesDto;
  loading = false;

  confirmDelete: { show: boolean; id?: string; type?: 'quiz' | 'question'; title?: string } = { show: false };

  constructor(
    private route: ActivatedRoute,
    private lectureService: LectureService,
    private questionService: QuestionService,
    private quizService:QuizService,
    private router: Router
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

  // 🔹 إنشاء كويز جديد
  createQuiz() {
    this.router.navigate(['/lectures/questions', this.lectureId, 'quiz']);
  }

  // 🔹 تعديل كويز
  editQuiz(quiz: any) {
    this.router.navigate(['/lectures/questions', this.lectureId, 'quiz', quiz.id]);
  }

  // 🔹 حذف كويز
  deleteQuiz(quiz: any) {
    this.confirmDelete = { show: true, id: quiz.id, type: 'quiz', title: quiz.title };
  }

  // 🔹 تعديل سؤال
  editQuestion(question: QuestionWithAnswersDto) {
    this.router.navigate([
      '/lectures/questions',
      this.lectureId,
      'update',
      question.id
    ]);
  }

  // 🔹 حذف سؤال
  deleteQuestion(question: QuestionWithAnswersDto) {
    this.confirmDelete = { show: true, id: question.id, type: 'question', title: question.title };
  }

  // 🔹 تنفيذ الحذف بعد التأكيد
  confirmDeleteYes() {
    if (!this.confirmDelete.id || !this.confirmDelete.type) return;

    if (this.confirmDelete.type === 'quiz') {
      this.quizService.delete(this.confirmDelete.id).subscribe({
        next: () => {
          this.lecture!.quizzes = this.lecture!.quizzes.filter(q => q.id !== this.confirmDelete.id);
          this.confirmDelete = { show: false };
        },
        error: err => {
          console.error('Error deleting quiz', err);
          this.confirmDelete = { show: false };
        }
      });
    } else if (this.confirmDelete.type === 'question') {
      this.questionService.delete(this.confirmDelete.id).subscribe({
        next: () => {
          this.lecture!.quizzes.forEach(qz => {
            qz.questions = qz.questions.filter(q => q.id !== this.confirmDelete.id);
          });
          this.confirmDelete = { show: false };
        },
        error: err => {
          console.error('Error deleting question', err);
          this.confirmDelete = { show: false };
        }
      });
    }
  }

  confirmDeleteCancel() {
    this.confirmDelete = { show: false };
  }
}
