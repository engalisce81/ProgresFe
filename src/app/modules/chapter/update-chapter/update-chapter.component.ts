import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ChapterService, CreateUpdateChapterDto } from '@proxy/dev/acadmy/chapters';
import { CourseService } from '@proxy/dev/acadmy/courses';
import { LookupDto } from '@proxy/dev/acadmy/look-up';


@Component({
  selector: 'app-update-chapter',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './update-chapter.component.html',
  styleUrl: './update-chapter.component.scss'
})
export class UpdateChapterComponent {
chapterForm: FormGroup;
  loading = false;
  courses: LookupDto[] = [];
  chapterId!: string;

  constructor(
    private fb: FormBuilder,
    private chapterService: ChapterService,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.chapterForm = this.fb.group({
      name: ['', Validators.required],
      courseId: ['', Validators.required],
      isFree: [false] 
    });
  }

  ngOnInit(): void {
    this.chapterId = this.route.snapshot.paramMap.get('id')!;
    this.loadCourses();
    this.loadChapter();
  }

  loadCourses() {
    this.courseService.getCoursesList().subscribe({
      next: (res) => (this.courses = res.items),
      error: (err) => console.error('Error loading courses', err),
    });
  }

  loadChapter() {
    this.chapterService.get(this.chapterId).subscribe({
      next: (chapter) => {
        this.chapterForm.patchValue({
          name: chapter.data.name,
          courseId: chapter.data.courseId,
          isFree:chapter.data.isFree
          
        });
      },
      error: (err) => console.error('Error loading chapter', err),
    });
  }

  submit() {
    if (this.chapterForm.invalid) return;
    const dto: CreateUpdateChapterDto = this.chapterForm.value;
    this.loading = true;

    this.chapterService.update(this.chapterId, dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/chapters']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      },
    });
  }
}
