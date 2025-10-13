import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LookupDto } from '@proxy/look-up/models';
import { QuestionService } from '@proxy/questions';

@Component({
  selector: 'app-create-question',
  imports: [ReactiveFormsModule,RouterLink ],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.scss'
})
export class CreateQuestionComponent implements OnInit {
   questionForm: FormGroup;
  questionTypes: LookupDto[] = [];
  quizzes: LookupDto[] = [];
  questionBanks: LookupDto[] = [];
  lecId: string = '';
  quizId: string = '';

  loading = false;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      questionTypeId: ['', Validators.required],
      quizId: [''], // هيتم تعيينها من الـ param
      questionBankId: [''],
      score: [1, [Validators.required, Validators.min(1)]],
      answers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // 🟢 جلب الـ IDs من الـ route params
    this.route.paramMap.subscribe(params => {
      this.lecId = params.get('id') ?? '';
      this.quizId = params.get('quizid') ?? '';

      // ✅ ربط quizId داخل الـ Form
      if (this.quizId) {
        this.questionForm.patchValue({ quizId: this.quizId });
      }
    });

    // تحميل البيانات
    this.loadQuestionTypes();
    this.loadQuizzes();
    this.loadQuestionBanks();

    // إجابة افتراضية
    this.addAnswer();
  }

  // Getter للـ Answers
  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  // إضافة إجابة جديدة
  addAnswer() {
    const answerGroup = this.fb.group({
      answer: ['', Validators.required],
      isCorrect: [false]
    });
    this.answers.push(answerGroup);
  }

  // إزالة إجابة
  removeAnswer(index: number) {
    this.answers.removeAt(index);
  }

  // تحميل Question Types
  loadQuestionTypes() {
    this.questionService.getListQuestionTypes().subscribe(res => {
      this.questionTypes = res.items;
    });
  }

  // تحميل Quizzes
  loadQuizzes() {
    this.questionService.getListQuizzes(this.lecId).subscribe(res => {
      this.quizzes = res.items;
    });
  }

  // تحميل Question Banks
  loadQuestionBanks() {
    this.questionService.getListQuestionBanks().subscribe(res => {
      this.questionBanks = res.items;
    });
  }

  // Submit
  submit() {
    if (this.questionForm.invalid) return;

    this.loading = true;
    const dto = this.questionForm.value;

    this.questionService.create(dto).subscribe({
      next: res => {
        console.log('Question created', res);
        this.loading = false;

        // ✅ العودة لقائمة الأسئلة الخاصة بالـ quiz
        this.router.navigate(['/lectures/questions', this.lecId ]);
      },
      error: err => {
        console.error('Error creating question', err);
        this.loading = false;
      }
    });
  }
}
