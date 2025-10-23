import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { MediaItemService } from '@proxy/dev/acadmy/media-items/media-item.service';
import { QuestionService } from '@proxy/dev/acadmy/questions';


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
  selectedFile?: File;


  loading = false;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
        private mediaService: MediaItemService,

    private route: ActivatedRoute,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      questionTypeId: ['', Validators.required],
      quizId: [''], // هيتم تعيينها من الـ param
      questionBankId: [''],
      score: [1, [Validators.required, Validators.min(1)]],
      logoUrl: [''],
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
  // ✅ عند اختيار صورة
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  // Submit
  submit() {
    if (this.questionForm.invalid) return;
    this.loading = true;

    const dto = this.questionForm.value;

    // لو المستخدم رفع صورة
    if (this.selectedFile) {
      this.mediaService.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          dto.logoUrl = res.data || ''; // لو الصورة اتحمّلت، نحط الرابط
          this.createQuestion(dto);
        },
        error: (err) => {
          console.error('Error uploading image', err);
          dto.logoUrl = ''; // لو فشل الرفع، نحطها فاضية
          this.createQuestion(dto);
        }
      });
    } else {
      // مفيش صورة
      dto.logoUrl = '';
      this.createQuestion(dto);
    }
  }
  private createQuestion(dto: any) {
    this.questionService.create(dto).subscribe({
      next: (res) => {
        console.log('Question created', res);
        this.loading = false;
        this.router.navigate(['/lectures/questions', this.lecId]);
      },
      error: (err) => {
        console.error('Error creating question', err);
        this.loading = false;
      }
    });
  }
}
