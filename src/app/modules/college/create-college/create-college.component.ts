import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LookupDto } from '@proxy/look-up';
import { CollegeService, CreateUpdateCollegeDto, UniversityService } from '@proxy/universites';

@Component({
  selector: 'app-create-college',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-college.component.html',
  styleUrl: './create-college.component.scss'
})
export class CreateCollegeComponent {
 collegeForm: FormGroup;
  loading = false;
  universities: LookupDto[] = [];

  constructor(
    private fb: FormBuilder,
    private collegeService: CollegeService,
    private universityService: UniversityService,
    private router: Router
  ) {
    this.collegeForm = this.fb.group({
      name: ['', Validators.required],
      universityId: ['', Validators.required],
      gradeLevelCount: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities() {
    this.universityService.getUniversitysList().subscribe({
      next: (res) => {
        this.universities = res.items;
      },
      error: (err) => {
        console.error('Error loading universities', err);
      }
    });
  }

  submit() {
    if (this.collegeForm.invalid) return;
    const dto: CreateUpdateCollegeDto = this.collegeForm.value;
    this.loading = true;

    this.collegeService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/colleges']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }
}
