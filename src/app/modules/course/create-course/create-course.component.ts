import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService, CreateUpdateCourseDto } from '@proxy/dev/acadmy/courses';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { CollegeService, SubjectService } from '@proxy/dev/acadmy/universites';


@Component({
  selector: 'app-create-course',
  imports: [ReactiveFormsModule,RouterLink,FormsModule],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.scss'
})
export class CreateCourseComponent {
courseForm: FormGroup;
  loading = false;
  colleges: LookupDto[] = [];
  subjects: LookupDto[] = [];
pdfFile: File | null = null;
pdfFileName: string | null = null;

  logoFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private collegeService: CollegeService,
    private subjectService: SubjectService,
    private router: Router,
    private uploadService: MediaItemService
  ) {
    this.courseForm = this.fb.group({
  name: ['', Validators.required],
  title: ['', Validators.required],
  description: [''],
  price: [0, [Validators.required, Validators.min(0)]],
  subjectId: ['', Validators.required],
  introductionVideoUrl:[""],
  isActive: [true],
  isLifetime: [false],
  durationInDays: [0],
  isPdf: [false], // ✅ جديد
  logoFile: [""],
  pdfFile: [""],
  infos: this.fb.array([this.fb.control('', Validators.required)])
});

  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  get infos(): FormArray {
    return this.courseForm.get('infos') as FormArray;
  }
onPdfSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  this.pdfFile = input.files[0];
  this.pdfFileName = this.pdfFile.name;
  this.courseForm.patchValue({ pdfFile: this.pdfFile });
  this.courseForm.get('pdfFile')?.updateValueAndValidity();
}

  addInfo() {
    this.infos.push(this.fb.control('', Validators.required));
  }

  removeInfo(index: number) {
    if (this.infos.length > 1) {
      this.infos.removeAt(index);
    } else {
      alert('At least one info is required.');
    }
  }

  loadSubjects() {
    this.subjectService.getSubjectsWithCollegeList().subscribe(res => {
      this.subjects = res.items;
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

  const isPdf = this.courseForm.get('isPdf')?.value;

  this.loading = true;

  const uploadTasks: Promise<string>[] = [];

  // ✅ رفع الصورة لو موجودة
  if (this.logoFile) {
    const logoUpload = this.uploadService.uploadImage(this.logoFile).toPromise().then(res => res.data);
    uploadTasks.push(logoUpload);
  } else {
    uploadTasks.push(Promise.resolve(''));
  }

  // ✅ رفع PDF لو هو كورس PDF
  if (isPdf && this.pdfFile) {
    const pdfUpload = this.uploadService.uploadImage(this.pdfFile).toPromise().then(res => res.data);
    uploadTasks.push(pdfUpload);
  } else {
    uploadTasks.push(Promise.resolve(''));
  }

  Promise.all(uploadTasks).then(([logoUrl, pdfUrl]) => {
    const dto: CreateUpdateCourseDto = {
      ...this.courseForm.value,
      logoUrl,
      pdfUrl,
      infos: this.infos.value.filter((i: string) => i.trim() !== '')
    };

    this.courseService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error creating course: ' + err.message);
      }
    });
  }).catch(err => {
    this.loading = false;
    alert('Upload error: ' + err.message);
  });
}

}
