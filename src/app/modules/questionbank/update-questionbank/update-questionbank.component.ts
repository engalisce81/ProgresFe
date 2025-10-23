import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '@proxy/dev/acadmy/courses';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { QuestionBankService, CreateUpdateQuestionBankDto } from '@proxy/dev/acadmy/questions';


@Component({
  selector: 'app-update-questionbank',
  imports: [ReactiveFormsModule ,RouterLink],
  templateUrl: './update-questionbank.component.html',
  styleUrl: './update-questionbank.component.scss'
})
export class UpdateQuestionbankComponent {
questionBankForm: FormGroup;
  loading = false;
  courses: LookupDto[] = [];
  id!: string;

  constructor(
    private fb: FormBuilder,
    private questionBankService: QuestionBankService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.questionBankForm = this.fb.group({
      name: ['', Validators.required],
      courseId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadCourses();
    this.loadQuestionBank();
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

  loadQuestionBank() {
    this.loading = true;
    this.questionBankService.get(this.id).subscribe({
      next: (res) => {
        this.questionBankForm.patchValue({
          name: res.data.name,
          courseId: res.data.courseId
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading question bank:', err);
        this.loading = false;
      }
    });
  }

  submit() {
    if (this.questionBankForm.invalid) return;

    const dto: CreateUpdateQuestionBankDto = this.questionBankForm.value;
    this.loading = true;

    this.questionBankService.update(this.id, dto).subscribe({
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
