import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService, CreateUpdateCourseDto } from '@proxy/courses';
import { LookupDto } from '@proxy/look-up';
import { MediaItemService } from '@proxy/media-items';
import { CollegeService, SubjectService } from '@proxy/universites';

@Component({
  selector: 'app-update-course',
  imports: [ReactiveFormsModule],
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.scss'
})
export class UpdateCourseComponent {
 courseForm: FormGroup;
  loading = false;
  colleges: LookupDto[] = [];
  subjects: LookupDto[] = [];
  courseId!: string;

  logoFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;
  existingLogoUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private collegeService: CollegeService,
    private subjectService: SubjectService,
    private router: Router,
    private route: ActivatedRoute,
    private uploadService: MediaItemService
  ) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      subjectId: ['', Validators.required],
      isActive: [true],
      isLifetime: [false],
      durationInDays: [0],
      logoFile: [null] // ليس إلزاميًا في التحديث
    });
  }

  ngOnInit(): void {
    this.loadSubjects();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.courseId = id;
        this.loadCourse(id);
      }
    });
  }

 
  

  loadSubjects() {
    this.subjectService.getSubjectsWithCollegeList().subscribe(res => {
      this.subjects = res.items;
    });
  }

  loadCourse(id: string) {
    this.courseService.get(id).subscribe(course => {
      this.courseForm.patchValue({
        name: course.data.name,
        title: course.data.title,
        description: course.data.description,
        price: course.data.price,
        subjectId: course.data.subjectId,
        isActive: course.data.isActive,
        isLifetime: course.data.isLifetime,
        durationInDays: course.data.durationInDays
      });
      this.existingLogoUrl = course.data.logoUrl || null;
      this.logoPreview = this.existingLogoUrl;
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.logoFile = input.files[0];
    this.courseForm.patchValue({ logoFile: this.logoFile });
    this.courseForm.get('logoFile')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = e => this.logoPreview = e.target?.result;
    reader.readAsDataURL(this.logoFile);
  }

  submit() {
    if (this.courseForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    this.loading = true;

    const sendUpdate = (logoUrl?: string) => {
      const dto: CreateUpdateCourseDto = {
        ...this.courseForm.value,
        logoUrl: logoUrl || this.existingLogoUrl
      };
      this.courseService.update(this.courseId, dto).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/courses']);
        },
        error: err => {
          this.loading = false;
          alert('Error updating course: ' + err.message);
        }
      });
    };

    // إذا المستخدم اختار صورة جديدة، نرفعها أولاً
    if (this.logoFile) {
      this.uploadService.uploadImage(this.logoFile).subscribe({
        next: res => sendUpdate(res.data),
        error: err => {
          this.loading = false;
          alert('Error uploading logo: ' + err.message);
        }
      });
    } else {
      // لا توجد صورة جديدة، استخدم الحالية
      sendUpdate();
    }
  }
}
