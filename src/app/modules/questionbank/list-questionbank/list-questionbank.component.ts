import { Component } from '@angular/core';
import { FormsModule,  } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QuestionBankDto, QuestionBankService } from '@proxy/dev/acadmy/questions';

@Component({
  selector: 'app-list-questionbank',
  imports: [RouterLink,FormsModule],
  templateUrl: './list-questionbank.component.html',
  styleUrl: './list-questionbank.component.scss'
})
export class ListQuestionbankComponent {
 questionBanks: QuestionBankDto[] = [];
  loading = false;
  search = '';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // Delete confirmation
  showDeleteConfirm = false;
  questionBankToDelete!: QuestionBankDto;

  constructor(
    private questionBankService: QuestionBankService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuestionBanks();
  }

  loadQuestionBanks(): void {
    this.loading = true;
    this.questionBankService
      .getList(this.pageIndex, this.pageSize, this.search)
      .subscribe({
        next: (res) => {
          this.questionBanks = res.items;
          this.totalCount = res.totalCount;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.loadQuestionBanks();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadQuestionBanks();
  }

  confirmDelete(qb: QuestionBankDto): void {
    this.questionBankToDelete = qb;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.questionBankToDelete = null!;
  }

  deleteQuestionBank(): void {
    if (!this.questionBankToDelete) return;

    this.questionBankService.delete(this.questionBankToDelete.id).subscribe({
      next: () => {
        this.loadQuestionBanks();
        this.showDeleteConfirm = false;
        this.questionBankToDelete = null!;
      },
      error: (error) => {
        console.error('Failed to delete question bank:', error);
        this.showDeleteConfirm = false;
        this.questionBankToDelete = null!;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
