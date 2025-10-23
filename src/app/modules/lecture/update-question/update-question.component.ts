import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { MediaItemService } from '@proxy/dev/acadmy/media-items/media-item.service';
import { QuestionService } from '@proxy/dev/acadmy/questions';


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
  selectedFile?: File;
  existingLogoUrl: string = ''; // ✅ الصورة الحالية إن وجدت
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
      quizId: ['', Validators.required],
      questionBankId: [''],
      score: [1, [Validators.required, Validators.min(1)]],
      logoUrl: [''], // ✅ أضفنا logoUrl
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

  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  addAnswer(answer: string = '', isCorrect: boolean = false) {
    const answerGroup = this.fb.group({
      answer: [answer, Validators.required],
      isCorrect: [isCorrect]
    });
    this.answers.push(answerGroup);
  }

  removeAnswer(index: number) {
    this.answers.removeAt(index);
  }

  loadQuestionTypes() {
    this.questionService.getListQuestionTypes().subscribe(res => {
      this.questionTypes = res.items;
    });
  }

  loadQuizzes() {
    this.questionService.getListQuizzes(this.lecId).subscribe(res => {
      this.quizzes = res.items;
    });
  }

  loadQuestionBanks() {
    this.questionService.getListQuestionBanks().subscribe(res => {
      this.questionBanks = res.items;
    });
  }

  // ✅ تحميل بيانات السؤال
  loadQuestion() {
    this.loading = true;
    this.questionService.get(this.questionId).subscribe({
      next: (res) => {
        const data = res.data;
        this.existingLogoUrl = data.logoUrl || ''; // ✅ نحفظ الصورة القديمة

        this.questionForm.patchValue({
          title: data.title,
          questionTypeId: data.questionTypeId,
          quizId: data.quizId,
          questionBankId: data.questionBankId,
          score: data.score,
          logoUrl: data.logoUrl || ''
        });

        this.answers.clear();
        data.answers.forEach(a => this.addAnswer(a.answer ?? '', a.isCorrect));
        if (data.answers.length === 0) this.addAnswer();

        this.loading = false;
      },
      error: err => {
        console.error('Error loading question', err);
        this.loading = false;
      }
    });
  }

  // ✅ عند اختيار صورة جديدة
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // ✅ عند الحفظ (تحديث)
  submit() {
    if (this.questionForm.invalid) return;
    this.loading = true;

    const dto = this.questionForm.value;

    // لو المستخدم اختار صورة جديدة نرفعها أولاً
    if (this.selectedFile) {
      this.mediaService.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          dto.logoUrl = res.data || ''; // ✅ استخدم الصورة الجديدة
          this.updateQuestion(dto);
        },
        error: (err) => {
          console.error('Error uploading image', err);
          dto.logoUrl = this.existingLogoUrl || ''; // لو فشل الرفع، نحتفظ القديمة
          this.updateQuestion(dto);
        }
      });
    } else {
      // لو مفيش صورة جديدة، استخدم القديمة
      dto.logoUrl = this.existingLogoUrl || '';
      this.updateQuestion(dto);
    }
  }

  // ✅ دالة تحديث السؤال فعليًا
  private updateQuestion(dto: any) {
    this.questionService.update(this.questionId, dto).subscribe({
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
