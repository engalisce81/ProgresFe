import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LookupDto } from '@proxy/look-up';
import { StudentService, StudentDto, CreateUpdateStudentDto } from '@proxy/students';
import { UniversityService, CollegeService } from '@proxy/universites';

@Component({
  selector: 'app-update-student',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './update-student.component.html',
  styleUrl: './update-student.component.scss'
})
export class UpdateStudentComponent {

  studentForm: FormGroup;
  loading = false;
  studentId!: string;

  universities: LookupDto[] = [];
  colleges: LookupDto[] = [];
  gradeLevels: LookupDto[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private universityService: UniversityService,
    private collegeService: CollegeService
  ) {
    this.studentForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      password: [''], // password optional for update
      gender: ['', Validators.required],
      universityId: ['', Validators.required],
      collegeId: ['', Validators.required],
      gradeLevelId: ['', Validators.required],
      accountTypeKey: [3],
      studentMobileIP: [''],
      phoneNumber: ['']
    });
  }

  ngOnInit(): void {
    // 🔹 Get studentId from URL
    this.studentId = this.route.snapshot.paramMap.get('id')!;

    // 🔹 Load data
    this.loadUniversities();
    this.loadStudent();

    // 🔹 Handle value changes
    this.studentForm.get('universityId')?.valueChanges.subscribe((universityId) => {
      if (universityId) {
        this.loadColleges(universityId);
        this.studentForm.patchValue({ collegeId: '', gradeLevelId: '' });
        this.colleges = [];
        this.gradeLevels = [];
      }
    });

    this.studentForm.get('collegeId')?.valueChanges.subscribe((collegeId) => {
      if (collegeId) {
        this.loadGradeLevels(collegeId);
        this.studentForm.patchValue({ gradeLevelId: '' });
        this.gradeLevels = [];
      }
    });
  }

  // 🔹 Load existing student data
  loadStudent() {
    this.loading = true;
    this.studentService.get(this.studentId).subscribe({
      next: (student) => {
        this.loading = false;
        this.studentForm.patchValue({
          fullName: student.data.fullName,
          userName: student.data.userName,
          gender: student.data.gender,
          universityId: student.data.universityId,
          collegeId: student.data.collegeId,
          gradeLevelId: student.data.gradeLevelId,
          studentMobileIP: student.data.studentMobileIP,
          phoneNumber: student.data.phoneNumber,

        });

        // preload colleges and grade levels
        this.loadColleges(student.data.universityId);
        this.loadGradeLevels(student.data.collegeId);
      },
      error: (err) => {
        this.loading = false;
        alert('Error loading student: ' + err.message);
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

    this.studentService.update(this.studentId, dto).subscribe({
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
