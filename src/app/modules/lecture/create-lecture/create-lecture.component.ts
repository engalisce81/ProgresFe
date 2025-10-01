import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChapterService } from '@proxy/chapters';
import { CourseService } from '@proxy/courses';
import { LectureService, CreateUpdateLectureDto } from '@proxy/lectures';
import { LookupDto } from '@proxy/look-up';
import { MediaItemService } from '@proxy/media-items/media-item.service';

@Component({
  selector: 'app-create-lecture',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './create-lecture.component.html',
  styleUrl: './create-lecture.component.scss'
})
export class CreateLectureComponent {
lectureForm: FormGroup;
  loading = false;
  chapters: LookupDto[] = [];
  courses: LookupDto[] = [];

  pdfFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private lectureService: LectureService,
    private chapterService: ChapterService,
    private mediaItemService: MediaItemService,
    private courseService: CourseService,
    private router: Router
  ) {
    this.lectureForm = this.fb.group({
      title: ['', Validators.required],
      courseId: ['', Validators.required], // جديد: الكورس لازم يتحدد
      chapterId: [{ value: '', disabled: true }, Validators.required], // disabled by default
      content: [''],
      videoUrl: [''],
      pdfUrl: [''],
      quizTime: [0, [Validators.required, Validators.min(1)]],
      quizTryCount: [0, [Validators.required, Validators.min(1)]],
      quizCount: [0, [Validators.required, Validators.min(1)]],
      isVisible: [true]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getMyCoursesLookUp().subscribe({
      next: (res) => { this.courses = res.items },
      error: (err) => console.error('Error loading courses', err)
    });
  }

  onCourseChange(event: any) {
    const courseId = event.target.value;

    if (!courseId) {
      this.chapters = [];
      this.lectureForm.get('chapterId')?.reset();
      this.lectureForm.get('chapterId')?.disable();
      return;
    }

    this.chapterService.getChaptersByCourseLookUp(courseId).subscribe({
      next: (res) => {
        this.chapters = res.items;
        this.lectureForm.get('chapterId')?.enable();
      },
      error: (err) => console.error('Error loading chapters', err)
    });
  }

  onPdfSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.pdfFile = event.target.files[0];
    }
  }

  submit() {
    if (this.lectureForm.invalid) return;
    this.loading = true;

    if (this.pdfFile) {
      this.mediaItemService.uploadImage(this.pdfFile).subscribe({
        next: (uploadResult) => {
          this.lectureForm.patchValue({ pdfUrl: uploadResult.data });
          this.createLecture();
        },
        error: (err) => {
          this.loading = false;
          alert('Error uploading PDF: ' + err.message);
        }
      });
    } else {
      this.lectureForm.patchValue({ pdfUrl: '' });
      this.createLecture();
    }
  }

  private createLecture() {
    const dto: CreateUpdateLectureDto = {
      title: this.lectureForm.value.title,
      chapterId: this.lectureForm.value.chapterId,
      content: this.lectureForm.value.content || '',
      videoUrl: this.lectureForm.value.videoUrl || '',
      pdfUrl: this.lectureForm.value.pdfUrl,
      quizTime: this.lectureForm.value.quizTime,
      quizTryCount: this.lectureForm.value.quizTryCount,
      quizCount: this.lectureForm.value.quizCount,
      isVisible: this.lectureForm.value.isVisible
    };

    this.lectureService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/lectures']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error creating lecture: ' + err.message);
      }
    });
  }
}
