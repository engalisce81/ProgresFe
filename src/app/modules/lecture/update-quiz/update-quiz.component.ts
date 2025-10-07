import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { QuizService } from '@proxy/lectures';
import { CreateUpdateQuizDto } from '@proxy/quizzes';

@Component({
  selector: 'app-update-quiz',
  imports: [ReactiveFormsModule ,RouterLink],
  templateUrl: './update-quiz.component.html',
  styleUrl: './update-quiz.component.scss'
})
export class UpdateQuizComponent {
 quizForm: FormGroup;
  loading = false;
  quizId!: string;
  lectureId!: string;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      quizTime: [1, [Validators.required, Validators.min(1)]],
      quizTryCount: [1, [Validators.required, Validators.min(1)]],
      lectureId: [''],
    });
  }

  ngOnInit(): void {
    // ✅ استخراج lectureId و quizId من المسار
    this.lectureId = this.route.snapshot.paramMap.get('id')!;
    this.quizId = this.route.snapshot.paramMap.get('quizid')!;
    this.loadQuiz();
  }

  // ✅ تحميل بيانات الكويز
  loadQuiz() {
    this.loading = true;
    this.quizService.get(this.quizId).subscribe({
      next: (res) => {
        const quiz = res.data;
        this.quizForm.patchValue({
          title: quiz.title,
          description: quiz.description,
          quizTime: quiz.quizTime,
          quizTryCount: quiz.quizTryCount,
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading quiz', err);
        this.loading = false;
      },
    });
  }

  // ✅ عند التحديث
  submit() {
    if (this.quizForm.invalid) return;

    const dto: CreateUpdateQuizDto = this.quizForm.value;
    dto.lectureId = this.lectureId; // ربط الكويز بالمحاضرة

    this.loading = true;

    this.quizService.update(this.quizId, dto).subscribe({
      next: () => {
        this.loading = false;
        // بعد الحفظ نرجع لصفحة الأسئلة الخاصة بالمحاضرة
        this.router.navigate(['/lectures/questions', this.lectureId]);
      },
      error: (err) => {
        this.loading = false;
        alert('Error updating quiz: ' + err.message);
      },
    });
  }
}
