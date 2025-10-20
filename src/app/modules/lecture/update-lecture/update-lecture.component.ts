import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ChapterService } from '@proxy/chapters';
import { LectureService, CreateUpdateLectureDto, LectureDto } from '@proxy/lectures';
import { LookupDto } from '@proxy/look-up';
import { MediaItemService } from '@proxy/media-items';
import { CourseService } from '@proxy/courses';

@Component({
  selector: 'app-update-lecture',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './update-lecture.component.html',
  styleUrl: './update-lecture.component.scss'
})
export class UpdateLectureComponent {
 lectureForm: FormGroup;
  loading = false;
  lectureId!: string;
  lectureData!: LectureDto;

  courses: LookupDto[] = [];
  chapters: LookupDto[] = [];

  pdfFiles: File[] = []; // ملفات جديدة
  existingPdfs: string[] = []; // روابط PDF القديمة

  constructor(
    private fb: FormBuilder,
    private lectureService: LectureService,
    private chapterService: ChapterService,
    private courseService: CourseService,
    private mediaItemService: MediaItemService,
    private route: ActivatedRoute,
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
    this.lectureId = this.route.snapshot.params['id'];
    this.loadCourses();
    this.loadLecture();
  }

  loadLecture() {
    this.loading = true;
    this.lectureService.get(this.lectureId).subscribe({
      next: (lec) => {
        this.lectureData = lec.data;
        this.lectureForm.patchValue({
          title: lec.data.title,
          content: lec.data.content,
          courseId: lec.data.courseId,
          chapterId: lec.data.chapterId,
          videoUrl: lec.data.videoUrl,
          quizTime: lec.data.quizTime,
          quizTryCount: lec.data.quizTryCount,
          quizCount: lec.data.quizCount,
          isVisible: lec.data.isVisible,
          isFree:lec.data.isFree
        });

        this.existingPdfs = lec.data.pdfUrls || [];
        this.loading = false;

        // تحميل الشابترز بناءً على الكورس
        if (lec.data.courseId) {
          this.chapterService.getChaptersByCourseLookUp(lec.data.courseId).subscribe({
            next: (res) => {
              this.chapters = res.items;
              this.lectureForm.get('chapterId')?.enable();
            }
          });
        }
      },
      error: () => (this.loading = false)
    });
  }

  loadCourses() {
    this.courseService.getMyCoursesLookUp().subscribe({
      next: (res) => (this.courses = res.items),
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
    this.pdfFiles.push(...newFiles);
    input.value = '';
  }

  removeExistingPdf(index: number) {
    this.existingPdfs.splice(index, 1);
  }

  removeNewPdf(index: number) {
    this.pdfFiles.splice(index, 1);
  }

  submit() {
    if (this.lectureForm.invalid) return;
    this.loading = true;

    if (this.pdfFiles.length > 0) {
      this.mediaItemService.uploadImages(this.pdfFiles).subscribe({
        next: (uploadResult) => {
          const newPdfUrls = uploadResult.items;
          const mergedUrls = [...this.existingPdfs, ...newPdfUrls];
          this.updateLecture(mergedUrls);
        },
        error: (err) => {
          this.loading = false;
          alert('Error uploading PDFs: ' + err.message);
        }
      });
    } else {
      this.updateLecture(this.existingPdfs);
    }
  }

  private updateLecture(pdfUrls: string[]) {
    const dto: CreateUpdateLectureDto = {
      title: this.lectureForm.value.title,
      content: this.lectureForm.value.content,
      chapterId: this.lectureForm.value.chapterId,
      videoUrl: this.lectureForm.value.videoUrl,
      quizTime: this.lectureForm.value.quizTime,
      quizTryCount: this.lectureForm.value.quizTryCount,
      quizCount: this.lectureForm.value.quizCount,
      isVisible: this.lectureForm.value.isVisible,
      pdfUrls: pdfUrls,
      isFree: this.lectureForm.value.isFree
    };

    this.lectureService.update(this.lectureId, dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/lectures']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error updating lecture: ' + err.message);
      }
    });
  }

}
