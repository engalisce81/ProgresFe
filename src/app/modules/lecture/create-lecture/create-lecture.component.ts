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
  pdfFiles: File[] = []; // ✅ الآن يمكن رفع عدة ملفات متراكمة

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
      content: ['', Validators.required],
      courseId: ['', Validators.required],
      chapterId: [{ value: '', disabled: true }, Validators.required],
      videoUrl: [''],
      quizTime: [0, [Validators.required, Validators.min(1)]],
      quizTryCount: [0, [Validators.required, Validators.min(1)]],
      quizCount: [0, [Validators.required, Validators.min(1)]],
      isVisible: [true],
      isFree:[false]
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

 onPdfSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const newFiles = Array.from(input.files);
  this.pdfFiles.push(...newFiles); // نضيف الملفات الجديدة بدون حذف القديمة
  input.value = ''; // نفرغ الـ input علشان يسمح باختيار نفس الملف تاني لو احتجت
}


  /** ✅ حذف ملف من الليست قبل الإرسال */
  removePdf(index: number) {
    this.pdfFiles.splice(index, 1);
  }

  submit() {
    if (this.lectureForm.invalid) return;
    this.loading = true;

    if (this.pdfFiles.length > 0) {
      this.mediaItemService.uploadImages(this.pdfFiles).subscribe({
        next: (uploadResult) => {
          this.createLecture(uploadResult.items);
        },
        error: (err) => {
          this.loading = false;
          alert('Error uploading PDFs: ' + err.message);
        }
      });
    } else {
      this.createLecture([]);
    }
  }

  private createLecture(pdfUrls: string[]) {
    const dto: CreateUpdateLectureDto = {
      title: this.lectureForm.value.title,
      chapterId: this.lectureForm.value.chapterId,
      content: this.lectureForm.value.content || '',
      videoUrl: this.lectureForm.value.videoUrl || '',
      pdfUrls: pdfUrls,
      quizTime: this.lectureForm.value.quizTime,
      quizTryCount: this.lectureForm.value.quizTryCount,
      quizCount: this.lectureForm.value.quizCount,
      isVisible: this.lectureForm.value.isVisible,
      isFree: this.lectureForm.value.isFree // ✅ أضفناها هنا
      ,successQuizRate:80
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
