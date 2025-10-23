import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SubjectDto, SubjectService } from '@proxy/dev/acadmy/universites';

@Component({
  selector: 'app-list-subject',
  imports: [FormsModule,RouterLink],
  templateUrl: './list-subject.component.html',
  styleUrl: './list-subject.component.scss'
})

export class ListSubjectComponent {
  subjects: SubjectDto[] = [];
  loading = false;
  search = '';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // Delete confirmation state
  showDeleteConfirm = false;
  subjectToDelete!: SubjectDto;

  constructor(
    private subjectService:SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading = true;

    this.subjectService
      .getList(this.pageIndex, this.pageSize, this.search)
      .subscribe({
        next: (res) => {
          this.subjects = res.items;
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
    this.loadSubjects();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadSubjects();
  }

  confirmDelete(subject: SubjectDto): void {
    this.subjectToDelete = subject;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.subjectToDelete = null!;
  }

  deleteSubject(): void {
    if (!this.subjectToDelete) return;

    this.subjectService.delete(this.subjectToDelete.id).subscribe({
      next: () => {
        this.loadSubjects();
        this.showDeleteConfirm = false;
        this.subjectToDelete = null!;
      },
      error: (error) => {
        console.error('Failed to delete subject:', error);
        this.showDeleteConfirm = false;
        this.subjectToDelete = null!;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
