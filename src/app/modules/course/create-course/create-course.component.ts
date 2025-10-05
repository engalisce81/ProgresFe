import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from '@proxy/courses';
import { CreateUpdateCourseDto } from '@proxy/courses/models';
import { LookupDto } from '@proxy/look-up';
import { MediaItemService } from '@proxy/media-items';
import { CollegeService, SubjectService } from '@proxy/universites';

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
      isActive: [true],
      isLifetime: [false],
      durationInDays: [0],
      logoFile: [null, Validators.required],
      infos: this.fb.array([this.fb.control('', Validators.required)]) // لازم واحدة على الأقل
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  get infos(): FormArray {
    return this.courseForm.get('infos') as FormArray;
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
    if (this.courseForm.invalid || !this.logoFile) {
      alert('Please fill all required fields and select a logo.');
      return;
    }

    this.loading = true;

    this.uploadService.uploadImage(this.logoFile).subscribe({
      next: (res) => {
        const dto: CreateUpdateCourseDto = {
          ...this.courseForm.value,
          logoUrl: res.data,
          infos: this.infos.value.filter((i: string) => i.trim() !== '')
        };

        if (dto.infos.length === 0) {
          this.loading = false;
          alert('At least one info is required.');
          return;
        }

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
      },
      error: (err) => {
        this.loading = false;
        alert('Error uploading logo: ' + err.message);
      }
    });
  }
}
