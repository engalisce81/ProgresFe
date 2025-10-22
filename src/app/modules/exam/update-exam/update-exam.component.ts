import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '@proxy/courses';
import { ExamService, ExamDto, CreateUpdateExamDto } from '@proxy/exams';
import { LookupDto } from '@proxy/look-up';

@Component({
  selector: 'app-update-exam',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './update-exam.component.html',
  styleUrl: './update-exam.component.scss'
})
export class UpdateExamComponent {
  examForm: FormGroup;
  loading = false;
  courses: LookupDto[] = [];
  examId!: string;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      name: ['', Validators.required],
      timeExam: [0, [Validators.required, Validators.min(1)]],
      score: [0, [Validators.required, Validators.min(1)]],
      isActive: [true, Validators.required],
      courseId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id')!;
    this.loadCourses();
    this.loadExam();
  }

  loadCourses() {
    this.courseService.getMyCoursesLookUp().subscribe({
      next: (res) => (this.courses = res.items),
      error: (err) => console.error('Error loading courses', err),
    });
  }

  loadExam() {
    this.loading = true;
    this.examService.get(this.examId).subscribe({
      next: (res) => {
        this.examForm.patchValue({
          name: res.data.name,
          timeExam: res.data.timeExam,
          score: res.data.score,
          isActive: res.data.isActive,
          courseId: res.data.courseId,
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert('Error loading exam: ' + err.message);
      },
    });
  }

  submit() {
    if (this.examForm.invalid) return;

    const dto: CreateUpdateExamDto = this.examForm.value;
    this.loading = true;

    this.examService.update(this.examId, dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/exams']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error updating exam: ' + err.message);
      },
    });
  }
}
