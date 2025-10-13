import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { LookupDto } from '@proxy/look-up';
import { CollegeService, UniversityService, CreateUpdateCollegeDto } from '@proxy/universites';

@Component({
  selector: 'app-update-college',
  imports: [ReactiveFormsModule ,RouterLink],
  templateUrl: './update-college.component.html',
  styleUrl: './update-college.component.scss'
})
export class UpdateCollegeComponent {
collegeForm: FormGroup;
  loading = false;
  universities: LookupDto[] = [];
  collegeId!: string;

  constructor(
    private fb: FormBuilder,
    private collegeService: CollegeService,
    private universityService: UniversityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.collegeForm = this.fb.group({
      name: ['', Validators.required],
      universityId: ['', Validators.required],
      gradeLevelCount: [0],
    });
  }

  ngOnInit(): void {
    this.collegeId = this.route.snapshot.paramMap.get('id')!;
    this.loadUniversities();
    this.loadCollege();
  }

  loadUniversities() {
    this.universityService.getUniversitysList().subscribe({
      next: (res) => (this.universities = res.items),
      error: (err) => console.error('Error loading universities', err),
    });
  }

  loadCollege() {
    this.collegeService.get(this.collegeId).subscribe({
      next: (college) => {
        this.collegeForm.patchValue({
          name: college.data.name,
          universityId: college.data.universityId,
        });
      },
      error: (err) => console.error('Error loading college', err),
    });
  }

  submit() {
    if (this.collegeForm.invalid) return;
    const dto: CreateUpdateCollegeDto = this.collegeForm.value;
    this.loading = true;

    this.collegeService.update(this.collegeId, dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/colleges']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      },
    });
  }
}
