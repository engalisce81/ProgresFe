import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { LookupDto } from '@proxy/look-up';
import { SubjectService, CreateUpdateSubjectDto, CollegeService, UniversityService } from '@proxy/universites';

@Component({
  selector: 'app-update-subject',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './update-subject.component.html',
  styleUrl: './update-subject.component.scss'
})

export class UpdateSubjectComponent {
  subjectForm: FormGroup;
  loading = false;

  universities: LookupDto[] = [];
  colleges: LookupDto[] = [];
  gradeLevels: LookupDto[] = [];
  terms: LookupDto[] = [];

  subjectId!: string;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private universityService: UniversityService,
    private collegeService: CollegeService,
    private route: ActivatedRoute,
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
    this.subjectId = this.route.snapshot.paramMap.get('id')!;
    this.loadUniversities();
    this.loadTerms();
    this.loadSubject();
  }

  loadUniversities() {
    this.universityService.getUniversitysList().subscribe({
      next: (res) => this.universities = res.items,
      error: (err) => console.error('Error loading universities', err)
    });
  }

  loadSubject() {
    this.subjectService.get(this.subjectId).subscribe({
      next: (subject) => {
        this.subjectForm.patchValue(subject.data);

       if (subject.data.universityId) {
         this.onUniversityChange(subject.data.universityId, true);}
      },
      error: (err) => console.error('Error loading subject', err)
    });
  }

  onUniversityChange(universityId: string, isEdit = false) {
    this.colleges = [];
    this.gradeLevels = [];
    this.subjectForm.patchValue({ collegeId: '', gradeLevelId: '' });

    if (!universityId) return;

    this.collegeService.getCollegesList(universityId).subscribe({
      next: (res) => {
        this.colleges = res.items;

        // لو تحديث: نعيد تحميل الـ GradeLevels
        if (isEdit) {
          const colId = this.subjectForm.get('collegeId')?.value;
          if (colId) this.onCollegeChange(colId, true);
        }
      },
      error: (err) => console.error('Error loading colleges', err)
    });
  }

  onCollegeChange(collegeId: string, isEdit = false) {
    this.gradeLevels = [];
    this.subjectForm.patchValue({ gradeLevelId: '' });

    if (!collegeId) return;

    this.collegeService.getGradeLevelList(collegeId).subscribe({
      next: (res) => {
        this.gradeLevels = res.items;

        // لو تحديث: نخلي الـ grade level يتملأ
        if (isEdit) {
          const gradeId = this.subjectForm.get('gradeLevelId')?.value;
          if (gradeId) {
            this.subjectForm.patchValue({ gradeLevelId: gradeId });
          }
        }
      },
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

    this.subjectService.update(this.subjectId, dto).subscribe({
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
