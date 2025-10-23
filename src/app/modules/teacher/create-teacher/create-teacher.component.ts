import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { TeacherService, CreateUpdateTeacherDto } from '@proxy/dev/acadmy/teachers';
import { UniversityService, CollegeService } from '@proxy/dev/acadmy/universites';


@Component({
  selector: 'app-create-teacher',
  imports: [ReactiveFormsModule ,RouterLink],
  templateUrl: './create-teacher.component.html',
  styleUrl: './create-teacher.component.scss'
})
export class CreateTeacherComponent {
teacherForm: FormGroup;
  loading = false;

  universities: LookupDto[] = [];
  colleges: LookupDto[] = [];

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private universityService: UniversityService,
    private collegeService: CollegeService,
    private router: Router
  ) {
    this.teacherForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      universityId: ['', Validators.required],
      collegeId: ['', Validators.required],
      accountTypeKey: [2] // 2 = Teacher
    });
  }

  ngOnInit(): void {
    this.loadUniversities();

    // 🟢 عند تغيير الجامعة، حمّل الكليات
    this.teacherForm.get('universityId')?.valueChanges.subscribe((universityId) => {
      if (universityId) {
        this.loadColleges(universityId);
        this.colleges = [];
        this.teacherForm.patchValue({ collegeId: '' });
      }
    });
  }

  loadUniversities() {
    this.universityService.getUniversitysList().subscribe({
      next: (res) => (this.universities = res.items),
      error: (err) => console.error('Error loading universities', err)
    });
  }

  loadColleges(universityId: string) {
    this.collegeService.getCollegesList(universityId).subscribe({
      next: (res) => (this.colleges = res.items),
      error: (err) => console.error('Error loading colleges', err)
    });
  }

  submit() {
    if (this.teacherForm.invalid) return;

    const dto: CreateUpdateTeacherDto = this.teacherForm.value;
    this.loading = true;

    this.teacherService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/teachers']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }
}
