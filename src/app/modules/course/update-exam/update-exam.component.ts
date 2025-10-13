import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from '@proxy/courses';
import { ExamDto, CreateUpdateExamDto } from '@proxy/exams';

@Component({
  selector: 'app-update-exam',
  imports: [ReactiveFormsModule ,RouterLink],
  templateUrl: './update-exam.component.html',
  styleUrl: './update-exam.component.scss'
})
export class UpdateExamComponent {
examForm: FormGroup;
  loading = false;

  bankId!: string;
  examId!: string;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      name: ['', Validators.required],
      timeExam: [0, [Validators.required, Validators.min(1)]],
      isActive: [true],
      examQuestions: this.fb.array([]) // لعرض الأسئلة المرتبطة بالامتحان
    });
  }

  get examQuestions(): FormArray {
    return this.examForm.get('examQuestions') as FormArray;
  }

  ngOnInit(): void {
    this.bankId = this.route.snapshot.paramMap.get('bankId')!;
    this.examId = this.route.snapshot.paramMap.get('examId')!;
    this.loadExam();
  }

  loadExam() {
    this.loading = true;
    this.examService.get(this.bankId, this.examId).subscribe({
      next: (exam: ExamDto) => {
        this.loading = false;
        this.examForm.patchValue({
          name: exam.name,
          timeExam: exam.timeExam,
          isActive: exam.isActive
        });

        // 🟢 نملأ الأسئلة في الـ FormArray
        this.examQuestions.clear();
        exam.examQuestions.forEach(q => {
          this.examQuestions.push(
            this.fb.group({
              id: [q.id],
              isSelected: [q.isSelected]
            })
          );
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading exam', err);
      }
    });
  }

  submit() {
    if (this.examForm.invalid) return;

    const dto: CreateUpdateExamDto = {
      name: this.examForm.value.name,
      timeExam: this.examForm.value.timeExam,
      isActive: this.examForm.value.isActive,
      questionIds: this.examForm.value.examQuestions
        .filter((q: any) => q.isSelected)
        .map((q: any) => q.id)
    };

    this.loading = true;

    this.examService.updateExamByIdAndInput(this.examId, dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/courses']); // ✅ غيّر المسار لو عندك صفحة عرض
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }
}
