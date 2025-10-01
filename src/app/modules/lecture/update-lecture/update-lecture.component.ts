import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ChapterService } from '@proxy/chapters';
import { LectureService, CreateUpdateLectureDto } from '@proxy/lectures';
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
  courses: LookupDto[] = [];
  chapters: LookupDto[] = [];
  pdfFile: File | null = null;
  lectureId!: string;

  constructor(
    private fb: FormBuilder,
    private lectureService: LectureService,
    private chapterService: ChapterService,
    private courseService: CourseService,
    private mediaItemService: MediaItemService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.lectureForm = this.fb.group({
      title: ['', Validators.required],
      courseId: ['', Validators.required],
      chapterId: ['', Validators.required],
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
    this.lectureId = this.route.snapshot.paramMap.get('id')!;
    this.loadCourses();
    this.loadLecture();
  }

  loadCourses() {
    this.courseService.getMyCoursesLookUp().subscribe({
      next: (res) => this.courses = res.items,
      error: (err) => console.error('Error loading courses', err)
    });
  }

  onCourseChange() {
    const courseId = this.lectureForm.get('courseId')?.value;
    if (!courseId) {
      this.chapters = [];
      this.lectureForm.patchValue({ chapterId: '' });
      return;
    }

    this.chapterService.getChaptersByCourseLookUp(courseId).subscribe({
      next: (res) => this.chapters = res.items,
      error: (err) => console.error('Error loading chapters', err)
    });
  }

  loadLecture() {
    this.loading = true;
    this.lectureService.get(this.lectureId).subscribe({
      next: (lec) => {
        this.lectureForm.patchValue({
          title: lec.data.title,
          courseId: lec.data.courseId,
          chapterId: lec.data.chapterId,
          content: lec.data.content,
          videoUrl: lec.data.videoUrl,
          pdfUrl: lec.data.pdfUrl,
          quizTime: lec.data.quizTime,
          quizTryCount: lec.data.quizTryCount,
          quizCount: 0,
          isVisible: lec.data.isVisible
        });

        if (lec.data.courseId) {
          this.chapterService.getChaptersByCourseLookUp(lec.data.courseId).subscribe({
            next: (res) => this.chapters = res.items
          });
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading lecture', err);
        this.loading = false;
      }
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
          this.updateLecture();
        },
        error: (err) => {
          this.loading = false;
          alert('Error uploading PDF: ' + err.message);
        }
      });
    } else {
      this.updateLecture();
    }
  }

  private updateLecture() {
    const dto: CreateUpdateLectureDto = this.lectureForm.value;

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
