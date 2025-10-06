import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UniversityService, CreateUpdateUniversityDto } from '@proxy/universites';

@Component({
  selector: 'app-update-university',
  imports: [ReactiveFormsModule ,RouterLink],
  templateUrl: './update-university.component.html',
  styleUrl: './update-university.component.scss'
})
export class UpdateUniversityComponent  {
universityForm: FormGroup;
  loading = false;
  universityId!: string;

  constructor(
    private fb: FormBuilder,
    private universityService: UniversityService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.universityForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.universityId = this.route.snapshot.paramMap.get('id')!;
    if (this.universityId) {
      this.loadUniversity();
    }
  }

  loadUniversity() {
    this.loading = true;
    this.universityService.get(this.universityId).subscribe({
      next: (university) => {
        this.universityForm.patchValue(university);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert('Failed to load university: ' + err.message);
      }
    });
  }

  update() {
    if (this.universityForm.invalid) return;
    const dto: CreateUpdateUniversityDto = this.universityForm.value;
    this.loading = true;

    this.universityService.update(this.universityId, dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/universties']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error updating university: ' + err.message);
      }
    });
  }
}
