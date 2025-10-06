import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CourseDto, CourseService, CreateUpdateCourseDto } from '@proxy/courses';
import { LookupDto } from '@proxy/look-up';
import { MediaItemService } from '@proxy/media-items';
import { CollegeService, SubjectService } from '@proxy/universites';

@Component({
  selector: 'app-update-course',
  imports: [ReactiveFormsModule , RouterLink ],
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.scss'
})
export class UpdateCourseComponent implements OnInit{
 courseForm: FormGroup;
  loading = false;
  subjects: LookupDto[] = [];
  logoFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;
  courseId!: string;
  courseLoaded = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private subjectService: SubjectService,
    private uploadService: MediaItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, this.nonEmptyValidator]],
      title: ['', [Validators.required, this.nonEmptyValidator]],
      description: ['',[Validators.required, this.nonEmptyValidator]],
      price: [0, [Validators.required, Validators.min(0)]],
      subjectId: ['', Validators.required],
      isActive: [true],
      isLifetime: [false],
      durationInDays: [0],
      logoFile: [null],
      infos: this.fb.array([], [Validators.required, this.infosArrayValidator])
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.loadSubjects();
    this.loadCourseData();
  }

  // Custom validator للتحقق من أن الحقل ليس فارغاً أو مسافات فقط
  nonEmptyValidator(control: any) {
    const value = control.value;
    if (value && value.trim().length === 0) {
      return { 'empty': true };
    }
    return null;
  }

  // Custom validator للتحقق من أن كل info غير فارغ وأن هناك info واحدة على الأقل
  infosArrayValidator(control: FormArray) {
    if (control.length === 0) {
      return { 'noInfos': true };
    }

    const hasEmptyInfo = control.controls.some(
      infoControl => !infoControl.value || infoControl.value.trim().length === 0
    );
    
    if (hasEmptyInfo) {
      return { 'emptyInfo': true };
    }

    return null;
  }

  get infos(): FormArray {
    return this.courseForm.get('infos') as FormArray;
  }

  addInfo() {
    this.infos.push(this.fb.control('', [Validators.required, this.nonEmptyValidator]));
    // تحديث صحة النموذج بعد إضافة info جديدة
    this.courseForm.updateValueAndValidity();
  }

  removeInfo(index: number) {
    if (this.infos.length > 1) {
      this.infos.removeAt(index);
      // تحديث صحة النموذج بعد إزالة info
      this.courseForm.updateValueAndValidity();
    } else {
      alert('At least one info is required.');
    }
  }

  // دالة للتحقق من صحة الحقول المطلوبة
  areRequiredFieldsValid(): boolean {
    const basicFieldsValid = 
      this.courseForm.get('name')?.valid &&
      this.courseForm.get('title')?.valid &&
      this.courseForm.get('price')?.valid &&
      this.courseForm.get('description')?.valid &&
      this.courseForm.get('subjectId')?.valid;

    const infosValid = this.infos.valid && this.infos.length > 0;

    return !!(basicFieldsValid && infosValid);
  }

  // دالة للتحقق من صحة حقل معين
  isFieldInvalid(fieldName: string): boolean {
    const field = this.courseForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // دالة للحصول على رسالة الخطأ
  getFieldError(fieldName: string): string {
    const field = this.courseForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    
    if (errors['required']) return 'This field is required';
    if (errors['empty']) return 'This field cannot be empty';
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    
    return 'Invalid value';
  }

  loadSubjects() {
    this.subjectService.getSubjectsWithCollegeList().subscribe(res => {
      this.subjects = res.items;
    });
  }

  loadCourseData() {
    this.courseService.get(this.courseId).subscribe({
      next: (course) => {
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

        this.logoPreview = course.data.logoUrl || null;

        this.infos.clear();
        if (course.data.infos && course.data.infos.length > 0) {
          course.data.infos.forEach(info => {
            this.infos.push(this.fb.control(info, [Validators.required, this.nonEmptyValidator]));
          });
        } else {
          this.infos.push(this.fb.control('', [Validators.required, this.nonEmptyValidator]));
        }

        this.courseLoaded = true;
        this.courseForm.updateValueAndValidity();
      },
      error: (err) => {
        alert('Error loading course: ' + err.message);
        this.courseLoaded = true;
      }
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
    this.courseForm.markAllAsTouched();

    if (this.courseForm.invalid || !this.areRequiredFieldsValid()) {
      alert('Please fill all required fields with valid values.');
      return;
    }

    this.loading = true;

    const handleUpdate = (logoUrl?: string) => {
      const dto: CreateUpdateCourseDto = {
        ...this.courseForm.value,
        logoUrl: logoUrl || (this.logoPreview as string) || '',
        infos: this.infos.value.filter((i: string) => i && i.trim() !== '')
      };

     // delete dto.logoUrl;

      this.courseService.update(this.courseId, dto).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/courses']);
        },
        error: (err) => {
          this.loading = false;
          alert('Error updating course: ' + err.message);
        }
      });
    };

    if (this.logoFile) {
      this.uploadService.uploadImage(this.logoFile).subscribe({
        next: (res) => handleUpdate(res.data),
        error: (err) => {
          this.loading = false;
          alert('Error uploading logo: ' + err.message);
        }
      });
    } else {
      handleUpdate();
    }
  }
}

