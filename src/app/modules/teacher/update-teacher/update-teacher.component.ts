import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupDto } from '@proxy/look-up';
import { TeacherService, CreateUpdateTeacherDto } from '@proxy/teachers';
import { UniversityService, CollegeService } from '@proxy/universites';

@Component({
  selector: 'app-update-teacher',
  imports: [ReactiveFormsModule],
  templateUrl: './update-teacher.component.html',
  styleUrl: './update-teacher.component.scss'
})
export class UpdateTeacherComponent {
 teacherForm: FormGroup;
  loading = false;
  teacherId!: string;

  universities: LookupDto[] = [];
  colleges: LookupDto[] = [];
  departments: LookupDto[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService,
    private universityService: UniversityService,
    private collegeService: CollegeService,
  ) {
    this.teacherForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      password: [''], // optional for update
      gender: ['', Validators.required],
      universityId: ['', Validators.required],
      collegeId: ['', Validators.required],
      departmentId: ['', Validators.required],
      accountTypeKey: [2], // 2 = Teacher
      teacherMobileIP: ['']
    });
  }

  ngOnInit(): void {
    this.teacherId = this.route.snapshot.paramMap.get('id')!;
    this.loadUniversities();
    this.loadTeacher();

    this.teacherForm.get('universityId')?.valueChanges.subscribe((universityId) => {
      if (universityId) {
        this.loadColleges(universityId);
        this.teacherForm.patchValue({ collegeId: '', departmentId: '' });
        this.colleges = [];
        this.departments = [];
      }
    });

    this.teacherForm.get('collegeId')?.valueChanges.subscribe((collegeId) => {
      if (collegeId) {
        this.teacherForm.patchValue({ departmentId: '' });
        this.departments = [];
      }
    });
  }

  loadTeacher() {
    this.loading = true;
    this.teacherService.get(this.teacherId).subscribe({
      next: (teacher) => {
        this.loading = false;
        this.teacherForm.patchValue({
          fullName: teacher.data.fullName,
          userName: teacher.data.userName,
          gender: teacher.data.gender,
          universityId: teacher.data.universityId,
          collegeId: teacher.data.collegeId,
        });

        this.loadColleges(teacher.data.universityId);
      },
      error: (err) => {
        this.loading = false;
        alert('Error loading teacher: ' + err.message);
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

    this.teacherService.update(this.teacherId, dto).subscribe({
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
