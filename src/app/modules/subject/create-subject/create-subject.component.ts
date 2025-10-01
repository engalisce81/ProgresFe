import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LookupDto } from '@proxy/look-up';
import { SubjectService, CreateUpdateSubjectDto, CollegeService } from '@proxy/universites';

@Component({
  selector: 'app-create-subject',
  imports: [ReactiveFormsModule],
  templateUrl: './create-subject.component.html',
  styleUrl: './create-subject.component.scss'
})
export class CreateSubjectComponent {
subjectForm: FormGroup;
  loading = false;
  terms: LookupDto[] = [];
  gradeLevels: LookupDto[] = [];

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private gollegeService:CollegeService,
    private router: Router
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      termId: ['', Validators.required],
      gradeLevelId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadLookups();
  }

  loadLookups() {
    this.gollegeService.getTermList().subscribe({
      next: (res) => this.terms = res.items,
      error: (err) => console.error('Error loading terms', err)
    });

    this.gollegeService.getGradeLevelList("3a1ca04e-c99e-70f6-a15e-190f320e8114").subscribe({
      next: (res) => this.gradeLevels = res.items,
      error: (err) => console.error('Error loading grade levels', err)
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
