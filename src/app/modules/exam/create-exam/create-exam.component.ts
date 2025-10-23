import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from '@proxy/dev/acadmy/courses';
import { ExamService, CreateUpdateExamDto } from '@proxy/dev/acadmy/exams';
import { LookupDto } from '@proxy/dev/acadmy/look-up';


@Component({
  selector: 'app-create-exam',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './create-exam.component.html',
  styleUrl: './create-exam.component.scss'
})
export class CreateExamComponent {
examForm: FormGroup;
  loading = false;
  courses: LookupDto[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private courseService: CourseService,
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
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getMyCoursesLookUp().subscribe({
      next: (res) => {
        this.courses = res.items;
      },
      error: (err) => {
        console.error('Error loading courses', err);
      }
    });
  }

  submit() {
    if (this.examForm.invalid) return;

    const dto: CreateUpdateExamDto = this.examForm.value;
    this.loading = true;

    this.examService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/exams']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }
}
