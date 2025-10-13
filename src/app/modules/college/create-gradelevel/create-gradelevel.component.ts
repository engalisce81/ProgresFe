import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GradeLevelService, CreateUpdateGradeLevelDto } from '@proxy/universites';

@Component({
  selector: 'app-create-gradelevel',
  imports: [ReactiveFormsModule ,RouterLink],
  templateUrl: './create-gradelevel.component.html',
  styleUrl: './create-gradelevel.component.scss'
})
export class CreateGradelevelComponent implements OnInit {
 gradeLevelForm: FormGroup;
  loading = false;
  collegeId!: string;

  constructor(
    private fb: FormBuilder,
    private gradeLevelService: GradeLevelService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // إنشاء الـ FormGroup
    this.gradeLevelForm = this.fb.group({
      name: ['', Validators.required],
      collegeName:['']
    });
  }

  ngOnInit(): void {
    // جلب collegeId من الـ route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.collegeId = id;
      } else {
        alert('College ID not found.');
        this.router.navigate(['/colleges']);
      }
    });
  }

  submit() {
    if (this.gradeLevelForm.invalid || !this.collegeId) return;

    const dto: CreateUpdateGradeLevelDto = {
      ...this.gradeLevelForm.value,
      collegeId: this.collegeId
    };

    this.loading = true;

    this.gradeLevelService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/colleges/gradelevel', this.collegeId]);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Error: ' + err.message);
      }
    });
  }
}
