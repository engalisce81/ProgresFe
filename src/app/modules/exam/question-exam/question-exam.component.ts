import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamQuestionsDto, ExamService, CreateUpdateExamQuestionDto } from '@proxy/exams';
import { LookupDto } from '@proxy/look-up';
import { QuestionBankService } from '@proxy/questions';

@Component({
  selector: 'app-question-exam',
  imports: [ReactiveFormsModule,FormsModule,RouterLink],
  templateUrl: './question-exam.component.html',
  styleUrl: './question-exam.component.scss'
})
export class QuestionExamComponent {
 examId!: string;
  banks: LookupDto[] = [];
  selectedBankIds: string[] = [];
  questions: ExamQuestionsDto[] = [];
  loading = false;

  constructor(
    private examService: ExamService,
    private bankService:QuestionBankService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id')!;
    this.loadMyBanks();
  }

  loadMyBanks() {
    this.bankService.getListMyBank().subscribe({
      next: (res) => (this.banks = res.items),
      error: (err) => alert('Error loading banks: ' + err.message),
    });
  }

  loadQuestions() {
    if (this.selectedBankIds.length === 0) {
      alert('Please select at least one bank.');
      return;
    }

    this.loading = true;
    this.examService.getQuestionsFromBank(this.selectedBankIds, this.examId).subscribe({
      next: (res) => {
        this.questions = res.items;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert('Error loading questions: ' + err.message);
      },
    });
  }

  hasSelectedQuestions(): boolean {
    return this.questions.some(q => q.isSelected);
  }

  onBankChecked(event: any, bankId: string) {
  const isChecked = event.target.checked;

  if (isChecked) {
    this.selectedBankIds.push(bankId);
  } else {
    this.selectedBankIds = this.selectedBankIds.filter(id => id !== bankId);
  }
}


  addSelectedQuestions() {
    const selectedQuestions = this.questions.filter(q => q.isSelected).map(q => q.id!);

    if (selectedQuestions.length === 0) {
      alert('Please select at least one question.');
      return;
    }

    const dto: CreateUpdateExamQuestionDto = {
      examId: this.examId,
      questionIds: selectedQuestions,
      questionBankIds: this.selectedBankIds,
    };

    this.loading = true;
    this.examService.addQuestionToExam(dto).subscribe({
      next: () => {
        this.loading = false;
        alert('Questions added successfully!');
        this.router.navigate(['/exams']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error adding questions: ' + err.message);
      },
    });
  }
}
