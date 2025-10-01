import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChapterService, CreateUpdateChapterDto } from '@proxy/chapters';
import { CourseService } from '@proxy/courses';
import { LookupDto } from '@proxy/look-up';

@Component({
  selector: 'app-create-chapter',
  imports: [ReactiveFormsModule],
  templateUrl: './create-chapter.component.html',
  styleUrl: './create-chapter.component.scss'
})
export class CreateChapterComponent {
chapterForm: FormGroup;
  loading = false;
  courses: LookupDto[] = [];

  constructor(
    private fb: FormBuilder,
    private chapterService: ChapterService,
    private courseService: CourseService,
    private router: Router
  ) {
    this.chapterForm = this.fb.group({
      name: ['', Validators.required],
      courseId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCoursesList().subscribe({
      next: (res) => {
        this.courses = res.items;
      },
      error: (err) => {
        console.error('Error loading courses', err);
      }
    });
  }

  submit() {
    if (this.chapterForm.invalid) return;

    const dto: CreateUpdateChapterDto = this.chapterForm.value;
    this.loading = true;

    this.chapterService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/chapters']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }
}
