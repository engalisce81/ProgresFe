import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from '@proxy/dev/acadmy/courses';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { QuestionBankService, CreateUpdateQuestionBankDto } from '@proxy/dev/acadmy/questions';


@Component({
  selector: 'app-creat-questionbank',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './creat-questionbank.component.html',
  styleUrl: './creat-questionbank.component.scss'
})
export class CreatQuestionbankComponent {
 questionBankForm: FormGroup;
  loading = false;
  courses: LookupDto[] = [];

  constructor(
    private fb: FormBuilder,
    private questionBankService: QuestionBankService,
    private courseService: CourseService,
    private router: Router
  ) {
    this.questionBankForm = this.fb.group({
      name: ['', Validators.required],
      courseId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getMyCoursesLookUp().subscribe({
      next: (res) => {
        this.courses = res.items;
      },
      error: (err) => {
        console.error('Error loading courses', err);
      }
    });
  }

  submit() {
    if (this.questionBankForm.invalid) return;

    const dto: CreateUpdateQuestionBankDto = this.questionBankForm.value;
    this.loading = true;

    this.questionBankService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/questionbanks']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error: ' + err.message);
      }
    });
  }
}
