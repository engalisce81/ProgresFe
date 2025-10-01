import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LookupDto } from '@proxy/look-up';
import { QuestionService, QuestionWithAnswersDto } from '@proxy/questions';

@Component({
  selector: 'app-update-question',
  imports: [ReactiveFormsModule ,RouterLink],
  templateUrl: './update-question.component.html',
  styleUrl: './update-question.component.scss'
})
export class UpdateQuestionComponent {
questionForm: FormGroup;
  questionTypes: LookupDto[] = [];
  quizzes: LookupDto[] = [];
  questionBanks: LookupDto[] = [];
  lecId: string = '';
  questionId: string = '';
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
      quizId: ['', Validators.required],
      questionBankId: [''],
      score: [1, [Validators.required, Validators.min(1)]],
      answers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.lecId = this.route.snapshot.paramMap.get('id')!;   // lectureId
    this.questionId = this.route.snapshot.paramMap.get('qid')!; // questionId

    this.loadQuestionTypes();
    this.loadQuizzes();
    this.loadQuestionBanks();
    this.loadQuestion(); // ✅ تحميل بيانات السؤال
  }

  // Getter للـ Answers
  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  // إضافة إجابة
  addAnswer(answer: string = '', isCorrect: boolean = false) {
    const answerGroup = this.fb.group({
      answer: [answer, Validators.required],
      isCorrect: [isCorrect]
    });
    this.answers.push(answerGroup);
  }

  // إزالة إجابة
  removeAnswer(index: number) {
    this.answers.removeAt(index);
  }

  // تحميل الـ Question Types
  loadQuestionTypes() {
    this.questionService.getListQuestionTypes().subscribe(res => {
      this.questionTypes = res.items;
    });
  }

  // تحميل الـ Quizzes
  loadQuizzes() {
    this.questionService.getListQuizzes(this.lecId).subscribe(res => {
      this.quizzes = res.items;
    });
  }

  // تحميل الـ Question Banks
  loadQuestionBanks() {
    this.questionService.getListQuestionBanks().subscribe(res => {
      this.questionBanks = res.items;
    });
  }

  // ✅ تحميل السؤال الحالي
  loadQuestion() {
    this.loading = true;
    this.questionService.get(this.questionId).subscribe({
      next: (res) => {
        this.questionForm.patchValue({
          title: res.data.title,
          questionTypeId: res.data.questionTypeId,
          quizId: res.data.quizId,
          questionBankId: res.data.questionBankId,
          score: res.data.score
        });

        this.answers.clear();
        res.data.answers.forEach(a => this.addAnswer(a.answer ?? '', a.isCorrect));
        if (res.data.answers.length === 0) this.addAnswer();

        this.loading = false;
      },
      error: err => {
        console.error('Error loading question', err);
        this.loading = false;
      }
    });
  }

  // ✅ تحديث السؤال
  submit() {
    if (this.questionForm.invalid) return;

    this.loading = true;
    this.questionService.update(this.questionId, this.questionForm.value).subscribe({
      next: () => {
        console.log('Question updated');
        this.loading = false;
        this.router.navigate(['/lectures/questions', this.lecId]);
      },
      error: err => {
        console.error('Error updating question', err);
        this.loading = false;
      }
    });
  }
}
