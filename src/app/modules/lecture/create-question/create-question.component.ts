import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupDto } from '@proxy/look-up/models';
import { QuestionService } from '@proxy/questions';

@Component({
  selector: 'app-create-question',
  imports: [ReactiveFormsModule ],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.scss'
})
export class CreateQuestionComponent implements OnInit {
  questionForm: FormGroup;
  questionTypes: LookupDto[] = [];
  quizzes: LookupDto[] = [];
  questionBanks: LookupDto[] = [];
  lecId: string = '';
  loading = false; // للتحكم في حالة اللودينج

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router:Router
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
    this.lecId = this.route.snapshot.paramMap.get('id')!;

    this.loadQuestionTypes();
    this.loadQuizzes();
    this.loadQuestionBanks();

    this.addAnswer(); // نبدأ بإجابة واحدة افتراضية
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

  // Submit
  submit() {
    if (this.questionForm.invalid) return;

    this.loading = true;
    this.questionService.create(this.questionForm.value).subscribe({
      next: res => {
        console.log('Question created', res);
        this.questionForm.reset();
        this.answers.clear();
        this.addAnswer();
        this.loading = false;
        this.router.navigate(['/lectures/questions', this.lecId]);
      },
      error: err => {
        console.error('Error creating question', err);
        this.loading = false;
      }
    });
  }
}
