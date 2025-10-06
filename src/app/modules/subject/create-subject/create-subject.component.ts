import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LookupDto } from '@proxy/look-up';
import { SubjectService, CreateUpdateSubjectDto, CollegeService, UniversityService } from '@proxy/universites';

@Component({
  selector: 'app-create-subject',
  imports: [ReactiveFormsModule ,RouterLink],
  templateUrl: './create-subject.component.html',
  styleUrl: './create-subject.component.scss'
})
export class CreateSubjectComponent {
subjectForm: FormGroup;
  loading = false;

  universities: LookupDto[] = [];
  colleges: LookupDto[] = [];
  gradeLevels: LookupDto[] = [];
  terms: LookupDto[] = [];

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private universityService: UniversityService,
    private collegeService: CollegeService,
    private router: Router,
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      universityId: ['', Validators.required],
      collegeId: ['', Validators.required],
      gradeLevelId: ['', Validators.required],
      termId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUniversities();
    this.loadTerms();
  }

  loadUniversities() {
    this.universityService.getUniversitysList().subscribe({
      next: (res) => this.universities = res.items,
      error: (err) => console.error('Error loading universities', err)
    });
  }

  onUniversityChange(universityId: string) {
    this.colleges = [];
    this.gradeLevels = [];
    this.subjectForm.patchValue({ collegeId: '', gradeLevelId: '' });

    if (!universityId) return;

    this.collegeService.getCollegesList(universityId).subscribe({
      next: (res) => this.colleges = res.items,
      error: (err) => console.error('Error loading colleges', err)
    });
  }

  onCollegeChange(collegeId: string) {
    this.gradeLevels = [];
    this.subjectForm.patchValue({ gradeLevelId: '' });

    if (!collegeId) return;

    this.collegeService.getGradeLevelList(collegeId).subscribe({
      next: (res) => this.gradeLevels = res.items,
      error: (err) => console.error('Error loading grade levels', err)
    });
  }

  loadTerms() {
    this.collegeService.getTermList().subscribe({
      next: (res) => this.terms = res.items,
      error: (err) => console.error('Error loading terms', err)
    });
  }

  submit() {
    if (this.subjectForm.invalid) return;
    const dto: CreateUpdateSubjectDto = this.subjectForm.value;
    this.loading = true;

    this.subjectService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/subjects']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }
}
