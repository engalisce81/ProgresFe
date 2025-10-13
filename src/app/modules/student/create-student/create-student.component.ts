import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountcustomService } from '@proxy/account-customs';
import { LookupDto } from '@proxy/look-up';
import { StudentService, CreateUpdateStudentDto } from '@proxy/students';
import { UniversityService, CollegeService, GradeLevelService } from '@proxy/universites';

@Component({
  selector: 'app-create-student',
  imports: [ReactiveFormsModule],
  templateUrl: './create-student.component.html',
  styleUrl: './create-student.component.scss'
})
export class CreateStudentComponent {
studentForm: FormGroup;
  loading = false;

  universities: LookupDto[] = [];
  colleges: LookupDto[] = [];
  gradeLevels: LookupDto[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private universityService: UniversityService,
    private collegeService: CollegeService,
    private gradeLevelService: GradeLevelService,
    private accountCService: AccountcustomService,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      gender: ['', Validators.required],
      universityId: ['', Validators.required],
      collegeId: ['', Validators.required],
      gradeLevelId: ['', Validators.required],
      accountTypeKey: [3],
      studentMobileIP: ['']
    });
  }

  ngOnInit(): void {
    this.loadUniversities();

    // 🟢 عند تغيير الجامعة، حمّل الكليات
    this.studentForm.get('universityId')?.valueChanges.subscribe((universityId) => {
      if (universityId) {
        this.loadColleges(universityId);
        this.colleges = [];
        this.gradeLevels = [];
        this.studentForm.patchValue({ collegeId: '', gradeLevelId: '' });
      }
    });

    // 🟢 عند تغيير الكلية، حمّل المستويات الدراسية
    this.studentForm.get('collegeId')?.valueChanges.subscribe((collegeId) => {
      if (collegeId) {
        this.loadGradeLevels(collegeId);
        this.gradeLevels = [];
        this.studentForm.patchValue({ gradeLevelId: '' });
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

  loadGradeLevels(collegeId: string) {
    this.collegeService.getGradeLevelList(collegeId).subscribe({
      next: (res) => (this.gradeLevels = res.items),
      error: (err) => console.error('Error loading grade levels', err)
    });
  }

  submit() {
    if (this.studentForm.invalid) return;

    const dto: CreateUpdateStudentDto = this.studentForm.value;
    this.loading = true;

    this.studentService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }
}
