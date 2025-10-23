import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GradeLevelService, CreateUpdateGradeLevelDto } from '@proxy/dev/acadmy/universites';

@Component({
  selector: 'app-update-gradelevel',
  imports: [ReactiveFormsModule ,RouterLink],
  templateUrl: './update-gradelevel.component.html',
  styleUrl: './update-gradelevel.component.scss'
})
export class UpdateGradelevelComponent implements OnInit {
  gradeLevelForm: FormGroup;
  loading = false;
  gradeLevelId!: string;
  collegeId!: string;

  constructor(
    private fb: FormBuilder,
    private gradeLevelService: GradeLevelService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.gradeLevelForm = this.fb.group({
      name: ['', Validators.required],
            collegeName:['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('gradeId');
      const collegeId = params.get('id');

      if (!id || !collegeId) {
        alert('Missing parameters.');
        this.router.navigate(['/colleges']);
        return;
      }

      this.gradeLevelId = id;
      this.collegeId = collegeId;
      this.loadGradeLevel();
    });
  }

  loadGradeLevel() {
    this.loading = true;
    this.gradeLevelService.get(this.gradeLevelId).subscribe({
      next: (gradeLevel) => {
        this.gradeLevelForm.patchValue({
          name: gradeLevel.data.name,
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Error loading grade level: ' + err.message);
      }
    });
  }

  submit() {
    if (this.gradeLevelForm.invalid) return;

    const dto: CreateUpdateGradeLevelDto = {
      ...this.gradeLevelForm.value,
      collegeId: this.collegeId
    };

    this.loading = true;

    this.gradeLevelService.update(this.gradeLevelId, dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/colleges/gradelevel', this.collegeId]);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Error updating grade level: ' + err.message);
      }
    });
  }
}
