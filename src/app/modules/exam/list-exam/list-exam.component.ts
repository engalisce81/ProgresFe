import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ExamDto, ExamService } from '@proxy/exams';

@Component({
  selector: 'app-list-exam',
  imports: [FormsModule ,RouterLink],
  templateUrl: './list-exam.component.html',
  styleUrl: './list-exam.component.scss'
})
export class ListExamComponent {
exams: ExamDto[] = [];
  loading = false;
  search = '';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // Delete confirmation state
  showDeleteConfirm = false;
  examToDelete!: ExamDto;

  constructor(
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;

    this.examService
      .getList(this.pageIndex, this.pageSize, this.search)
      .subscribe({
        next: (res) => {
          this.exams = res.items;
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
    this.loadExams();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadExams();
  }

  confirmDelete(exam: ExamDto): void {
    this.examToDelete = exam;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.examToDelete = null!;
  }

  deleteExam(): void {
    if (!this.examToDelete) return;

    this.examService.delete(this.examToDelete.id).subscribe({
      next: () => {
        this.loadExams();
        this.showDeleteConfirm = false;
        this.examToDelete = null!;
      },
      error: (error) => {
        console.error('Failed to delete exam:', error);
        this.showDeleteConfirm = false;
        this.examToDelete = null!;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
