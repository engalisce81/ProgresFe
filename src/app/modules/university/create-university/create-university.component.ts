import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UniversityService, CreateUpdateUniversityDto } from '@proxy/universites';

@Component({
  selector: 'app-create-university',
  imports: [ReactiveFormsModule],
  templateUrl: './create-university.component.html',
  styleUrl: './create-university.component.scss'
})
export class CreateUniversityComponent {
universityForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private universityService: UniversityService,
    private router: Router
  ) {
    this.universityForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  submit() {
    if (this.universityForm.invalid) return;
    const dto: CreateUpdateUniversityDto = this.universityForm.value;
    this.loading = true;

    this.universityService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/universties']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }
}
