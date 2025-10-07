import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService } from '@proxy/lectures';
import { CreateUpdateQuizDto } from '@proxy/quizzes';

@Component({
  selector: 'app-create-quiz',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.scss'
})
export class CreateQuizComponent {
quizForm: FormGroup;
  loading = false;
  lectureId: string = '';

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
    });
  }

  ngOnInit(): void {
    // 🔹 نحصل على الـ Lecture ID من الـ Route Param
    this.lectureId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  submit() {
    if (this.quizForm.invalid) return;

    this.loading = true;

    const dto: CreateUpdateQuizDto = {
      ...this.quizForm.value,
      lectureId: this.lectureId, // 🔹 نضيفها أوتوماتيكياً من الـ route param
    };

    this.quizService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/lectures/questions', this.lectureId]);
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      },
    });
  }
}
